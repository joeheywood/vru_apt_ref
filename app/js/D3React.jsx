const { useEffect } = React; // Global React access
import * as d3 from "d3"; // Explicit D3 import

export default function D3React({ id = "d3react" }) {
    useEffect(() => {
        const width = 500;
        const height = 300;

        // Clear previous content
        d3.select("#d3-animation").selectAll("*").remove();

        // Create the SVG canvas
        const svg = d3
            .select("#d3-animation")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Circle data - positions and radii
        const circleData = [
            { cx: 50, cy: 150, r: 10 },
            { cx: 150, cy: 150, r: 15 },
            { cx: 250, cy: 150, r: 20 },
            { cx: 350, cy: 150, r: 25 },
            { cx: 450, cy: 150, r: 30 },
        ];

        // Add and animate circles
        svg
            .selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle")
            .attr("cx", 0) // Start all circles from the left
            .attr("cy", (d) => d.cy)
            .attr("r", (d) => d.r)
            .attr("fill", "steelblue")
            .transition() // Animate the circle's movement
            .duration(1000)
            .delay((d, i) => i * 500) // Delay each circle animation
            .attr("cx", (d) => d.cx) // Move to final x position
            .ease(d3.easeBounceOut); // Smooth bouncing effect
    }, []);

    return (
        <div id={id}>
            <h1 style={{ textAlign: "center", color: "#333" }}>
                React and D3: Animated Circle Series
            </h1>
            <div
                id="d3-animation"
                style={{
                    margin: "20px auto",
                    textAlign: "center",
                    width: "500px",
                    height: "300px",
                    border: "1px solid #ddd",
                }}
            ></div>
        </div>
    );
}

