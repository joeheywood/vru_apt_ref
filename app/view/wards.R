# app/view/wards.R #nolint

# package/imports #nolint
box::use(
  shiny[...],
  shiny.fluent[...],
  dplyr[...],
  r2d3[...],
  purrr[...],
  janitor[make_clean_names],
  leaflet[...],
  sf[...],
  glue[...],
  shiny.emptystate[use_empty_state, EmptyStateManager],
)
# file/imports #nolint
box::use(
  app / view / layout[makeCard],
  app / logic / beeswarm_utlis[prepare_beeswarm_data],
  app / view / inputs / toggle,
  app / view / basemaps / ward_basemap,
  app / view / charts / multi_beeswarm,
  app / view / charts / ranking_chart,
  app / view[get_ward_mapping_data],  # Import the function instead of ward_mapping_data
  app / view / react[ProfileMetaData, ThemeDescription],
)

#' @export
ui <- function(id) {
  ns <- NS(id)

  tagList(
    use_empty_state(), # Initialise shiny.emptystate
    div(
      Stack(
        tokens = list(childrenGap = 10),
        horizontal = TRUE,

        # Card containing Dropdowns
        makeCard(
          title = "Controls",
          content = div(

            ###### Testing Toggle UI
            TooltipHost(
              content = "Toggle between ranked and unranked data",
              # directionalHint = "bottomCenter",
              delay = 0,
              Toggle.shinyInput(ns("toggle"), value = TRUE, label = "Toggle Ranked Data")
            ),
            TooltipHost(
              content = "Choose between one of the priority area thematic groupings or a ranking grouping.",
              Dropdown.shinyInput(
                inputId = ns("themeInput"),
                label = "Select a priority area",
                placeholder = "Select a priority area",
                options = list() # Placeholder options
              )
            ),
            # Added Borough dropdown
            TooltipHost(
              content = "Select a borough to filter the wards list.",
              Dropdown.shinyInput(
                inputId = ns("boroughInput"),
                label = "Select Borough",
                placeholder = "Select a borough first",
                options = list() # Placeholder options
              )
            ),
            TooltipHost(
              content = "Select one Ward for a detailed summary of it under the selected priority area.",
              Dropdown.shinyInput(
                inputId = ns("wardInput"),
                label = "Select Ward",
                placeholder = "Select a ward for more details",
                options = list() # Placeholder options
              )
            )
          ),
          size = 4,
          style = "max-height: 1300px"
        ),
        makeCard(
          title = "Metadata",
          content = div(ProfileMetaData(id = ns("profilemetadata"))),
          size = 8,
          style = "max-height: 600px"
        )
      ),
      Stack(
        tokens = list(childrenGap = 10),
        horizontal = TRUE,
        makeCard(
          title = "Wards",
          content = div(ward_basemap$ui(ns("ward_basemap")))
        ),
        makeCard(
          title = "Theme Description",
          content = div(ThemeDescription(id = ns("themeDescription"))),
          size = 12,
          style = "max-height: 600px"
        )
      ),
      # Wrap the beeswarm chart in a div with an id
      div(
        id = ns("beeswarm_container"),
        multi_beeswarm$ui(ns("multi_beeswarm"))
      )
    )
  )
}

