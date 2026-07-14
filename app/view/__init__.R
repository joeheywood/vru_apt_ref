# app/view/__init__.R
box::use(
  readr[read_rds],
  dplyr[mutate, arrange],
  app / logic / database[init_connection, query_ward_data],
  sf[st_read],
  memoise[memoise, cache_memory]
)

#' @export
fix_geometries <- function(sf_data) {
  if (!inherits(sf_data, "sf") || nrow(sf_data) == 0) return(sf_data)
  
  geom_types <- sf::st_geometry_type(sf_data)
  problem_indices <- which(geom_types == "GEOMETRYCOLLECTION")
  
  if (length(problem_indices) > 0) {
    message(paste("Found", length(problem_indices), "GeometryCollection objects. Converting to MultiPolygons..."))
    
    for (i in problem_indices) {
      tryCatch({
        poly <- sf::st_collection_extract(sf_data$geometry[i], "POLYGON")
        if (length(poly) > 0 && !sf::st_is_empty(poly)[1]) {
          sf_data$geometry[i] <- sf::st_cast(poly, "MULTIPOLYGON")
        } else {
          pt <- sf::st_point(c(sf_data$lng[i], sf_data$lat[i]))
          pt_sfc <- sf::st_sfc(pt, crs = sf::st_crs(sf_data))
          sf_data$geometry[i] <- sf::st_cast(sf::st_buffer(pt_sfc, 0.001), "MULTIPOLYGON")
        }
      }, error = function(e) {
        message("Error fixing geometry: ", e$message)
        pt <- sf::st_point(c(sf_data$lng[i], sf_data$lat[i]))
        pt_sfc <- sf::st_sfc(pt, crs = sf::st_crs(sf_data))
        sf_data$geometry[i] <- sf::st_cast(sf::st_buffer(pt_sfc, 0.001), "MULTIPOLYGON")
      })
    }
  }
  
  return(sf_data)
}

# Memoised query function for caching
#' @export
get_ward_mapping_data <- memoise::memoise(
  function(theme = NULL, borough = NULL, ward = NULL) {
    query_ward_data(theme, borough, ward) |> 
      fix_geometries()
  },
  cache = cache_memory()
)

# For backward compatibility - full dataset
# @export
# ward_mapping_data <- get_ward_mapping_data()

# Constants
#' @export
url_temp <- "https://api.os.uk/maps/raster/v1/zxy/Light_3857/{z}/{x}/{y}.png?key=vmRzM4mAA1Ag0hkjGh1fhA2hNLEM6PYP"

#' @export
os_mapsattr <- "Contains OS data © Crown copyright and database rights 2024"
