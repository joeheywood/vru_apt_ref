# app / logic / util / multibeeswarm_utilis.R #nolint

box::use(
  dplyr[filter, select, arrange, slice_head, slice_tail, sym, mutate, as_tibble, rename],
  sf[st_drop_geometry],
)

#' @description A utility function that prepares data from sf data frame and prepares it for a multiple beeswarm
#' It filters the data based on the selected theme, sorts it to find the top 10 highest or lowest values, and formats it for the beeswarm chart. # nolint
#'
#' @param selected_theme The theme selected by the user.
#' @param data The dataset to be used for the beeswarm chart.
#' @return A dataframe suitable for plotting in a beeswarm chart, containing the relevant 10 wards.
#' @export
prepare_multibeeswarm_data <- function(selected_theme, data) {
  if (is.null(selected_theme) || is.null(data)) {
    return(NULL)
  }


  # This rename assumes that'data' has columns "indicator", "theme", "wd22nm", "value", "lad22nm"
  multibeeswarm_data <- data |>
    filter(theme == selected_theme & !is.na(value) & value != 0) |>
    as_tibble() |>
    select(indicator, theme, wd22cd, value, lad22nm, lad22cd, wd22nm) |>
    rename("unique_id" = indicator, "id" = wd22cd, "borough" = lad22nm) |>
    mutate(unique = id)

  # ! Get subset of data for debugging
  if (!is.null(multibeeswarm_data)) {
    # Get a sample LAD code to demonstrate grouping
    sample_lad <- multibeeswarm_data$lad22cd[1]

    # Filter to show wards with the same LAD code
    matching_wards <- multibeeswarm_data |>
      filter(lad22cd == sample_lad) |>
      select(id, borough, value, lad22cd)

    # print("Sample group of wards with the same LAD code:")
    # print(matching_wards)
  }

  return(multibeeswarm_data)
}
