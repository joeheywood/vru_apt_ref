r2d3.onRender(function(data, svg, width, height, options) {
  // Debug the initial data
  console.log("Full data received:", JSON.stringify(data, null, 2));
  console.log("Data type:", typeof data);
  console.log("Is Array?", Array.isArray(data));
  console.log("Length:", data.length);
  
  if (data.length > 0) {
    console.log("First item:", JSON.stringify(data[0], null, 2));
    console.log("First item keys:", Object.keys(data[0]));
  }

  // Clear existing content
  svg.selectAll("*").remove();

  // Debug grouped data
  const groupedData = d3.group(data, (d) => {
    console.log("Grouping item:", JSON.stringify(d, null, 2));
    return d.unique_id;
  });
  
  console.log("Grouped data size:", groupedData.size);
  console.log("Group keys:", Array.from(groupedData.keys()));

  const groupHeight = 400;

  // Iterate through groups
  let yOffset = 0;
  groupedData.forEach((values, uniqueId) => {
    console.log("Processing group:", uniqueId);
    console.log("Group values:", JSON.stringify(values, null, 2));

    // Basic margins
    const margin = { top: 10, right: 50, bottom: 40, left: 100 };
    const actualWidth = width - margin.left - margin.right;
    const actualHeight = groupHeight - margin.top - margin.bottom;

    // Create group
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top + yOffset})`);

    // Add label
    g.append("text")
      .attr("x", 0)
      .attr("y", 10)
      .text(uniqueId || "unnamed group");

    // Simple x scale
    const x = d3.scaleLinear()
      .domain(d3.extent(values, d => {
        console.log("Value for extent:", d.value);
        return d.value;
      }))
      .range([0, actualWidth]);

    // Add circles with enhanced debugging
    g.selectAll("circle")
      .data(values)
      .enter()
      .append("circle")
      .attr("cx", d => {
        console.log("Circle data:", JSON.stringify(d, null, 2));
        return x(d.value);
      })
      .attr("cy", actualHeight / 2)
      .attr("r", 5)
      .attr("fill", "#EE266D")
      .style("cursor", "pointer")
      .on("click", function(event, d) {
        console.log("Clicked circle data:", JSON.stringify(d, null, 2));
        
        // Debug all possible properties
        const allProps = Object.getOwnPropertyNames(d);
        console.log("All properties of clicked data:", allProps);
        
        allProps.forEach(prop => {
          console.log(`${prop}:`, d[prop]);
        });
      });

    yOffset += groupHeight;
  });

  // Debug the options
  console.log("Options received:", JSON.stringify(options, null, 2));
});