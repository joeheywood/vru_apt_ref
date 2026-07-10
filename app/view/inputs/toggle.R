# app/view/toggle.R

box::use(
  dplyr[filter],
  shiny[div, moduleServer, NS, reactive],
  shiny.fluent[Text, Toggle.shinyInput, ]
)

#' @export
ui <- function(id) {
  ns <- NS(id)

  div(
    Toggle.shinyInput(ns("showRanking"), label = "Show ranking view")
  )
}

#' @export
server <- function(id) {
  moduleServer(id, function(input, output, session) {
    # Reactive value to capture the state of the toggle
    toggleState <- reactive({
      input$showRanking
    })

    # Make this reactive value accessible outside the module
    return(list(
      toggleState = toggleState
    ))
  })
}