#' @export
server <- function(id) {
  moduleServer(id, function(input, output, session) {
    ns <- session$ns

    # Load minimal data once for dropdowns (no geometry needed)
    dropdown_data <- reactive({
      get_ward_mapping_data() |>
        sf::st_drop_geometry() |>
        select(theme, lad22cd, lad22nm, wd22cd, wd22nm) |>
        distinct()
    }) |>
      bindCache("dropdown_data")  # Cache this forever
    
    # Pre-compute all dropdown options
    all_options <- reactive({
      data <- dropdown_data()
      
      # Themes
      themes <- unique(data$theme)
      ranking_theme <- "Ranking - Combined Indicators"
      other_themes <- sort(themes[themes != ranking_theme])
      
      # Boroughs (same for all themes)
      boroughs <- data |>
        select(lad22cd, lad22nm) |>
        distinct() |>
        arrange(lad22nm)
      
      # Wards grouped by theme and borough for fast lookup
      wards_by_theme_borough <- data |>
        select(theme, lad22cd, wd22cd, wd22nm) |>
        distinct() |>
        group_by(theme, lad22cd) |>
        arrange(wd22nm) |>
        summarise(
          wards = list(map2(wd22cd, wd22nm, ~ list(key = .x, text = .y))),
          .groups = "drop"
        )
      
      list(
        ranking_theme = ranking_theme,
        other_themes = map(other_themes, ~ list(key = .x, text = .x)),
        ranking_theme_option = list(list(key = ranking_theme, text = ranking_theme)),
        boroughs = map2(boroughs$lad22cd, boroughs$lad22nm, ~ list(key = .x, text = .y)),
        wards_lookup = wards_by_theme_borough
      )
    }) |>
      bindCache("all_options")  # Cache this forever too

    # Current active theme based on toggle
    active_theme <- reactive({
      if (input$toggle) {
        all_options()$ranking_theme
      } else {
        input$themeInput
      }
    })

    # Load ALL data for the selected theme (for beeswarm distribution)
    theme_data <- reactive({
      req(active_theme())
      
      get_ward_mapping_data(
        theme = active_theme(),
        borough = NULL  # Get all boroughs for this theme
      ) |>
        sf::st_drop_geometry()  # Beeswarm doesn't need geometry
    })

    # Geometry data for map (filtered by borough if selected)
    basemap_data <- reactive({
      req(active_theme())
      print("BOROUGH SELECTED")
      
      get_ward_mapping_data(
        theme = active_theme(),
        borough = input$boroughInput  # Filter by borough for map
      ) |>
        select(wd22cd, wd22nm, lng, lat, geometry)
    })

    # Data for beeswarm (all wards in theme)
    selected_dataset <- reactive({
      theme_data()  # This has all wards for the theme
    })

    # Ward-specific data for description
    filtered_dataset <- reactive({
      req(input$wardInput, theme_data())
      
      theme_data() |>
        filter(wd22cd == input$wardInput) |>
        slice_head(n = 1)
    })

    # Send theme description to React
    observe({
      req(filtered_dataset())
      
      theme_text <- filtered_dataset() |>
        select(
          ward = wd22nm,
          theme,
          theme_description,
          point
        ) |>
        as.list()
      
      session$sendCustomMessage("themeDescriptionChange", theme_text)
    })

    # Initialize dropdowns once
    observe({
      opts <- all_options()
      
      # Set initial theme based on toggle
      if (input$toggle) {
        updateDropdown.shinyInput(
          session = session,
          inputId = "themeInput",
          options = opts$ranking_theme_option,
          value = opts$ranking_theme
        )
      } else {
        updateDropdown.shinyInput(
          session = session,
          inputId = "themeInput",
          options = opts$other_themes
        )
      }
      
      # Set boroughs (always the same)
      updateDropdown.shinyInput(
        session = session,
        inputId = "boroughInput",
        options = opts$boroughs
      )
    }) |>
      bindEvent(all_options(), once = TRUE)

    # Update theme dropdown only when toggle changes
    observeEvent(input$toggle, {
      opts <- all_options()
      
      if (input$toggle) {
        updateDropdown.shinyInput(
          session = session,
          inputId = "themeInput",
          options = opts$ranking_theme_option,
          value = opts$ranking_theme
        )
      } else {
        updateDropdown.shinyInput(
          session = session,
          inputId = "themeInput",
          options = opts$other_themes,
          value = NULL  # Let user choose
        )
      }
    }, ignoreInit = TRUE)

    # Update ward dropdown when theme or borough changes
    observe({
      req(active_theme(), input$boroughInput)
      
      opts <- all_options()
      
      # Fast lookup from pre-computed data
      ward_options <- opts$wards_lookup |>
        filter(
          theme == active_theme(),
          lad22cd == input$boroughInput
        ) |>
        pull(wards) |>
        first()
      
      if (!is.null(ward_options)) {
        updateDropdown.shinyInput(
          session = session,
          inputId = "wardInput",
          options = ward_options,
          value = NULL  # Clear selection when filters change
        )
      } else {
        updateDropdown.shinyInput(
          session = session,
          inputId = "wardInput",
          options = list(),
          value = NULL
        )
      }
    })

    # Create a reactive value for the selected ward
    selected_ward <- reactive({
      input$wardInput
    })

    # Call the ward_basemap module
    ward_basemap$server("ward_basemap", 
      ward_data = basemap_data,
      selected_ward = selected_ward
    )

    # Call the beeswarm and dynamic text modules
    multi_beeswarm$server(
      "multi_beeswarm",
      selected_dataset = selected_dataset,  # This now has all theme data
      themeInput = active_theme,
      wardInput = reactive(input$wardInput)
    )

    # Empty state management
    empty_state_content <- div(
      style = "padding: 20px; text-align: center;",
      h3("Please select a priority area to display the chart.")
    )

    beeswarm_empty_state <- EmptyStateManager$new(
      id = ns("beeswarm_container"),
      html_content = empty_state_content
    )

    observe({
      if (!input$toggle && (is.null(input$themeInput) || input$themeInput == "")) {
        beeswarm_empty_state$show()
      } else {
        beeswarm_empty_state$hide()
      }
    })
  })
}
