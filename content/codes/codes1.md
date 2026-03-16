---
title: "U.S. Treasury CUSIP panel metadata" 
date: 2026-01-19
tags: ["Treasury","CUSIP","panel data","bonds","notes","bills","auctions","python","polars","financial data"]
author: ["Corey Garriott"]
description: "A complete CUSIP-date level panel dataset of US Treasury bond metadata from 1990 to present, generated from public Treasury auction data."
summary: "A complete CUSIP-date level panel dataset of US Treasury bond metadata from public sources, including tenor classifications, vintage tracking, cumulative issuance, and auction markers."
editPost:
    URL: "https://github.com/cgarriott/ustCusipPanel"
    Text: "GitHub repository"
showToc: true
disableAnchoredHeadings: false

---

## Overview

The **ustCusipPanel** code is a simple Python code to create a merge dataset for work with US Treasury data. It uses public data from US Treasury to create a complete, `CUSIP-date` level panel dataset of US Treasury bonds outstanding. If you are working with `CUSIP-date` UST data, or with `(maturity date x coupon)-date` data, this will give you a nice daily merge table with Treasury securities characteristics. The public data that it uses spans November 1979 to now.

Features:

- **Time series completion** ideal for merging: every bond listed on every day (weekends excepted)
- **Tenor classifications** giving the tenor of bills, notes, and bonds
- **Vintage tracking** or "runness." This is neat. Vintage is an ordinal ranking by issue date within date-tenor groups (on-the-run securities have vintage 0, the first off-the-run is vintage 1, and so on). That way you can tell where a bond sits in the "run" stack within its tenor class. Bonds that have been announced by ODM (i.e., "when-issued") have vintage -1.
- **Auction data** marking openings, re-openings, unscheduled re-openings, and issuance
- **Smart caching** with partial date range merging
- **Incremental updates** via `updateUstCusipPanel()` to update an existing panel without re-downloading everything

---

## Get it

It's just one file. Run it, and it returns a `DataFrame` with the panel. Easy!

Click to download ustCusipPanel.py from GitHub:

