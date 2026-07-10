# app/logic/one-time-data-processsing-script.R

library(qs)
library(dplyr)
library(glue)
library(tidyr)
library(sf) # Add sf library for spatial data handling

# Load the original data
# data <- qread("app/logic/data/mapping_data.qs")


#* One time removal of economic data
data <- data |>
  dplyr::filter(theme != "CYP-Opportunities") |>
  glimpse()

data <- data |>
  select(-theme_description.x, -theme_description.y) |>
  glimpse()

# Create text descriptions by theme

# Families theme
families_text <- data |>
  filter(theme == "Families") |>
  group_by(ward_code) |>
  reframe(
    theme = first(theme),
    ward_name = first(ward_name),
    theme_description = {
      idaci <- abs(value[indicator == "IDACI"][1])
      incidents <- value[indicator == "Domestic Abuse Incidents"][1]
      offences <- value[indicator == "Domestic Abuse Offences"][1]
      injury <- value[indicator == "Domestic Abuse (Violence with Injury)"][1]
      deprived_four <- value[indicator == "Household is Deprived in Four Dimensions"][1]
      deprived_three <- value[indicator == "Household is Deprived in Three dimensions"][1]

      glue("
Family Overview for {ward_name}:

- Income Deprivation: {idaci}% of children aged 0 to 15 live in income-deprived families.
- Domestic Abuse Incidents: {incidents} incidents of domestic violence reported.
- Domestic Abuse Offences: {offences} criminal acts of domestic violence or abuse recorded.
- Violence with Injury: {injury} incidents of physical violence resulting in injury within a domestic setting.
- Severe Household Deprivation: {deprived_four} households experiencing severe deprivation across multiple life aspects.
- Multiple Deprivation: {deprived_three} households experiencing multiple forms of deprivation simultaneously.
")
    }
  ) |>
  st_drop_geometry() # Drop the geometry before combining

# All indicators theme
all_indicators_text <- data |>
  filter(theme == "All indicators") |>
  group_by(ward_code) |>
  summarise(
    theme = first(theme),
    ward_name = first(ward_name),
    value = value[indicator == "Overall Ranking"],
    rank = rank(-value),
    total_wards = n_distinct(data$ward_code),
    theme_description = glue("
Overall Performance for {ward_name}:

{ward_name} is ranked {rank} out of {total_wards} London wards across all indicators. This ranking reflects the ward's performance in various priority areas. For a detailed breakdown of specific metrics, please select a priority area."),
    .groups = "drop"
  ) |>
  st_drop_geometry() # Drop the geometry before combining

# CYP-Reducing Harm theme
cyp_reducing_harm_text <- data |>
  filter(theme == "CYP-Reducing Harm") |>
  group_by(ward_code) |>
  reframe(
    theme = first(theme),
    ward_name = first(ward_name),
    theme_description = {
      gun_crime <- value[indicator == "Gun Crime"][1]
      discharge_lethal <- value[indicator == "Discharge from Lethal Barrels"][1]
      knife_crime <- value[indicator == "Knife Crime"][1]
      homicide <- value[indicator == "Homicide"][1]
      crime_injury <- value[indicator == "Crime with Injury"][1]
      violence_with_injury <- value[indicator == "Violence with Injury"][1]
      violence_without_injury <- value[indicator == "Violence without Injury"][1]
      rape <- value[indicator == "Rape"][1]
      sexual_offences <- value[indicator == "Sexual Offences"][1]
      serious_youth_violence <- value[indicator == "Serious Youth Violence Victims"][1]
      knife_crime_u25 <- value[indicator == "Knife Crime (Victims U25)"][1]
      ambulance_youth_assault <- value[indicator == "Ambulance callouts to Youth Assault"][1]
      las_alcohol <- value[indicator == "LAS callouts to alchol-related incidents"][1]
      las_drug_overdose <- value[indicator == "LAS callouts to drug overdoses"][1]
      las_assault <- value[indicator == "LAS callouts to Assault"][1]

      glue("
Reducing Harm Overview for {ward_name}:

- Gun Crime: {gun_crime} incidents involving firearms.
- Firearm Discharges: {discharge_lethal} incidents where firearms were discharged.
- Knife Crime: {knife_crime} incidents involving knives or sharp instruments.
- Homicides: {homicide} cases reported.
- Crimes with Injury: {crime_injury} violent crimes resulting in injury.
- Violence with Injury: {violence_with_injury} physical assaults causing harm.
- Violence without Injury: {violence_without_injury} violent incidents without physical harm.
- Rape Cases: {rape} serious sexual offences involving non-consensual acts.
- Sexual Offences: {sexual_offences} crimes of a sexual nature reported.
- Serious Youth Violence Victims: {serious_youth_violence} young individuals affected by severe violent crimes.
- Knife Crime Victims Under 25: {knife_crime_u25} knife-related offences involving victims under 25.
- Ambulance Callouts to Youth Assaults: {ambulance_youth_assault} emergency responses to youth assaults.
- LAS Callouts to Alcohol-related Incidents: {las_alcohol} emergency responses to alcohol misuse.
- LAS Callouts to Drug Overdoses: {las_drug_overdose} emergency responses to drug overdoses.
- LAS Callouts to Assaults: {las_assault} emergency responses to assaults.
")
    }
  ) |>
  st_drop_geometry() # Drop the geometry before combining

# Education theme
education_text <- data |>
  filter(theme == "Education") |>
  group_by(ward_code) |>
  reframe(
    theme = first(theme),
    ward_name = first(ward_name),
    theme_description = {
      total_exclusions <- value[indicator == "Total Exclusions"][1]
      total_suspensions <- value[indicator == "Total Suspensions"][1]

      glue("
Education Overview for {ward_name}:

- Total Exclusions: {total_exclusions} pupils have been excluded from school, either permanently or temporarily.
- Total Suspensions: {total_suspensions} pupils have been suspended from school for fixed periods.
")
    }
  ) |>
  st_drop_geometry() # Drop the geometry before combining

# Communities & Place theme
communities_place_text <- data |>
  filter(theme == "Communities & Place") |>
  group_by(ward_code) |>
  reframe(
    theme = first(theme),
    ward_name = first(ward_name),
    theme_description = {
      police_good_job <- value[indicator == "Feel the police do a good job in the local area"][1]
      police_fair <- value[indicator == "Agree the police treat everyone fairly regardless of who they are​​"][1]
      trust_police <- value[indicator == "Agree that the MPS is an organisation they can trust​​"][1]
      gangs_problem <- value[indicator == "Feel that gangs are a problem in the local area​"][1]
      gun_crime_problem <- value[indicator == "Feel that gun crime is a problem in the local area​​"][1]
      knife_crime_problem <- value[indicator == "Feel that knife crime is a problem in the local area​"][1]
      community_cohesion <- value[indicator == "Agree local area is place where people from different backgrounds get on well​​"][1]

      glue("
Community and Place Overview for {ward_name}:

- Police Performance: {police_good_job}% of residents feel the police do a good job in the local area.
- Police Fairness: {police_fair}% agree the police treat everyone fairly regardless of who they are.
- Trust in Police: {trust_police}% trust the Metropolitan Police Service.
- Gang Issues: {gangs_problem}% feel gangs are a problem in the area.
- Gun Crime Concern: {gun_crime_problem}% perceive gun crime as a problem locally.
- Knife Crime Concern: {knife_crime_problem}% perceive knife crime as a problem locally.
- Community Cohesion: {community_cohesion}% agree that people from different backgrounds get along well in the area.
")
    }
  ) |>
  st_drop_geometry() # Drop the geometry before combining

# CYP-Opportunities theme
cyp_opportunities_text <- data |>
  filter(theme == "CYP-Opportunities") |>
  group_by(ward_code) |>
  reframe(
    theme = first(theme),
    ward_name = first(ward_name),
    theme_description = {
      benefits_16_24 <- value[indicator == "Benefits Claimants Aged 16 to 24"][1]
      unemployed_youth <- value[indicator == "Economically active (excluding full-time students): Unemployed: Seeking work or waiting to start a job already obtained: Available to start working within 2 weeks"][1]

      glue("
Opportunities for Young People in {ward_name}:

- Benefits Claimants (Aged 16-24): {benefits_16_24} young people are claiming benefits.
- Youth Unemployment: {unemployed_youth} young people are unemployed and actively seeking work.
")
    }
  ) |>
  st_drop_geometry() # Drop the geometry before combining

# Combine all theme descriptions
theme_descriptions <- bind_rows(
  all_indicators_text,
  families_text,
  cyp_reducing_harm_text,
  education_text,
  communities_place_text,
  cyp_opportunities_text
)

# Print diagnostics
print("Theme descriptions summary:")
print(theme_descriptions |> count(theme))

# Add descriptions back to the spatial data
updated_data <- data |>
  left_join(
    theme_descriptions |>
      select(ward_code, theme, theme_description),
    by = c("ward_code", "theme")
  )

# Save the updated data
# qsave(updated_data, "app/logic/data/mapping_data.qs")

# Verification
print("\nVerification after save:")
print("Number of rows in updated dataset:")
print(nrow(updated_data))
print("Number of rows with theme descriptions:")
print(sum(!is.na(updated_data$theme_description)))

# Show sample of updated data
print("\nSample of updated data:")
print(updated_data |>
  st_drop_geometry() |> # Drop geometry for display
  filter(!is.na(theme_description)) |>
  select(ward_name, theme, theme_description) |>
  head(1))
