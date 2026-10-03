/* =========================================================
   COS30045 Exercises 4.3 to 4.7
   D3 setup, CSV loading, data binding, scales and labels.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof d3 === "undefined") {
    return;
  }

  d3.csv("data/tvBrandCount.csv", (d) => {
    return {
      brand: d.brand,
      count: +d.count
    };
  }).then((data) => {
    data.sort((a, b) => b.count - a.count);

    console.log(data);
    console.log(data.length);
    console.log(d3.max(data, (d) => d.count));
    console.log(d3.min(data, (d) => d.count));
    console.log(d3.extent(data, (d) => d.count));

    drawBarChart(data);
  }).catch((error) => {
    console.error("Could not load tvBrandCount.csv", error);
  });
});

function drawBarChart(data) {
  const width = 620;
  const height = 900;
  const margin = {
    top: 74,
    right: 78,
    bottom: 42,
    left: 150
  };

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.count)])
    .nice()
    .range([0, chartWidth]);

  const yScale = d3.scaleBand()
    .domain(data.map((d) => d.brand))
    .range([0, chartHeight])
    .padding(0.18);

  const container = d3.select(".responsive-svg-container");
  container.selectAll("*").remove();

  const svg = container
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "brand-chart-title brand-chart-desc")
    .style("border", "1px solid black");

  svg
    .append("title")
    .attr("id", "brand-chart-title")
    .text("TV brand count bar chart");

  svg
    .append("desc")
    .attr("id", "brand-chart-desc")
    .text("A horizontal bar chart showing the number of television models for each brand.");

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("x", margin.left)
    .attr("y", 34)
    .text("TV models by brand");

  svg
    .append("text")
    .attr("class", "chart-note")
    .attr("x", margin.left)
    .attr("y", 56)
    .text(`${data.length} brands loaded from tvBrandCount.csv`);

  const chart = svg
    .append("g")
    .attr("transform", `translate(0, ${margin.top})`);

  const barAndLabel = chart
    .selectAll("g")
    .data(data, (d) => d.brand)
    .join("g")
    .attr("class", (d) => `bar-row count-${d.count}`)
    .attr("transform", (d) => `translate(0, ${yScale(d.brand)})`);

  barAndLabel
    .append("text")
    .attr("class", "brand-label")
    .text((d) => d.brand)
    .attr("x", margin.left - 12)
    .attr("y", yScale.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle");

  barAndLabel
    .append("rect")
    .attr("class", (d) => `brand-bar count-${d.count}`)
    .attr("x", margin.left)
    .attr("y", 0)
    .attr("width", (d) => xScale(d.count))
    .attr("height", yScale.bandwidth())
    .attr("fill", "#2f7d55");

  barAndLabel
    .append("text")
    .attr("class", "count-label")
    .text((d) => d.count)
    .attr("x", (d) => margin.left + xScale(d.count) + 8)
    .attr("y", yScale.bandwidth() / 2)
    .attr("dominant-baseline", "middle");
}
