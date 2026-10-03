/* Exercises 6.2 and 6.4: filters, animated updates and tooltips. */

function makeFilterButtons(selector, items, activeId, onSelect) {
  const buttons = d3.select(selector)
    .selectAll("button.filter")
    .data(items)
    .join("button")
    .attr("type", "button")
    .attr("class", (d) => `filter${d.id === activeId ? " active" : ""}`)
    .attr("aria-pressed", (d) => String(d.id === activeId))
    .text((d) => d.label);

  buttons.on("click", (event, selected) => {
    if (event.currentTarget.getAttribute("aria-pressed") === "true") return;

    buttons
      .classed("active", (d) => d.id === selected.id)
      .attr("aria-pressed", (d) => String(d.id === selected.id));

    onSelect(selected);
  });
}

function populateFilters() {
  makeFilterButtons("#filters_screen", screenFilters, histogramState.screenTech, (selected) => {
    histogramState.screenTech = selected.id;
    updateHistogram();
  });

  const activeSize = sizeFilters.find((filter) => filter.value === histogramState.screenSize);
  makeFilterButtons("#filters_size", sizeFilters, activeSize.id, (selected) => {
    histogramState.screenSize = selected.value;
    updateHistogram();
  });
}

function updateHistogramStatus(count) {
  const technology = histogramState.screenTech === "all"
    ? "all screen technologies"
    : histogramState.screenTech;
  const size = histogramState.screenSize === null
    ? "all screen sizes"
    : `${histogramState.screenSize}-inch screens`;

  d3.select("#histogram-status")
    .text(`Showing ${d3.format(",")(count)} televisions: ${technology}, ${size}.`);
}

function populateScatterFilters() {
  makeFilterButtons("#filters_scatter", screenFilters, scatterplotState.screenTech, (selected) => {
    updateScatterplot(selected.id);
  });
}

function updateScatterplotStatus(count) {
  const technology = scatterplotState.screenTech === "all"
    ? "all screen technologies"
    : `${scatterplotState.screenTech} screens`;

  d3.select("#scatterplot-status")
    .text(`Showing ${d3.format(",")(count)} televisions: ${technology}.`);
}

function appendTooltip(parent, className, width, height, lines) {
  const tooltip = parent.append("g")
    .attr("class", `tooltip ${className}`)
    .style("opacity", 0)
    .attr("aria-hidden", "true");

  tooltip.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 7)
    .attr("fill", colours.tooltip)
    .attr("fill-opacity", 0.95);

  lines.forEach((line, index) => {
    tooltip.append("text")
      .attr("class", line.className)
      .attr("x", 13)
      .attr("y", 24 + index * 22)
      .attr("fill", "white")
      .classed("tooltip-heading", index === 0);
  });

  return tooltip;
}

function createHistogramTooltip() {
  histogramTooltip = appendTooltip(innerChartH, "histogram-tooltip", 210, 66, [
    { className: "histogram-tooltip-range" },
    { className: "histogram-tooltip-count" }
  ]);
}

function positionTooltip(x, y, width, height) {
  const tooltipX = Math.max(0, Math.min(chart.innerWidth - width, x - width / 2));
  const tooltipY = y - height - 10 >= 0
    ? y - height - 10
    : Math.min(chart.innerHeight - height, y + 10);
  return `translate(${tooltipX},${tooltipY})`;
}

function showHistogramTooltip(event, d) {
  const bar = d3.select(event.currentTarget);
  const x = Number(bar.attr("x")) + Number(bar.attr("width")) / 2;
  const y = Number(bar.attr("y"));

  innerChartH.select(".histogram-tooltip-range")
    .text(`${d3.format(",")(d.x0)}-${d3.format(",")(d.x1)} kWh/year`);
  innerChartH.select(".histogram-tooltip-count")
    .text(`${d3.format(",")(d.length)} ${d.length === 1 ? "television" : "televisions"}`);

  bar.attr("fill", colours.barHover);
  histogramTooltip
    .attr("transform", positionTooltip(x, y, 210, 66))
    .interrupt()
    .transition()
    .duration(140)
    .style("opacity", 1);
}

function hideHistogramTooltip(event) {
  d3.select(event.currentTarget).attr("fill", colours.bar);
  histogramTooltip.interrupt().transition().duration(120).style("opacity", 0);
}

function handleHistogramMouseEvents() {
  if (!innerChartH || !histogramTooltip) return;

  innerChartH.selectAll("rect.histogram-bar")
    .on("mouseenter focus", showHistogramTooltip)
    .on("mouseleave blur", hideHistogramTooltip);
}

function createTooltip() {
  scatterplotTooltip = appendTooltip(innerChartS, "scatterplot-tooltip", 315, 146, [
    { className: "tooltip-brand" },
    { className: "tooltip-model" },
    { className: "tooltip-size" },
    { className: "tooltip-tech" },
    { className: "tooltip-rating" },
    { className: "tooltip-energy" }
  ]);
}

function showScatterplotTooltip(event, d) {
  const point = d3.select(event.currentTarget);
  const x = Number(point.attr("cx"));
  const y = Number(point.attr("cy"));

  innerChartS.select(".tooltip-brand").text(`Brand: ${d.brand}`);
  innerChartS.select(".tooltip-model").text(`Model: ${d.model}`);
  innerChartS.select(".tooltip-size").text(`Screen size: ${d.screenSize} inches`);
  innerChartS.select(".tooltip-tech").text(`Screen technology: ${d.screenTech}`);
  innerChartS.select(".tooltip-rating").text(`Star rating: ${d.star}`);
  innerChartS.select(".tooltip-energy").text(`Energy: ${d3.format(",")(d.energyConsumption)} kWh/year`);

  point.attr("r", 6).attr("opacity", 1);
  scatterplotTooltip
    .attr("transform", positionTooltip(x, y, 315, 146))
    .interrupt()
    .transition()
    .duration(140)
    .style("opacity", 1);
}

function hideScatterplotTooltip(event) {
  d3.select(event.currentTarget).attr("r", 3.2).attr("opacity", 0.48);
  scatterplotTooltip.interrupt().transition().duration(120).style("opacity", 0);
}

function handleMouseEvents() {
  if (!innerChartS || !scatterplotTooltip) return;

  innerChartS.selectAll("circle.data-point")
    .on("mouseenter", showScatterplotTooltip)
    .on("mouseleave", hideScatterplotTooltip);
}
