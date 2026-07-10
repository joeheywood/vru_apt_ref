# app/view/layout.R

box::use(
  shiny[...],
  shiny.fluent[...],
  shiny.router[route_link, router_ui, route],
  glue[glue],
)

# header panel and it's items

header <- tagList(
  img(src = "static/vru_logo_black.png", class = "logo"),
  div(Text(variant = "xLarge", "Area Prioritisation Tool"), class = "title"),
  div(
    Text(variant = "large", "Early Build: Data will initially take a few minutes to load", class = "gla-gray-text"),
    class = "header-message"
  )
)


navigation <- Nav(
  groups = list(
    list(links = list(
      list(name = "Home", url = route_link("home"), icon = "Home", key = "home"),
      list(name = "Overview", url = route_link("map"), icon = "AnalyticsReport", key = "map"),
      list(name = "Area Profiles", url = route_link("wards"), icon = "BIDashboard", key = "wards"),
      list(name = "Weighting", url = route_link("weighting"), icon = "Weights", key = "weighting"),
      list(name = "Weighting (Borough)", url = route_link("weighting_boro"), icon = "Weights", key = "weighting_boro")
    ))
  ),
  styles = list(
    root = list(
      height = "100%",
      boxSizing = "border-box",
      overflowY = "auto"
    )
  )
)


mainUI <- "main"

footer <- Stack(
  horizontal = TRUE,
  horizontalAlign = "space-between",
  tokens = list(childrenGap = 20),
  img(src = "static/designed_city.svg", class = "logoBottom"),
  Text(variant = "medium", "© Copyright Greater London Authority 2024", block = TRUE)
)


#' A function for creating layouts in the app
#' @export
dash_layout <- function(mainUI) {
  div(
    class = "grid-container",
    div(class = "header", header),
    div(class = "sidenav", navigation),
    div(
      class = "main", 
      # Wrap mainUI in a div with appropriate styles to ensure content stays within bounds
      div(
        style = "height: 100%; overflow-y: auto;",
        mainUI
      )
    ),
    div(class = "footer", footer)
  )
}


#' A function for creating cards in the app
#' @export
makeCard <- function(title, content, size = 12, style = "") {
  div(
    class = glue("card ms-depth-8 ms-sm{size} ms-xl{size}"),
    style = style,
    Stack(
      tokens = list(childrenGap = 5),
      Text(variant = "large", title, block = TRUE),
      content
    )
  )
}