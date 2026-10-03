/* Shared dimensions, scales, colours, filters and chart state. */

const chart = {
  width: 900,
  height: 500,
  margin: { top: 42, right: 36, bottom: 72, left: 86 }
};

chart.innerWidth = chart.width - chart.margin.left - chart.margin.right;
chart.innerHeight = chart.height - chart.margin.top - chart.margin.bottom;

const colours = {
  bar: "#7d6744",
  barHover: "#d88b24",
  tooltip: "#4d3a26",
  grid: "#eadfca",
  background: "#ffffff"
};

const technologyColours = d3
  .scaleOrdinal()
  .domain(["LED", "LCD", "OLED"])
  .range(["#2878b8", "#d97706", "#17835b"]);

const histogramX = d3
  .scaleLinear()
  .domain([0, 2800])
  .range([0, chart.innerWidth]);

const histogramY = d3.scaleLinear().range([chart.innerHeight, 0]);
const scatterX = d3.scaleLinear().range([0, chart.innerWidth]);
const scatterY = d3.scaleLinear().range([chart.innerHeight, 0]);

const binGenerator = d3
  .bin()
  .value((d) => d.energyConsumption)
  .domain(histogramX.domain())
  .thresholds(d3.range(200, 2800, 200));

const screenFilters = ["all", "LED", "LCD", "OLED"].map((id) => ({
  id,
  label: id === "all" ? "All" : id
}));

const sizeFilters = [
  { id: "all-sizes", label: "All sizes", value: null },
  ...[24, 32, 55, 65, 98].map((size) => ({
    id: String(size),
    label: `${size}\"`,
    value: size
  }))
];

const histogramState = { screenTech: "all", screenSize: null };
const scatterplotState = { screenTech: "all" };

let televisionData = [];
let innerChartH;
let innerChartS;
let histogramTooltip;
let scatterplotTooltip;
