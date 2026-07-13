#app/logic/run_rankings.R

box::use(
  dplyr[...],
  tidyr[...],
  glue[...],
  purrr[...],
  utils[...],
  readr[...]
)

box::use(
  app / logic / database[get_data_for_weighting],
)

#' @export
run_weightings <- function(weightings) {
  ### get data from database
  dt <- get_data_for_weighting()
  # inds <- read_csv("default_weights.csv")
   # saveRDS(inds, file = "default_weights.RDS")
  inds <- readRDS("default_weights.RDS")
  
  inds <- inds[which(inds$weighting >= 0),]
  
  rev_inds <- c(
    "pass_backgrounds_score",
    "pass_fairness_score",
    "pass_good_job_score",
    "pass_trust_mps_score"
    )
  
  #save(dt, rev_inds, file = "debug_inds.RData")
  dt$value[which(dt$indicator %in% rev_inds)] <- 1000 -  dt$value[which(dt$indicator %in% rev_inds)]
  
  

  scores <- map_df(unique(inds$indicator), run_for_indicator, dt = dt) %>%
    apply_weightings(weightings)
  

  scores %>% summarise(.by = c(lad22nm, wd22nm), score = sum(score)) %>%
    arrange(desc(score))
  
}

#' @export
run_weightings_borough <- function(weightings) {
  dt <- readRDS("borough_version.RDS") # %>% 
    # summarise(.by = c(lad22cd, lad22nm, indicator, theme), value = sum(value))
  
  inds <- readRDS("default_weights.RDS")
  inds$weighting[which(inds$indicator == "Household is deprived in three dimensions")] <- -1
  
  
  inds <- inds[which(inds$weighting >= 0),]
  
  
  rev_inds <- c(
    "pass_backgrounds_score",
    "pass_fairness_score",
    "pass_good_job_score",
    "pass_trust_mps_score"
  )
  dt$value[which(dt$indicator %in% rev_inds)] <- 1000 -  dt$value[which(dt$indicator %in% rev_inds)]
  
  
  scores <- map_df(unique(inds$indicator), run_for_indicator_boro, dt = dt) %>%
    apply_weightings(weightings)
  
  
  scores %>% summarise(.by = c(lad22nm), score = sum(score)) %>%
    arrange(desc(score))
  
}

#' @export
get_inds_scores_for_ward <- function(ward, weightings) {
  message("Back: get_inds_scores_for_ward")
  ### get data from database
  zz <- which(weightings$weighting == 0)
  rems <- weightings$indicator[zz]
  
  dt <- get_data_for_weighting()  ## should use a where in the SQL eventually.
  
  
  
  
  scores <- map_df(unique(dt$indicator), run_for_indicator, dt = dt) %>% 
    apply_weightings(weightings) %>% 
    filter(wd22nm == ward, !indicator %in% rems)
  
  # print(scores[1:3,])
  scores %>% select(indicator, score, rank_n)

  
}

#' @export
get_inds_scores_for_borough <- function(ward, weightings) {
  message("Back: get_inds_scores_for_ward")
  ### get data from database
  zz <- which(weightings$weighting == 0)
  rems <- weightings$indicator[zz]
  
  dt <- get_data_for_weighting()  ## should use a where in the SQL eventually.
  
  
  
  
  scores <- map_df(unique(dt$indicator), run_for_indicator, dt = dt) %>% 
    apply_weightings(weightings) %>% 
    filter(wd22nm == ward, !indicator %in% rems)
  
  # print(scores[1:3,])
  scores %>% select(indicator, score, rank_n)
  
  
}

run_for_indicator <- function(ind, dt) {
  ind_dat <- dt %>% filter(indicator %in% ind) %>% 
    arrange(desc(value))
  thresh_val <- ind_dat$value[round(nrow(ind_dat) * .15)]
  ind_dat$rank_n <- 1:nrow(ind_dat)
  ind_dat$score <- 0
  ind_dat$score[which(ind_dat$value >= thresh_val)] <- 1
  ind_dat %>% select(lad22nm, wd22nm, indicator, score, rank_n)
}

run_for_indicator_boro <- function(ind, dt) {
  # print(ind)
  ind_dat <- dt %>% filter(indicator %in% ind) %>% 
    arrange(desc(value))
  thresh_val <- ind_dat$value[round(nrow(ind_dat) * .15)]
  ind_dat$rank_n <- 1:nrow(ind_dat)
  ind_dat$score <- 0
  ind_dat$score[which(ind_dat$value >= thresh_val)] <- 1
  ind_dat %>% select(lad22nm, indicator, score, rank_n)
}

apply_weightings <- function(scores, weightings) {
  ww <- which(weightings$weighting != 1)
  for(w in ww) {
    wsw <- which(scores$indicator %in% weightings$indicator[w] & scores$score > 0)
    # print(wsw)
    
    scores$score[wsw] <- weightings$weighting[w]
  }
  scores
}





### set threshold

### 
