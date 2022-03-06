# Water quality data

This is the data format that is used to render the data on the drinking water quality page. 

## Zones

Water is usually distributed in different zones in a city. A small village or town might have only one zone, a larger city will have multiple zones. Measurements are only done for a single zone, so they are associated 1:1 with a zone.

We're identifying zones by their ISO code, national numbering (if possible) and local name.

## Categories

Categories is a tree structure, to categorize the location of the different zones. It usually goes Continent, Country, State, City/Town, Districts, Streets; but levels can be skipped as needed. The upper categories have a property called "children" that contains the lower categories. The leaf entry has a "zone" property that links to a zone id in the zones array.

## Measurements

Measurements identify the measured levels of substances in the water. If the report states a range instead of exact values, the measurement is represented by a object with "from" and "to" keys. 

## Examples

```json
{
  "categories": [{
    "name": "Europe",
    "children": [{
      "name": "Germany",
      "children": [{
        "name": "Baden-Württemberg",
        "children": [{
          "name": "Heilbronn",
          "children": [{
            "name": "Aachener Straße",
            "zone": "DE-08121000-Heilbronn 10"
          }, {
            "name": "Bebelstraße",
            "zone": "DE-08121000-Heilbronn 9"
          }]
        }]
      }]
    }]
  }],
  "zones": [{
    "id": "DE-08121000-Heilbronn 9",
    "name": "Heilbronn 9",
    "measurements": [{
      "sodium": {"from":  5, "to":  6},
      "potassium": {"from":  1, "to":  2},
      "calcium": {"from": 48, "to": 52},
      "magnesium": {"from": 7, "to": 9},
      "chlorides": {"from": 8, "to": 9},
      "nitrates": {"from": 4.5, "to": 7},
      "sulfates": 32,
      "hardness": 9,
      "year": "2020",
      "source": "https://opendata.heilbronn.de/dataset/wasserversorgung-und-wasserqualitt-der-stadt-heilbronn/resource/154272a6-9ce8-4e4b-89b8",
      "origin": ""
    }]
  }, {
    "id": "DE-08121000-Heilbronn 10-11",
    "name": "Heilbronn 10-11",
    "measurements": [{
			"sodium": "5-6",
			"potassium": "1-2",
			"calcium": "55-60",
			"magnesium": "11-12",
			"chlorides": "8-9",
			"nitrates": "4,5-7",
			"sulfates": "32",
			"hardness": "9",
			"year": "2020",
			"source": "https://opendata.heilbronn.de/dataset/wasserversorgung-und-wasserqualitt-der-stadt-heilbronn/resource/154272a6-9ce8-4e4b-89b8",
			"origin": ""
		}]
  }]
}
```
