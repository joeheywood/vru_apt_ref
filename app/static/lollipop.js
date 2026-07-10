// app/static/lollipop.js
r2d3.onRender(function (data, div, width, height) {
  // Configuration and setup
  let colourPaletter = "#EE266D";
  let margin = { top: 15, right: 50, bottom: 50, left: 90 };
  let xAxisTicks = 4;

  const adjWidth = width - margin.left - margin.right;
  const adjHeight = height - margin.top - margin.bottom;

  // Determine scale domain dynamically based on data
  const minValue = d3.min(data, (d) => d.value);
  const maxValue = d3.max(data, (d) => d.value);

  const x = d3
    .scaleLinear()
    .domain([minValue < 0 ? minValue : 0, maxValue])
    .range([0, adjWidth]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.id))
    .rangeRound([0, adjHeight])
    .padding(0.4);

  // Clear existing content
  div.selectAll("*").remove();

  // Initialize SVG container
  let svg = div
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // X Axis
  // Append the X-axis once
  const xAxisGroup = svg
    .append("g")
    .attr("transform", `translate(0,${adjHeight})`)
    .call(d3.axisBottom(x).ticks(xAxisTicks));

  // Style the axis line and tick lines for crisp edges
  xAxisGroup
    .selectAll("path, .tick line")
    .style("stroke", "#d9d9d9")
    .style("shape-rendering", "crispEdges");

  // Style the text separately
  xAxisGroup
    .selectAll("text")
    .style("fill", "#707071")
    .style("font-size", "14px");

  // Zero Line (if there are negative values)
  if (minValue < 0) {
    svg
      .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y1", 0)
      .attr("y2", adjHeight)
      .attr("stroke", "#000")
      .attr("stroke-width", 2);
  }

  // Y Axis dynamic placement
  const yAxisFunction = minValue < 0 ? d3.axisRight(y) : d3.axisLeft(y);
  const yAxisXOffset = minValue < 0 ? adjWidth : 0;

  const yAxisGroup = svg
    .append("g")
    .attr("transform", `translate(${yAxisXOffset},0)`)
    .call(yAxisFunction);

  // Remove the main line of the Y-axis but keep the ticks
  yAxisGroup
    .select(".domain")
    .remove(); // This selects the main line and removes it

  // Style the tick lines if needed
  // If you want to style or remove them, you can do it like this:
  yAxisGroup
    .selectAll(".tick line")
    .style("stroke", "#d9d9d9"); // Example to style, or use .remove() to remove

  // Style the text
  yAxisGroup
    .selectAll(".tick text")
    .style("fill", "#707071") // Sets the color of the text
    .style("font-size", "12px")
    .call(wrap, margin.left); // Sets the font size of the text
  
  // Y Axis
  // svg
  //   .append("g")
  //   .attr("transform", `translate(${yAxisXOffset},0)`)
  //   .call(yAxisFunction)
  //   .attr("class", "y-axis")
  //   .selectAll(".tick text")
  //   .style("text-anchor", "end")
  //   .attr("dx", "-0.5em") // Moves text to the left; adjust value as needed
  //   .attr("dy", "0.35em") // Adjusts vertical alignment of text; modify as needed
  //   .call(wrap, margin.left - 10); // Adjust text wrapping as needed

  // Lines for lollipops
  svg
    .selectAll(".line")
    .data(data)
    .join("line")
    .attr("class", "line")
    .attr("x1", x(0))
    .attr("x2", (d) => x(d.value))
    .attr("y1", (d) => y(d.id) + y.bandwidth() / 2)
    .attr("y2", (d) => y(d.id) + y.bandwidth() / 2)
    .attr("stroke", colourPaletter)
    .attr("stroke-width", "3")
    .transition()
    .duration(750)
    .attr("x2", (d) => x(d.value));

  // Circles for lollipops
  svg
    .selectAll(".circle")
    .data(data)
    .join("circle")
    .attr("class", "circle")
    .attr("cx", (d) => x(d.value))
    .attr("cy", (d) => y(d.id) + y.bandwidth() / 2)
    .attr("r", 0)
    .attr("fill", colourPaletter)
    .transition()
    .duration(750)
    .attr("r", 7);

  // Text labels for lollipops
  svg
    .selectAll(".label")
    .data(data)
    .join("text")
    .attr("class", "label")
    .attr("x", (d) => x(d.value) + 10)
    .attr("y", (d) => y(d.id) + y.bandwidth() / 2)
    .attr("dy", "0.35em")
    .text((d) => d.value)
    .style("font-size", "12px")
    .style("fill", colourPaletter)
    .style("font-weight", "bold");
});

// Text wrapping function
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}
