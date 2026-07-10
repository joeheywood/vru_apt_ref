// todo: graphic and div for later.
r2d3.onRender(function (data, div, width, height) {
  // Clear any existing content
  div.selectAll("*").remove();

  let colourPaletter = "#EE266D";
  let margin = { top: 15, right: 50, bottom: 50, left: 80 };
  let xAxisTicks = 4;
  let xAxisLable = "Something";

  // Adjusted width and height for margins
  const adjWidth = width - margin.left - margin.right;
  const adjHeight = height - margin.top - margin.bottom;

  // Define scales
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)]) // Set domain to max of data.value
    .range([0, adjWidth]);

  const y = d3
    .scaleBand()
    .domain(data.map((d) => d.id)) // Set domain based on data.id
    .rangeRound([0, adjHeight])
    .paddingInner(0.5);

  // Clear existing content
  div.selectAll("*").remove();

  // Create SVG and append group for margins
  let svg = div
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Append X Axis to SVG
  svg
    .append("g")
    .attr("transform", `translate(0,${adjHeight})`)
    .call(d3.axisBottom(x).ticks(xAxisTicks));

  // Append Y Axis to SVG
  svg
    .append("g")
    .call(d3.axisLeft(y))
    .attr("class", "y-axis")
    .selectAll(".tick text") // Select all text elements for ticks in the y-axis
    .call(wrap, margin.left - 20); // Use 'margin.left - 20' as the width, adjust 20 as needed;;

  // Append bars for each data element
  svg
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", (d) => y(d.id))
    .attr("width", (d) => x(d.value))
    .attr("height", y.bandwidth())
    .attr("fill", colourPaletter);
  // End of the function.
});

// function to wrap text for the labels.

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
