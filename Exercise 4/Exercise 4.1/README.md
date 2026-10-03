# COS30045 - Data Visualisation
## Exercise 4.1, 4.3 and 4.4

This folder starts from the Exercise 0.2 energy website template and adds the Week 4 D3 work.

## Pages and files

- `index.html` - energy website home page.
- `d3-setup.html` - D3 setup and CSV-driven TV brand bar chart page.
- `draw-svg-house.html` - Exercise 4.1 SVG house and garden page.
- `assets/js/d3.js` - D3 setup code and CSV loading code.
- `data/tvBrandCount.csv` - TV brand count data used by D3.

## Exercise 4.4 note

The CSV file was extracted from `2026 TV Data.knwf` because the KNIME workflow could not be imported locally.
The workflow archive already contained `tvBrandCount.csv`, so no KNIME export was required.

The D3 script loads the CSV with:

```js
d3.csv("data/tvBrandCount.csv", (d) => {
  return {
    brand: d.brand,
    count: +d.count
  };
});
```

It logs the loaded data, length, maximum count, minimum count and extent in the browser console, then calls `drawBarChart(data)`.
