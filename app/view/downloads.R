
box::use(
  shiny[...],
  shinyjs[click, useShinyjs, delay],
  glue[glue],
  dplyr[...],
  shiny.fluent[ActionButton.shinyInput, reactOutput, renderReact, Modal, Stack,
               Text, IconButton.shinyInput, ChoiceGroup.shinyInput],
  utils[write.csv],
)


#' @export
ui <- function(id) {
  ns <- NS(id)
  tagList(
    useShinyjs(),
    reactOutput(ns("modal")),
    div(
      # style = "visibility: hidden;",
      # downloadLink(ns("download"), label = ""),
      downloadLink(ns("export_csv"), label = "")
      
    )
    
    
  )
}

#' @export
server <- function(id, wt) {
  moduleServer(id, function(input, output, session) {
    observe({
      get_csv <- wt$download
      if(get_csv %in% 1) {
        print(glue("DOWNLOAD {get_csv}"))
        click("export_csv")
        wt$download <- 4
        
      }
    })
    
    output$export_csv <- downloadHandler(
      filename = function() {
        paste("weigthings-", Sys.Date(), ".csv", sep="")
      },
      content = function(file) {
        dat <- wt$top_wards
        write.csv(dat, file, row.names = FALSE)
      }
    )
    
  })
}