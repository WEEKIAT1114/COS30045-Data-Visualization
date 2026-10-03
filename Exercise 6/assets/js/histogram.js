/* Exercise 6.1: histogram of annual television energy consumption. */

function drawHistogram(data) {
  const container = d3.select("#histogram").html("");
  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${chart.width} ${chart.height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "histogram-title histogram-description");

  svg.append("title")
    .attr("id", "histogram-title")
    .text("Distribution of television energy consumption");

  svg.append("desc")
    .attr("id", "histogram-description")
    .text("A histogram showing the number of televisions in 200 kilowatt-hour annual energy-consumption intervals.");

  innerChartH = svg
    .append("g")
    .attr("transform", `translate(${chart.margin.left},${chart.margin.top})`);

  innerChartH.append("g")
    .attr("class", "grid histogram-grid");

  innerChartH.append("g")
    .attr("class", "axis histogram-x-axis")
    .attr("transform", `translate(0,${chart.innerHeight})`)
    .call(d3.axisBottom(histogramX).ticks(7).tickFormat(d3.format(",")));

  innerChartH.append("g")
    .attr("class", "axis histogram-y-axis");

  innerChartH.append("text")
    .attr("class", "axis-label")
    .attr("x", chart.innerWidth / 2)
    .attr("y", chart.innerHeight + 56)
    .attr("text-anchor", "middle")
    .text("Labelled energy consumption (kWh/year)");

  innerChartH.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -chart.innerHeight / 2)
    .attr("y", -62)
    .attr("text-anchor", "middle")
    .text("Number of televisions");

  innerChartH.append("text")
    .attr("class", "empty-message")
    .attr("x", chart.innerWidth / 2)
    .attr("y", chart.innerHeight / 2)
    .attr("text-anchor", "middle")
    .attr("display", "none")
    .text("No televisions match these filters.");

  updateHistogram(data, false);
}

function getFilteredHistogramData(data) {
  return data.filter((tv) => {
    const matchesTechnology = histogramState.screenTech === "all" ||
      tv.screenTech === histogramState.screenTech;
    const matchesSize = histogramState.screenSize === null ||
      tv.screenSize === histogramState.screenSize;
    return matchesTechnology && matchesSize;
  });
}

function updateHistogram(data = televisionData, animate = true) {
  const filteredData = getFilteredHistogramData(data);
  const bins = binGenerator(filteredData);
  const maximumFrequency = Math.max(1, d3.max(bins, (d) => d.length) || 0);
  const transition = d3.transition().duration(animate ? 500 : 0).ease(d3.easeCubicInOut);

  histogramY.domain([0, maximumFrequency]).nice();

  innerChartH.select(".histogram-y-axis")
    .transition(transition)
    .call(d3.axisLeft(histogramY).ticks(6).tickFormat(d3.format(",d")));

  innerChartH.select(".histogram-grid")
    .transition(transition)
    .call(d3.axisLeft(histogramY).ticks(6).tickSize(-chart.innerWidth).tickFormat(""));

  innerChartH.selectAll("rect.histogram-bar")
    .data(bins, (d) => d.x0)
    .join((enter) => enter
      .append("rect")
      .attr("class", "histogram-bar")
      .attr("x", (d) => histogramX(d.x0) + 1)
      .attr("width", (d) => Math.max(0, histogramX(d.x1) - histogramX(d.x0) - 2))
      .attr("y", chart.innerHeight)
      .attr("height", 0)
      .attr("fill", colours.bar)
      .attr("tabindex", 0)
    )
    .attr("aria-label", (d) => `${d.x0} to ${d.x1} kilowatt-hours per year: ${d.length} ${d.length === 1 ? "television" : "televisions"}`)
    .transition(transition)
    .attr("y", (d) => histogramY(d.length))
    .attr("height", (d) => chart.innerHeight - histogramY(d.length));

  innerChartH.select(".empty-message")
    .attr("display", filteredData.length ? "none" : null);

  if (histogramTooltip) histogramTooltip.style("opacity", 0);
  handleHistogramMouseEvents();
  updateHistogramStatus(filteredData.length);
}
