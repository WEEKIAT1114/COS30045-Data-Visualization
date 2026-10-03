/* =========================================================
   COS30045 Exercise 5.3 - Donut chart
   Loads TV size category counts and draws a D3 donut chart.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof d3 === "undefined") {
    showDonutChartStatus("D3 could not be loaded. Check your internet connection and refresh the page.");
    return;
  }

  const fallbackData = [
    {
      sizeCategory: "large",
      count: 1352
    },
    {
      sizeCategory: "medium",
      count: 2386
    },
    {
      sizeCategory: "small",
      count: 770
    }
  ];

  d3.csv("data/Data_exercise 5.3.csv", parseDonutRow)
    .then((data) => {
      const chartData = prepareDonutData(data);

      console.log("Exercise 5.3 donut chart data:", chartData);
      drawDonutChart(chartData);
      showDonutChartStatus("");
    })
    .catch((error) => {
      const chartData = prepareDonutData(fallbackData);

      console.warn("Could not load Data_exercise 5.3.csv. Drawing the chart with embedded fallback data.", error);
      console.log("Exercise 5.3 fallback donut chart data:", chartData);
      drawDonutChart(chartData);
      showDonutChartStatus("Showing embedded data because the CSV could not be loaded in this preview.");
    });
});

function parseDonutRow(row) {
  return {
    sizeCategory: row.Screensize_Category || row.Size,
    count: Number(row.Count)
  };
}

function prepareDonutData(data) {
  return data
    .filter((row) => row.sizeCategory && Number.isFinite(row.count))
    .map((row) => ({
      sizeCategory: formatSizeCategory(row.sizeCategory),
      count: row.count
    }));
}

function drawDonutChart(data) {
  const chartContainer = d3.select("#donut-chart");

  if (chartContainer.empty() || !data.length) {
    showDonutChartStatus("No valid donut chart data was found.");
    return;
  }

  chartContainer.selectAll("*").remove();

  const width = 860;
  const height = 520;
  const radius = Math.min(width, height) / 2 - 82;
  const total = d3.sum(data, (d) => d.count);

  const svg = chartContainer
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "donut-chart-title donut-chart-description");

  svg
    .append("title")
    .attr("id", "donut-chart-title")
    .text("TV model proportions by screen-size category");

  svg
    .append("desc")
    .attr("id", "donut-chart-description")
    .text("A donut chart showing small, medium and large television model counts.");

  const colorScale = d3
    .scaleOrdinal()
    .domain(data.map((d) => d.sizeCategory))
    .range(["#2f7d77", "#d88b24", "#7d6744"]);

  const pie = d3
    .pie()
    .sort(null)
    .value((d) => d.count);

  const arcGenerator = d3
    .arc()
    .innerRadius(radius * 0.58)
    .outerRadius(radius)
    .padAngle(0.025)
    .cornerRadius(8);

  const labelArc = d3
    .arc()
    .innerRadius(radius * 0.76)
    .outerRadius(radius * 0.76);

  const chartGroup = svg
    .append("g")
    .attr("transform", `translate(${width * 0.36}, ${height / 2})`);

  const slices = chartGroup
    .selectAll(".donut-slice")
    .data(pie(data))
    .join("path")
    .attr("class", "donut-slice")
    .attr("fill", (d) => colorScale(d.data.sizeCategory))
    .attr("d", arcGenerator);

  slices
    .append("title")
    .text((d) => {
      const percent = (d.data.count / total) * 100;
      return `${d.data.sizeCategory}: ${d.data.count} TVs (${percent.toFixed(1)}%)`;
    });

  chartGroup
    .selectAll(".donut-label")
    .data(pie(data))
    .join("text")
    .attr("class", "donut-label")
    .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
    .text((d) => `${((d.data.count / total) * 100).toFixed(1)}%`);

  chartGroup
    .append("text")
    .attr("class", "donut-center-value")
    .attr("y", -4)
    .text(total.toLocaleString());

  chartGroup
    .append("text")
    .attr("class", "donut-center-label")
    .attr("y", 24)
    .text("TV models");

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width * 0.66}, ${height / 2 - 86})`);

  const legendItems = legend
    .selectAll(".legend-item")
    .data(data)
    .join("g")
    .attr("class", "legend-item")
    .attr("transform", (d, index) => `translate(0, ${index * 62})`);

  legendItems
    .append("rect")
    .attr("class", "legend-swatch")
    .attr("width", 22)
    .attr("height", 22)
    .attr("fill", (d) => colorScale(d.sizeCategory));

  legendItems
    .append("text")
    .attr("class", "legend-label")
    .attr("x", 36)
    .attr("y", 13)
    .text((d) => d.sizeCategory);

  legendItems
    .append("text")
    .attr("class", "legend-value")
    .attr("x", 36)
    .attr("y", 36)
    .text((d) => {
      const percent = (d.count / total) * 100;
      return `${d.count.toLocaleString()} models (${percent.toFixed(1)}%)`;
    });
}

function showDonutChartStatus(message) {
  const status = document.querySelector("#donut-chart-status");

  if (status) {
    status.textContent = message;
  }
}

function formatSizeCategory(value) {
  const normalized = value.trim().toLowerCase();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
