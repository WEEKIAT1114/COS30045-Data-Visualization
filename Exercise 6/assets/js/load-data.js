/* Load the CSV once, convert numeric fields, then initialise both charts. */

d3.csv("assets/data/Ex6_TVdata_withStar.csv", (d) => ({
  brand: d.brand.trim(),
  model: d.model.trim(),
  screenSize: Number(d.screenSize),
  screenTech: d.screenTech.trim(),
  star: Number(d.star),
  energyConsumption: Number(d.energyConsumption)
}))
  .then((rows) => {
    televisionData = rows.filter((d) =>
      d.brand &&
      d.model &&
      ["LED", "LCD", "OLED"].includes(d.screenTech) &&
      Number.isFinite(d.screenSize) &&
      Number.isFinite(d.star) &&
      Number.isFinite(d.energyConsumption)
    );

    if (!televisionData.length) {
      throw new Error("The CSV did not contain any valid television rows.");
    }

    d3.select("#tv-count").text(d3.format(",")(televisionData.length));

    drawHistogram(televisionData);
    createHistogramTooltip();
    handleHistogramMouseEvents();
    populateFilters();

    drawScatterplot(televisionData);
    createTooltip();
    handleMouseEvents();
    populateScatterFilters();

    updateHistogramStatus(televisionData.length);
    updateScatterplotStatus(televisionData.length);
    console.log(`Loaded ${televisionData.length} television records.`, televisionData);
  })
  .catch((error) => {
    console.error("Unable to load television data:", error);

    d3.selectAll("#histogram, #scatterplot")
      .html("")
      .append("p")
      .attr("class", "chart-error")
      .text("The television data could not be loaded. Run this site through a local web server and try again.");
  });
