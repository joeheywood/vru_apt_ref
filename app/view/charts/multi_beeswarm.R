# app/view/charts/multi_beeswarm.R
box::use(
  shiny[
    moduleServer, NS, tags, getDefaultReactiveDomain, observe, reactive,
    div, uiOutput, renderUI, HTML, tagList, req, observeEvent, updateSelectInput,
  ],
  r2d3[r2d3, renderD3, d3Output],
  shiny.fluent[Text, fluentPage, Toggle.shinyInput, TooltipHost, updateDropdown.shinyInput],
  app / logic / util / multibeeswarm_utilis[prepare_multibeeswarm_data],
)

#' @export
ui <- function(id) {
  ns <- NS(id)
  tagList(
    div(
      TooltipHost(
        content = "Toggle between borough highlighting and standard view",
        Toggle.shinyInput(ns("highlightMode"), value = FALSE, label = "Highlight Borough")
      ),
      id = "multibeeswarm",
      d3Output(ns("multibeeswarm"))
    )
  )
}

#' @export
server <- function(id, selected_dataset, themeInput, wardInput) {
  moduleServer(id, function(input, output, session) {
    ns <- session$ns

    #* Reactive data for the beeswarm
    multibee_data <- reactive({
      req(themeInput(), selected_dataset())
 
      multibee_prepared_data <- prepare_multibeeswarm_data(themeInput(), selected_dataset())
      multibee_prepared_data <- multibee_prepared_data[multibee_prepared_data$value != 0, ]

      multibee_prepared_data
    })

    #* Reactive input for the beeswarm
    selected_ward <- reactive({
      req(wardInput())
      wardInput()
    })

    # todo: Observer for D3 ward selection: this is currently not working
    # observeEvent(input$ward_clicked, {
    #   req(input$ward_clicked)
    #   print("ward click")
    #   updateDropdown.shinyInput(
    #     session = getDefaultReactiveDomain(),
    #     inputId = "wardInput",
    #     value = input$ward_clicked
    #   )
    # })

    # Render the beeswarm plot
    output$multibeeswarm <- renderD3({
      req(multibee_data(), selected_ward())

      r2d3(
        data = multibee_data(),
        script = "app/static/charts/multibeeswarm-no-animation-toggle-inputs-updater.js",
        d3_version = 6,
        options = list(
          selected_ward = selected_ward(),
          highlightMode = input$highlightMode
        )
      )
    })
  })
}
# # app/view/charts/multi_beeswarm.R
# box::use(
#   shiny[
#     moduleServer, NS, tags, getDefaultReactiveDomain, observe, reactive,
#     div, uiOutput, renderUI, HTML, tagList, req,
#   ],
#   r2d3[r2d3, renderD3, d3Output],
#   shiny.fluent[Text, fluentPage],
#   app / logic / util / multibeeswarm_utilis[prepare_multibeeswarm_data],
# )

# #' @export
# ui <- function(id) {
#   ns <- NS(id)
#   tagList(
#     div(
#       id = "multibeeswarm",
#       d3Output(ns("multibeeswarm"))
#     )
#   )
# }

# #' @export
# server <- function(id, selected_dataset, themeInput, wardInput) {
#   moduleServer(id, function(input, output, session) {

#     #* Reactive data for the beeswarm
#     multibee_data <- reactive({
#       req(themeInput(), selected_dataset())

#       multibee_prepared_data <- prepare_multibeeswarm_data(themeInput(), selected_dataset())
#       multibee_prepared_data <- multibee_prepared_data[multibee_prepared_data$value != 0, ]

#   # Print the full dataframe
#   print("Full multibeeswarm dataframe:")
#   print(multibee_prepared_data)


#       multibee_prepared_data
#     })

#     #* Reactive input for the beeswarm
#     selected_ward <- reactive({
#       req(wardInput())
#       wardInput()
#     })


#     #* Render the beeswarm plot
#     output$multibeeswarm <- renderD3({
#       req(multibee_data(), selected_ward())

#       r2d3(
#         data = multibee_data(),
#         script = "app/static/charts/test.js",
#         d3_version = 6,
#         options = list(
#           selected_ward = selected_ward()
#         )
#       )
#     })
#   })
# }
