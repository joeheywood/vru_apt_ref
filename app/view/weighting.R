# package/imports #nolint
# -------------------------------------------------------------------------
# Using box::use for modular dependency management. 
# This helps keep the namespace clean and explicitly defines what is used.
box::use(
  shiny[...],
  shiny.fluent[...],
  shinyjs[...],
  dplyr[...],
  readr[...],
  purrr[map, transpose],
  utils[write.csv],
  glue[...],
  DT[...],
  shiny.emptystate[use_empty_state, EmptyStateManager],
)

# file/imports #nolint
# -------------------------------------------------------------------------
# Importing local module components and logic functions
box::use(
  app / view / layout[makeCard],
  app / view / inputs / toggle,
  app / logic / database[get_themes_df, get_indicators, get_all_indicators],
  app / logic / run_weightings[run_weightings, get_inds_scores_for_ward]
)

# UI Function
# -------------------------------------------------------------------------
ui <- function(id) {
  ns <- NS(id)
  
  # ordered_themes <- c(
  #   "Communities & Place",
  #   "CYP-Reducing Harm", "CYP-Opportunities", "Education", "Families"
  # )
  # 
  # opts <- map(ordered_themes, ~list(key = .x, text = .x))
  # save(opts, file = "weighting_opts.RData")
  load("weighting_opts.RData")
  
  tagList(
    useShinyjs(), # Enable JavaScript toggling (show/hide)
    # use_empty_state(),     # Enable empty state handling for tables
    div(
      Stack(
        tokens = list(childrenGap = 10),
        horizontal = TRUE,
        
        # Left Column: Configuration of Themes and Weights
        makeCard(
          title = "Weighting",
          content = div(
            p(paste0("The APT assigns points to wards based on their ranking for specific ", 
                     "metrics. For instance, if a ward is in the top 15% for an indicator ", 
                     "like 'knife crime offences,' it receives a point. This allows users ", 
                     "to compare need across wards and identify priority areas effectively.")),
            
            p(paste0("On this page, you can prioritise, or de-prioritise, indicators, by",
                     " assigning a weight to them. For example, if you wanted to prioritise", 
                     " knife crime offences, you could assign a bigger weight, such as 1.2 to that indicator", 
                     " and if a ward is in the top 15%, it would get 1.2, rather than 1")),
            
            p(paste0("You can assign the weights across themes. Press 'Run rankings' when ",
                     "you are ready")),
            # Dropdown for category selection
            TooltipHost(
              content = "Select either an overall ranking or one of the priority areas",
              Dropdown.shinyInput(
                inputId = ns("themeInputw"),
                label = "Select a Theme",
                placeholder = "Select a theme to begin",
                options = opts
              )
            ),
            # Table showing indicators and the dynamic slider for weights
            TooltipHost(
              content = "Select a variable within your selected priority area",
              DTOutput(ns("data_table")),
              uiOutput(ns("slider_ui"))
            )
          ),
          size = 6,
          style = "min-height: 500px"
        ),
        
        # Right Column: Results and Breakdown
        makeCard(
          title = "Run",
          content = div(
            ActionButton.shinyInput(
              ns("run_ranking"),
              iconProps = list("iconName" = "NumberedList"),
              text = "Run Ranking"
            ),
            br(),
            ActionButton.shinyInput(ns("download"), text = "Download",  iconProps = list(iconName = "PageData")),
            DTOutput(ns("top_wards")), # Main results table
            hr(),
            h4(textOutput(ns("ward_points"))),
            DTOutput(ns("ward_points_tbl")) # Detail table for selected ward
          ),
          size = 4,
          style = "min-height: 300px"
        )
      )
    )
  )
}

