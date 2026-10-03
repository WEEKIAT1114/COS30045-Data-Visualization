/* =========================================================
   COS30045 Exercise 5.2 - Scatter plot and line chart
   Loads ARE spot prices and draws a D3 line chart with points.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof d3 === "undefined") {
    showLineChartStatus("D3 could not be loaded. Check your internet connection and refresh the page.");
    return;
  }

  const fallbackData = [
    { year: 1998, averagePrice: 41.5 },
    { year: 1999, averagePrice: 44 },
    { year: 2000, averagePrice: 50.5 },
    { year: 2001, averagePrice: 35.75 },
    { year: 2002, averagePrice: 35.25 },
    { year: 2003, averagePrice: 33.5 },
    { year: 2004, averagePrice: 36.25 },
    { year: 2005, averagePrice: 38.5 },
    { year: 2006, averagePrice: 61 },
    { year: 2007, averagePrice: 63.5 },
    { year: 2008, averagePrice: 49.25 },
    { year: 2009, averagePrice: 53.5 },
    { year: 2010, averagePrice: 37 },
    { year: 2011, averagePrice: 30.25 },
    { year: 2012, averagePrice: 65.25 },
    { year: 2013, averagePrice: 59 },
    { year: 2014, averagePrice: 42.75 },
    { year: 2015, averagePrice: 58.75 },
    { year: 2016, averagePrice: 96 },
    { year: 2017, averagePrice: 92 },
    { year: 2018, averagePrice: 106.75 },
    { year: 2019, averagePrice: 73 },
    { year: 2020, averagePrice: 60.5 },
    { year: 2021, averagePrice: 137.75 },
    { year: 2022, averagePrice: 144.5 },
    { year: 2023, averagePrice: 98.75 },
    { year: 2024, averagePrice: 132.5 }
  ];

  d3.csv("data/ARE_Spot_Prices.csv", parseSpotPriceRow)
    .then((data) => {
      const chartData = prepareLineChartData(data);

      console.log("Exercise 5.2 line chart data:", chartData);
      drawLineChart(chartData);
      showLineChartStatus("");
    })
    .catch((error) => {
      const chartData = prepareLineChartData(fallbackData);

      console.warn("Could not load ARE_Spot_Prices.csv. Drawing the chart with embedded fallback data.", error);
      console.log("Exercise 5.2 fallback line chart data:", chartData);
      drawLineChart(chartData);
      showLineChartStatus("Showing embedded data because the CSV could not be loaded in this preview.");
    });
});

function parseSpotPriceRow(row) {
  return {
    year: Number(row.Year),
    averagePrice: Number(row["Average Price (notTas-Snowy)"])
  };
}

function prepareLineChartData(data) {
  return data
    .filter((row) => Number.isFinite(row.year) && Number.isFinite(row.averagePrice))
    .sort((a, b) => d3.ascending(a.year, b.year));
}

function drawLineChart(data) {
  const chartContainer = d3.select("#line-chart");

  if (chartContainer.empty() || !data.length) {
    showLineChartStatus("No valid line chart data was found.");
    return;
  }

  chartContainer.selectAll("*").remove();

  const width = 860;
  const height = 520;
  const margin = {
    top: 42,
    right: 150,
    bottom: 78,
    left: 86
  };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svg = chartContainer
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("role", "img")
    .attr("aria-labelledby", "line-chart-title line-chart-description");

  svg
    .append("title")
    .attr("id", "line-chart-title")
    .text("Average Australian electricity spot price by year");

  svg
    .append("desc")
    .attr("id", "line-chart-description")
    .text("A line chart with scatter points showing average spot prices from 1998 to 2024.");

  const innerChart = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([0, innerWidth]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.averagePrice) * 1.16])
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

  const lineGenerator = d3
    .line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.averagePrice));

  innerChart
    .append("path")
    .datum(data)
    .attr("class", "price-line")
    .attr("d", lineGenerator);

  innerChart
    .selectAll(".price-point")
    .data(data)
    .join("circle")
    .attr("class", "price-point")
    .attr("r", 5)
    .attr("cx", (d) => xScale(d.year))
    .attr("cy", (d) => yScale(d.averagePrice))
    .append("title")
    .text((d) => `${d.year}: $${d.averagePrice.toFixed(2)} per MWh`);

  innerChart
    .append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3
        .axisBottom(xScale)
        .ticks(9)
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
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
    .text("Year");

  svg
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(margin.top + innerHeight / 2))
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .text("Average spot price ($ per MWh)");

  const lastPoint = data[data.length - 1];

  innerChart
    .append("text")
    .attr("class", "line-end-label")
    .attr("x", xScale(lastPoint.year) + 12)
    .attr("y", yScale(lastPoint.averagePrice) + 5)
    .text(`2024: $${Math.round(lastPoint.averagePrice)}`);
}

function showLineChartStatus(message) {
  const status = document.querySelector("#line-chart-status");

  if (status) {
    status.textContent = message;
  }
}
