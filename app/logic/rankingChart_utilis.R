# app/logic/rankingChart_utilis.

box::use(
  dplyr[filter, select, arrange, slice_head, slice_tail, sym, mutate],
  sf[st_drop_geometry],
)

#' @description A utility function that prepares data from the map to be used by the beeswarm chart.
#' It filters the data based on the selected indicator, sorts it to find the top 10 highest or lowest values, and formats it for the beeswarm chart. # nolint
#'
#' @param selected_indicator The indicator selected by the user.
#' @param data The dataset to be used for the beeswarm chart.
#' @return A dataframe suitable for plotting in a beeswarm chart, containing the relevant 10 wards.
#' @export
prepare_rankingchart_data <- function(selected_indicator, data) {
  if (is.null(selected_indicator) || is.null(data)) {
    return(NULL)
  }

  # Check if the maximum value in the dataset is negative
  is_negative <- all(dplyr::filter(data, indicator == selected_indicator)$value < 0)

  # Assuming 'data' has columns 'wd22nm', 'indicator', 'value'
  if (is_negative) {
    # If all values are negative, select the bottom 10
    rankingchart_data <- data |>
      filter(indicator == selected_indicator & !is.na(value) & value != 0) |>
      arrange(value) |> # Sort data in ascending order to get the bottom values
      slice_head(n = 10) |>
      st_drop_geometry() |>
      select(id = wd22nm, value)
  } else {
    # Otherwise, select the top 10
    rankingchart_data <- data |>
      filter(indicator == selected_indicator & !is.na(value) & value != 0) |>
      arrange(desc(value)) |>
      slice_head(n = 10) |>
      st_drop_geometry() |>
      select(id = wd22nm, value)
  }

  return(rankingchart_data)
}