+ **Repository**: [ustCusipPanel on GitHub](https://github.com/cgarriott/ustCusipPanel)
+ **Documentation**: [Usage examples](https://github.com/cgarriott/ustCusipPanel#readme)
+ **Data Source**: [U.S. Treasury Fiscal Data API](https://fiscaldata.treasury.gov/)
+ **Installation**: Available from PyPI (when published) or install from source

---

## Methodology

The raw data is pulled from **U.S. Treasury Fiscal Data API**, specifically the [Auction Query endpoint](https://fiscaldata.treasury.gov/datasets/treasury-auctions-query-auctions/treasury-auctions-query). The ustCusipPanel package:

1. **Fetches all auction records** including issuance metadata (CUSIP, tenor, coupon, maturity date, issuance type)
2. **Classifies securities** by tenor type using term-to-maturity calculations that account for market conventions
3. **Caches results locally** with smart partial range merging — if you request a range that overlaps with cached data, only the missing portion is fetched
4. **Creates a time series fill** for each CUSIP from announcement through maturity, completing the data with forward and backward filling of static characteristics and forward filling of dynamic characteristics

Special handling is included for "when issued" securities (vintage = -1) and for unscheduled reopenings where an issuance was announced under one CUSIP but instead reopened under a different, pre-existing CUSIP. Consistent with FICC press releases as well as with futures-delivery methodology, the CUSIP will use the old tenor until the unscheduled reopening, then it will switch to the new tenor.

---

## Output data schema

The returned Polars DataFrame contains the following 16 columns:

| Column | Type | Description |
|--------|------|-------------|
| `date` | Date | Business date (excludes weekends) |
| `cusip` | String | CUSIP security identifier |
| `securityType` | String | "Bill", "Note", or "Bond" |
| `tenor` | Int64 | Tenor in weeks (bills) or years (notes/bonds) |
| `vintage` | Int64 | Ordinal ranking by firstIssueDate (0 = on-the-run) |
| `coupon` | Float64 | Interest rate as a percentage |
| `maturityDate` | Date | Security maturity date |
| `TIPS` | Boolean | True for TIPS |
| `floatingRate` | Boolean | True for FRNs (Floating Rate Notes) |
| `firstIssueDate` | Date | Original issue date of the security |
| `issuanceType` | String | "Opening", "Re-opening", or None |
| `auctionDate` | Date | Date of the most recent auction |
| `unscheduledReopeningDate` | Date | Date of most recent unscheduled reopening (if any) |
| `totalIssued` | Float64 | Cumulative issuance in dollars |
| `announcementDate` | Date | Announcement date of most recent auction |

### Security classifications

**Bills** tenors are measured in weeks:
- 1, 2, 4, 8, 13, 17, 22, 26, 52-week bills

**Notes and bonds** tenors are measured in years:
- 2, 3, 4, 5, 7, 10-year notes
- 20, 30-year bonds

**Special securities**:
- TIPS (Treasury Inflation-Protected Securities) marked with `TIPS = True`
- FRNs (Floating Rate Notes) marked with `floatingRate = True`

---

## Using the package with Python

### Installation

From PyPI (when published):
```python
pip install ustCusipPanel
```

From source:
```bash
git clone https://github.com/cgarriott/ustCusipPanel.git
cd ustCusipPanel
pip install -e .
```

### Quick start

```python
import ustCusipPanel

# Generate panel with default parameters (1990-01-01 to today)
df = ustCusipPanel.ustCusipPanel()

# Custom date range
df = ustCusipPanel.ustCusipPanel(
    startDate="2020-01-01",
    endDate="2023-12-31"
)

# Suppress summary statistics
df = ustCusipPanel.ustCusipPanel(silent=True)

# Force fresh download (ignore cache)
df = ustCusipPanel.ustCusipPanel(forceDownload=True)

# Incrementally update a saved panel parquet file
ustCusipPanel.updateUstCusipPanel("treasuryPanel.parquet")

# Or update a DataFrame in memory and get the result
dfUpdate = ustCusipPanel.updateUstCusipPanel(df)
```

### Common usage examples

#### Get on-the-run securities

```python
import polars as pl

df = ustCusipPanel.ustCusipPanel()

# Filter for on-the-run 10-year notes
otr_10y = df.filter(
    (pl.col('tenor') == 10) & 
    (pl.col('vintage') == 0)
)
```

#### Analyze auction activity

```python
# Get all auction dates for 5-year notes
auctions_5y = df.filter(
    (pl.col('tenor') == 5) & 
    (pl.col('auctionDate').is_not_null())
)

# Count auctions by type
auctionSummary = auctions_5y.group_by('issuanceType').agg(
    pl.count().alias('count')
)
```

#### Track issuance over time

```python
# Get cumulative issuance for a specific CUSIP
cusipHistory = df.filter(
    pl.col('cusip') == '912828Z29'
).select(['date', 'totalIssued', 'issuanceType']).sort('date')
```

#### Compare Treasury tenors

```python
# Average number of active securities by tenor
tenorSummary = df.group_by(['date', 'tenor']).agg(
    pl.col('cusip').n_unique().alias('nSecurities')
).group_by('tenor').agg(
    pl.col('nSecurities').mean().alias('avgSecurities')
)

# Track how many vintages exist for each tenor on each date
vintage_distribution = df.filter(
    pl.col('date') == '2024-01-15'
).group_by('tenor').agg(
    pl.col('vintage').max().alias('maxVintage'),
    pl.col('cusip').n_unique().alias('nCusips')
)
```

#### Incrementally update an existing panel

```python
# If you've previously saved a panel to parquet, update it in place
ustCusipPanel.updateUstCusipPanel("treasuryPanel.parquet")

# Or update a DataFrame and get the result back
df = ustCusipPanel.ustCusipPanel(startDate="2020-01-01")
df = ustCusipPanel.updateUstCusipPanel(df)
```

`updateUstCusipPanel` figures out where to start the update automatically. If there are any Notes or Bonds in the data with a missing coupon (e.g., a recently announced security whose coupon wasn't set yet), it refreshes from that date forward. Otherwise it picks up from the day after the latest date in the panel. Only new data is fetched from the API.

#### Identify special security types

```python
# Get all TIPS in the dataset
tips = df.filter(pl.col('TIPS') == True)

# Get all Floating Rate Notes
frns = df.filter(pl.col('floatingRate') == True)

# Count TIPS by tenor over time
tipsByTenor = tips.group_by(['date', 'tenor']).agg(
    pl.col('cusip').n_unique()
).group_by('tenor').agg(
    pl.col('cusip').mean().alias('avgDailyCount')
)
```

---

## Technical details

### Why Polars?

This package uses [Polars](https://pola.rs/) instead of Pandas, as everyone should. Polars is written in Rust, significantly faster than Pandas for large datasets. It has better memory management and built-in query optimization for complex operations. Also Pandas drives me crazy.

### Caching

Data is automatically cached in platform-specific directories to minimize API calls:

- **Linux**: `~/.local/share/ustCusipPanel/`
- **macOS**: `~/Library/Application Support/ustCusipPanel/`
- **Windows**: `%LOCALAPPDATA%\ustCusipPanel\`

Cache files include:
- `auctions.csv`: Downloaded auction data
- `auctions.txt`: Date range metadata

The cache handles six overlap scenarios intelligently — only missing date ranges are fetched from the API:

| Scenario | Behavior |
|----------|----------|
| Exact match | Use cache as-is |
| Subset (requested ⊂ cache) | Filter cached data |
| Superset (cache ⊂ requested) | Fetch both ends, merge |
| Left extension | Fetch earlier range, merge |
| Right extension | Fetch later range, merge |
| No overlap | Full download |

Use `forceDownload=True` to bypass the cache entirely.

### Requirements

- Python ≥ 3.8
- polars ≥ 0.20.0
- requests ≥ 2.25.0
- platformdirs ≥ 3.0.0

---

## Contributing and support

This project is in the public domain (Unlicense), and contributions are welcome.

For issues, questions, or suggestions:
- **Issues**: [ustCusipPanel Issues](https://github.com/cgarriott/ustCusipPanel/issues)
- **Discussions**: [ustCusipPanel Discussions](https://github.com/cgarriott/ustCusipPanel/discussions)

---

## Unlicense

This is free and unencumbered software released into the public domain. Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.

---

## Acknowledgments

- Data provided by the U.S. Department of the Treasury
- Built with [Polars](https://pola.rs/)
- API infrastructure from [Treasury Fiscal Data](https://fiscaldata.treasury.gov/)
