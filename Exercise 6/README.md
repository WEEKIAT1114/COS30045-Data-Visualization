# Exercise 6 - Interactive D3 Visualisations

This folder contains the completed Week 6 exercise built from the supplied January 2026 television dataset.

## Exercise coverage

- **6.1 Histogram:** bins all 4,233 televisions into 200 kWh/year intervals and draws labelled axes.
- **6.2 Filters:** filters the histogram by LED, LCD or OLED screen technology with animated bar and y-axis updates.
- **6.3 Scatterplot:** plots star rating against labelled annual energy consumption, colour-coded by screen technology, with an SVG legend.
- **6.4 Tooltips:** shows brand, model, screen size, screen technology, star rating and energy consumption when a point is hovered.

The optional extensions are also included: screen-size filters, histogram tooltips, a scatterplot technology filter and histogram y-axis rescaling.

## Run locally

D3 loads the CSV through HTTP, so do not open `visualisations.html` directly as a `file://` page. Start a local server from this folder, for example:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000/visualisations.html`.

## Relevant files

```text
visualisations.html
assets/
  css/
    style.css
    visualisations.css
  data/
    Ex6_TVdata_withStar.csv
  js/
    shared-constants.js
    histogram.js
    scatterplot.js
    interactions.js
    load-data.js
```

The script order at the bottom of `visualisations.html` matters: D3 and shared values are loaded before the chart and interaction functions, while `load-data.js` runs last to initialise the page.
