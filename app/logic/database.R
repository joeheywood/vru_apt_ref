#app/logic/database.R

box::use(
  config[get,],
  DBI[dbDisconnect, dbConnect,dbGetQuery],
  RPostgres,
  glue[...]
)

#' @export
init_connection <- function() {
  conn_args <- config::get("dataconnection")

  tryCatch(
    {
      # Establish connection using RPostgres
      con <- DBI::dbConnect(
        RPostgres::Postgres(),
        dbname   = conn_args$database,
        host     = conn_args$server,
        port     = 5432,
        user     = conn_args$uid,
        password = conn_args$pwd,
        sslmode  = conn_args$sslmode # Enable SSL/TLS - AWS will not run without
      )
      message("Successfully connected to database")
      return(con)
    },
    error = function(e) {
      message("Failed to connect to database: ", e$message)
      return(NULL)
    }
  )
}

#' @export
get_themes_df <- function() {
  # con <- init_connection()
  # on.exit(DBI::dbDisconnect(con))
  # dbGetQuery(con, "SELECT DISTINCT theme value_col, theme text_col FROM apt_data_2025")
}

#' @export
get_indicators <- function(theme) {
  con <- init_connection()
  on.exit(DBI::dbDisconnect(con))
  # dbGetQuery(con, glue("SELECT DISTINCT indicator FROM apt_data_2025 WHERE theme = '{theme}'"))
  dbGetQuery(con, glue("SELECT DISTINCT indicator FROM vru_apt_dev_table WHERE theme = '{theme}'"))
  
}

#' @export
get_all_indicators <- function(theme) {
  con <- init_connection()
  on.exit(DBI::dbDisconnect(con))
  #dbGetQuery(con, glue("SELECT DISTINCT theme, indicator FROM apt_data_2025"))
  dbGetQuery(con, glue("SELECT DISTINCT theme, indicator FROM vru_apt_dev_table"))
}


#' @export
get_data_for_weighting <- function() {
  con <- init_connection()
  on.exit(DBI::dbDisconnect(con))
  # return(dbGetQuery(con, glue_sql("SELECT lad22nm, wd22nm, indicator, value, rank_n FROM apt_data_2025")))
  return(dbGetQuery(con, "SELECT lad22nm, wd22nm, indicator, value, rank_n FROM vru_apt_dev_table"))
  
}


#' @export
query_ward_data <- function(theme = NULL, borough = NULL, ward = NULL) {
  con <- init_connection()
  on.exit(DBI::dbDisconnect(con))
  
  # Build dynamic query
  where_clauses <- character()
  
  if (!is.null(theme) && theme != "") {
    where_clauses <- c(where_clauses, 
      glue_sql("theme = {theme}", .con = con))
  }
  
  if (!is.null(borough) && borough != "") {
    where_clauses <- c(where_clauses, 
      glue_sql("lad22cd = {borough}", .con = con))
  }
  
  if (!is.null(ward) && ward != "") {
    where_clauses <- c(where_clauses, 
      glue_sql("wd22cd = {ward}", .con = con))
  }
  
  # Construct the full query
  # base_query <- "SELECT * FROM apt_data_2025"
  base_query <- "SELECT * FROM vru_apt_dev_table"
  
  if (length(where_clauses) > 0) {
    query <- paste(base_query, "WHERE", paste(where_clauses, collapse = " AND "))
  } else {
    query <- base_query
  }
  # print(query)
  
  # Execute query
  # result <- sf::st_read(con, query = query)
  result <- sf::st_read(con, query = query, geometry_column = "geometry")
  
  # to_change <- c(
  #   pass_backgrounds_score = "People from different backgrounds get on well",
  #   pass_fairness_score = "Police treat everyone fairly",
  #   pass_gangs_score = "Gangs are a problem",
  #   pass_good_job_score = "Police do a good job in the local area",
  #   pass_gun_crime_score = "Gun crime is a problem",
  #   pass_knife_crime_score = "Knife crime is a local problem",
  #   pass_trust_mps_score = "Trust the MPS"
  # )
  # print(theme)
  # 
  # if(!is.null(theme) && theme %in% "Communities & Place") {
  #   
  #   result$indicator <- to_change[result$indicator]
  # }
  
  
  
  return(result)
}