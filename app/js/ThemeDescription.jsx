const { useState, useEffect } = React;


export default function ThemeDescription({ id }) {
    const [descriptionText, setDescriptionText] = useState(`Select a ward and theme to view description ${id}`);
    const [isTop15Percent, setIsTop15Percent] = useState(false);
    const [isOutsideTop15, setIsOutsideTop15] = useState(false);

    // Shiny handler for development
    useEffect(() => {
        if (window.Shiny) {
            window.Shiny.addCustomMessageHandler("themeDescriptionChange", (data) => {
                console.log("Received theme description update:", data);

                if (data && data.theme_description) {
                    setDescriptionText(data.theme_description);
                    setIsTop15Percent(data.point >= 0.5);
                    setIsOutsideTop15(data.point === 0);
                } else {
                    setDescriptionText("Select a ward and theme to view description");
                    setIsTop15Percent(false);
                    setIsOutsideTop15(false);
                }
            });
        }
        return () => {
            console.log("ThemeDescription component cleanup");
            if (window.Shiny) {
                window.Shiny.removeCustomMessageHandler("themeDescriptionChange");
            }
        };
    }, []);

    // Helper function to format percentages in Community & Place theme
    const formatCommunityPercentages = (text) => {
        // Only format if it's a Community & Place theme
        if (!descriptionText.includes('Community') && !descriptionText.includes('Place Overview')) {
            return text;
        }

        // Replace decimal numbers that appear before % with formatted percentages
        return text.replace(/(\d*\.?\d+)(%)/g, (match, number, percent) => {
            const num = parseFloat(number);
            if (num < 1) {
                // Convert decimal to percentage
                return `${(num * 100).toFixed(1)}${percent}`;
            }
            return match;
        });
    };

    // Highlighting functions
    const highlightNumericValues = (text) => {
        // First apply percentage formatting if it's Community & Place
        const formattedText = formatCommunityPercentages(text);

        // Handle NA values and numbers
        return formattedText.split(/(\bNA\b|\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\d+(?:\.\d+)?%?)/).map((part, i) => {
            if (/^\d{1,3}(?:,\d{3})*(?:\.\d+)?%?$|^\d+(?:\.\d+)?%?$/.test(part)) {
                return (
                    <span key={i} style={{ fontWeight: 'bold', color: '#1976D2' }}>
                        {part}
                    </span>
                );
            }
            if (part === 'NA') {
                return (
                    <span key={i} style={{ fontWeight: 'bold', color: '#666' }}>
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <div className="theme-description">
            {/* Header */}
            <div className="theme-header">
                {/* <h3>Theme Description</h3> */}
                {isTop15Percent && (
                    <div className="indicator indicator-warning">
                        <span className="indicator-icon">⚠</span>
                        Top 15%
                    </div>
                )}
                {isOutsideTop15 && (
                    <div className="indicator indicator-success">
                        <span className="indicator-icon">✓</span>
                        Outside Top 15%
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="theme-content">
                {descriptionText.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (!trimmedLine) return null;

                    // Handle the title line
                    if (index === 0 && trimmedLine.includes('Overview')) {
                        return (
                            <div key={index} className="description-title">
                                {trimmedLine}
                            </div>
                        );
                    }

                    // Handle bullet points
                    if (line.startsWith('-')) {
                        const parts = trimmedLine.replace(/^-\s*/, '').split(':');
                        const formattedContent = highlightNumericValues(parts.slice(1).join(':'));

                        return (
                            <div key={index} className="bullet-point">
                                <span className="bullet">•</span>
                                <span>
                                    <strong>{parts[0]}:</strong>
                                    {formattedContent}
                                </span>
                            </div>
                        );
                    }

                    return (
                        <div key={index} className="description-line">
                            {highlightNumericValues(trimmedLine)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

