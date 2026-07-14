box::use(
  shiny[
    moduleServer, NS, tags, getDefaultReactiveDomain, observe, reactive,
    div, uiOutput, renderUI, HTML, tagList, req
  ],
  r2d3[r2d3, renderD3, d3Output],
  shiny.fluent[Text, fluentPage, ],
  app / logic / rankingChart_utilis[prepare_rankingchart_data],
)

#' @export
ui <- function(id) {
  ns <- NS(id)
  tagList(
    div(id = "barchart", d3Output(ns("barchart")))
  )
}


#' @export
server <- function(id, data, indicatorInput) {
  moduleServer(id, function(input, output, session) {
    bar_data <- reactive({
      # Ensure the indicator input is available
      req(indicatorInput())
      # Prepare the data based on the current value of the indicator input
      prepared_data <- prepare_rankingchart_data(indicatorInput(), data())
      # print(prepared_data) # Debugging
      ii <- indicatorInput()
      # save(data,ii, file = "debug_rank.RData" )
      prepared_data
    })

    output$barchart <- renderD3({
      r2d3(
        data = bar_data(),
        script = "app/static/lollipop.js",
        d3_version = 6
      )
    })
  })
}
