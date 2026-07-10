const { useEffect, useState } = React;

export default function DataWatcher({ id }) {
    const [wardData, setWardData] = useState(null);

    useEffect(() => {
        // Matches the R message name now
        Shiny.addCustomMessageHandler("wardDataChange", (data) => {
            setWardData(data);
            console.log("Ward Data Changed:");
            // Updated to match the actual data structure
            console.table({
                ward: data.ward,
                theme: data.theme,
                value: data.value  // Changed from values to value to match R output
            });
        });

        // Cleanup handler when component unmounts
        return () => {
            Shiny.removeCustomMessageHandler("wardDataChange");
        };
    }, []);

    useEffect(() => {
        if (wardData) {
            console.log("Full ward data:", wardData);
        }
    }, [wardData]);

    return null;
}