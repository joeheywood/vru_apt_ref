# view/basemaps/ward_basemap.R

box::use(
  shiny[...],
  shiny.fluent[...],
  leaflet[...],
  r2d3[r2d3, renderD3, d3Output],
  purrr[map2, discard],
  janitor[make_clean_names],
  dplyr[arrange, desc, order_by, slice_max, filter, slice_head],
  sf[st_read],
  app / view[url_temp, os_mapsattr] # Load basemap and attribution
)

#' @export
ui <- function(id) {
  ns <- NS(id)

  tagList(div(
    leafletOutput(ns("ward_map"), height = 600)
  ))
}

#' @export
server <- function(id, ward_data, selected_ward) {
  moduleServer(id, function(input, output, session) {
    # Highlight styling
    highlight_style <- list(
      weight = 2,
      color = "#000000",
      fillColor = "#228B22",
      fillOpacity = 0.5
    )
    
    
    initial_ward_data <- reactiveVal(NULL)
    
    # This separates out the initial data from the map, so it doesn't keep re-rendering
    # every time that ward_data() changes.
    observeEvent(ward_data(), {
      if (is.null(initial_ward_data())) {
        initial_ward_data(ward_data())
      }
    }, once = TRUE)

    # Initial map render - now using reactive ward_data
    output$ward_map <- renderLeaflet({
      # req(ward_data())  # Ensure data is available
      req(initial_ward_data()) # Ensures this only runs once.
      
      leaflet(options = leafletOptions(minZoom = 10, maxZoom = 18)) |>
        setView(-0.118092, 51.509865, zoom = 10) |>
        addTiles(urlTemplate = url_temp, attribution = os_mapsattr) |>
        addPolygons(
          data = initial_ward_data(),  # Call the reactive
          layerId = ~wd22cd,
          fillColor = FALSE,
          color = "black",
          weight = 1
        )
    })

    # Observer to update the map when the selected ward changes
    observeEvent(selected_ward(), {
      req(selected_ward())
      req(ward_data())  # Ensure data is available

      # Filter using wd22cd instead of ward_name
      selected_ward_code <- selected_ward()
      
      # Now we need to call ward_data() to get the actual data
      current_ward_data <- ward_data()
      selected_ward_data <- current_ward_data[current_ward_data$wd22cd == selected_ward_code, ]

      if (nrow(selected_ward_data) > 0) {
        leafletProxy("ward_map") |>
          clearGroup("selected-ward") |> # Clear previous selection
          setView(
            lng = selected_ward_data$lng[1],
            lat = selected_ward_data$lat[1],
            zoom = 14
          ) |>
          addPolygons(
            data = selected_ward_data,
            layerId = ~wd22cd,
            group = "selected-ward",
            fillColor = highlight_style$fillColor,
            fillOpacity = highlight_style$fillOpacity,
            color = highlight_style$color,
            weight = highlight_style$weight
          )
      }
    })
  })
}

# # view/basemaps/ward_basemap.R

# box::use(
#   shiny[...],
#   shiny.fluent[...],
#   leaflet[...],
#   r2d3[r2d3, renderD3, d3Output],
#   purrr[map2, discard],
#   janitor[make_clean_names],
#   dplyr[arrange, desc, order_by, slice_max, filter, slice_head],
#   sf[st_read],
#   app / view[url_temp, os_mapsattr] # Load basemap and attribution
# )

# #' @export
# ui <- function(id) {
#   ns <- NS(id)

#   tagList(div(
#     leafletOutput(ns("ward_map"), height = 600)
#   ))
# }

# #' @export
# server <- function(id, ward_data, selected_ward) {
#   moduleServer(id, function(input, output, session) {
#     # Highlight styling
#     highlight_style <- list(
#       weight = 2,
#       color = "#000000",
#       fillColor = "#228B22",
#       fillOpacity = 0.5
#     )

#     # Initial map render
#     output$ward_map <- renderLeaflet({
#       leaflet(options = leafletOptions(minZoom = 10, maxZoom = 18)) |>
#         setView(-0.118092, 51.509865, zoom = 10) |>
#         addTiles(urlTemplate = url_temp, attribution = os_mapsattr) |>
#         addPolygons(
#           data = ward_data,
#           layerId = ~wd22cd, # Use wd22nm as layerId
#           fillColor = FALSE,
#           color = "black",
#           weight = 1
#         )
#     })

#     # Observer to update the map when the selected ward changes
#     observeEvent(selected_ward(), {
#       req(selected_ward())

#       # Filter using wd22cd instead of ward_name
#       selected_ward_code <- selected_ward()
#       selected_ward_data <- ward_data[ward_data$wd22cd == selected_ward_code, ]

#       if (nrow(selected_ward_data) > 0) {
#         leafletProxy("ward_map") |>
#           clearGroup("selected-ward") |> # Clear previous selection
#           setView(
#             lng = selected_ward_data$lng[1],
#             lat = selected_ward_data$lat[1],
#             zoom = 14
#           ) |>
#           addPolygons(
#             data = selected_ward_data,
#             layerId = ~wd22cd,
#             group = "selected-ward",
#             fillColor = highlight_style$fillColor,
#             fillOpacity = highlight_style$fillOpacity,
#             color = highlight_style$color,
#             weight = highlight_style$weight
#           )
#       }
#     })
#   })
# }
