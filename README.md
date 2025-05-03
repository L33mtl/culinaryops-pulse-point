
# CulinaryOps Calendar

This application displays a calendar of culinary events across Canada and the US.

## Setup and Running

1. Clone this repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`

## Event Data

The calendar displays real culinary events fetched from the `/public/data/culinary_events.json` file. To update this data with real events:

1. Run the Python scraper:
```bash
python scripts/culinary_events_scraper.py
```

This will scrape real culinary events from multiple sources and update the JSON file.

## Features

- Display real culinary events from across Canada and the US
- Filter events by country, event type, and month
- View event details including date, location, and description
- Links to official ticket suppliers or registration sites
