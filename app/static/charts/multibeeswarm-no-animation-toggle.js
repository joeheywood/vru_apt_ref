r2d3.onRender(function(data, svg, width, height, options) {
  // Get the selected ward and highlight mode
  const selectedWard = options.selected_ward;
  const highlightMode = options.highlightMode;
  
  // Find the lad22cd for the selected ward
  const selectedWardData = data.find(d => d.id === selectedWard);
  const selectedLad = selectedWardData ? selectedWardData.lad22cd : null;
  
  // Group data by unique_id
  const groupedData = d3.group(data, (d) => d.unique_id);

  // Set fixed height per group chart
  const groupHeight = 400;
  let yOffset = 0;

  // Clear existing content
  svg.selectAll("*").remove();

  // Adjust the overall SVG height
  svg.attr("height", groupHeight * groupedData.size);

  // Add hover text container at the top level
  const hoverText = svg.append("text")
    .attr("class", "hover-value")
    .attr("x", 200)
    .attr("y", 20)
    .attr("fill", "#707071")
    .style("font-size", "14px");

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
      .attr("y", 10)
      .attr("text-anchor", "start")
      .style("font-size", "12px")
      .style("font-weight", "bold")
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
        if (!highlightMode) return 1;
        if (d.id === selectedWard) return 1;
        if (d.lad22cd === selectedLad) return 1;
        return 0.2;
      })
      .style("cursor", "pointer");

    // Interactive text hover
    circles
      .on("mouseover", function(event, d) {
        // Highlight the circle
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", d.id === selectedWard ? 10 : 8)
          .style("opacity", 1);

        // Update hover text
        hoverText.text(`The ward ${d.ward_name} has a value of ${d.value}`);
      })
      .on("mouseout", function(event, d) {
        // Reset circle
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", d.id === selectedWard ? 8 : 5)
          .style("opacity", d => {
            if (!highlightMode) return 1;
            if (d.id === selectedWard) return 1;
            if (d.lad22cd === selectedLad) return 1;
            return 0.2;
          });

        // Clear hover text
        hoverText.text("");
      });

    // Bring selected ward circle to front
    if (selectedWard) {
      circleGroup
        .selectAll(`.ward-${selectedWard}`)
        .each(function() {
          this.parentNode.appendChild(this);
        });
    }

    // Force Simulation
    let simulation = d3
      .forceSimulation(values)
      .alphaDecay(0.1) // Fast decay
      .velocityDecay(0.3) // Less movement
      .force("x", d3.forceX((d) => x(d.value)).strength(0.2))
      .force("y", d3.forceY(actualHeight / 2).strength(0.1))
      .force("collide", d3.forceCollide(d => d.id === selectedWard ? 9 : 6).strength(0.8)) //Stronger collision
      .stop() //Start Paused
      .tick(50); //Run 50 ticks immediately

    // Only update positions every few frames
    let tickCounter = 0;
    simulation.on("tick", () => {
      tickCounter++;
      if (tickCounter % 3 === 0) {  // Update every 3rd tick
        circleGroup
          .selectAll("circle")
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      }
    });

    // Start the simulation
    simulation.restart();

    yOffset += groupHeight;
  });
});