# app/view/map.R
box::use(
  shiny[...],
  shiny.fluent[...],
  leaflet[...],
  r2d3[r2d3, renderD3, d3Output],
  purrr[...],
  janitor[make_clean_names],
  dplyr[...],
  sf[st_read],
  htmltools[htmlEscape, ],
  glue[...],
)
box::use(
  app / view / react[Reveal], # Import the component
)
box::use(
  app / view / layout[makeCard],
  app / logic / beeswarm_utlis[prepare_beeswarm_data],
  app / view / inputs / toggle,
  app / view / charts / ranking_chart,
  app / logic / database[query_ward_data_by_indicator],
  app / logic / rankingChart_utilis[prepare_rankingchart_data],
  # app / view[ward_mapping_data, url_temp, os_mapsattr], # Where is this?
  app / view[url_temp, os_mapsattr], # Where is this?
  app / view / react[ProfileMetaData], # Meta data component for this section
)

#' @export
ui <- function(id) {
  
  ns <- NS(id)
  tagList(
    # First row: 2 components
    Stack(
      tokens = list(childrenGap = 10),
      horizontal = TRUE,
      makeCard(
        title = "Theme & Indicator Selection",
        content = div(
          TooltipHost(
            content = "Select either an overall ranking or one of the priority areas",
            Dropdown.shinyInput(
              inputId = ns("themeInput"),
              label = "Select a Theme",
              placeholder = "Select a theme to begin",
              options = list()
            )
          ),
          TooltipHost(
            content = "Select a variable within your selected priority area",
            Dropdown.shinyInput(
              inputId = ns("indicatorInput"),
              label = "Select Indicator",
              placeholder = "Select an indicator",
              options = list()
            )
          ),
          shiny.fluent::Text(
            variant = "small",
            "Note: The data presented in this view of the APT is intended to provide an overview of raw counts and is unweighted. It is designed to offer users a snapshot view rather than a definitive suggestion for priority areas." # nolint
          )
        ),
        size = 6,
        style = "min-height: 300px"
      ),
      makeCard(
        title = "Metadata",
        content = div(
          style = "max-height: 500px; overflow-y: auto;",
          ProfileMetaData(id = ns("profilemetadata"))
        ),
        size = 6,
        style = "min-height: 300px"
      )
    ),
    
    # Second row: 1 component (map)
    Stack(
      tokens = list(childrenGap = 10),
      makeCard(
        title = "London Area Distribution",
        content = leafletOutput(ns("map"), height = 500),
        size = 12,
        style = "min-height: 550px"
      )
    ),
    
    # Third row: 2 components
    Stack(
      tokens = list(childrenGap = 10),
      horizontal = TRUE,
      makeCard(
        title = "Highest Ranked 10 Wards",
        content = div(
          ranking_chart$ui(ns("ranking_chart")),
        ),
        size = 6,
        style = "max-height: 400px"
      ),
      makeCard(
        title = "Data Point Distribution (Excluding Zeros)",
        content = div(d3Output(ns("beeswarm"))),
        size = 6,
        style = "max-height: 400px"
      )
    )
  )
}

