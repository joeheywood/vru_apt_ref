# app/main.R

box::use(
  shiny[...],
  shiny.fluent[fluentPage, Text, parseTheme, Spinner, Stack],
  shiny.router[...],
  glue[...],
  shinyjs,
)


box::use(
  app / view / layout[dash_layout],
  app / view / map,
  app / view / home,
  app / view / wards,
  app / view / weighting,
  app / view / weighting_boro,
  app / view / downloads,
  app / logic / database[init_connection],
)

# parseTheme("app/logic/theme.json") # custom theming for the application.

#' @export
ui <- function(id) {
  ns <- NS(id)

  # Add CSS for the loading overlay
  tagList(
    shinyjs::useShinyjs(),
    tags$script(
      src = "https://cdn.jsdelivr.net/gh/Appsilon/shiny.tictoc@v0.2.0/shiny-tic-toc.min.js"
    ),
    tags$head(
      tags$style(HTML("
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.7);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
      "))
    ),
    # Loading overlay div - hidden by default
    div(
      id = ns("loadingScreen"),
      class = "loading-screen",
      style = "display: none;",
      Stack(
        horizontalAlign = "center",
        verticalAlign = "center",
        tokens = list(childrenGap = 10),
        Spinner(size = 3, label = "Loading module..."),
        Text(variant = "large", "Please wait while this section loads...")
      )
    ),
    # Regular app UI
    fluentPage(
      dash_layout(
        router_ui(
          route("map", map$ui(ns("map"))),
          route("home", home$ui(ns("home"))),
          route("wards", wards$ui(ns("wards"))),
          route("weighting", weighting$ui(ns("weighting"))),
          route("weighting_boro", weighting$ui(ns("weighting_boro")))
        )
      )
    ),
    p(
      downloads$ui(ns("downloads"))
    )
  )
}

#' @export
server <- function(id) {
  options(shiny.reactlog = TRUE)
  moduleServer(id, function(input, output, session) {
    ns <- session$ns
    print(glue("USER: {session$user}"))
    
    # Initialise router with default route
    router_server("home")
    
    # Initialise database connection
    con <- init_connection()
    
    # Initialise module status tracking
    module_status <- reactiveValues(
      map_loaded = FALSE,
      wards_loaded = FALSE, 
      weighting_loaded = FALSE,
      weighting_boro_loaded = FALSE
    )
    
    # Helper to show loading screen
    show_loading <- function() {
      shinyjs::show(id = "loadingScreen")
    }
    
    # Helper to hide loading screen
    hide_loading <- function() {
      shinyjs::hide(id = "loadingScreen")
    }
    
    # Initialise home module at start (usually lightweight)
    home$server("home")
    
    # Only Initialise map module when map page is visited
    observeEvent(session$clientData$url_hash, {
      if (grepl("#!/map", session$clientData$url_hash)) {
        # Show loading screen if module not yet loaded
        if (!module_status$map_loaded) {
          show_loading()
          
          # Initialise module
          map$server("map")
          
          # Mark as loaded and hide loading screen
          module_status$map_loaded <- TRUE
          
          # Add slight delay before hiding loading to ensure UI has updated
          shinyjs::delay(300, {
            hide_loading()
          })
        }
      }
    }, ignoreInit = TRUE)
    
    # Only Initialise wards module when wards page is visited
    observeEvent(session$clientData$url_hash, {
      if (grepl("#!/wards", session$clientData$url_hash)) {
        # Show loading screen if module not yet loaded
        if (!module_status$wards_loaded) {
          show_loading()
          
          # Initialise module
          wards$server("wards")
          
          # Mark as loaded and hide loading screen
          module_status$wards_loaded <- TRUE
          
          # Add slight delay before hiding loading to ensure UI has updated
          shinyjs::delay(300, {
            hide_loading()
          })
        }
      }
    }, ignoreInit = TRUE)
    
    # Only Initialise wards module when wards page is visited
    observeEvent(session$clientData$url_hash, {
      if (grepl("#!/weighting", session$clientData$url_hash)) {
        # Show loading screen if module not yet loaded
        if (!module_status$weighting_loaded) {
          show_loading()
          
          # Initialise module
          wt <- weighting$server("weighting")
          dwn <-downloads$server("downloads", wt)
          
          
          # Add slight delay before hiding loading to ensure UI has updated
          shinyjs::delay(300, {
            hide_loading()
          })
        }
      }
    }, ignoreInit = TRUE)
    
    # Only Initialise wards module when wards page is visited
    observeEvent(session$clientData$url_hash, {
      if (grepl("#!/weighting_boro", session$clientData$url_hash)) {
        # Show loading screen if module not yet loaded
        if (!module_status$weighting_boro_loaded) {
          show_loading()
          
          # Initialise module
          wt <- weighting_boro$server("weighting_boro")
          
          
          # Add slight delay before hiding loading to ensure UI has updated
          shinyjs::delay(300, {
            hide_loading()
          })
        }
      }
    }, ignoreInit = TRUE)
    
    
    # Disconnect when session ends
    session$onSessionEnded(function() {
      if (!is.null(con)) {
        DBI::dbDisconnect(con)
        message("Database connection closed")
      }
    })
  })
}