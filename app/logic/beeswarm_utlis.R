# app/logic/beeswarm_utlis.

box::use(dplyr[filter, select, mutate])

#' @description A utility function that prepares data from the map to be used by the beeswarm chart.
#' It filters the data based on the selected indicator and formats it for the beeswarm chart.
#'
#' @param selected_indicator The indicator selected by the user.
#' @param data The dataset to be used for the beeswarm chart.
#' @return A dataframe suitable for plotting in a beeswarm chart. With `wd22nm` as the id, value,and lad22nm
#' @export
prepare_beeswarm_data <- function(selected_indicator, data) {
  #* Return NULL into dropdowns when use has not selected an indicator
  if (is.null(selected_indicator) || is.null(data)) {
    return(NULL)
  }

  #* This is the actual data that goes into the beeswarm
  beeswarm_data <- data |>
    filter(indicator == selected_indicator & !is.na(value) & value != 0) |>
    select(id = wd22nm, series = lad22cd, value)

  # print(beeswarm_data)

  #* Returned dataframe into the application
  return(beeswarm_data)
}
