# Exercise 3 - Data Story: TV Energy Consumption

## Overview

This Exercise 3 website presents a data story based on the television energy consumption dataset explored in KNIME. The story uses two visualisations from the workflow to help household consumers understand the screen-size choices in the dataset and how screen technology affects labelled annual energy consumption. The processed dataset contains 4,724 usable television records.

The selected visualisations are:

- Histogram of television screen size
- Grouped bar chart of average labelled energy consumption by screen-size category and screen technology

## Data Story

### Audience

The main audience is Australian household consumers who are comparing televisions before buying or replacing a TV. They may not be data experts, so the story needs to be direct, practical and easy to scan.

The audience wants to know:

- which TV screen sizes are common in the dataset
- whether technology changes annual energy use within each size group
- what label information should be checked before choosing a television

### Story Overview

The website now presents each selected chart as its own data story. Each chart story is organised into six storytelling boxes: Issue, Audience, Chart Role, Insight, Meaning and Action. This follows Step 3 of the exercise by planning how the audience will experience the information on the webpage.

### Data Story 1 - Histogram

The histogram answers the question: which TV screen sizes are common in the dataset?

This story gives the audience context before making energy comparisons. The screen sizes are not evenly spread across the dataset. Many products sit around common mid-to-large screen ranges, while the very smallest and very largest TVs appear less often. The recommendation from this chart is to compare televisions inside a realistic screen-size range rather than treating every possible TV size as equally common.

### Data Story 2 - Bar Chart

The grouped bar chart answers the question: for a chosen TV size, which screen technology tends to have higher labelled annual energy consumption?

This bar chart has its own data story. It compares average labelled annual energy consumption for LCD, LCD (LED) and OLED televisions inside small, medium and large screen-size categories. In the processed data, the average values by technology range from about 135-233 kWh/year for small TVs, 383-406 kWh/year for medium TVs, and 658-754 kWh/year for large TVs. The recommendation from this chart is to compare the kWh/year label for similar models instead of assuming one technology name is always the most efficient.

The overall message is: consumers should choose a realistic screen size first, then compare screen technology and labelled kWh/year values within that chosen group.

### User Story

As a household consumer shopping for a new television, I want to understand which screen sizes are common and how screen technology changes labelled annual energy consumption, so that I can compare realistic TV options before buying.

### Storyboard

1. Issue: shoppers often compare TV size first, but size alone does not explain the whole energy story.
2. Context: the histogram helps the audience see which screen sizes are common before comparing energy use.
3. First story: screen-size distribution shows that buyers are usually comparing models in popular mid-to-large ranges.
4. Next question: after choosing a realistic size range, the buyer needs to compare technology and annual kWh values.
5. Bar chart story: the grouped bar chart compares LCD, LCD (LED) and OLED TVs within small, medium and large categories.
6. Action: choose the screen size first, then compare the energy label for similar technologies and models.

## About the Data

### Data Source

The dataset contains television product registration information used for the COS30045 exercises. It includes fields such as brand, model number, country sold in, screen size, screen area, screen technology, power values, star rating and labelled annual energy consumption in kWh/year.

### Data Processing

The data was processed in KNIME before the visualisations were created. The workflow:

- cleaned and filtered the television dataset
- selected the relevant screen size, screen technology and labelled energy consumption fields
- converted screen size from centimetres to inches
- rounded screen size in inches for plotting
- grouped televisions into small, medium and large screen-size categories
- created histogram and grouped bar chart visualisations

### Privacy

The dataset describes television products, not people. It does not contain personal or sensitive information about customers or households.

### Accuracy and Limitations

The visualisations are useful for comparing broad patterns, but they have limitations:

- the dataset may not include every television available in the market
- labelled annual energy consumption is based on standard testing, not every household's actual use
- energy use may change with brightness settings, viewing hours and device features
- screenshots from KNIME are static and do not allow filtering or interaction

### Ethics

The story avoids claiming that screen size or screen technology alone determines energy consumption. The page explains that labelled annual energy consumption should be treated as a guide rather than an exact household electricity bill, and it notes that some technology groups have fewer records than others.

## AI Declaration

ChatGPT was used to help structure the website content, refine the written user story and prepare HTML/CSS changes. The output was reviewed and adapted for this exercise.

## Website Storytelling

The website has been updated to include a separate Data Story page. It presents two KNIME chart screenshots with explanatory text, an audience-focused user story and a clear practical takeaway for consumers.
