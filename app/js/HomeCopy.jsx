export default function HomeCopy({ id = "homecopy" }) {
    return (
        <div id={id}>
            {/* Welcome Section */}
            <div style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
                <h1>Welcome to the VRU Area Prioritisation Tool (APT)</h1>
                <p style={{ margin: "20px auto", width: "80%", lineHeight: "1.6" }}>
                    The <strong>VRU Area Prioritisation Tool (APT)</strong> enables the Violence Reduction Unit (VRU) and its partners to take a <strong>strategic and data-driven approach to violence prevention</strong> across London. By identifying areas of high need, the APT helps target resources effectively, supporting a <strong>public health and highly localised approach</strong> to reducing violence.
                </p>
            </div>

            {/* Tool Information Section */}
            <section style={{ margin: "20px auto", width: "80%" }}>
                <h2 style={{ textAlign: "center", color: "#333", marginTop: "50px" }}>
                    About the Area Prioritisation Tool
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {[
                        {
                            title: "What the Tool Does",
                            content: "The tool combines metrics from multiple sources—including crime, education, public health (e.g., deprivation), emergency services, and public perceptions—to provide a holistic view of need at both ward and borough levels. Users can explore how these metrics have changed over time, covering data from 2018/19 onwards.",
                        },
                        {
                            title: "How the Tool Works",
                            content: "The APT assigns points to wards based on their ranking for specific metrics. For example, if a ward is in the top 15% for an indicator like 'knife crime offences,' it receives a point. This allows users to compare need across wards and identify priority areas effectively.",
                        },
                        {
                            title: "Navigating the Tool",
                            content: "Overview Page: View how a specific metric varies across London. Ward Profile Page: Explore detailed data for a specific area. How to Use the APT: Guidance on using and interpreting the tool. About the Data: Detailed explanations of the data sources, definitions, and methodology.",
                        },
                        {
                            title: "Why the APT Matters",
                            content: "The APT supports the VRU's mission to reduce violence by providing a clear, evidence-based understanding of need across London. By connecting data to these priority areas, it helps identify where interventions can have the most impact—whether through addressing youth violence, supporting families, or empowering communities.",
                        }
                    ].map((item, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#FFF",
                                padding: "20px",
                                borderRadius: "10px",
                                marginBottom: "20px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h3 style={{ color: "#333", fontWeight: "bold" }}>{item.title}</h3>
                            <p style={{ color: "#333" }}>{item.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Priority Areas Section */}
            <section style={{ margin: "20px auto", width: "80%" }}>
                <h2 style={{ textAlign: "center", color: "#333", marginTop: "50px" }}>
                    Priority Areas
                </h2>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "20px",
                    }}
                >
                    {[
                        {
                            title: "Children & Young People: Reducing Harm",
                            content: "Identifying and preventing harm to young people most at risk of violence or exploitation.",
                            indicators: "Key indicators: Ambulance callouts to youth assaults, knife crime (including victims under 25), serious youth violence victims, homicide and gun crime, LAS callouts to alcohol-related incidents",
                            color: "#C5DCF2",
                        },
                        {
                            title: "Children & Young People: Positive Opportunities",
                            content: "Expanding access to opportunities through education, training, and employment.",
                            indicators: "Key indicators: Benefits claimants aged 16-24, unemployed individuals seeking work",
                            color: "#EEF5FB",
                        },
                        {
                            title: "Families",
                            content: "Strengthening families to build resilience and better support young people.",
                            indicators: "Key indicators: Domestic abuse incidents and offences, households deprived in three or four dimensions, Income Deprivation Affecting Children Index (IDACI)",
                            color: "#FBE6D0",
                        },
                        {
                            title: "Education",
                            content: "Promoting healthy relationships, reducing exclusions, and supporting engagement in education.",
                            indicators: "Key indicators: Total exclusions and suspensions",
                            color: "#DFECDF",
                        },
                        {
                            title: "Communities & Place",
                            content: "Supporting communities to deliver long-term reductions in violence.",
                            indicators: "Key indicators: Public perceptions of trust in police and fair treatment, concerns about gangs, gun crime, and knife crime in local areas",
                            color: "#FFF8BD",
                        }
                    ].map((area, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: area.color,
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                            }}
                        >
                            <h3 style={{ color: "#333", fontWeight: "bold" }}>{area.title}</h3>
                            <p style={{ color: "#333", marginBottom: "10px" }}>{area.content}</p>
                            <p style={{ color: "#666", fontSize: "0.9em" }}>{area.indicators}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Information Section */}
            <section style={{ margin: "20px auto", width: "80%" }}>
                <h2 style={{ textAlign: "center", color: "#333", marginTop: "50px" }}>
                    About The Data
                </h2>
                <div
                    style={{
                        backgroundColor: "#FFF",
                        padding: "20px",
                        borderRadius: "10px",
                        marginBottom: "20px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        overflowX: "auto"
                    }}
                >
                    <h3 style={{ color: "#333", fontWeight: "bold", marginBottom: "15px" }}>Indicators and Data Sources in the APT .</h3>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9em" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>#</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Indicator</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Data source</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Additional Definition</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Time Period</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Ranking - Combined Indicators</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold"  }} colspan="7">CYP-Reducing Harm</th>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Gun Crime</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded Gun Crimes</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Homicide</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded Homicides</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>3</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Knife Crime</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded Knife Crimes</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>4</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Knife Crime (Victims U25)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded Knife Crimes where the victim is aged 25 or under</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Discharge from Lethal Barrels</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded crimes with 'Discharge from Lethal Barrels' tag denoted</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>6</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Sexual Offences</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded crimes denoted 'other sexual offences', representing all sexual offences that are not classified as rape</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>7</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Rape</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded rapes</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>8</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Robbery (Robbery of Personal Property)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded robberies of personal property</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>9</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to alcohol-related incidents</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as alcohol related</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2019-25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident).</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>10</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to Assault</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as an assault injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2019-25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident).</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>11</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to gun injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as a gun injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident)</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>12</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to knife injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as a knife injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident)</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>13</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to drug overdoses</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as an overdose</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2019-25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident).</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>14</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to self harm injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as injury due to self harm</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident)</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>15</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to rape or sexual assault</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as related to a rape or sexual assault</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident)</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>16</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS callouts to Youth violence (victims U25)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of instances of an ambulance dispatched to an incident denoted as an assault injury where the age of the patient is aged 25 or under</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>LAS Data Extracted from SafeStats filtered by incident type, categorised by LAS caller and paramedic derived information. Incident ID’s de-duplicated to count incidents as opposed to number of ambulances (of which there may be multiple dispatched to a single incident).</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>17</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Violence with Injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded crimes denoted as 'violence with injury'</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Violence without Injury</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of MPS recorded crimes denoted as 'violence without injury'</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold"  }} colspan="7">Families</th>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Repeat child protection cases: % of children who became subject of a child protection plan for a second or subsequent time</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage of all new child protection cases during the year where it is the child's second or subsequent child protection plan that year</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2018</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using fingertips. Data stems from DfE data on children in need and child protection statistics. For more information on this indicator, see: Fingertips | Department of Health and Social Care</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Children in care</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Rate (per 10,000 children under 18) of children looked after at 31st march, including adoption and care leavers</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using Fingertips, a service collating public health data provided by Public Health England. Data stems from DfE. For more information on this indicator, see: Fingertips | Department of Health and Social Care </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>21</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Domestic Abuse Offences</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}></td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>22</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Domestic Abuse (Violence with Injury)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}></td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>20/21-25/26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MPS data has been extracted from the MPS Monthly Crime Dashboard. Data contained in the APT pre-dates implementation of CONNECT crime recording system. For methodological notes on this data, please see: MPS Monthly Crime Dashboard Data - London Datastore.</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>23</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Household is Deprived in Three dimensions</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>ONS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of households deprived in 3 of the 4 following characteristics: education, employment, health or housing</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2021 (Census)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data stems from household deprivation variable captured during the 2021 Census. For further information on the definition of this indicator, see: Household deprivation variable: Census 2021 - Office for National Statistics</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Household is Deprived in Four Dimensions</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>ONS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of households deprived in all 4 of the following characteristics: education, employment, health or housing</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2021 (Census)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data stems from household deprivation variable captured during the 2021 Census. For further information on the definition of this indicator, see: Household deprivation variable: Census 2021 - Office for National Statistics</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>IDACI (Income Deprivation Affecting Children Index)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MHCLG</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Proportion of children aged 0-15 living in income deprived families.</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using Fingertips, a service collating public health data provided by Public Health England. For more information on this indicator, see: Local health, public health data for small geographic areas | Fingertips | Department of Health and Social Care </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold"  }} colspan="7">Education</th>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>26</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>School readiness: percentage of children achieving a good level of development at the end of Reception</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage of early years foundation stage (EYFS) profile children defined as having reached a good level of development.</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>21/22-22/23</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using fingertips. Data stems from DfE Early Years Foundation Stage Profile Data. For more information on this indicator, see: Fingertips | Department of Health and Social Care</td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>27</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Persistent absentees - Secondary school</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage of secondary school enrolments classed as persistent absentees (defined as missing 10% or more of possible sessions)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-21/22</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using fingertips. Data stems from DfE data on pupils attendance and absence. For more information on this indicator, see: Fingertips | Department of Health and Social Care</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>28</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Suspensions</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of suspensions across state funded primary, secondary and special schools</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-23/24</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from DfE at school level during the school census. For further information on this indicator, see: Suspensions and permanent exclusions in England, Autumn term 2023/24 - Explore education statistics - GOV.UK </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>29</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Exclusions</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of permanent exclusions across state funded primary, secondary and special schools</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from DfE at school level during the school census. For further information on this indicator, see: Suspensions and permanent exclusions in England, Autumn term 2023/24 - Explore education statistics - GOV.UK</td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>30</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>School pupils with social, emotional and mental health needs: % of school pupils with social, emotional and mental health needs</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage of Special Educational Needs (SEN) children identified as having social, emotional and mental health as their primary type of need</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>18/19-22/23</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using fingertips. Data stems from DfE data on Special Educational Needs. For more information on this indicator, see: Fingertips | Department of Health and Social Care </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold"  }} colspan="7">Communities and Place</th>
                            </tr>

                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>31</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Agree local area is place where people from different backgrounds get on well</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who agree local area is a place where people from different backgrounds get along well</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>32</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Agree that the MPS is an organisation they can trust</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who agree that the MPS is an Organisation They Can Trust</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>33</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Agree the police treat everyone fairly, regardless of who they are</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who agree the Metropolitan Police Service treat everyone fairly regardless of who they are</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>34</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Feel that gangs are a problem in the local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who feel that Gangs are a Problem in the Local Area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>35</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Feel that gun crime is a problem in the local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who feel that Gun Crime is a Problem in the Local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>36</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Feel that knife crime is a problem in the local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who feel that knife crime is a problem in the local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>37</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Feel the police do a good job in the local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>MOPAC PAS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Percentage who feel the Metropolitan Police Service are doing a good job their local area</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>0.5</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted from MOPAC’s public attitude survey, a survey of 19,200 London residents per year capturing a wide range of perception data. For more information, see: MOPAC Surveys - London Datastore </td>
                            </tr>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                                <th style={{ padding: "10px", borderBottom: "1px solid #ddd", fontWeight: "bold"  }} colspan="7">CYP-Opportunities</th>
                            </tr>
                            <tr style={{ backgroundColor: "#f9f9f9" }}>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>38</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>16- to 17-year-olds not in education, employment or training (NEET) or whose activity is not known</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>DfE</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Proportion of 16 to 17 year olds not in education, employment or training (NEET) or whose activity is unknown</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>19/20-24/25</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data extracted using Fingertips, a service collating public health data provided by Public Health England. Data stems from DfE. For more information on this indicator, see: Fingertips | Department of Health and Social Care </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>39</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Economically active Unemployed Status</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>ONS</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Number of people aged 16 or over who, between 15/03/21 and 21/03/21, were unemployed but looking for work and could start within two weeks, or unemployed but waiting to start a job that they had been offered and accepted.</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>2021 (Census)</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>1</td>
                                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>Data stems from economic activity variable captured during the 2021 Census. For further information on the definition of this indicator, see: Economic activity status variable: Census 2021 - Office for National Statistics.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}      
