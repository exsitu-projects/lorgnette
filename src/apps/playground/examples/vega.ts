import { JSON_LANGUAGE } from "../../../presets/languages/json/language";

// From https://vega.github.io/vega-lite/examples/layer_line_rolling_mean_point_raw.html
const text = 
`
{
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Plot showing a 30 day rolling average with raw values in the background.",
    "width": 400,
    "height": 300,
    "data": {"url": "data/seattle-weather.csv"},
    "transform": [{
      "window": [
        {
          "field": "temp_max",
          "op": "mean",
          "as": "rolling_mean"
        }
      ],
      "frame": [-15, 15]
    }],
    "encoding": {
      "x": {"field": "date", "type": "temporal", "title": "Date"},
      "y": {"type": "quantitative", "axis": {"title": "Max Temperature and Rolling Mean"}}
    },
    "layer": [
      {
        "mark": {"type": "point", "opacity": 0.3},
        "encoding": {
          "y": {"field": "temp_max", "title": "Max Temperature"}
        }
      },
      {
        "mark": {"type": "line", "color": "red", "size": 3},
        "encoding": {
          "y": {"field": "rolling_mean", "title": "Rolling Mean of Max Temperature"}
        }
      }
    ]
  }
`;

export const VEGA_EXAMPLE = {
    name: "Vega",
    language: JSON_LANGUAGE,
    content: text.trim()
};