server <- function(id) {
  moduleServer(id, function(input, output, session) {
    ns <- session$ns
    hide("download")
    print(glue("USER: {session$user} using weighting page"))

    #Display name mapping for pass_* indicators
    pass_display_names <- c(
      pass_backgrounds_score = "Community Cohesion",
      pass_fairness_score = "Police Fairness",
      pass_gangs_score = "Gang Issues",
      pass_good_job_score = "Police Performance",
      pass_gun_crime_score = "Gun Crime Concern",
      pass_knife_crime_score = "Knife Crime Concern",
      pass_trust_mps_score = "Trust in Police"
    )

    display_name <- function(ind) {
      ifelse(ind %in% names(pass_display_names), pass_display_names[ind], ind)
    }

    # --- 1. DATA INITIALIZATION ---
    # inds_raw <- read_csv("default_weights.csv")
    # saveRDS(inds_raw, "default_weights.RDS")
    inds_raw <- readRDS("default_weights.RDS")
    
    inds_raw <- inds_raw[which(inds_raw$weighting >= 0),]
    
    
    
    inds_raw$visible <- FALSE
    weights <- reactiveVal(
      inds_raw |> select(indicator, weighting, name)
    )
    inds_base <- inds_raw  |> select(theme, indicator)
    
    
    # updateDropdown.shinyInput(
    #   session = session,
    #   inputId = "themeInputw",
    #   options = map(unique(inds_raw$theme), ~list(key = .x, text = .x))
    # )
    
    rv <- reactiveValues(
      data = inds_raw,
      top_wards = NULL,
      download = 0
    )
    
    # visible_df <- reactive({
    #   req(input$themeInputw)
    #   rv$data %>% filter(theme == input$themeInputw)
    # })
    
    visible_df <- reactive({
      # req(input$themeInputw)
      req(nzchar(input$themeInputw))
      inds_base |>
        left_join(weights(), by = "indicator") |>
        filter(theme == input$themeInputw)
    })
    
    
    observeEvent(input$themeInputw, {
      # --- 3. SIMPLIFIED DT: INDICATORS ---
      # print("THEME SELECTED")
      req(visible_df())

      
      output$data_table <- renderDT({
        datatable(
          # visible_df() %>% mutate(indicator = display_name(indicator)) %>% select(indicator, weighting),
          visible_df() %>%  select(name, weighting),
          selection = "single",
          colnames = c("Variable Name", "Current Weight"), # Human-readable headers
          options = list(
            dom = 't',       # 't' means ONLY the table; no search, no entries, no info
            paging = FALSE,  # Remove pagination for a clean list
            ordering = FALSE # Disable column sorting to keep it stable
          ),
          rownames = FALSE   # Hide the index column on the left
        )
       }, server = FALSE)
      
    })
    
    
    # --- 4. DYNAMIC SLIDER UI ---
    output$slider_ui <- renderUI({
      selected_row <- input$data_table_rows_selected
      req(selected_row)
      
      item_data <- visible_df()[selected_row, ]
      
      tagList(
        h4(paste("Adjusting:", item_data$name)),
        sliderInput(
          inputId = ns("weighting_slider"),
          label = "Set importance (0 = ignored, 2 = high importance):",
          min = 0, max = 2, step = 0.1,
          value = item_data$weighting
        )
      )
    })
    
    # --- 5. UPDATING DATA ---
    # observeEvent(input$weighting_slider, {
    #   selected_row <- isolate(input$data_table_rows_selected)
    #   req(selected_row)
    #   
    #   vis <- isolate(visible_df())
    #   target_indicator <- vis$indicator[selected_row]
    #   
    #   idx <- which(rv$data$indicator == target_indicator)
    #   if (length(idx) == 1) {
    #     rv$data$weighting[idx] <- input$weighting_slider
    #   }
    # }, ignoreInit = TRUE)
    
    
    observeEvent(input$weighting_slider, {
      sel <- input$data_table_rows_selected
      req(sel)
      
      w <- weights()
      w$weighting[w$indicator == visible_df()$indicator[sel]] <- input$weighting_slider
      weights(w)
    })
    
    # --- 6. SIMPLIFIED DT: RESULTS ---
    observeEvent(input$run_ranking, {
      df <- inds_base |>
        left_join(weights(), by = "indicator")
      results <- run_weightings(df)
      rv$top_wards <- results
      
      output$top_wards <- renderDT({
        datatable(
          results, 
          selection = "single",
          colnames = c("Ward Name", "Total Score", "Rank"),
          options = list(
            dom = 'tp', # Table and Pagination only
            pageLength = 20 # Keep it compact
          ),
          rownames = FALSE
        )
      }, server = FALSE)
      show("download")
    })
    
    # Dowload data
    observeEvent(input$download, {
      # print("DOWNLOAD")
      rv$download <- 1
      
    })
    # output$download <- downloadHandler(
    #   filename = function() {
    #     paste("weigthings-", Sys.Date(), ".csv", sep="")
    #   },
    #   content = function(file) {
    #     write.csv(rv$top_wards, file)
    #   }
    # )
    
    # Ward Drill-down
    observeEvent(input$top_wards_rows_selected, {
      req(rv$top_wards)
      # df <- inds_base |>
      #   left_join(weights(), by = "indicator")
      # # print(names(df))
      # ward <- rv$top_wards$wd22nm[input$top_wards_rows_selected]
      # output$ward_points <- renderText(glue("Indicators for {ward}"))
      # 
      # dets <- get_inds_scores_for_ward(ward, df)  %>%
      #   arrange(desc(score), rank_n) %>%
      #   filter(score > 0) %>%
      #   mutate(indicator = display_name(indicator)) %>%
      #   select(indicator, score, rank_n)
      # 
      # output$ward_points_tbl <- renderDT({
      #   datatable(
      #     dets,
      #     colnames = c("Indicator", "Contribution to Score", "Rank"),
      #     options = list(dom = 't', paging = FALSE),
      #     rownames = FALSE
      #   )
      # })
    })
    return(rv)
  })
  
}