// SimpleBeeswarm.jsx 
const { useEffect, useRef, useState } = React;
import * as d3 from 'd3';

export default function SimpleBeeswarm({ 
  id = "simplebeeswarm",
  data = [], 
  width = 800, 
  height = 400,
  marginTop = 20,
  marginRight = 40,
  marginBottom = 40,
  marginLeft = 100
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    ward: null,
    value: null 
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Calculate dimensions
    const actualWidth = width - marginLeft - marginRight;
    const actualHeight = height - marginTop - marginBottom;

    // Create main group
    const g = svg.append("g")
      .attr("transform", `translate(${marginLeft},${marginTop})`);

    // X scale
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.value))
      .range([0, actualWidth]);

    // X axis
    const xAxisGroup = g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", `translate(0,${actualHeight})`)
      .call(d3.axisBottom(x).ticks(5));

    // Style the axis
    xAxisGroup.selectAll("path, .tick line")
      .style("stroke", "#d9d9d9")
      .style("shape-rendering", "crispEdges");

    xAxisGroup.selectAll("text")
      .style("fill", "#707071")
      .style("font-size", "14px");

    // Add circles
    const circles = g.selectAll(".circle")
      .data(data)
      .join("circle")
      .attr("class", "circle")
      .attr("r", 5)
      .attr("fill", "#C51B8A")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#EE266D")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.9)
      .attr("cx", d => x(d.value))
      .attr("cy", actualHeight / 2);

    // Force simulation
    const simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(d => x(d.value)).strength(0.5))
      .force("y", d3.forceY(actualHeight / 2).strength(0.1))
      .force("collide", d3.forceCollide(6))
      .on("tick", () => {
        circles
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

    // Hover text at top
    const valueText = svg.append("text")
      .attr("class", "value-text")
      .attr("y", marginTop / 2)
      .attr("x", marginLeft)
      .attr("fill", "#707071")
      .attr("text-anchor", "start")
      .style("font-size", "14px");

    // Mouse interactions
    circles
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 10)
          .attr("fill-opacity", 0.8);
        
        // Get mouse position relative to the container
        const containerRect = containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;
        
        setTooltip({
          visible: true,
          x: mouseX,
          y: mouseY,
          ward: d.id,
          value: d.value
        });
        
        valueText.text(`The ward ${d.id} has a value of ${d.value}`);
      })
      .on("mousemove", function(event) {
        // Update tooltip position as mouse moves
        const containerRect = containerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;
        
        setTooltip(prev => ({
          ...prev,
          x: mouseX,
          y: mouseY
        }));
      })
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 5)
          .attr("fill-opacity", 0.5);
        
        setTooltip({
          visible: false,
          x: 0,
          y: 0,
          ward: null,
          value: null
        });
        
        valueText.text("");
      })
      .on("click", function(event, d) {
        // Visual feedback
        d3.select(this)
          .attr("stroke", "black")
          .attr("stroke-width", 2);
        
        // Shiny interaction
        if (window.Shiny) {
          const ns = window.Shiny.ns || ((id) => id);
          window.Shiny.setInputValue(ns(id) + "-clicked_circle", d.id, { priority: "event" });
        }
      });

    // Stop simulation after 2 seconds
    setTimeout(() => simulation.stop(), 2000);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, width, height, marginTop, marginRight, marginBottom, marginLeft, id]);

  return (
    <div id={id} className="beeswarm-container" ref={containerRef}>
      <svg ref={svgRef}></svg>
      
      {tooltip.visible && (
        <div
          className="beeswarm-tooltip"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 40}px`,
          }}
        >
          <strong>{tooltip.ward}</strong>
          <br />
          Value: {tooltip.value}
        </div>
      )}
    </div>
  );
}