## home.R
box::use(
  shiny[...],
  shiny.fluent[...],
)
box::use(
  app / view / react[HomeCopy], # Import the component
)

#' @export
ui <- function(id) {
  ns <- NS(id)

  tagList(
    HomeCopy(id = ns("HomeCopy"))
  )
}

#' @export
server <- function(id) {
  moduleServer(id, function(input, output, session) {
    # Empty server-side logic for now
  })
}
