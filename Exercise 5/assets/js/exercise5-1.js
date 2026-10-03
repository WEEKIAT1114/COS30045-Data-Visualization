/* =========================================================
   COS30045 Exercise 5.1 - Vertical bar chart with axis
   Loads the supplied CSV and draws a D3 vertical bar chart.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof d3 === "undefined") {
    showChartStatus("D3 could not be loaded. Check your internet connection and refresh the page.");
    return;
  }

  const fallbackData = [
    {
      screenTech: "lcd",
      energyConsumption: 335.288889
    },
    {
      screenTech: "led",
      energyConsumption: 369.375215
    },
    {
      screenTech: "oled",
      energyConsumption: 362.28125
    }
  ];

  d3.csv("data/Data_exercise 5.1-1.csv", parseEnergyRow)
    .then((data) => {
      const chartData = prepareChartData(data);

      console.log("Exercise 5.1 bar chart data:", chartData);
      drawBarChart(chartData);
      showChartStatus("");
    })
    .catch((error) => {
      const chartData = prepareChartData(fallbackData);

      console.warn("Could not load the CSV file. Drawing the chart with embedded fallback data.", error);
      console.log("Exercise 5.1 fallback bar chart data:", chartData);
      drawBarChart(chartData);
      showChartStatus("Showing embedded data because the CSV could not be loaded in this preview.");
    });
});

function parseEnergyRow(row) {
  return {
    screenTech: row.Screen_Tech,
    energyConsumption: Number(row["Mean(Labelled energy consumption (kWh/year))"])
  };
}

function prepareChartData(data) {
  return data
    .filter((row) => row.screenTech && Number.isFinite(row.energyConsumption))
    .map((row) => ({
      screenTech: row.screenTech.trim().toLowerCase(),
      energyConsumption: row.energyConsumption
    }))
    .sort((a, b) => d3.descending(a.energyConsumption, b.energyConsumption));
}

function drawBarChart(data) {
  const chartContainer = d3.select("#bar-chart");

  if (chartContainer.empty() || !data.length) {
    showChartStatus("No valid chart data was found.");
    return;
  }

  chartContainer.selectAll("*").remove();

  const width = 860;
  const height = 520;
  const margin = {
    top: 42,
    right: 34,
    bottom: 78,
    left: 86
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxEnergy = d3.max(data, (d) => d.energyConsumption);

  const svg = chartContainer
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "bar-chart-title bar-chart-description");

  svg
    .append("title")
    .attr("id", "bar-chart-title")
    .text("Mean labelled energy consumption by screen technology");

  svg
    .append("desc")
    .attr("id", "bar-chart-description")
    .text("A vertical bar chart comparing LCD, LED and OLED screen technologies by kWh per year.");

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.screenTech))
    .range([0, innerWidth])
    .padding(0.28);

  const yScale = d3
    .scaleLinear()
    .domain([0, maxEnergy * 1.16])
    .nice()
    .range([innerHeight, 0]);

  innerChart
    .append("g")
    .attr("class", "grid-lines")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat("")
    );

  innerChart
    .selectAll(".bar")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.screenTech))
    .attr("y", (d) => yScale(d.energyConsumption))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(d.energyConsumption))
    .attr("rx", 8)
    .attr("fill", (d, index) => ["#2f7d77", "#d88b24", "#7d6744"][index]);

  innerChart
    .selectAll(".bar-value-label")
    .data(data)
    .join("text")
    .attr("class", "bar-value-label")
    .attr("x", (d) => xScale(d.screenTech) + xScale.bandwidth() / 2)
    .attr("y", (d) => yScale(d.energyConsumption) - 12)
    .attr("text-anchor", "middle")
    .text((d) => `${Math.round(d.energyConsumption)} kWh`);

  innerChart
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3
        .axisBottom(xScale)
        .tickSizeOuter(0)
        .tickFormat(formatScreenTech)
    );

  innerChart
    .append("g")
    .attr("class", "axis y-axis")
    .call(
      d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSizeOuter(0)
    );

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("x", margin.left + innerWidth / 2)
    .attr("y", height - 24)
    .attr("text-anchor", "middle")
    .text("Screen technology");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Mean labelled energy consumption (kWh/year)");
}

function formatScreenTech(value) {
  return value.toUpperCase();
}

function showChartStatus(message) {
  const status = document.querySelector("#chart-status");

  if (status) {
    status.textContent = message;
  }
}
