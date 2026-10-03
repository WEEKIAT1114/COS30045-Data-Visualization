/* Exercise 6.3: scatterplot of star rating and annual energy use. */

function drawScatterplot(data) {
  const container = d3.select("#scatterplot").html("");
  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${chart.width} ${chart.height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "scatter-title scatter-description");

  svg.append("title")
    .attr("id", "scatter-title")
    .text("Television energy consumption by star rating");

  svg.append("desc")
    .attr("id", "scatter-description")
    .text("Each point is a television. Its horizontal position shows star rating, its vertical position shows annual energy consumption, and its colour shows screen technology.");

  innerChartS = svg
    .append("g")
    .attr("transform", `translate(${chart.margin.left},${chart.margin.top})`);

  scatterX
    .domain([0, d3.max(data, (d) => d.star)])
    .nice()
    .range([0, chart.innerWidth]);

  scatterY
    .domain([0, d3.max(data, (d) => d.energyConsumption)])
    .nice()
    .range([chart.innerHeight, 0]);

  innerChartS.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(scatterY).ticks(7).tickSize(-chart.innerWidth).tickFormat(""));

  innerChartS.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${chart.innerHeight})`)
    .call(d3.axisBottom(scatterX).ticks(8));

  innerChartS.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(scatterY).ticks(7).tickFormat(d3.format(",")));

  innerChartS.append("text")
    .attr("class", "axis-label")
    .attr("x", chart.innerWidth / 2)
    .attr("y", chart.innerHeight + 56)
    .attr("text-anchor", "middle")
    .text("Star rating");

  innerChartS.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -chart.innerHeight / 2)
    .attr("y", -62)
    .attr("text-anchor", "middle")
    .text("Labelled energy consumption (kWh/year)");

  innerChartS.selectAll("circle.data-point")
    .data(data)
    .join("circle")
    .attr("class", "data-point")
    .attr("cx", (d) => scatterX(d.star))
    .attr("cy", (d) => scatterY(d.energyConsumption))
    .attr("r", 3.2)
    .attr("fill", (d) => technologyColours(d.screenTech))
    .attr("opacity", 0.48)
    .attr("aria-hidden", "true");

  const legend = innerChartS
    .append("g")
    .attr("class", "legend")
    .attr("transform", `translate(${chart.innerWidth - 104},12)`);

  const legendRows = legend.selectAll("g")
    .data(technologyColours.domain())
    .join("g")
    .attr("transform", (_, index) => `translate(0,${index * 24})`);

  legendRows.append("rect")
    .attr("width", 12)
    .attr("height", 12)
    .attr("rx", 2)
    .attr("fill", (d) => technologyColours(d));

  legendRows.append("text")
    .attr("class", "legend-label")
    .attr("x", 20)
    .attr("y", 11)
    .text((d) => d);
}

function updateScatterplot(filterId) {
  scatterplotState.screenTech = filterId;
  const visible = (d) => filterId === "all" || d.screenTech === filterId;
  const filteredCount = televisionData.filter(visible).length;

  innerChartS.selectAll("circle.data-point")
    .style("pointer-events", (d) => visible(d) ? "auto" : "none")
    .transition()
    .duration(400)
    .attr("opacity", (d) => visible(d) ? 0.48 : 0)
    .attr("r", (d) => visible(d) ? 3.2 : 0);

  if (scatterplotTooltip) scatterplotTooltip.style("opacity", 0);
  updateScatterplotStatus(filteredCount);
}