#' @export
server <- function(id) {
  moduleServer(id, function(input, output, session) {
    quicker <- TRUE
    if(!quicker) {
      ward_json_data2 <- ward_mapping_data
      
    }
    inds <- readRDS("default_weights.RDS")
# 
    # Create reactive values to track theme changes
    rv <- reactiveValues(
      theme_changed = FALSE,
      previous_theme = NULL
    )

    # Observer for theme changes
    observeEvent(input$themeInput, {
      rv$theme_changed <- TRUE
      rv$previous_theme <- input$themeInput
    })

    # Reset theme changed flag when indicator is selected
    observeEvent(input$indicatorInput, {
      rv$theme_changed <- FALSE
    })

# == "All indicators"

    ordered_themes <- c(
      "Ranking - Combined Indicators", "Communities & Place",
      "CYP-Reducing Harm", "CYP-Opportunities", "Education", "Families"
    )
#     
# 
    create_dropdown_options <- function(data, value_col, text_col) {
      ## This can be removed generally I think ## 
      # to_change <- c(
      #   pass_backgrounds_score = "Community Cohesion",
      #   pass_fairness_score = "Police Fairness",
      #   pass_gangs_score = "Gang Issues",
      #   pass_good_job_score = "Police Performance",
      #   pass_gun_crime_score = "Gun Crime Concern",
      #   pass_knife_crime_score = "Knife Crime Concern",
      #   pass_trust_mps_score = "Trust in Police"
      # 
      # )


      # if(all(data[[value_col]] %in% names(to_change))) {
      #   text_col <- "x"
      #   # print("NEED TO CHANGE...")
      #   # print(as.character(to_change[data$indicator]))
      #   data$x <- as.character(to_change[data$indicator])
      #   # data$indicator <- to_change[data$indicator]
      # 
      # }

      unique_pairs <- data |>
        select(dplyr::all_of(c(value_col, text_col))) |>
        dplyr::distinct()

      purrr::map2(
        unique_pairs[[value_col]],
        unique_pairs[[text_col]],
        ~ list(key = .x, text = .y)
      )
    }

    # Theme dropdown
    observe({
      a <- Sys.time()
      if(quicker) {
        theme_data <- tibble(
          theme_id = ordered_themes,
          theme_name = ordered_themes
        ) |>
          filter(theme_id %in% unique(inds$theme))
        
        
      } else {
        
        theme_data <- tibble(
          theme_id = ordered_themes,
          theme_name = ordered_themes
        ) |>
          filter(theme_id %in% unique(ward_json_data2$theme))
        
      }
      
      new_choices <- create_dropdown_options(
        data = theme_data,
        value_col = "theme_id",
        text_col = "theme_name"
      )
      # req(ward_json_data2)
      
      
      message(paste0("Theme dropdowns: ", Sys.time() - a))
      
      updateDropdown.shinyInput(
        session = session,
        inputId = "themeInput",
        options = new_choices
      )
    })
# 
    # Indicator dropdown
    observe({
      a <- Sys.time()
      req(input$themeInput)
      
      if(quicker) {
        
      } else {
        
      }


      # filtered_data <- ward_json_data2 |>
      #   filter(theme == input$themeInput) |>
      #   group_by(indicator) |>
      #   slice_head(n = 1) |>
      #   ungroup() |>
      #   mutate(name = indicator) |>
      #   select(name, indicator) |>
      #   arrange(name)
      filtered_data <- inds %>%
        filter(theme == input$themeInput) %>%
        arrange(indicator)

      new_choices <- create_dropdown_options(
        data = filtered_data,
        value_col = "indicator",
        text_col = "name"
      )
      message(paste0("Indicator dropdowns: ", Sys.time() - a))

      updateDropdown.shinyInput(
        session = session,
        inputId = "indicatorInput",
        options = new_choices
      )
    })
# 
    # Filtered data reactive
    filtered_data_reactive <- reactive({
      validate(need(!rv$theme_changed, "Please select an indicator"))
      req(input$themeInput, input$indicatorInput)
      a <- Sys.time()

      # dt <- ward_json_data2 |>
      #   filter(
      #     theme == input$themeInput,
      #     indicator == input$indicatorInput
      #   )
      wards_sf <- readRDS("app/data/wards.rds")
      
      x2 <- query_ward_data_by_indicator(input$indicatorInput)
      dt <- left_join(wards_sf, x2, by = "wd22cd")


      message(paste0("data for maps ready: ", Sys.time() - a))
      dt
    })
    
    
# 
    # Map output
    output$map <- renderLeaflet({
      a <- Sys.time()
      req(filtered_data_reactive())
      filtered_data <- filtered_data_reactive()

      req(nrow(filtered_data) > 0)

      if (!"rank" %in% colnames(filtered_data)) {
        filtered_data <- filtered_data |>
          mutate(rank = rank(-value))
      }

      pal <- colorNumeric(palette = "RdPu", domain = filtered_data$value)

      popup_content <- map(1:nrow(filtered_data), function(i) {
        wd22nm <- filtered_data$wd22nm[i]
        value <- filtered_data$value[i]
        borough <- filtered_data$lad22nm[i]
        rank <- filtered_data$rank[i]
        glue(
          "<b>Ward Name:</b> {wd22nm} <br>",
          "<b>Value:</b> {value} <br>",
          "<b>Borough:</b> {borough} <br>",
          "<b>Rank:</b> {rank}"
        )
      })

      leaflet(options = leafletOptions(minZoom = 10, maxZoom = 18)) |>
        setView(-0.118092, 51.509865, zoom = 10) |>
        addTiles(urlTemplate = url_temp, attribution = os_mapsattr) |>
        addPolygons(
          data = filtered_data,
          fillColor = ~ pal(value),
          layerId = ~wd22cd,
          color = "#444444",
          weight = 0.9,
          opacity = 0.8,
          fillOpacity = 0.7,
          smoothFactor = 0.5,
          label = map(popup_content, htmltools::HTML)
        ) |>
        setMaxBounds(
          lng1 = -0.51036,
          lat1 = 51.28676,
          lng2 = 0.33402,
          lat2 = 51.69188
        )
    })

    # Highlight style
    highlight_style <- list(
      weight = 2,
      color = "#000000",
      fillOpacity = 0.0
    )

    # Ward selection observer
    observe({
      # cat("ward observer tick\n")
      # selected_ward <- NULL
      # selected_la <- NULL
      # 
      # if (!is.null(input$wardInput)) {
      #   selected_ward_name <- input$wardInput
      #   selected_ward <- ward_json_data2[ward_json_data2$wd22nm == selected_ward_name, ]
      # } else if (!is.null(input$map_shape_click)) {
      #   click <- input$map_shape_click
      #   if (!is.null(click)) {
      #     selected_ward <- ward_json_data2[ward_json_data2$wd22nm == click$id, ]
      #   }
      # }
      # 
      # if (!is.null(selected_ward) && nrow(selected_ward) > 0) {
      #   selected_la <- la_json_data[la_json_data$lad22cd == selected_ward$lad22cd, ]
      # 
      #   leafletProxy("map", session) |>
      #     clearGroup("highlighted-ward") |>
      #     clearGroup("highlighted-local-authority") |>
      #     setView(lng = selected_ward$lng, lat = selected_ward$lat, zoom = 10.5) |>
      #     addPolygons(
      #       data = selected_la,
      #       group = "highlighted-local-authority",
      #       weight = highlight_style$weight,
      #       color = highlight_style$color,
      #       fill = FALSE
      #     ) |>
      #     addPolygons(
      #       data = selected_ward,
      #       group = "highlighted-ward",
      #       weight = highlight_style$weight,
      #       color = highlight_style$color,
      #       fill = FALSE
      #     )
      # }
    })
# 
    # Beeswarm data reactive
    beeswarm_data <- reactive({
      req(input$indicatorInput)
      validate(need(!rv$theme_changed, "Please select an indicator"))

      # prepare_beeswarm_data(input$indicatorInput, ward_json_data2)
      prepare_beeswarm_data(input$indicatorInput,  filtered_data_reactive())
    })

    #* Beeswarm onclick observer
    observeEvent(input$clicked_circle, {
      clicked_id <- input$clicked_circle
      clicked_key <- input$clicked_circle
      # print(clicked_id) #* currently the same output
      # print(clicked_key) #* currently the same output
    })

    # Beeswarm output with namespace passed to D3.js
    output$beeswarm <- renderD3({
      r2d3_data <- beeswarm_data()
      req(r2d3_data)

      r2d3(
        data = r2d3_data,
        script = "app/static/beeswarm.js",
        d3_version = 6,
        options = list(namespace = session$ns("")) #* This will pass the namespace to D3
      )
    })
# 
    # Ranking chart server with theme change validation
    indicatorInputReactive <- reactive({
      req(input$indicatorInput)
      validate(need(!rv$theme_changed, "Please select an indicator"))
      input$indicatorInput
    })

    ranking_chart$server("ranking_chart",
      data = filtered_data_reactive,
      indicatorInput = indicatorInputReactive
    )
  })
}