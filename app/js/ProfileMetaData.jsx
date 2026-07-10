const { useEffect, useState } = React;

export default function ProfileMetaData({ id = "profilemetadata" }) {
    const [themeDescription, setThemeDescription] = useState('');
    const [currentTheme, setCurrentTheme] = useState('');

    const themeDetails = {
        "CYP-Reducing Harm": {
            introduction: ``,
            overview: `The CYP-Reducing Harm theme focuses on indicators related to reducing harm and violence affecting children and young people (CYP).`,
            indicators: [
                "Gun Crime: Incidents involving the use or possession of firearms in criminal activities",
                "Discharge from Lethal Barrels: Incidents where firearms are discharged, causing potential harm or fatalities",
                "Knife Crime: Incidents involving the use or possession of knives or other sharp instruments",
                "Crime with Injury: Violent crimes that result in physical harm to the victim",
                "Rape: Serious sexual offenses involving non-consensual penetration",
                "Sexual Offences: Crimes of a sexual nature",
                "Homicide: Unlawful killing of one person by another",
                "Violence with Injury: Physical assaults that result in harm to the victim",
                "Violence without Injury: Incidents of violence that do not result in physical harm",
                "Serious Youth Violence Victims: Individuals under the age of 25 who have experienced severe violent crimes",
                "Knife Crime (Victims U25): Knife-related offenses where the victim is under 25 years old",
                "Ambulance Callouts to Youth Assault: Emergency medical responses to violent incidents involving young victims",
                "Ambulance Callouts to Alcohol-Related Incidents: Emergency responses to incidents involving alcohol misuse",
                "Ambulance Callouts to Drug Overdoses: Emergency responses to incidents of drug overdose",
                "Ambulance Callouts to Assault: Emergency medical responses to violent assaults"
            ],
            conclusion: `This theme aims to identify areas where targeted interventions and support services are needed to reduce harm and violence affecting children and young people.`
        },
        "Families": {
            introduction: `The Families theme focuses on indicators that impact the well-being and stability of families in the community.`,
            overview: ``,
            indicators: [
                "IDACI: Measures the proportion of children aged 0 to 15 living in income-deprived families",
                "Domestic Abuse Incidents: Incidents of violence or abuse within a domestic setting",
                "Domestic Abuse Offences: Criminal acts of violence or abuse within a domestic setting",
                "Domestic Abuse (Violence with Injury): Physical violence resulting in harm within a domestic setting",
                "Household is Deprived in Three Dimensions: Households experiencing multiple forms of deprivation simultaneously",
                "Household is Deprived in Four Dimensions: Households experiencing severe deprivation across multiple aspects of life"
            ],
            conclusion: `This theme aims to identify areas where families may be facing challenges and require targeted support and interventions.`
        },
        "Education": {
            introduction: `The Education theme focuses on indicators related to educational outcomes and inclusion.`,
            overview: ``,
            indicators: [
                "Total Exclusions: The number of pupils excluded from school, either permanently or for a fixed period",
                "Total Suspensions: The number of pupils temporarily suspended from school"
            ],
            conclusion: `This theme aims to identify areas where additional support and resources may be needed to improve educational outcomes and address disciplinary issues in schools.`
        },
        "Ranking - Combined Indicators": {
            introduction: `The Ranking - Combined Indicators provides a prioritisation based on combining all the crime and public health metrics in the tool.`,
            overview: `This is a combination of all indicators to give an area ranking. If a ward is in the top 15% of all London wards for a particular indicator (e.g. knife crime offences), it is given a point. Some indicators are given more weight than others. Please see the Home Page for the weighting across all indicators. Please note, this is an indicative ranking of need and should be combined with other local information to inform any decision making.`,
            indicators: [],
            conclusion: `Please see the home page for weighting across indicators.`
        },
        "Communities & Place": {
            introduction: `The Communities & Place theme focuses on indicators related to community perceptions of safety, trust in the police, and social cohesion.`,
            overview: ``,
            indicators: [
                "Percentage who feel the Metropolitan Police Service are doing a good job their local area",
                "Percentage who agree the Metropolitan Police Service are treat everyone fairly regardless of who they are",
                "Percentage who agree that the MPS is an Organisation They Can Trust",
                "Percentage who feel that Gangs are a Problem in the Local Area",
                "Percentage who feel that Gun Crime is a Problem in the Local area",
                "Percentage who feel that knife crime is a problem in the local area",
                "Percentage who agree local area is a place where people from different backgrounds get along well"
            ],
            conclusion: `This theme aims to identify areas where community engagement, trust-building initiatives, and targeted interventions are needed to improve community safety and well-being.`
        },
        "CYP-Opportunities": {
            introduction: `The CYP-Opportunities theme focuses on indicators related to employment and economic opportunities for children and young people (CYP).`,
            overview: ``,
            indicators: [
                "Benefits Claimants Aged 16 to 24: Measures the number of young people claiming benefits",
                "Economically Active (Excluding Full-Time Students): Unemployed Aged 16 to 24",
                "Long term Unemployment",
                "Young people who are not in education, employment or training (NEET)"
            ],
            conclusion: `This theme aims to identify areas where targeted interventions and support services are needed to improve employment prospects and economic opportunities for young people.`

        }
    };

    useEffect(() => {
        const inputId = id.replace('profilemetadata', 'themeInput');

        const handleShinyInputChange = () => {
            const shinyInput = window.Shiny.shinyapp.$inputValues[inputId];
            if (shinyInput && shinyInput !== currentTheme) {
                setCurrentTheme(shinyInput);
                const themeContent = themeDetails[shinyInput];
                if (themeContent) {
                    // Create formatted content here instead of storing HTML
                    const formattedContent = (
                        <div className="theme-description">
                            <p className="mb-4">{themeContent.introduction}</p>
                            <p className="mb-4">{themeContent.overview}</p>

                            {/* Only show indicators section if the theme has indicators to display */}
                            {themeContent.indicators && themeContent.indicators.length > 0 && (
                                <>
                                    <p className="font-bold mb-2">Key indicators included in this theme are:</p>
                                    <ul className="list-disc pl-6 mb-4 space-y-1">
                                        {themeContent.indicators.map((indicator, index) => (
                                            <li key={index}>{indicator}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <p>{themeContent.conclusion}</p>
                        </div>
                    );
                    setThemeDescription(formattedContent);
                } else {
                    setThemeDescription('Please select a priority area to view its description.');
                }
            }
        };

        const intervalId = setInterval(handleShinyInputChange, 100);
        return () => clearInterval(intervalId);
    }, [currentTheme]);

    return (
        <div id={id}>
            <div className="p-4">
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Priority Area: {currentTheme || 'None selected'}</h3>
                </div>
                <div>
                    <h3 className="text-lg font-bold mb-2">Description:</h3>
                    <div className="text-gray-700 leading-relaxed">
                        {themeDescription}
                    </div>
                </div>
            </div>
        </div>
    );
}