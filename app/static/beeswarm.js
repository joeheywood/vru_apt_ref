// beeswarm.js

r2d3.onRender(function (data, svg, width, height) {
  // Retrieve the namespace passed from Shiny
  var ns = r2d3.options.namespace;

  // Set up dimensions and margins
  let margin = { top: 10, right: 40, bottom: 40, left: 100 }; // Adjust left margin for labels
  let actualWidth = width - margin.left - margin.right;
  let actualHeight = height - margin.top - margin.bottom;

  // Clear existing graphics
  svg.selectAll("*").remove();

  // Adjust the SVG container size
  svg.attr("width", width).attr("height", height);

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
  const xAxisGroup = g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${actualHeight})`)
    .call(d3.axisBottom(x).ticks(5));
  
  xAxisGroup
    .selectAll("path, .tick line")
    .style("stroke", "#d9d9d9")
    .style("shape-rendering", "crispEdges");
  
  xAxisGroup
    .selectAll("text")
    .style("fill", "#707071")
    .style("font-size", "14px");

  // Initialize the circle elements
  let circles = g
    .selectAll(".circle")
    .data(data)
    .join("circle")
    .attr("class", "circle")
    .attr("r", 5)
    .attr("fill", "#C51B8A")
    .attr("fill-opacity", 0.5)
    .attr("stroke", "#EE266D") // Add stroke to original circles if desired
    .attr("stroke-width", 1.5) // Control the thickness of the circle border
    .attr("stroke-opacity", 0.9); 

  // Simulation
  let simulation = d3
    .forceSimulation(data)
    .force("x", d3.forceX((d) => x(d.value)).strength(0.5))
    .force("y", d3.forceY(actualHeight / 2).strength(0.1))
    .force("collide", d3.forceCollide(6)) // collision strength
    .on("tick", ticked);

  // Mouseover and mouseout for visual feedback
  circles
    .on("mouseover", function (event, d) {
      d3.select(this)
        .transition()
        .duration(150)
        .attr("r", 10) // Increase the radius
        .attr("fill-opacity", 0.8); // Increase opacity or change color
      
      valueText.text("The ward " + d.id + " has a value of " + d.value);

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
    // Set the input value with the namespaced ID
    Shiny.setInputValue(ns + "clicked_circle", d.id, { priority: "event" });

    // Optionally, provide additional visual feedback for the clicked circle
    d3.select(this)
      .attr("stroke", "black")
      .attr("stroke-width", 2);
  });

  function ticked() {
    circles.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  }

  // Show the value of the each on on of the wards.
  let valueText = svg.append("text")
    .attr("class", "circle value")
    .attr("y", 0)
    .attr("x", 50)
    .attr("dy", "1em")
    .attr("fill", "#707071")
    .attr("text-anchor", "start")
    .style("font-size", "14px");

  // Stop simulation after 2-3 seconds
  setTimeout(() => simulation.stop(), 2000);
});

// Function to wrap text for the labels (if needed)
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      x = text.attr("x");
    (y = text.attr("y") != undefined ? text.attr("y") : 0),
      (dy = text.attr("dy") != undefined ? parseFloat(text.attr("dy")) : 0),
      (tspan = text
        .text(null)
        .append("tspan")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", dy + "em"));
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
