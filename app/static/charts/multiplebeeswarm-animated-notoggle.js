
r2d3.onRender(function(data, svg, width, height, options) {
  // Get the selected ward
  const selectedWard = options.selected_ward;
  
  // Find the lad22cd for the selected ward
  const selectedWardData = data.find(d => d.id === selectedWard);
  const selectedLad = selectedWardData ? selectedWardData.lad22cd : null;
  
  // Group data by unique_id
  const groupedData = d3.group(data, (d) => d.unique_id);

  // Set fixed height per group chart
  const groupHeight = 300;
  let yOffset = 0;

  // Clear existing content
  svg.selectAll("*").remove();

  // Adjust the overall SVG height
  svg.attr("height", groupHeight * groupedData.size);

  // Iterate through each group
  groupedData.forEach((values, uniqueId) => {
    // Set up dimensions and margins
    let margin = { top: 10, right: 50, bottom: 40, left: 100 },
      actualWidth = width - margin.left - margin.right,
      actualHeight = groupHeight - margin.top - margin.bottom;

    // Create group container
    let g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top + yOffset})`);

    // Add group label
    g.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .attr("fill", "#707071")
      .text(uniqueId);

    // Set up x scale
    let x = d3
      .scaleLinear()
      .domain(d3.extent(values, (d) => d.value))
      .range([0, actualWidth]);

    // Add and style x-axis
    const xAxisGroup = g
      .append("g")
      .attr("transform", `translate(0, ${actualHeight})`)
      .call(d3.axisBottom(x).ticks(5));

    xAxisGroup
      .selectAll("path, .tick line")
      .style("stroke", "#d9d9d9")
      .style("shape-rendering", "crispEdges");
    
    xAxisGroup
      .selectAll("text")
      .style("fill", "#707071")
      .style("font-size", "14px");

    // Create circle group to maintain proper z-index
    const circleGroup = g.append("g").attr("class", "circles");

    // Initialize circles with proper styling
    let circles = circleGroup
      .selectAll("circle")
      .data(values)
      .enter()
      .append("circle")
      .attr("class", d => `ward-${d.id}`)
      .attr("r", d => d.id === selectedWard ? 8 : 5)
      .attr("fill", d => d.id === selectedWard ? "#FF0000" : "#EE266D")
      .style("stroke", d => d.id === selectedWard ? "#000000" : "none")
      .style("stroke-width", d => d.id === selectedWard ? 2 : 0)
      .style("opacity", d => {
        if (d.id === selectedWard) return 1;  // Selected ward is full opacity
        if (d.lad22cd === selectedLad) return 1;  // Same borough wards are full opacity
        return 0.2;  // Other wards are faded
      })
      .style("cursor", "pointer");

    // Add tooltips with more information
    circles
      .append("title")
      .text(d => `${d.borough} - Value: ${d.value}`);

    // Bring selected ward circle to front
    if (selectedWard) {
      circleGroup
        .selectAll(`.ward-${selectedWard}`)
        .each(function() {
          this.parentNode.appendChild(this);
        });
    }

    // Setup force simulation
    let simulation = d3
      .forceSimulation(values)
      .force("x", d3.forceX((d) => x(d.value)).strength(0.1))
      .force("y", d3.forceY(actualHeight / 2))
      .force("collide", d3.forceCollide(d => d.id === selectedWard ? 9 : 6))
      .on("tick", ticked);

    function ticked() {
      circleGroup
        .selectAll("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

    yOffset += groupHeight;
  });
});