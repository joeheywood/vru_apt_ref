// beeswarm_id.js script

r2d3.onRender(function (data, svg, width, height, options) {
  // Set up dimensions and margins
  let margin = { top: 10, right: 50, bottom: 40, left: 100 };
  let actualWidth = width - margin.left - margin.right;
  let actualHeight = height - margin.top - margin.bottom;

  // Clear existing graphics
  svg.selectAll("*").remove();

  // Adjust the SVG container size
  svg.attr("width", width).attr("height", height);

  console.table(data);

  // Create the main group element
  let g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X scale
  let x = d3
    .scaleLinear()
    .rangeRound([0, actualWidth])
    .domain(d3.extent(data, (d) => d.value));

  // Append the x-axis
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${actualHeight})`)
    .call(d3.axisBottom(x).ticks());

    xAxisGroup
      .selectAll("path, .tick line")
      .style("stroke", "#d9d9d9")
      .style("shape-rendering", "crispEdges");

    xAxisGroup
      .selectAll("text")
      .style("fill", "#707071")
      .style("font-size", "14px");
  
  // Y label (unique_id)
  svg
    .append("text")
    .attr("class", "custom-label")
    .attr("y", actualHeight - 150)
    .attr("x", 0)
    .attr("dy", "1em")
    .attr("fill", "#707071")
    .attr("text-anchor", "start")
    .text(data[0].unique_id);

  // Initialize the circle elements without highlight
  let circles = g
    .selectAll(".circle")
    .data(data)
    .join("circle")
    .attr("class", "circle")
    .attr("r", 5)
    .attr("fill", "#EE266D") // Set all circles to non-highlighted color by default
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#EE266D")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.9);

  // Simulation
  let simulation = d3
    .forceSimulation(data)
    .force("x", d3.forceX((d) => x(d.value)).strength(0.5))
    .force("y", d3.forceY(actualHeight / 2).strength(0.1))
    .force("collide", d3.forceCollide(4))
    .on("tick", ticked);

  function ticked() {
    circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  // Add a text element to the SVG
  let valueText = svg
    .append("text")
    .attr("class", "circle value")
    .attr("y", actualHeight - 150)
    .attr("x", actualWidth - 10)
    .attr("dy", "1em")
    .attr("fill", "#707071")
    .attr("text-anchor", "start") // align the text to the right
    .style("font-size", "14px");

  // Mouseover and mouseout for visual feedback
  circles
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("r", 7) // Increase the radius
        .attr("fill-opacity", 0.8); // Increase opacity or change color

      // pull up the information on the beeswarms
      valueText.text(d.value + " in " + d.unique);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("r", 5) // Return to original radius
        .attr("fill-opacity", 0.5); // Return to original opacity or color

      valueText.text("");
    });

  // Click event to interact with Shiny
  circles.on("click", function (event, d) {
    // Example: Send the clicked circle's ID to Shiny
    Shiny.setInputValue("clicked_circle", d.id);

    // Optionally, provide additional visual feedback for the clicked circle
    d3.select(this)
      .attr("stroke", "black") // Add a stroke to highlight the selected circle
      .attr("stroke-width", 2);
  });
});
