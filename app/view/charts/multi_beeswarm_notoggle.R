# app/view/charts/multi_beeswarm.R
box::use(
  shiny[
    moduleServer, NS, tags, getDefaultReactiveDomain, observe, reactive,
    div, uiOutput, renderUI, HTML, tagList, req,
  ],
  r2d3[r2d3, renderD3, d3Output],
  shiny.fluent[Text, fluentPage],
  app / logic / util / multibeeswarm_utilis[prepare_multibeeswarm_data],
)

#' @export
ui <- function(id) {
  ns <- NS(id)
  tagList(
    div(
      id = "multibeeswarm",
      d3Output(ns("multibeeswarm"))
    )
  )
}

#' @export
server <- function(id, selected_dataset, themeInput, wardInput) {
  moduleServer(id, function(input, output, session) {
    # Create reactive for the data
    multibee_data <- reactive({
      req(themeInput(), selected_dataset())

      multibee_prepared_data <- prepare_multibeeswarm_data(themeInput(), selected_dataset())
      multibee_prepared_data <- multibee_prepared_data[multibee_prepared_data$value != 0, ]

      multibee_prepared_data
    })

    # Create reactive for the selected ward
    selected_ward <- reactive({
      req(wardInput())
      wardInput()
    })

    # Render the beeswarm plot
    output$multibeeswarm <- renderD3({
      req(multibee_data(), selected_ward())

      r2d3(
        data = multibee_data(),
        script = "app/static/charts/multiplebeeswarm-animated-notoggle.js",
        d3_version = 6,
        options = list(
          selected_ward = selected_ward()
        )
      )
    })
  })
}
