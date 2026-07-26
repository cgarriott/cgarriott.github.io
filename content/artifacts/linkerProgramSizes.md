---
title: "Linker program sizes"
date: 2026-07-26
tags: ["Treasury", "TIPS", "inflation-linked bonds", "sovereign debt", "linkers", "data visualization"]
author: ["Corey Garriott"]
description: "How big are inflation-linked bond programs, as a share of total marketable government debt, across 22 countries?"
summary: "An interactive chart of inflation-linked bonds (TIPS, OATi, Bunds, RRBs, and more) as a share of sovereign debt outstanding, by country, from official public sources."
cover:
    image: "cover.svg"
    alt: "Stylized rising line chart with country-code callouts, evoking the linker program size chart below."
    relative: true
editPost:
    URL: "../"
    Text: "Corey's artifacts"
showToc: false
disableAnchoredHeadings: false

---

<style>
.viz-root {
  --surface-1:      var(--entry);
  --page-plane:     var(--theme);
  --text-primary:   var(--primary);
  --text-secondary: var(--secondary);
  --text-muted:     var(--secondary);
  --gridline:       var(--border);
  --baseline:       var(--secondary);
  --border:         var(--border);
  --series-1:       #2a78d6; /* blue   - US */
  --series-2:       #eb6834; /* orange - FR */
  --series-3:       #1baf7a; /* aqua   - DE */
  --series-4:       #eda100; /* yellow - CA */
  --series-5:       #e87ba4; /* magenta - UK */
  --series-6:       #8e44ad; /* purple - IT */
  --series-7:       #c0392b; /* brick red - ES */
  --series-8:       #34495e; /* dark slate blue - SE */
  --series-9:       #8b5a2b; /* brown - AU */
  --series-10:      #5c6bc0; /* indigo - JP */
  --series-11:      #e07a5f; /* terracotta - DK */
  --series-12:      #4a7c59; /* forest green - NZ */
  --series-13:      #17a2b8; /* cyan - MX */
  --series-14:      #c9a227; /* gold - BR */
  --series-15:      #b23a6b; /* rose - CL */
  --series-16:      #7f8c8d; /* slate grey - CO */
  --series-17:      #d35400; /* burnt orange - UY */
  --series-18:      #7c9a3e; /* olive green - IL */
  --series-19:      #1f3a5f; /* navy - ZA */
  --series-20:      #9b4f96; /* magenta-violet - PL */
  --series-21:      #a68b1f; /* mustard - KR */
  --series-22:      #0d6e6e; /* deep teal - TR */

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--content);
  padding: 0 0 24px;
}
.dark .viz-root {
  --series-1:       #3987e5;
  --series-2:       #d95926;
  --series-3:       #199e70;
  --series-4:       #c98500;
  --series-5:       #d55181;
  --series-6:       #a569bd;
  --series-7:       #e0574a;
  --series-8:       #5d7a99;
  --series-9:       #a97a4a;
  --series-10:      #7986cb;
  --series-11:      #ed9382;
  --series-12:      #6b9c7c;
  --series-13:      #3fc3d9;
  --series-14:      #e0bc4a;
  --series-15:      #d15a8a;
  --series-16:      #9fadae;
  --series-17:      #f07f2d;
  --series-18:      #9bbf5a;
  --series-19:      #3f6a99;
  --series-20:      #bc75b7;
  --series-21:      #c9ac3f;
  --series-22:      #2a9d9d;
}

.viz-root * { box-sizing: border-box; }
.viz-root h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 4px;
}
.viz-root .subtitle {
  color: var(--text-secondary);
  font-size: 15px;
  margin: 0 0 20px;
  max-width: 68ch;
}
.viz-root .card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 20px 12px;
}
.viz-root .toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 4px;
}
.viz-root button.toggle {
  font: inherit;
  font-size: 0.82rem;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}
.viz-root button.toggle:hover { color: var(--text-primary); border-color: var(--baseline); }
.viz-root button.toggle[aria-pressed="true"] { color: var(--text-primary); border-color: var(--baseline); background: var(--page-plane); }

.viz-root svg { display: block; width: 100%; height: auto; overflow: visible; }
.viz-root .gridline { stroke: var(--gridline); stroke-width: 1; }
.viz-root .baseline { stroke: var(--baseline); stroke-width: 1; }
.viz-root .axis-label { fill: var(--text-muted); font-size: 15px; }
.viz-root .line-path { fill: none; stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; transition: opacity 0.15s ease; }
.viz-root .line-path.dimmed { opacity: 0.15; }
.viz-root .line-path.highlighted { stroke-width: 3; }
.viz-root .end-dot { stroke: var(--surface-1); stroke-width: 2; transition: opacity 0.15s ease; }
.viz-root .end-dot.dimmed { opacity: 0.15; }
.viz-root .end-label { font-size: 16px; font-weight: 600; transition: opacity 0.15s ease; }
.viz-root .end-label.dimmed { opacity: 0.25; }
.viz-root .crosshair { stroke: var(--baseline); stroke-width: 1; pointer-events: none; }
.viz-root .hover-dot { stroke: var(--surface-1); stroke-width: 2; pointer-events: none; }

.viz-root .tooltip {
  position: absolute;
  pointer-events: none;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 0.82rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  min-width: 150px;
  opacity: 0;
  transition: opacity 0.08s ease;
}
.viz-root .tooltip.visible { opacity: 1; }
.viz-root .tooltip-date { color: var(--text-secondary); margin-bottom: 4px; font-size: 0.78rem; }
.viz-root .tooltip-row { display: flex; align-items: center; gap: 6px; justify-content: space-between; }
.viz-root .tooltip-row + .tooltip-row { margin-top: 2px; }
.viz-root .tooltip-row.highlighted { font-weight: 700; }
.viz-root .tooltip-key { display: inline-block; width: 10px; height: 2px; border-radius: 1px; }
.viz-root .tooltip-name { color: var(--text-secondary); flex: 1; margin-left: 4px; }
.viz-root .tooltip-value { font-weight: 600; font-variant-numeric: tabular-nums; }

.viz-root table.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  margin-top: 8px;
}
.viz-root table.data-table th, .viz-root table.data-table td {
  text-align: right;
  padding: 5px 8px;
  border-bottom: 1px solid var(--gridline);
  font-variant-numeric: tabular-nums;
}
.viz-root table.data-table th:first-child, .viz-root table.data-table td:first-child { text-align: left; }
.viz-root table.data-table thead th { color: var(--text-secondary); font-weight: 600; border-bottom: 1px solid var(--baseline); position: sticky; top: 0; background: var(--surface-1); }

.viz-root .notes {
  margin-top: 18px;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}
.viz-root .notes summary { cursor: pointer; color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 6px; }
.viz-root .notes ul { margin: 6px 0 0; padding-left: 18px; }
</style>

<div class="viz-root">
  <h3>Inflation-Linked Bonds as a Share of Sovereign Debt Outstanding</h3>
  <p class="subtitle">Percent of total central-government marketable debt composed of inflation-linked bonds (TIPS, OATi/OAT&euro;i, inflation-linked Bunds, Real Return Bonds), by country, from official public sources.</p>

  <div class="card">
    <div class="toolbar">
      <button class="toggle" id="table-toggle" aria-pressed="false">View as table</button>
    </div>
    <div id="chart-wrap" style="position:relative;">
      <svg id="chart" viewBox="0 0 900 600" role="img" aria-label="Line chart of percent of sovereign debt in inflation-linked bonds by country over time"></svg>
      <div class="tooltip" id="tooltip"></div>
    </div>
    <div id="table-wrap" style="display:none; max-height:520px; overflow-y:auto;"></div>
  </div>

  <details class="notes">
    <summary>Sources &amp; methodology notes</summary>
    <ul id="notes-list"></ul>
  </details>
</div>

<script>
const DATA = {"US": {"name": "United States", "slot": "--series-1", "points": [{"date": "1996-12-31", "pct": 0.0, "total": 5323171750783.19, "linked": 0.0, "currency": "USD"}, {"date": "1997-12-31", "pct": 0.6004483857861134, "total": 5502388012375.95, "linked": 33039000000.0, "currency": "USD"}, {"date": "1998-12-31", "pct": 1.204745020447977, "total": 5614217021195.87, "linked": 67637000000.0, "currency": "USD"}, {"date": "1999-12-31", "pct": 1.7440860007164014, "total": 5776091314225.33, "linked": 100740000000.0, "currency": "USD"}, {"date": "2000-12-31", "pct": 2.1407696157612297, "total": 5662216013697.37, "linked": 121215000000.0, "currency": "USD"}, {"date": "2001-12-31", "pct": 2.3566161491374715, "total": 5943438563436.13, "linked": 140064033000.0, "currency": "USD"}, {"date": "2002-12-31", "pct": 2.2924889247482123, "total": 6405707456847.53, "linked": 146850134000.0, "currency": "USD"}, {"date": "2003-12-31", "pct": 2.5177754952796567, "total": 6997964247818.28, "linked": 176193029000.0, "currency": "USD"}, {"date": "2004-12-31", "pct": 3.2377079051425075, "total": 7596142802424.14, "linked": 245940916000.0, "currency": "USD"}, {"date": "2005-12-31", "pct": 4.022774814675126, "total": 8170424541313.62, "linked": 328677780700.0, "currency": "USD"}, {"date": "2006-12-31", "pct": 4.737122500478928, "total": 8680224380086.18, "linked": 411192862201.12, "currency": "USD"}, {"date": "2007-12-31", "pct": 5.1108169741365606, "total": 9229172659218.31, "linked": 471686122839.7, "currency": "USD"}, {"date": "2008-12-31", "pct": 4.954577519419998, "total": 10699804864612.13, "linked": 530130126443.88, "currency": "USD"}, {"date": "2009-12-31", "pct": 4.61407830938246, "total": 12311349677512.03, "linked": 568055315062.3099, "currency": "USD"}, {"date": "2010-12-31", "pct": 4.392841959702296, "total": 14025215218708.52, "linked": 616105539065.98, "currency": "USD"}, {"date": "2011-12-31", "pct": 4.852909003378782, "total": 15222940045451.09, "linked": 738755428044.65, "currency": "USD"}, {"date": "2012-12-31", "pct": 5.17165186402887, "total": 16432730050569.12, "linked": 849843589971.09, "currency": "USD"}, {"date": "2013-12-31", "pct": 5.605103084714733, "total": 17351970784950.15, "linked": 972595849726.04, "currency": "USD"}, {"date": "2014-12-31", "pct": 5.939738918739566, "total": 18141444135563.3, "linked": 1077554417741.4501, "currency": "USD"}, {"date": "2015-12-31", "pct": 6.1722477041993375, "total": 18922179009420.89, "linked": 1167923759493.47, "currency": "USD"}, {"date": "2016-12-31", "pct": 6.24324737382742, "total": 19976826951047.8, "linked": 1247202723995.34, "currency": "USD"}, {"date": "2017-12-31", "pct": 6.478039531161139, "total": 20492746546193.75, "linked": 1327528222283.09, "currency": "USD"}, {"date": "2018-12-31", "pct": 6.4284381224159235, "total": 21974095705790.55, "linked": 1412591145407.2002, "currency": "USD"}, {"date": "2019-12-31", "pct": 6.496875725473244, "total": 23201380134806.73, "linked": 1507364833953.03, "currency": "USD"}, {"date": "2020-12-31", "pct": 5.691515072563584, "total": 27747797947667.77, "linked": 1579270102496.0, "currency": "USD"}, {"date": "2021-12-31", "pct": 5.836454473744963, "total": 29617214856051.75, "linked": 1728595261464.6902, "currency": "USD"}, {"date": "2022-12-31", "pct": 6.072854408027186, "total": 31419689421557.9, "linked": 1908071994025.53, "currency": "USD"}, {"date": "2023-12-31", "pct": 5.900399919335998, "total": 34001493655565.48, "linked": 2006224104226.02, "currency": "USD"}, {"date": "2024-12-31", "pct": 5.737564169827004, "total": 36218605311689.91, "linked": 2078065721174.58, "currency": "USD"}, {"date": "2025-12-31", "pct": 5.540533987604988, "total": 38514009184232.72, "linked": 2133881768841.7202, "currency": "USD"}]}, "UK": {"name": "United Kingdom", "slot": "--series-5", "points": [{"date": "1985-03-31", "pct": 8.376621082017033, "total": 120057000000.0, "linked": 10056719972.43719, "currency": "GBP"}, {"date": "1986-03-31", "pct": 9.10718538776784, "total": 130073000000.0, "linked": 11845989249.431263, "currency": "GBP"}, {"date": "1987-03-31", "pct": 11.326016907089791, "total": 136519000000.0, "linked": 15462165021.389912, "currency": "GBP"}, {"date": "1988-03-31", "pct": 11.259744795963108, "total": 144103000000.0, "linked": 16225630043.32672, "currency": "GBP"}, {"date": "1989-03-31", "pct": 13.697027223854215, "total": 139475000000.0, "linked": 19103928720.47067, "currency": "GBP"}, {"date": "1990-12-31", "pct": 20.5, "total": 115000000000.0, "linked": 23575000000.0, "currency": "GBP"}, {"date": "1991-12-31", "pct": 20.0, "total": 122400000000.0, "linked": 24480000000.0, "currency": "GBP"}, {"date": "1992-12-31", "pct": 14.5, "total": 148500000000.0, "linked": 21532500000.0, "currency": "GBP"}, {"date": "1993-12-31", "pct": 14.8, "total": 224100000000.0, "linked": 33166800000.000004, "currency": "GBP"}, {"date": "1994-12-31", "pct": 17.2, "total": 227900000000.0, "linked": 39198800000.0, "currency": "GBP"}, {"date": "1995-12-31", "pct": 17.9, "total": 252700000000.0, "linked": 45233300000.0, "currency": "GBP"}, {"date": "1996-12-31", "pct": 17.8, "total": 285400000000.0, "linked": 50801200000.0, "currency": "GBP"}, {"date": "1997-12-31", "pct": 19.6, "total": 295300000000.0, "linked": 57878800000.0, "currency": "GBP"}, {"date": "1998-03-31", "pct": 19.81163807601749, "total": 297300000000.0, "linked": 58900000000.0, "currency": "GBP"}, {"date": "1999-03-31", "pct": 21.42543724332737, "total": 291714000000.0, "linked": 62501000000.0, "currency": "GBP"}, {"date": "2000-03-31", "pct": 22.757106325567626, "total": 290551000000.0, "linked": 66121000000.0, "currency": "GBP"}, {"date": "2001-03-31", "pct": 25.349543641499523, "total": 281796000000.0, "linked": 71434000000.0, "currency": "GBP"}, {"date": "2002-03-31", "pct": 25.617198683979204, "total": 278719000000.0, "linked": 71400000000.0, "currency": "GBP"}, {"date": "2003-03-31", "pct": 26.67999043421817, "total": 292710000000.0, "linked": 78095000000.0, "currency": "GBP"}, {"date": "2004-03-31", "pct": 25.08964258232943, "total": 320997000000.0, "linked": 80537000000.0, "currency": "GBP"}, {"date": "2005-03-31", "pct": 24.828505615228195, "total": 355551000000.0, "linked": 88278000000.0, "currency": "GBP"}, {"date": "2006-03-31", "pct": 25.830356925917826, "total": 411570000000.0, "linked": 106310000000.0, "currency": "GBP"}, {"date": "2007-03-31", "pct": 27.24337262340243, "total": 442860000000.0, "linked": 120650000000.0, "currency": "GBP"}, {"date": "2008-03-31", "pct": 29.559078471917623, "total": 478770000000.0, "linked": 141520000000.0, "currency": "GBP"}, {"date": "2009-03-31", "pct": 23.834828939988782, "total": 713200000000.0, "linked": 169990000000.0, "currency": "GBP"}, {"date": "2010-03-31", "pct": 20.866585656890756, "total": 913470000000.0, "linked": 190610000000.0, "currency": "GBP"}, {"date": "2011-03-31", "pct": 22.620741730316848, "total": 1032990000000.0, "linked": 233670000000.0, "currency": "GBP"}, {"date": "2012-03-31", "pct": 22.83990926587847, "total": 1163840000000.0, "linked": 265820000000.0, "currency": "GBP"}, {"date": "2013-03-31", "pct": 23.758342723411634, "total": 1269070000000.0, "linked": 301510000000.0, "currency": "GBP"}, {"date": "2014-03-31", "pct": 23.880968777014257, "total": 1365020000000.0, "linked": 325980000000.0, "currency": "GBP"}, {"date": "2015-03-31", "pct": 25.06058865556225, "total": 1427660000000.0, "linked": 357780000000.0, "currency": "GBP"}, {"date": "2016-03-31", "pct": 26.434682697634337, "total": 1462170000000.0, "linked": 386520000000.0, "currency": "GBP"}, {"date": "2017-03-31", "pct": 24.530009747945968, "total": 1579820000000.0, "linked": 387530000000.0, "currency": "GBP"}, {"date": "2018-03-31", "pct": 24.97853175755404, "total": 1618670000000.0, "linked": 404320000000.0, "currency": "GBP"}, {"date": "2019-03-31", "pct": 26.09207342336121, "total": 1665410000000.0, "linked": 434540000000.0, "currency": "GBP"}, {"date": "2020-03-31", "pct": 26.955508411270806, "total": 1673350000000.0, "linked": 451060000000.0, "currency": "GBP"}, {"date": "2021-03-31", "pct": 22.713294965323787, "total": 1999930000000.0, "linked": 454250000000.0, "currency": "GBP"}, {"date": "2022-03-31", "pct": 23.08029979576183, "total": 2164139999999.9998, "linked": 499490000000.0, "currency": "GBP"}, {"date": "2023-03-31", "pct": 23.81506998890968, "total": 2335370000000.0, "linked": 556170000000.0, "currency": "GBP"}, {"date": "2024-03-31", "pct": 24.487602519155416, "total": 2521480000000.0, "linked": 617450000000.0, "currency": "GBP"}, {"date": "2025-03-31", "pct": 23.179708604743627, "total": 2691190000000.0, "linked": 623810000000.0, "currency": "GBP"}]}, "DE": {"name": "Germany", "slot": "--series-3", "points": [{"date": "2005-12-31", "pct": 0.0, "total": 879798442298.0, "linked": 0.0, "currency": "EUR"}, {"date": "2006-12-31", "pct": 0.9712212209466254, "total": 926668384699.0, "linked": 9000000000.0, "currency": "EUR"}, {"date": "2007-12-31", "pct": 1.5921827294932178, "total": 942102920861.0, "linked": 15000000000.0, "currency": "EUR"}, {"date": "2008-12-31", "pct": 2.3013383613807803, "total": 955965466408.0, "linked": 22000000000.0, "currency": "EUR"}, {"date": "2009-12-31", "pct": 2.5920761831528694, "total": 1041636051266.0, "linked": 27000000000.0, "currency": "EUR"}, {"date": "2010-12-31", "pct": 3.481325379461004, "total": 1091538303894.0, "linked": 38000000000.0, "currency": "EUR"}, {"date": "2011-12-31", "pct": 4.163663550346751, "total": 1104796279617.0, "linked": 46000000000.0, "currency": "EUR"}, {"date": "2012-12-31", "pct": 4.8888767478176085, "total": 1125002793833.0, "linked": 55000000000.0, "currency": "EUR"}, {"date": "2013-12-31", "pct": 4.7272261477921305, "total": 1142318947978.0, "linked": 54000000000.0, "currency": "EUR"}, {"date": "2014-12-31", "pct": 5.6720663332894965, "total": 1145966851948.0, "linked": 65000000000.0, "currency": "EUR"}, {"date": "2015-12-31", "pct": 6.7764989438856436, "total": 1136279967541.0, "linked": 77000000000.0, "currency": "EUR"}, {"date": "2016-12-31", "pct": 6.053098010534383, "total": 1131651922384.0, "linked": 68500000000.0, "currency": "EUR"}, {"date": "2017-12-31", "pct": 6.630364291015528, "total": 1131159566928.0, "linked": 75000000000.0, "currency": "EUR"}, {"date": "2018-12-31", "pct": 5.940819719535539, "total": 1119374145984.0, "linked": 66500000000.0, "currency": "EUR"}, {"date": "2019-12-31", "pct": 6.430185608590092, "total": 1130605000000.0, "linked": 72700000000.0, "currency": "EUR"}, {"date": "2020-12-31", "pct": 4.308374315993627, "total": 1443700000000.0, "linked": 62200000000.0, "currency": "EUR"}, {"date": "2021-12-31", "pct": 4.396502924712245, "total": 1589900000000.0, "linked": 69900000000.0, "currency": "EUR"}, {"date": "2022-12-31", "pct": 4.109351145573546, "total": 1877425346897.0, "linked": 77150000000.0, "currency": "EUR"}, {"date": "2023-12-31", "pct": 3.597122302158273, "total": 1841750000000.0, "linked": 66250000000.0, "currency": "EUR"}, {"date": "2024-12-31", "pct": 3.5201912858660998, "total": 1882000000000.0, "linked": 66250000000.0, "currency": "EUR"}, {"date": "2025-12-31", "pct": 3.362944162436548, "total": 1970000000000.0, "linked": 66250000000.0, "currency": "EUR"}]}, "FR": {"name": "France", "slot": "--series-2", "points": [{"date": "1997-12-31", "pct": 0.0, "total": 514820331210.73486, "linked": 0.0, "currency": "EUR"}, {"date": "1998-11-30", "pct": 0.7774440196613872, "total": 558268301123.3969, "linked": 4340223520.749074, "currency": "EUR"}, {"date": "1999-11-30", "pct": 0.5123554497689543, "total": 584300000000.0, "linked": 2993692893.0, "currency": "EUR"}, {"date": "2000-11-30", "pct": 2.0446347469015005, "total": 613200000000.0, "linked": 12537700268.0, "currency": "EUR"}, {"date": "2001-11-30", "pct": 2.9516672790273555, "total": 658000000000.0, "linked": 19421970696.0, "currency": "EUR"}, {"date": "2002-11-30", "pct": 4.674119963174603, "total": 630000000000.0, "linked": 29446955768.0, "currency": "EUR"}, {"date": "2003-11-30", "pct": 5.876566675378788, "total": 792000000000.0, "linked": 46542408069.0, "currency": "EUR"}, {"date": "2004-11-30", "pct": 8.423787173008323, "total": 841000000000.0, "linked": 70844050125.0, "currency": "EUR"}, {"date": "2005-10-31", "pct": 10.203576110277137, "total": 866000000000.0, "linked": 88362969115.0, "currency": "EUR"}, {"date": "2006-11-30", "pct": 11.843888789125561, "total": 892000000000.0, "linked": 105647487999.0, "currency": "EUR"}, {"date": "2007-11-30", "pct": 13.269092196459228, "total": 932000000000.0, "linked": 123667939271.0, "currency": "EUR"}, {"date": "2008-11-30", "pct": 14.055138346001975, "total": 1013000000000.0, "linked": 142378551445.0, "currency": "EUR"}, {"date": "2009-12-01", "pct": 12.877433067505237, "total": 1147985000000.0, "linked": 147831000000.0, "currency": "EUR"}, {"date": "2010-12-01", "pct": 12.972885446442591, "total": 1228971000000.0, "linked": 159433000000.0, "currency": "EUR"}, {"date": "2011-12-01", "pct": 12.636445338085881, "total": 1312980000000.0, "linked": 165914000000.0, "currency": "EUR"}, {"date": "2012-12-01", "pct": 12.482740013014428, "total": 1386154000000.0, "linked": 173030000000.0, "currency": "EUR"}, {"date": "2013-12-01", "pct": 11.917212226019407, "total": 1457220000000.0, "linked": 173660000000.0, "currency": "EUR"}, {"date": "2014-12-01", "pct": 12.389546218091311, "total": 1527562000000.0, "linked": 189258000000.0, "currency": "EUR"}, {"date": "2015-12-01", "pct": 12.077732920909531, "total": 1576372000000.0, "linked": 190390000000.0, "currency": "EUR"}, {"date": "2016-12-01", "pct": 12.312006007662609, "total": 1620597000000.0, "linked": 199528000000.0, "currency": "EUR"}, {"date": "2017-12-01", "pct": 11.96492285209998, "total": 1686112000000.0, "linked": 201742000000.0, "currency": "EUR"}, {"date": "2018-12-01", "pct": 12.50193577772717, "total": 1756400000000.0, "linked": 219584000000.0, "currency": "EUR"}, {"date": "2019-12-01", "pct": 12.420198540162003, "total": 1822805000000.0, "linked": 226396000000.0, "currency": "EUR"}, {"date": "2020-12-01", "pct": 10.997124457899844, "total": 2001014000000.0, "linked": 220054000000.0, "currency": "EUR"}, {"date": "2021-12-01", "pct": 11.018585897951677, "total": 2145121000000.0, "linked": 236362000000.0, "currency": "EUR"}, {"date": "2022-12-01", "pct": 11.512368673256912, "total": 2277811000000.0, "linked": 262230000000.0, "currency": "EUR"}, {"date": "2023-12-01", "pct": 11.16728457476688, "total": 2429973000000.0, "linked": 271362000000.0, "currency": "EUR"}, {"date": "2024-12-01", "pct": 11.110581530013603, "total": 2601637000000.0, "linked": 289057000000.0, "currency": "EUR"}, {"date": "2025-12-01", "pct": 11.202959309494451, "total": 2737125000000.0, "linked": 306639000000.0, "currency": "EUR"}]}, "CA": {"name": "Canada", "slot": "--series-4", "points": [{"date": "1991-03-31", "pct": 0.0, "total": 323900000000.0, "linked": 0.0, "currency": "CAD"}, {"date": "1992-03-31", "pct": 0.1989766913018761, "total": 351800000000.0, "linked": 700000000.0, "currency": "CAD"}, {"date": "1993-03-31", "pct": 0.3135615364515286, "total": 382700000000.0, "linked": 1200000000.0, "currency": "CAD"}, {"date": "1994-03-31", "pct": 0.6582125603864735, "total": 414000000000.0, "linked": 2725000000.0, "currency": "CAD"}, {"date": "1995-03-31", "pct": 1.0147392290249433, "total": 441000000000.0, "linked": 4475000000.0, "currency": "CAD"}, {"date": "1996-03-31", "pct": 1.2992545260915869, "total": 469500000000.0, "linked": 6100000000.0, "currency": "CAD"}, {"date": "1997-03-31", "pct": 1.6778523489932886, "total": 476800000000.0, "linked": 8000000000.0, "currency": "CAD"}, {"date": "1998-03-31", "pct": 2.120822622107969, "total": 466800000000.0, "linked": 9900000000.0, "currency": "CAD"}, {"date": "1999-03-31", "pct": 2.5562595586628793, "total": 457700000000.0, "linked": 11700000000.0, "currency": "CAD"}, {"date": "2000-03-31", "pct": 2.917217084984588, "total": 454200000000.0, "linked": 13250000000.0, "currency": "CAD"}, {"date": "2001-03-31", "pct": 3.3940211283434483, "total": 444900000000.0, "linked": 15100000000.0, "currency": "CAD"}, {"date": "2002-03-31", "pct": 3.8103878430483102, "total": 440900000000.0, "linked": 16800000000.0, "currency": "CAD"}, {"date": "2003-03-31", "pct": 4.354765161878705, "total": 438600000000.0, "linked": 19100000000.0, "currency": "CAD"}, {"date": "2004-03-31", "pct": 4.720439963336388, "total": 436400000000.0, "linked": 20600000000.0, "currency": "CAD"}, {"date": "2005-03-31", "pct": 5.188788510539727, "total": 431700000000.0, "linked": 22400000000.0, "currency": "CAD"}, {"date": "2006-03-31", "pct": 5.745318352059925, "total": 427200000000.0, "linked": 24544000000.0, "currency": "CAD"}, {"date": "2007-03-31", "pct": 6.32609214609692, "total": 418900000000.0, "linked": 26500000000.0, "currency": "CAD"}, {"date": "2008-03-31", "pct": 7.449378330373002, "total": 394100000000.0, "linked": 29358000000.0, "currency": "CAD"}, {"date": "2009-03-31", "pct": 6.226898981989037, "total": 510800000000.0, "linked": 31807000000.0, "currency": "CAD"}, {"date": "2010-03-31", "pct": 6.144806806097129, "total": 564200000000.0, "linked": 34669000000.0, "currency": "CAD"}, {"date": "2011-03-31", "pct": 6.321045576407506, "total": 596800000000.0, "linked": 37724000000.0, "currency": "CAD"}, {"date": "2012-03-31", "pct": 6.4893819334389855, "total": 631000000000.0, "linked": 40948000000.0, "currency": "CAD"}, {"date": "2013-03-31", "pct": 6.506736526946108, "total": 668000000000.0, "linked": 43465000000.0, "currency": "CAD"}, {"date": "2014-03-31", "pct": 7.148759056574688, "total": 648700000000.0, "linked": 46374000000.0, "currency": "CAD"}, {"date": "2015-03-31", "pct": 7.5522709776751356, "total": 649500000000.0, "linked": 49052000000.0, "currency": "CAD"}, {"date": "2016-03-31", "pct": 7.902642974466179, "total": 669700000000.0, "linked": 52924000000.0, "currency": "CAD"}, {"date": "2017-03-31", "pct": 8.014674147604662, "total": 695100000000.0, "linked": 55710000000.0, "currency": "CAD"}, {"date": "2018-03-31", "pct": 8.36092574187136, "total": 704300000000.0, "linked": 58886000000.0, "currency": "CAD"}, {"date": "2019-03-31", "pct": 8.599084731659964, "total": 721100000000.0, "linked": 62008000000.0, "currency": "CAD"}, {"date": "2020-03-31", "pct": 8.5446941975954, "total": 765200000000.0, "linked": 65384000000.0, "currency": "CAD"}, {"date": "2021-03-31", "pct": 6.085420796539917, "total": 1109800000000.0, "linked": 67536000000.0, "currency": "CAD"}, {"date": "2022-03-31", "pct": 5.094488188976378, "total": 1244600000000.0, "linked": 63406000000.0, "currency": "CAD"}, {"date": "2023-03-31", "pct": 5.39233272481943, "total": 1259900000000.0, "linked": 67938000000.0, "currency": "CAD"}, {"date": "2024-03-31", "pct": 4.952110212114586, "total": 1371900000000.0, "linked": 67938000000.0, "currency": "CAD"}, {"date": "2025-12-31", "pct": 4.675329433670404, "total": 1560893880000.0, "linked": 72976931000.0, "currency": "CAD"}]}, "IT": {"name": "Italy", "slot": "--series-6", "points": [{"date": "2002-12-31", "pct": 0.0, "total": 1142936000000.0, "linked": 0.0, "currency": "EUR"}, {"date": "2003-12-31", "pct": 0.8817329987140241, "total": 1157175700000.0, "linked": 10203200000.0, "currency": "EUR"}, {"date": "2004-12-31", "pct": 2.413218032658658, "total": 1184244010000.0, "linked": 28578390000.0, "currency": "EUR"}, {"date": "2005-12-31", "pct": 3.959816279466372, "total": 1213031530000.0, "linked": 48033820000.0, "currency": "EUR"}, {"date": "2006-12-31", "pct": 4.847708459722674, "total": 1256946050000.0, "linked": 60933080000.0, "currency": "EUR"}, {"date": "2007-12-31", "pct": 6.141078158084444, "total": 1288577640000.0, "linked": 79132560000.0, "currency": "EUR"}, {"date": "2008-12-31", "pct": 6.242351511532332, "total": 1356207510000.0, "linked": 84659240000.0, "currency": "EUR"}, {"date": "2009-12-31", "pct": 7.039265981988038, "total": 1446133450000.0, "linked": 101797180000.0, "currency": "EUR"}, {"date": "2010-12-31", "pct": 6.780249143760492, "total": 1526334030000.0, "linked": 103489250000.0, "currency": "EUR"}, {"date": "2011-12-31", "pct": 7.6326475710851565, "total": 1586740890000.0, "linked": 121110340000.0, "currency": "EUR"}, {"date": "2012-12-31", "pct": 9.088756140890643, "total": 1638724020000.0, "linked": 148939630000.0, "currency": "EUR"}, {"date": "2013-12-31", "pct": 7.7532434171321984, "total": 1722705490000.0, "linked": 133565549999.99998, "currency": "EUR"}, {"date": "2014-12-31", "pct": 7.313864753385656, "total": 1782232710000.0, "linked": 130350090000.0, "currency": "EUR"}, {"date": "2015-12-31", "pct": 7.936053785619035, "total": 1814444860000.0, "linked": 143995320000.0, "currency": "EUR"}, {"date": "2016-12-31", "pct": 7.89075514373733, "total": 1867214320000.0, "linked": 147337310000.0, "currency": "EUR"}, {"date": "2017-12-31", "pct": 7.702905899924565, "total": 1906389120000.0, "linked": 146847360000.0, "currency": "EUR"}, {"date": "2018-12-31", "pct": 7.919396567380091, "total": 1959428710000.0, "linked": 155174930000.0, "currency": "EUR"}, {"date": "2019-12-31", "pct": 7.567341638385851, "total": 2004765970000.0, "linked": 151707490000.0, "currency": "EUR"}, {"date": "2020-12-31", "pct": 7.604468060214881, "total": 2149584279999.9998, "linked": 163464450000.0, "currency": "EUR"}, {"date": "2021-12-31", "pct": 7.41373357323287, "total": 2236302780000.0, "linked": 165793530000.0, "currency": "EUR"}, {"date": "2022-12-31", "pct": 8.20468225229166, "total": 2289180790000.0, "linked": 187820010000.0, "currency": "EUR"}, {"date": "2023-12-31", "pct": 7.38189060656347, "total": 2394108900000.0, "linked": 176730500000.0, "currency": "EUR"}, {"date": "2024-12-31", "pct": 7.626903457380879, "total": 2505825740000.0, "linked": 191116910000.0, "currency": "EUR"}, {"date": "2025-12-31", "pct": 8.381726122186292, "total": 2628308260000.0, "linked": 220297600000.0, "currency": "EUR"}]}, "ES": {"name": "Spain", "slot": "--series-7", "points": [{"date": "2013-12-31", "pct": 0.0, "total": 711777000000.0, "linked": 0.0, "currency": "EUR"}, {"date": "2014-12-31", "pct": 1.614557270511779, "total": 769375000000.0, "linked": 12422000000.0, "currency": "EUR"}, {"date": "2015-12-31", "pct": 2.5190250198498303, "total": 827463000000.0, "linked": 20844000000.0, "currency": "EUR"}, {"date": "2016-12-31", "pct": 3.3190336158680736, "total": 867150000000.0, "linked": 28781000000.0, "currency": "EUR"}, {"date": "2017-12-31", "pct": 4.545978511462004, "total": 919560000000.0, "linked": 41803000000.0, "currency": "EUR"}, {"date": "2018-12-31", "pct": 5.741577310034419, "total": 966912000000.0, "linked": 55516000000.0, "currency": "EUR"}, {"date": "2019-12-31", "pct": 5.782527556623659, "total": 968279000000.0, "linked": 55991000000.0, "currency": "EUR"}, {"date": "2020-12-31", "pct": 5.602184514651358, "total": 1088022000000.0, "linked": 60953000000.0, "currency": "EUR"}, {"date": "2021-12-31", "pct": 5.565648324523527, "total": 1157044000000.0, "linked": 64397000000.0, "currency": "EUR"}, {"date": "2022-12-31", "pct": 6.310435217608805, "total": 1249375000000.0, "linked": 78841000000.0, "currency": "EUR"}, {"date": "2023-12-31", "pct": 6.36818402852215, "total": 1338749000000.0, "linked": 85254000000.0, "currency": "EUR"}, {"date": "2024-12-31", "pct": 5.834684070195055, "total": 1402321000000.0, "linked": 81821000000.0, "currency": "EUR"}, {"date": "2025-12-01", "pct": 6.235568176021493, "total": 1470275000000.0, "linked": 91680000000.0, "currency": "EUR"}]}, "SE": {"name": "Sweden", "slot": "--series-8", "points": [{"date": "1994-12-31", "pct": 0.0, "total": 1286597000000.0, "linked": 0.0, "currency": "SEK"}, {"date": "1995-12-31", "pct": 1.175545479794974, "total": 1386165000000.0, "linked": 16295000000.0, "currency": "SEK"}, {"date": "1996-12-31", "pct": 5.234790705452762, "total": 1411193000000.0, "linked": 73873000000.0, "currency": "SEK"}, {"date": "1997-12-31", "pct": 6.339328359668062, "total": 1432076000000.0, "linked": 90784000000.0, "currency": "SEK"}, {"date": "1998-12-31", "pct": 6.465639513575855, "total": 1448859000000.0, "linked": 93678000000.0, "currency": "SEK"}, {"date": "1999-12-31", "pct": 7.022442474784962, "total": 1374180000000.0, "linked": 96501000000.0, "currency": "SEK"}, {"date": "2000-12-31", "pct": 7.924296731172877, "total": 1279205000000.0, "linked": 101368000000.0, "currency": "SEK"}, {"date": "2001-12-31", "pct": 9.61187995697241, "total": 1215964000000.0, "linked": 116877000000.0, "currency": "SEK"}, {"date": "2002-12-31", "pct": 13.127837852433752, "total": 1203595000000.0, "linked": 158006000000.0, "currency": "SEK"}, {"date": "2003-12-31", "pct": 13.866811165612267, "total": 1238302000000.0, "linked": 171713000000.0, "currency": "SEK"}, {"date": "2004-12-31", "pct": 14.875146312914552, "total": 1271248000000.0, "linked": 189100000000.0, "currency": "SEK"}, {"date": "2005-12-31", "pct": 15.614008014005886, "total": 1315447000000.0, "linked": 205394000000.0, "currency": "SEK"}, {"date": "2006-12-31", "pct": 16.846681254100755, "total": 1274156000000.0, "linked": 214653000000.0, "currency": "SEK"}, {"date": "2007-12-31", "pct": 18.398093829088456, "total": 1167996000000.0, "linked": 214889000000.0, "currency": "SEK"}, {"date": "2008-12-31", "pct": 18.40279792440855, "total": 1120259000000.0, "linked": 206159000000.0, "currency": "SEK"}, {"date": "2009-12-31", "pct": 16.727138190394907, "total": 1189265000000.0, "linked": 198930000000.0, "currency": "SEK"}, {"date": "2010-12-31", "pct": 17.873874271100874, "total": 1179347000000.0, "linked": 210795000000.0, "currency": "SEK"}, {"date": "2011-12-31", "pct": 18.66563778766683, "total": 1150767000000.0, "linked": 214798000000.0, "currency": "SEK"}, {"date": "2012-12-31", "pct": 16.772890465159904, "total": 1146165000000.0, "linked": 192245000000.0, "currency": "SEK"}, {"date": "2013-12-31", "pct": 15.452333114614442, "total": 1277134000000.0, "linked": 197347000000.0, "currency": "SEK"}, {"date": "2014-12-31", "pct": 14.548306332525543, "total": 1394341000000.0, "linked": 202853000000.0, "currency": "SEK"}, {"date": "2015-12-31", "pct": 13.046693971082401, "total": 1403436000000.0, "linked": 183102000000.0, "currency": "SEK"}, {"date": "2016-12-31", "pct": 14.828549076425887, "total": 1347266000000.0, "linked": 199780000000.0, "currency": "SEK"}, {"date": "2017-12-31", "pct": 15.037950128282654, "total": 1327927000000.0, "linked": 199693000000.0, "currency": "SEK"}, {"date": "2018-12-31", "pct": 16.778556991171058, "total": 1262099000000.0, "linked": 211762000000.0, "currency": "SEK"}, {"date": "2019-12-31", "pct": 17.291489185798657, "total": 1112796000000.0, "linked": 192419000000.0, "currency": "SEK"}, {"date": "2020-12-31", "pct": 13.92526663709239, "total": 1280392000000.0, "linked": 178298000000.0, "currency": "SEK"}, {"date": "2021-12-31", "pct": 17.163165914478956, "total": 1204265000000.0, "linked": 206690000000.0, "currency": "SEK"}, {"date": "2022-12-31", "pct": 19.42608210201663, "total": 1092665000000.0, "linked": 212262000000.0, "currency": "SEK"}, {"date": "2023-12-31", "pct": 23.038070769590096, "total": 1027560000000.0, "linked": 236730000000.0, "currency": "SEK"}, {"date": "2024-12-31", "pct": 21.813695260562245, "total": 1151318000000.0, "linked": 251145000000.0, "currency": "SEK"}, {"date": "2025-12-31", "pct": 17.118801039973373, "total": 1243878000000.0, "linked": 212937000000.0, "currency": "SEK"}]}, "AU": {"name": "Australia", "slot": "--series-9", "points": [{"date": "1985-06-30", "pct": 0.0, "total": 37985000000.0, "linked": 0.0, "currency": "AUD"}, {"date": "1986-06-30", "pct": 0.7281126264848219, "total": 45460000000.0, "linked": 331000000.0, "currency": "AUD"}, {"date": "1987-06-30", "pct": 1.2828554662997511, "total": 49421000000.0, "linked": 634000000.0, "currency": "AUD"}, {"date": "1988-06-30", "pct": 1.8541902040273808, "total": 45141000000.0, "linked": 837000000.0, "currency": "AUD"}, {"date": "1989-06-30", "pct": 2.1222583265637693, "total": 39392000000.0, "linked": 836000000.0, "currency": "AUD"}, {"date": "1990-06-30", "pct": 2.5627647167147503, "total": 32582000000.0, "linked": 835000000.0, "currency": "AUD"}, {"date": "1991-06-30", "pct": 2.4544385655496765, "total": 34020000000.0, "linked": 835000000.0, "currency": "AUD"}, {"date": "1992-06-30", "pct": 1.7896995708154506, "total": 46600000000.0, "linked": 834000000.0, "currency": "AUD"}, {"date": "1993-06-30", "pct": 2.388734091422547, "total": 66395000000.0, "linked": 1586000000.0, "currency": "AUD"}, {"date": "1994-06-30", "pct": 3.2879999020699957, "total": 81691000000.0, "linked": 2686000000.0, "currency": "AUD"}, {"date": "1995-06-30", "pct": 3.293935283859717, "total": 98059000000.0, "linked": 3230000000.0, "currency": "AUD"}, {"date": "1996-06-30", "pct": 3.5611164581328203, "total": 103900000000.0, "linked": 3700000000.0, "currency": "AUD"}, {"date": "1997-06-30", "pct": 4.2412818096135725, "total": 106100000000.0, "linked": 4500000000.0, "currency": "AUD"}, {"date": "1998-06-30", "pct": 5.739514348785872, "total": 90600000000.0, "linked": 5200000000.0, "currency": "AUD"}, {"date": "1999-06-30", "pct": 6.7551266586248495, "total": 82900000000.0, "linked": 5600000000.0, "currency": "AUD"}, {"date": "2000-06-30", "pct": 7.994579945799458, "total": 73800000000.0, "linked": 5900000000.0, "currency": "AUD"}, {"date": "2001-06-30", "pct": 9.494640122511486, "total": 65300000000.0, "linked": 6200000000.0, "currency": "AUD"}, {"date": "2002-06-30", "pct": 10.305958132045088, "total": 62100000000.0, "linked": 6400000000.0, "currency": "AUD"}, {"date": "2003-12-31", "pct": 12.603029797642085, "total": 51985856617.0, "linked": 6551793000.0, "currency": "AUD"}, {"date": "2004-12-31", "pct": 12.664382590732767, "total": 51734010348.0, "linked": 6551793000.0, "currency": "AUD"}, {"date": "2005-12-31", "pct": 11.45205907451459, "total": 52566966000.0, "linked": 6020000000.0, "currency": "AUD"}, {"date": "2006-12-31", "pct": 11.776801903021635, "total": 51117443000.0, "linked": 6020000000.0, "currency": "AUD"}, {"date": "2007-12-31", "pct": 11.145023207474363, "total": 54015141000.0, "linked": 6020000000.0, "currency": "AUD"}, {"date": "2008-12-31", "pct": 10.411237661645705, "total": 57822136000.0, "linked": 6020000000.0, "currency": "AUD"}, {"date": "2009-12-31", "pct": 8.196433508272143, "total": 117310352000.0, "linked": 9615265000.0, "currency": "AUD"}, {"date": "2010-12-31", "pct": 7.317174189373789, "total": 174780587000.0, "linked": 12789000000.0, "currency": "AUD"}, {"date": "2011-12-31", "pct": 6.5488743716478375, "total": 223381900000.0, "linked": 14629000000.0, "currency": "AUD"}, {"date": "2012-12-31", "pct": 6.539787879980243, "total": 261766900000.0, "linked": 17119000000.0, "currency": "AUD"}, {"date": "2013-12-31", "pct": 7.305589691461978, "total": 296608500000.0, "linked": 21669000000.0, "currency": "AUD"}, {"date": "2014-12-31", "pct": 7.348283000768707, "total": 350164222000.0, "linked": 25731058000.0, "currency": "AUD"}, {"date": "2015-12-31", "pct": 7.26904388036434, "total": 398666585000.0, "linked": 28979249000.0, "currency": "AUD"}, {"date": "2016-12-31", "pct": 6.783802894562187, "total": 464769562000.0, "linked": 31529051000.0, "currency": "AUD"}, {"date": "2017-12-31", "pct": 6.750021118533146, "total": 516986664000.0, "linked": 34896709000.0, "currency": "AUD"}, {"date": "2018-12-31", "pct": 6.771473818223528, "total": 538525910000.0, "linked": 36466141000.0, "currency": "AUD"}, {"date": "2019-12-31", "pct": 6.7166481070700295, "total": 561839617000.0, "linked": 37736790000.0, "currency": "AUD"}, {"date": "2020-12-31", "pct": 4.654704056392601, "total": 807259657000.0, "linked": 37575548000.0, "currency": "AUD"}, {"date": "2021-12-31", "pct": 4.8193402015904985, "total": 855017975000.0, "linked": 41206225000.0, "currency": "AUD"}, {"date": "2022-12-31", "pct": 4.288466477767139, "total": 891584374000.0, "linked": 38235297000.0, "currency": "AUD"}, {"date": "2023-12-31", "pct": 4.448243866022187, "total": 914634544000.0, "linked": 40685175000.0, "currency": "AUD"}, {"date": "2024-12-31", "pct": 4.44918236145099, "total": 914434197000.0, "linked": 40684845000.0, "currency": "AUD"}, {"date": "2025-11-30", "pct": 4.110908883497461, "total": 950941680000.0, "linked": 39092346000.0, "currency": "AUD"}]}, "JP": {"name": "Japan", "slot": "--series-10", "points": [{"date": "2003-03-31", "pct": 0.0, "total": 421099100000000.0, "linked": 0.0, "currency": "JPY"}, {"date": "2004-03-31", "pct": 0.021839336014159244, "total": 456973600000000.0, "linked": 99800000000.0, "currency": "JPY"}, {"date": "2005-03-31", "pct": 0.1802956512015602, "total": 499013700000000.0, "linked": 899700000000.0, "currency": "JPY"}, {"date": "2006-03-31", "pct": 0.5654473790436985, "total": 526927900000000.0, "linked": 2979500000000.0, "currency": "JPY"}, {"date": "2007-03-31", "pct": 1.0276818854187924, "total": 531701500000000.0, "linked": 5464200000000.0, "currency": "JPY"}, {"date": "2008-03-31", "pct": 1.541817432327211, "total": 541458400000000.0, "linked": 8348300000000.0, "currency": "JPY"}, {"date": "2009-03-31", "pct": 1.5469040670731127, "total": 545935600000000.0, "linked": 8445100000000.0, "currency": "JPY"}, {"date": "2010-03-31", "pct": 0.97777385690261, "total": 593971700000000.0, "linked": 5807700000000.0, "currency": "JPY"}, {"date": "2011-03-31", "pct": 0.6993270750797133, "total": 636311700000000.0, "linked": 4449900000000.0, "currency": "JPY"}, {"date": "2012-03-31", "pct": 0.5745614729124003, "total": 669867400000000.0, "linked": 3848800000000.0, "currency": "JPY"}, {"date": "2013-03-31", "pct": 0.49471835181257723, "total": 705007200000000.0, "linked": 3487800000000.0, "currency": "JPY"}, {"date": "2014-03-31", "pct": 0.49160630198169675, "total": 743867600000000.0, "linked": 3656900000000.0, "currency": "JPY"}, {"date": "2015-03-31", "pct": 0.6564153125161885, "total": 774083100000000.0, "linked": 5081200000000.0, "currency": "JPY"}, {"date": "2016-03-31", "pct": 0.8965032078987041, "total": 805418200000000.0, "linked": 7220600000000.0, "currency": "JPY"}, {"date": "2017-03-31", "pct": 1.0628321425694758, "total": 830573300000000.0, "linked": 8827600000000.0, "currency": "JPY"}, {"date": "2018-03-31", "pct": 1.0825982686632312, "total": 853178900000000.0, "linked": 9236500000000.0, "currency": "JPY"}, {"date": "2019-03-31", "pct": 1.1223126906512881, "total": 874043400000000.0, "linked": 9809500000000.0, "currency": "JPY"}, {"date": "2020-03-31", "pct": 1.2404046715074921, "total": 886694500000000.0, "linked": 10998600000000.0, "currency": "JPY"}, {"date": "2021-03-31", "pct": 1.1827325672045794, "total": 946646800000000.0, "linked": 11196300000000.0, "currency": "JPY"}, {"date": "2022-03-31", "pct": 1.1583993764039962, "total": 991411100000000.0, "linked": 11484500000000.0, "currency": "JPY"}, {"date": "2023-03-31", "pct": 1.187200083185887, "total": 1027097300000000.0, "linked": 12193700000000.0, "currency": "JPY"}, {"date": "2024-03-31", "pct": 1.2293141022002887, "total": 1053652600000000.0, "linked": 12952700000000.0, "currency": "JPY"}, {"date": "2025-03-31", "pct": 1.0583528690018582, "total": 1079734400000000.0, "linked": 11427400000000.0, "currency": "JPY"}]}, "DK": {"name": "Denmark", "slot": "--series-11", "points": [{"date": "2011-12-31", "pct": 0.0, "total": 645927000000.0, "linked": 0.0, "currency": "DKK"}, {"date": "2012-12-31", "pct": 1.5290835984923388, "total": 667524000000.0, "linked": 10207000000.0, "currency": "DKK"}, {"date": "2013-12-31", "pct": 3.5006127690839177, "total": 664198000000.0, "linked": 23251000000.0, "currency": "DKK"}, {"date": "2014-12-31", "pct": 5.088651466544455, "total": 698240000000.0, "linked": 35531000000.0, "currency": "DKK"}, {"date": "2015-12-31", "pct": 5.5193277831079195, "total": 646220000000.0, "linked": 35667000000.0, "currency": "DKK"}, {"date": "2016-12-31", "pct": 6.016597510373444, "total": 634794000000.0, "linked": 38193000000.0, "currency": "DKK"}, {"date": "2017-12-31", "pct": 6.055829546324401, "total": 640127000000.0, "linked": 38765000000.0, "currency": "DKK"}, {"date": "2018-12-31", "pct": 7.11220060692766, "total": 617207000000.0, "linked": 43897000000.0, "currency": "DKK"}, {"date": "2019-12-31", "pct": 7.34902515934031, "total": 611741000000.0, "linked": 44957000000.0, "currency": "DKK"}, {"date": "2020-12-31", "pct": 6.103125051752977, "total": 724596000000.0, "linked": 44223000000.0, "currency": "DKK"}, {"date": "2021-12-31", "pct": 6.755736457872088, "total": 704616000000.0, "linked": 47602000000.0, "currency": "DKK"}, {"date": "2022-12-31", "pct": 8.795643359701078, "total": 628925000000.0, "linked": 55318000000.0, "currency": "DKK"}, {"date": "2023-12-31", "pct": 5.901580598112123, "total": 597179000000.0, "linked": 35243000000.0, "currency": "DKK"}, {"date": "2024-12-31", "pct": 7.281753381407538, "total": 577718000000.0, "linked": 42068000000.0, "currency": "DKK"}, {"date": "2025-12-31", "pct": 8.668653663010122, "total": 567020000000.0, "linked": 49153000000.0, "currency": "DKK"}]}, "NZ": {"name": "New Zealand", "slot": "--series-12", "points": [{"date": "1994-06-30", "pct": 0.0, "total": 18900000000.0, "linked": 0.0, "currency": "NZD"}, {"date": "1997-11-30", "pct": 3.0, "total": 23333333333.333336, "linked": 700000000.0, "currency": "NZD"}, {"date": "2000-12-31", "pct": 5.822878822101673, "total": 26121100000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2001-12-31", "pct": 5.624771181645717, "total": 27041100000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2002-12-31", "pct": 5.318423564707487, "total": 28598700000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2003-12-31", "pct": 5.371711107187004, "total": 28315000000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2004-12-31", "pct": 5.41728402097105, "total": 28076800000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2005-12-31", "pct": 5.436647507935146, "total": 27976800000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2006-12-29", "pct": 6.04362856121111, "total": 25167000000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2007-12-31", "pct": 5.587597810513942, "total": 27221000000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2008-12-31", "pct": 5.647137447092894, "total": 26934000000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2009-12-31", "pct": 4.652229766929712, "total": 32694000000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2010-12-31", "pct": 3.2673841593091444, "total": 46551000000.0, "linked": 1521000000.0, "currency": "NZD"}, {"date": "2011-12-31", "pct": 2.5303387067560226, "total": 55210000000.0, "linked": 1397000000.0, "currency": "NZD"}, {"date": "2012-12-31", "pct": 5.787960698502595, "total": 69921000000.0, "linked": 4047000000.0, "currency": "NZD"}, {"date": "2013-12-31", "pct": 13.521705261667021, "total": 70605000000.0, "linked": 9547000000.0, "currency": "NZD"}, {"date": "2014-12-31", "pct": 17.415040444219013, "total": 74918000000.0, "linked": 13047000000.0, "currency": "NZD"}, {"date": "2015-12-31", "pct": 18.978850903594132, "total": 74093000000.0, "linked": 14062000000.0, "currency": "NZD"}, {"date": "2016-12-31", "pct": 17.914375798004013, "total": 76754000000.0, "linked": 13750000000.0, "currency": "NZD"}, {"date": "2017-12-29", "pct": 21.894182594796437, "total": 74449000000.0, "linked": 16300000000.0, "currency": "NZD"}, {"date": "2018-12-28", "pct": 21.570053370474913, "total": 81131000000.0, "linked": 17500000000.0, "currency": "NZD"}, {"date": "2019-12-31", "pct": 22.96571457256162, "total": 79684000000.0, "linked": 18300000000.0, "currency": "NZD"}, {"date": "2020-12-31", "pct": 14.885628102809022, "total": 127304000000.0, "linked": 18950000000.0, "currency": "NZD"}, {"date": "2021-12-21", "pct": 13.459365046748175, "total": 145995000000.0, "linked": 19650000000.0, "currency": "NZD"}, {"date": "2022-12-31", "pct": 12.732584770417322, "total": 161554000000.0, "linked": 20570000000.0, "currency": "NZD"}, {"date": "2023-12-31", "pct": 11.949700139915354, "total": 172247000000.0, "linked": 20583000000.0, "currency": "NZD"}, {"date": "2024-12-31", "pct": 10.218580062711121, "total": 198051000000.0, "linked": 20238000000.0, "currency": "NZD"}, {"date": "2025-12-31", "pct": 8.752142880122806, "total": 217581000000.0, "linked": 19043000000.0, "currency": "NZD"}]}, "MX": {"name": "Mexico", "slot": "--series-13", "points": [{"date": "1988-12-29", "pct": 0.0, "total": 73582.76, "linked": 0.0, "currency": "MXN"}, {"date": "1989-12-28", "pct": 3.0042931348897577, "total": 129814.23, "linked": 3900.0, "currency": "MXN"}, {"date": "1990-12-28", "pct": 7.472025104531522, "total": 166210.63, "linked": 12419.3, "currency": "MXN"}, {"date": "1991-12-30", "pct": 18.571670134106235, "total": 172389.45, "linked": 32015.6, "currency": "MXN"}, {"date": "1992-12-30", "pct": 22.030770930055617, "total": 135441.47, "linked": 29838.8, "currency": "MXN"}, {"date": "1993-12-30", "pct": 20.350153937079103, "total": 132044.21, "linked": 26871.2, "currency": "MXN"}, {"date": "1994-12-30", "pct": 12.663901633304494, "total": 193851.79, "linked": 24549.2, "currency": "MXN"}, {"date": "1995-12-29", "pct": 18.409847735495415, "total": 123773.43, "linked": 22786.5, "currency": "MXN"}, {"date": "1996-12-31", "pct": 11.54391063664899, "total": 152417.74, "linked": 17594.9677, "currency": "MXN"}, {"date": "1997-12-31", "pct": 15.498952135560595, "total": 272018.27, "linked": 42159.98146727999, "currency": "MXN"}, {"date": "1998-12-31", "pct": 19.632626533818673, "total": 347057.81, "linked": 68136.56369375, "currency": "MXN"}, {"date": "1999-12-30", "pct": 14.238582485951076, "total": 549154.17, "linked": 78191.76947049, "currency": "MXN"}, {"date": "2000-12-29", "pct": 11.916776628960388, "total": 718051.07, "linked": 85568.54209376, "currency": "MXN"}, {"date": "2001-12-31", "pct": 12.174712748361111, "total": 748497.31, "linked": 91127.39742171, "currency": "MXN"}, {"date": "2002-12-31", "pct": 10.92540567209622, "total": 848037.8, "linked": 92651.56990272, "currency": "MXN"}, {"date": "2003-12-31", "pct": 8.480849488994258, "total": 988770.69, "linked": 83856.15401018999, "currency": "MXN"}, {"date": "2004-12-31", "pct": 7.826634758883577, "total": 1080395.92, "linked": 84558.64260828, "currency": "MXN"}, {"date": "2005-12-30", "pct": 7.752894108559976, "total": 1229618.56, "linked": 95331.024896, "currency": "MXN"}, {"date": "2006-12-29", "pct": 9.152871889640148, "total": 1697028.72, "linked": 155326.864672, "currency": "MXN"}, {"date": "2007-12-31", "pct": 11.599900330153153, "total": 2028700.92, "linked": 235327.28471690003, "currency": "MXN"}, {"date": "2008-12-31", "pct": 14.511644451241217, "total": 2343464.1, "linked": 340075.17803447996, "currency": "MXN"}, {"date": "2009-12-31", "pct": 16.125300031105322, "total": 2691822.34, "linked": 434064.42862932, "currency": "MXN"}, {"date": "2010-12-31", "pct": 17.77156638016403, "total": 2992165.58, "linked": 531754.69225412, "currency": "MXN"}, {"date": "2011-12-30", "pct": 17.540097357869712, "total": 3694120.25, "linked": 647952.28836678, "currency": "MXN"}, {"date": "2012-12-31", "pct": 17.553386118664662, "total": 4300348.24, "linked": 754856.7310144, "currency": "MXN"}, {"date": "2013-12-31", "pct": 18.1036660706493, "total": 4964622.15, "linked": 898778.61570549, "currency": "MXN"}, {"date": "2014-12-31", "pct": 18.434665291685683, "total": 5577556.9, "linked": 1028203.94596832, "currency": "MXN"}, {"date": "2015-12-31", "pct": 20.461636952136715, "total": 5939827.26, "linked": 1215385.8895252498, "currency": "MXN"}, {"date": "2016-12-30", "pct": 21.132994198483036, "total": 5906749.08, "linked": 1248272.94039535, "currency": "MXN"}, {"date": "2017-12-29", "pct": 22.287345794335216, "total": 6397614.74, "linked": 1425858.51969316, "currency": "MXN"}, {"date": "2018-12-31", "pct": 24.686880672367803, "total": 6849143.84, "linked": 1690839.9668596298, "currency": "MXN"}, {"date": "2019-12-31", "pct": 23.254209734841442, "total": 7586148.21, "linked": 1764098.8155493198, "currency": "MXN"}, {"date": "2020-12-31", "pct": 21.623660502844906, "total": 8474063.77, "linked": 1832402.78041938, "currency": "MXN"}, {"date": "2021-12-31", "pct": 25.05979529619178, "total": 9038738.4, "linked": 2265089.34039828, "currency": "MXN"}, {"date": "2022-12-30", "pct": 26.847011028785445, "total": 9922268.01, "linked": 2663832.38695035, "currency": "MXN"}, {"date": "2023-12-29", "pct": 27.43333495963357, "total": 11273899.03, "linked": 3092806.48391078, "currency": "MXN"}, {"date": "2024-12-31", "pct": 28.25407452428203, "total": 13404927.8, "linked": 3787438.2905381997, "currency": "MXN"}, {"date": "2025-12-31", "pct": 28.329897820660438, "total": 15210747.57, "linked": 4309189.244339591, "currency": "MXN"}]}, "BR": {"name": "Brazil", "slot": "--series-14", "points": [{"date": "1985-12-31", "pct": 96.55962149259736, "total": 258489000000000.0, "linked": 249596000000000.0, "currency": "BRL"}, {"date": "1986-12-31", "pct": 41.39452534526292, "total": 359219000000.0, "linked": 148697000000.0, "currency": "BRL"}, {"date": "1987-12-31", "pct": 26.936610579806548, "total": 2292575000000.0, "linked": 617542000000.0, "currency": "BRL"}, {"date": "1988-12-31", "pct": 31.470521542705317, "total": 31527447000000.0, "linked": 9921852000000.0, "currency": "BRL"}, {"date": "1989-12-31", "pct": 2.0706939909966136, "total": 706623000000.0, "linked": 14632000000.0, "currency": "BRL"}, {"date": "1990-12-31", "pct": 4.674365664422783, "total": 2212236000000.0, "linked": 103408000000.0, "currency": "BRL"}, {"date": "1991-12-31", "pct": 4.199297656784138, "total": 12356352000000.0, "linked": 518880000000.0, "currency": "BRL"}, {"date": "1992-12-31", "pct": 0.13062365946526697, "total": 450928264000000.0, "linked": 589019000000.0, "currency": "BRL"}, {"date": "1993-12-31", "pct": 0.0995786753192744, "total": 13715788000000.0, "linked": 13658000000.0, "currency": "BRL"}, {"date": "1994-12-31", "pct": 0.0663612967968535, "total": 61783000000.0, "linked": 41000000.0, "currency": "BRL"}, {"date": "1995-12-31", "pct": 0.35304745400243354, "total": 108484000000.0, "linked": 383000000.0, "currency": "BRL"}, {"date": "1996-12-31", "pct": 0.02736833874183837, "total": 230193000000.0, "linked": 63000000.0, "currency": "BRL"}, {"date": "1997-12-31", "pct": 0.020528120103188018, "total": 292282000000.0, "linked": 60000000.0, "currency": "BRL"}, {"date": "1998-12-31", "pct": 0.017169546589832947, "total": 372753000000.0, "linked": 64000000.0, "currency": "BRL"}, {"date": "1999-12-31", "pct": 0.18271306520496214, "total": 491481000000.0, "linked": 898000000.0, "currency": "BRL"}, {"date": "2000-12-31", "pct": 1.3569674108513534, "total": 510697599999.99994, "linked": 6930000000.0, "currency": "BRL"}, {"date": "2001-12-31", "pct": 3.761991379037777, "total": 624084364754.8466, "linked": 23478000000.0, "currency": "BRL"}, {"date": "2002-12-31", "pct": 9.021958461979883, "total": 623190632465.6427, "linked": 56224000000.0, "currency": "BRL"}, {"date": "2003-12-31", "pct": 10.676261984486716, "total": 731426412291.7577, "linked": 78089000000.0, "currency": "BRL"}, {"date": "2004-12-31", "pct": 12.65068661196442, "total": 810264321171.7582, "linked": 102504000000.0, "currency": "BRL"}, {"date": "2005-12-31", "pct": 14.025340905693074, "total": 979662461853.0812, "linked": 137401000000.0, "currency": "BRL"}, {"date": "2006-12-31", "pct": 21.29647934121945, "total": 1093495296892.8872, "linked": 232876000000.0, "currency": "BRL"}, {"date": "2007-12-31", "pct": 25.185762903091035, "total": 1224870579410.3176, "linked": 308493000000.0, "currency": "BRL"}, {"date": "2008-12-31", "pct": 28.304744791520896, "total": 1264823274814.4956, "linked": 358005000000.0, "currency": "BRL"}, {"date": "2009-12-31", "pct": 27.745902542017326, "total": 1398415493647.8394, "linked": 388003000000.0, "currency": "BRL"}, {"date": "2010-12-31", "pct": 27.352830378375582, "total": 1603940045439.8413, "linked": 438723000000.0, "currency": "BRL"}, {"date": "2011-12-31", "pct": 28.93743430118502, "total": 1783060635679.3364, "linked": 515972000000.0, "currency": "BRL"}, {"date": "2012-12-31", "pct": 34.85270344670816, "total": 1916709276287.418, "linked": 668025000000.0, "currency": "BRL"}, {"date": "2013-12-31", "pct": 35.45381383086716, "total": 2028125954037.6306, "linked": 719048000000.0, "currency": "BRL"}, {"date": "2014-12-31", "pct": 35.98333153186432, "total": 2183611040306.8354, "linked": 785736000000.0, "currency": "BRL"}, {"date": "2015-12-31", "pct": 33.57280963502548, "total": 2650165445407.8423, "linked": 889735000000.0, "currency": "BRL"}, {"date": "2016-12-31", "pct": 32.37979840429249, "total": 2986414516625.924, "linked": 966995000000.0, "currency": "BRL"}, {"date": "2017-12-31", "pct": 29.797480732401766, "total": 3435485063966.64, "linked": 1023688000000.0, "currency": "BRL"}, {"date": "2018-12-31", "pct": 27.9612745769054, "total": 3728857199024.6997, "linked": 1042636000000.0, "currency": "BRL"}, {"date": "2019-12-31", "pct": 26.671855045722953, "total": 4083229299698.229, "linked": 1089073000000.0, "currency": "BRL"}, {"date": "2020-12-31", "pct": 26.300954139563, "total": 4766161688842.929, "linked": 1253546000000.0, "currency": "BRL"}, {"date": "2021-12-31", "pct": 30.499953350604024, "total": 5348936049988.061, "linked": 1631423000000.0, "currency": "BRL"}, {"date": "2022-12-31", "pct": 31.421456064390647, "total": 5698975236317.48, "linked": 1790701000000.0, "currency": "BRL"}, {"date": "2023-12-31", "pct": 30.831178925471587, "total": 6268865049475.032, "linked": 1932765000000.0, "currency": "BRL"}, {"date": "2024-12-31", "pct": 28.190426348458956, "total": 6966879378563.789, "linked": 1963993000000.0, "currency": "BRL"}, {"date": "2025-12-31", "pct": 26.851335457719927, "total": 8309028068689.78, "linked": 2231085000000.0, "currency": "BRL"}]}, "CL": {"name": "Chile", "slot": "--series-15", "points": [{"date": "1986-12-31", "pct": 12.993825288305114, "total": 3280639000000.0, "linked": 426280500000.0, "currency": "CLP"}, {"date": "1987-12-31", "pct": 15.89462402209654, "total": 3928941000000.0, "linked": 624490400000.0, "currency": "CLP"}, {"date": "1988-12-31", "pct": 23.745533648502313, "total": 4192460000000.0, "linked": 995522000000.0, "currency": "CLP"}, {"date": "1989-12-31", "pct": 32.66469210180525, "total": 4121752000000.0, "linked": 1346357600000.0, "currency": "CLP"}, {"date": "1990-12-31", "pct": 43.073551210826, "total": 5567563000000.0, "linked": 2398147100000.0, "currency": "CLP"}, {"date": "1991-12-31", "pct": 46.315842431260265, "total": 8290583520528.479, "linked": 3839853600000.0, "currency": "CLP"}, {"date": "1992-12-31", "pct": 51.92477882094189, "total": 9329348357370.871, "linked": 4844243500000.0, "currency": "CLP"}, {"date": "1993-12-31", "pct": 55.535691199176554, "total": 10245373159386.13, "linked": 5689838800000.0, "currency": "CLP"}, {"date": "1994-12-31", "pct": 60.09432650800747, "total": 11482680980009.867, "linked": 6900439800000.001, "currency": "CLP"}, {"date": "1995-12-31", "pct": 69.08521635598399, "total": 11406112502269.756, "linked": 7879937500000.0, "currency": "CLP"}, {"date": "1996-12-31", "pct": 77.78949769444132, "total": 11636834364913.059, "linked": 9052235000000.0, "currency": "CLP"}, {"date": "1997-12-31", "pct": 78.86854735721668, "total": 12966889517668.06, "linked": 10226797400000.0, "currency": "CLP"}, {"date": "1998-12-31", "pct": 70.92916335089147, "total": 12510700649464.902, "linked": 8873735300000.0, "currency": "CLP"}, {"date": "1999-12-31", "pct": 65.78813278460491, "total": 13261260094680.15, "linked": 8724335400000.0, "currency": "CLP"}, {"date": "2000-12-31", "pct": 72.3118960930878, "total": 14680707288236.576, "linked": 10615897800000.0, "currency": "CLP"}, {"date": "2001-12-31", "pct": 50.875383235195606, "total": 15934076923850.875, "linked": 8106522700000.0, "currency": "CLP"}, {"date": "2002-12-31", "pct": 41.146761933153805, "total": 16856223921733.883, "linked": 6935790327995.162, "currency": "CLP"}, {"date": "2003-12-31", "pct": 37.228255059310335, "total": 17082983377190.47, "linked": 6359696623400.055, "currency": "CLP"}, {"date": "2004-12-31", "pct": 37.7838396800467, "total": 16727406970593.613, "linked": 6320256632398.047, "currency": "CLP"}, {"date": "2005-12-31", "pct": 39.03545887201171, "total": 16192873013452.537, "linked": 6320962285363.349, "currency": "CLP"}, {"date": "2006-12-31", "pct": 38.93469004444682, "total": 15131141387977.521, "linked": 5891262999596.057, "currency": "CLP"}, {"date": "2007-12-31", "pct": 49.86600668707209, "total": 12515101514934.715, "linked": 6240781358331.205, "currency": "CLP"}, {"date": "2008-12-31", "pct": 56.76600675195893, "total": 16963936188346.248, "linked": 9629749162074.635, "currency": "CLP"}, {"date": "2009-12-31", "pct": 47.59264263116858, "total": 20158124188652.13, "linked": 9593784006252.357, "currency": "CLP"}, {"date": "2010-12-31", "pct": 53.07670885132452, "total": 21445100674078.355, "linked": 11382353647654.0, "currency": "CLP"}, {"date": "2011-12-31", "pct": 52.8520132775973, "total": 32883877963604.555, "linked": 17379791547513.172, "currency": "CLP"}, {"date": "2012-12-31", "pct": 55.69442076865209, "total": 34165809352021.88, "linked": 19028449619530.55, "currency": "CLP"}, {"date": "2013-12-31", "pct": 55.352923003863985, "total": 35389397297766.79, "linked": 19589065837764.37, "currency": "CLP"}, {"date": "2014-12-31", "pct": 52.878693307360535, "total": 41130664659511.52, "linked": 21749358020582.023, "currency": "CLP"}, {"date": "2015-12-31", "pct": 50.20209137610225, "total": 47466877007205.94, "linked": 23829364968539.598, "currency": "CLP"}, {"date": "2016-12-31", "pct": 43.421977567832656, "total": 55466624604876.695, "linked": 24084705293563.51, "currency": "CLP"}, {"date": "2017-12-31", "pct": 41.50266862508033, "total": 60609397378502.8, "linked": 25154517349658.14, "currency": "CLP"}, {"date": "2018-12-31", "pct": 36.66213237363015, "total": 67816379997270.09, "linked": 24862931005603.203, "currency": "CLP"}, {"date": "2019-12-31", "pct": 33.52473736102015, "total": 75394435959808.92, "linked": 25275786640348.473, "currency": "CLP"}, {"date": "2020-12-31", "pct": 24.07515458989233, "total": 94686572773853.52, "linked": 22795938771176.133, "currency": "CLP"}, {"date": "2021-12-31", "pct": 18.79243863822192, "total": 136022038992667.97, "linked": 25561858212155.42, "currency": "CLP"}, {"date": "2022-12-31", "pct": 21.623130175011838, "total": 148761005888125.53, "linked": 32166785952846.406, "currency": "CLP"}, {"date": "2023-12-31", "pct": 20.64255227043909, "total": 169630144867034.8, "linked": 35015991320599.215, "currency": "CLP"}, {"date": "2024-12-31", "pct": 24.250124552882504, "total": 158435658275415.9, "linked": 38420844467967.65, "currency": "CLP"}, {"date": "2025-12-31", "pct": 24.651793985153034, "total": 171410009675468.0, "linked": 42255642455127.26, "currency": "CLP"}]}, "CO": {"name": "Colombia", "slot": "--series-16", "points": [{"date": "1998-12-31", "pct": 0.0, "total": 31059630000000.0, "linked": 0.0, "currency": "COP"}, {"date": "1999-12-23", "pct": 4.023094349608687, "total": 44741680000000.0, "linked": 1800000000000.0, "currency": "COP"}, {"date": "2001-12-31", "pct": 23.626549531092326, "total": 44235677489604.305, "linked": 10451364252495.62, "currency": "COP"}, {"date": "2002-12-31", "pct": 26.71337612711056, "total": 53401028388126.88, "linked": 14265217569065.42, "currency": "COP"}, {"date": "2003-12-31", "pct": 28.2729935444402, "total": 60949781787039.38, "linked": 17232327870000.033, "currency": "COP"}, {"date": "2004-12-31", "pct": 26.866643084576154, "total": 68632099428202.164, "linked": 18439141194826.508, "currency": "COP"}, {"date": "2005-12-31", "pct": 23.861531785325692, "total": 88455668277352.06, "linked": 21106877401922.617, "currency": "COP"}, {"date": "2006-12-31", "pct": 23.059882685474953, "total": 94398595822057.69, "linked": 21768205453302.164, "currency": "COP"}, {"date": "2007-12-31", "pct": 22.349498253904372, "total": 99061897676175.11, "linked": 22139837091421.293, "currency": "COP"}, {"date": "2008-12-31", "pct": 24.84707748935156, "total": 108713710018047.97, "linked": 27012179769733.33, "currency": "COP"}, {"date": "2009-12-31", "pct": 22.560829656859223, "total": 125639747226919.06, "linked": 28345369353173.72, "currency": "COP"}, {"date": "2010-12-31", "pct": 21.420246597997032, "total": 143534231097653.6, "linked": 30745386253656.344, "currency": "COP"}, {"date": "2011-12-01", "pct": 24.196966884003416, "total": 150713296316483.22, "linked": 36468046399489.38, "currency": "COP"}, {"date": "2012-12-31", "pct": 25.052879761577802, "total": 156770236883989.0, "linked": 39275458948486.46, "currency": "COP"}, {"date": "2013-12-31", "pct": 21.616836600490576, "total": 180640182340280.34, "linked": 39048693051326.63, "currency": "COP"}, {"date": "2014-12-31", "pct": 24.832693019479045, "total": 200098697555294.16, "linked": 49689895299882.016, "currency": "COP"}, {"date": "2015-12-31", "pct": 27.214465410576206, "total": 211609269764252.8, "linked": 57588331525565.48, "currency": "COP"}, {"date": "2016-12-31", "pct": 29.015959200692343, "total": 243015611755062.3, "linked": 70513310758161.78, "currency": "COP"}, {"date": "2017-12-31", "pct": 28.198491922351888, "total": 269333787823992.97, "linked": 75948066403713.03, "currency": "COP"}, {"date": "2018-12-31", "pct": 32.30456032459837, "total": 309935579365537.44, "linked": 100123326203533.5, "currency": "COP"}, {"date": "2019-12-31", "pct": 31.95635584889595, "total": 331298877003130.9, "linked": 105871048058516.61, "currency": "COP"}, {"date": "2020-12-31", "pct": 28.520859158005717, "total": 389845971685541.44, "linked": 111187420517592.12, "currency": "COP"}, {"date": "2021-12-31", "pct": 30.32209070734456, "total": 431911976938601.0, "linked": 130964741423207.72, "currency": "COP"}, {"date": "2022-12-31", "pct": 30.63581143194329, "total": 507274402142664.8, "linked": 155407629282944.47, "currency": "COP"}, {"date": "2023-12-31", "pct": 30.518404215432167, "total": 558650607417496.44, "linked": 170491250523638.62, "currency": "COP"}, {"date": "2024-12-31", "pct": 28.592201938920702, "total": 661813894799900.5, "linked": 189227165261023.78, "currency": "COP"}, {"date": "2025-12-31", "pct": 25.49800416216729, "total": 838545372036460.8, "linked": 213812333863517.97, "currency": "COP"}]}, "UY": {"name": "Uruguay", "slot": "--series-17", "points": [{"date": "2001-12-31", "pct": 0.0, "total": 149895200000.0, "linked": 0.0, "currency": "UYU"}, {"date": "2002-12-31", "pct": 1.7557305162447676, "total": 272623780000.00003, "linked": 4786538900.0, "currency": "UYU"}, {"date": "2004-12-31", "pct": 11.354243222722712, "total": 297434500000.0, "linked": 33771436558.289185, "currency": "UYU"}, {"date": "2007-12-31", "pct": 26.455823961042334, "total": 295560500000.0, "linked": 78192965578.37653, "currency": "UYU"}, {"date": "2009-12-31", "pct": 30.56999842683047, "total": 322098697000.0, "linked": 98465566605.74144, "currency": "UYU"}, {"date": "2012-12-31", "pct": 46.4672574109227, "total": 411084209000.0, "linked": 191019557571.68546, "currency": "UYU"}, {"date": "2015-12-31", "pct": 35.325745331081116, "total": 711156638000.0, "linked": 251221382844.95844, "currency": "UYU"}, {"date": "2016-12-31", "pct": 36.42216632001825, "total": 763535378085.1819, "linked": 278096125318.3651, "currency": "UYU"}, {"date": "2017-12-31", "pct": 34.00247565168222, "total": 824490890872.9818, "linked": 280347314419.42346, "currency": "UYU"}, {"date": "2018-12-31", "pct": 30.73953295285144, "total": 951699213471.8608, "linked": 292547893337.21063, "currency": "UYU"}, {"date": "2019-12-31", "pct": 28.10251403560561, "total": 1114024396301.2925, "linked": 313068862330.64136, "currency": "UYU"}, {"date": "2020-12-31", "pct": 31.310905282243816, "total": 1392101365179.2922, "linked": 435879539884.11127, "currency": "UYU"}, {"date": "2021-12-31", "pct": 29.987572377497617, "total": 1586430596643.7458, "linked": 475732023387.31055, "currency": "UYU"}, {"date": "2022-12-31", "pct": 31.92252156465422, "total": 1638850387808.874, "linked": 523162368460.7072, "currency": "UYU"}, {"date": "2023-12-31", "pct": 28.637569878601383, "total": 1764451681477.498, "linked": 505296083257.27563, "currency": "UYU"}, {"date": "2024-12-31", "pct": 26.82477710868666, "total": 2026766818600.683, "linked": 543675681602.45294, "currency": "UYU"}, {"date": "2025-12-31", "pct": 25.0414474490075, "total": 2101913390496.3237, "linked": 526349537104.7887, "currency": "UYU"}]}, "IL": {"name": "Israel", "slot": "--series-18", "points": [{"date": "1985-12-31", "pct": 79.2, "total": 6200000000.0, "linked": 4910400000.0, "currency": "ILS"}, {"date": "1986-12-31", "pct": 82.5, "total": 9400000000.0, "linked": 7755000000.0, "currency": "ILS"}, {"date": "1987-12-31", "pct": 89.1, "total": 16000000000.0, "linked": 14256000000.0, "currency": "ILS"}, {"date": "1988-12-31", "pct": 92.2, "total": 26100000000.0, "linked": 24064200000.0, "currency": "ILS"}, {"date": "1989-12-31", "pct": 93.1, "total": 41200000000.0, "linked": 38357200000.0, "currency": "ILS"}, {"date": "1990-12-31", "pct": 93.7, "total": 48700000000.0, "linked": 45631900000.0, "currency": "ILS"}, {"date": "1991-12-31", "pct": 92.8, "total": 67200000000.0, "linked": 62361600000.0, "currency": "ILS"}, {"date": "1992-12-31", "pct": 89.8, "total": 84700000000.0, "linked": 76060600000.0, "currency": "ILS"}, {"date": "1993-12-31", "pct": 87.5, "total": 95000000000.0, "linked": 83125000000.0, "currency": "ILS"}, {"date": "1994-12-31", "pct": 85.7, "total": 100200000000.0, "linked": 85871400000.0, "currency": "ILS"}, {"date": "1995-12-31", "pct": 82.2, "total": 115400000000.0, "linked": 94858800000.0, "currency": "ILS"}, {"date": "1996-12-31", "pct": 73.5, "total": 132400000000.0, "linked": 97314000000.0, "currency": "ILS"}, {"date": "1997-12-31", "pct": 72.1, "total": 125900000000.0, "linked": 90773900000.0, "currency": "ILS"}, {"date": "1998-12-31", "pct": 66.3, "total": 144400000000.0, "linked": 95737200000.0, "currency": "ILS"}, {"date": "1999-12-31", "pct": 63.5, "total": 146200000000.0, "linked": 92837000000.0, "currency": "ILS"}, {"date": "2000-12-31", "pct": 56.6, "total": 149400000000.0, "linked": 84560400000.0, "currency": "ILS"}, {"date": "2001-12-31", "pct": 52.8, "total": 180900000000.0, "linked": 95515200000.0, "currency": "ILS"}, {"date": "2002-12-31", "pct": 49.7, "total": 222300000000.0, "linked": 110483100000.0, "currency": "ILS"}, {"date": "2003-12-31", "pct": 46.8, "total": 231700000000.0, "linked": 108435600000.0, "currency": "ILS"}, {"date": "2004-12-31", "pct": 44.8, "total": 247000000000.0, "linked": 110656000000.0, "currency": "ILS"}, {"date": "2005-12-31", "pct": 41.9, "total": 253700000000.0, "linked": 106300300000.0, "currency": "ILS"}, {"date": "2006-12-31", "pct": 42.0, "total": 257800000000.0, "linked": 108276000000.0, "currency": "ILS"}, {"date": "2007-12-31", "pct": 41.0, "total": 267399999999.99997, "linked": 109633999999.99998, "currency": "ILS"}, {"date": "2008-12-31", "pct": 42.0, "total": 288300000000.0, "linked": 121086000000.0, "currency": "ILS"}, {"date": "2009-12-31", "pct": 43.0, "total": 342000000000.0, "linked": 147060000000.0, "currency": "ILS"}, {"date": "2010-12-31", "pct": 41.0, "total": 358500000000.0, "linked": 146985000000.0, "currency": "ILS"}, {"date": "2011-12-31", "pct": 41.0, "total": 378400000000.0, "linked": 155144000000.0, "currency": "ILS"}, {"date": "2013-12-31", "pct": 41.0, "total": 433100000000.0, "linked": 177571000000.0, "currency": "ILS"}, {"date": "2014-12-31", "pct": 41.0, "total": 429600000000.0, "linked": 176136000000.0, "currency": "ILS"}, {"date": "2015-12-31", "pct": 40.0, "total": 439000000000.0, "linked": 175600000000.0, "currency": "ILS"}, {"date": "2016-12-31", "pct": 41.0, "total": 444000000000.0, "linked": 182040000000.0, "currency": "ILS"}, {"date": "2019-12-31", "pct": 38.0, "total": 459000000000.0, "linked": 174420000000.0, "currency": "ILS"}, {"date": "2020-12-31", "pct": 36.0, "total": 551200000000.0, "linked": 198432000000.0, "currency": "ILS"}, {"date": "2021-12-31", "pct": 36.0, "total": 583600000000.0, "linked": 210096000000.0, "currency": "ILS"}, {"date": "2022-12-31", "pct": 38.0, "total": 550000000000.0, "linked": 209000000000.0, "currency": "ILS"}, {"date": "2023-12-31", "pct": 37.0, "total": 605900000000.0, "linked": 224183000000.0, "currency": "ILS"}, {"date": "2024-12-31", "pct": 36.0, "total": 779900000000.0, "linked": 280764000000.0, "currency": "ILS"}, {"date": "2025-12-31", "pct": 37.0, "total": 868100000000.0, "linked": 321197000000.0, "currency": "ILS"}]}, "ZA": {"name": "South Africa", "slot": "--series-19", "points": [{"date": "1999-03-31", "pct": 0.0, "total": 344943000000.0, "linked": 0.0, "currency": "ZAR"}, {"date": "2000-03-31", "pct": 0.14096181062626514, "total": 354706000000.0, "linked": 500000000.0, "currency": "ZAR"}, {"date": "2001-03-31", "pct": 0.9309176931859562, "total": 365231000000.0, "linked": 3400000000.0, "currency": "ZAR"}, {"date": "2002-03-31", "pct": 4.035316171314912, "total": 349415000000.0, "linked": 14100000000.0, "currency": "ZAR"}, {"date": "2003-03-31", "pct": 4.275087639296606, "total": 350870000000.0, "linked": 15000000000.0, "currency": "ZAR"}, {"date": "2004-03-31", "pct": 7.51995879474633, "total": 388300000000.0, "linked": 29200000000.0, "currency": "ZAR"}, {"date": "2005-03-31", "pct": 10.42947504975583, "total": 428593000000.0, "linked": 44700000000.0, "currency": "ZAR"}, {"date": "2006-03-31", "pct": 11.97081567565206, "total": 457780000000.0, "linked": 54800000000.0, "currency": "ZAR"}, {"date": "2007-03-31", "pct": 13.251714173349521, "total": 467864000000.0, "linked": 62000000000.0, "currency": "ZAR"}, {"date": "2008-03-31", "pct": 14.343512487846693, "total": 478265000000.0, "linked": 68599999999.99999, "currency": "ZAR"}, {"date": "2009-03-31", "pct": 15.897648701755184, "total": 527751000000.0, "linked": 83900000000.0, "currency": "ZAR"}, {"date": "2010-03-31", "pct": 18.614424465977287, "total": 700532000000.0, "linked": 130400000000.0, "currency": "ZAR"}, {"date": "2011-03-31", "pct": 19.646125156625896, "total": 869588000000.0, "linked": 170840346827.0, "currency": "ZAR"}, {"date": "2012-03-31", "pct": 21.13730688559089, "total": 1045415000000.0, "linked": 220972576778.0, "currency": "ZAR"}, {"date": "2013-03-31", "pct": 19.91202364651141, "total": 1210834000000.0, "linked": 241101552400.0, "currency": "ZAR"}, {"date": "2014-03-31", "pct": 21.186136010393568, "total": 1409718000000.0, "linked": 298664772843.0, "currency": "ZAR"}, {"date": "2015-03-31", "pct": 21.807932465084274, "total": 1601499000000.0, "linked": 349253820349.0, "currency": "ZAR"}, {"date": "2016-03-31", "pct": 22.568983517840767, "total": 1782042000000.0, "linked": 402188765261.0, "currency": "ZAR"}, {"date": "2017-03-31", "pct": 20.317020704350515, "total": 1981627000000.0, "linked": 402607567873.0, "currency": "ZAR"}, {"date": "2018-03-31", "pct": 19.8365001260871, "total": 2242894000000.0, "linked": 444911671138.0, "currency": "ZAR"}, {"date": "2019-03-31", "pct": 19.952729689580583, "total": 2467758000000.0, "linked": 492385083133.0, "currency": "ZAR"}, {"date": "2020-03-31", "pct": 19.58283471945977, "total": 2834638000000.0, "linked": 555102474435.0, "currency": "ZAR"}, {"date": "2021-03-31", "pct": 18.724907661380527, "total": 3526897000000.0, "linked": 660408206562.0, "currency": "ZAR"}, {"date": "2022-03-31", "pct": 18.100785845156636, "total": 3846429000000.0, "linked": 696233875976.0, "currency": "ZAR"}, {"date": "2023-03-31", "pct": 23.70706758223155, "total": 4185103000000.0, "linked": 992165196596.0, "currency": "ZAR"}, {"date": "2024-03-31", "pct": 22.145478397677007, "total": 4639876000000.0, "linked": 1027522737259.0, "currency": "ZAR"}, {"date": "2025-03-31", "pct": 21.296921184736398, "total": 5061531000000.0, "linked": 1077950267811.0, "currency": "ZAR"}]}, "PL": {"name": "Poland", "slot": "--series-20", "points": [{"date": "2003-12-31", "pct": 0.0, "total": 232564388299.999, "linked": 0.0, "currency": "PLN"}, {"date": "2004-12-31", "pct": 0.96747200921174, "total": 273500729200.0, "linked": 2646043000.0, "currency": "PLN"}, {"date": "2005-12-31", "pct": 1.5454162323126022, "total": 302780784694.99994, "linked": 4679223395.0, "currency": "PLN"}, {"date": "2006-12-31", "pct": 1.889033151935289, "total": 342845732853.6, "linked": 6476469553.6, "currency": "PLN"}, {"date": "2007-12-31", "pct": 2.194466544733737, "total": 373454617643.96, "linked": 8195336643.959999, "currency": "PLN"}, {"date": "2008-12-31", "pct": 2.6238956551942403, "total": 411218669913.2, "linked": 10789948813.199999, "currency": "PLN"}, {"date": "2009-12-31", "pct": 2.413745784792326, "total": 452956207977.00006, "linked": 10933211377.0, "currency": "PLN"}, {"date": "2010-12-31", "pct": 2.986805953787158, "total": 499258372906.76, "linked": 14911878806.76, "currency": "PLN"}, {"date": "2011-12-31", "pct": 4.075873653922029, "total": 507225198845.81006, "linked": 20673858245.809998, "currency": "PLN"}, {"date": "2012-12-31", "pct": 4.390729488665329, "total": 526109537296.77, "linked": 23100046596.77, "currency": "PLN"}, {"date": "2013-12-31", "pct": 5.312014928731702, "total": 565703779414.9199, "linked": 30050269214.920002, "currency": "PLN"}, {"date": "2014-12-31", "pct": 1.6107487662268591, "total": 482942764012.92, "linked": 7778994612.92, "currency": "PLN"}, {"date": "2015-12-31", "pct": 1.495397478408138, "total": 513385096791.95, "linked": 7677147791.95, "currency": "PLN"}, {"date": "2016-12-31", "pct": 0.7715585818140427, "total": 576701243939.04, "linked": 4449587939.04, "currency": "PLN"}, {"date": "2017-12-31", "pct": 0.7501502250829004, "total": 605711056856.3601, "linked": 4543742856.360001, "currency": "PLN"}, {"date": "2018-12-31", "pct": 0.7383824817766774, "total": 627157298626.2401, "linked": 4630819626.24, "currency": "PLN"}, {"date": "2019-12-31", "pct": 0.7356553099934952, "total": 646050358769.5199, "linked": 4752703769.5199995, "currency": "PLN"}, {"date": "2020-12-31", "pct": 0.6622525990689545, "total": 739444298082.72, "linked": 4896989082.72, "currency": "PLN"}, {"date": "2021-12-31", "pct": 0.690848526383159, "total": 756754685593.7601, "linked": 5228028593.759999, "currency": "PLN"}, {"date": "2022-12-31", "pct": 0.7924081018508855, "total": 778271793748.0801, "linked": 6167088748.08, "currency": "PLN"}, {"date": "2023-12-31", "pct": 0.0, "total": 862295802000.0001, "linked": 0.0, "currency": "PLN"}, {"date": "2024-12-31", "pct": 2.101212259646614, "total": 1022355586929.75, "linked": 21481860929.75, "currency": "PLN"}, {"date": "2025-12-31", "pct": 2.5611410711988336, "total": 1287996614284.08, "linked": 32987410284.079998, "currency": "PLN"}]}, "KR": {"name": "South Korea", "slot": "--series-21", "points": [{"date": "2009-12-31", "pct": 0.0, "total": 280899999999999.97, "linked": 0.0, "currency": "KRW"}, {"date": "2010-12-31", "pct": 0.41921960657852303, "total": 310100000000000.0, "linked": 1300000000000.0, "currency": "KRW"}, {"date": "2011-12-31", "pct": 0.7938841517200824, "total": 340100000000000.0, "linked": 2700000000000.0, "currency": "KRW"}, {"date": "2012-12-31", "pct": 1.7635712317442824, "total": 362900000000000.0, "linked": 6400000000000.0, "currency": "KRW"}, {"date": "2013-12-31", "pct": 1.854255053656102, "total": 400700000000000.0, "linked": 7430000000000.0, "currency": "KRW"}, {"date": "2014-12-31", "pct": 1.9233401779603008, "total": 438300000000000.0, "linked": 8429999999999.998, "currency": "KRW"}, {"date": "2015-12-31", "pct": 2.1500721500721496, "total": 485100000000000.0, "linked": 10429999999999.998, "currency": "KRW"}, {"date": "2016-12-31", "pct": 2.4821048558715413, "total": 516900000000000.0, "linked": 12829999999999.996, "currency": "KRW"}, {"date": "2017-12-31", "pct": 2.730931040790195, "total": 546700000000000.06, "linked": 14929999999999.998, "currency": "KRW"}, {"date": "2018-12-31", "pct": 2.7918871252204576, "total": 567000000000000.0, "linked": 15829999999999.994, "currency": "KRW"}, {"date": "2019-12-31", "pct": 2.8176614881439077, "total": 611500000000000.0, "linked": 17229999999999.996, "currency": "KRW"}, {"date": "2020-12-31", "pct": 1.944138690148596, "total": 726800000000000.0, "linked": 14129999999999.996, "currency": "KRW"}, {"date": "2021-12-31", "pct": 1.840701671210145, "total": 843700000000000.0, "linked": 15529999999999.992, "currency": "KRW"}, {"date": "2022-12-31", "pct": 1.3866666666666656, "total": 937500000000000.0, "linked": 12999999999999.99, "currency": "KRW"}, {"date": "2023-12-31", "pct": 1.4128256513026038, "total": 998000000000000.0, "linked": 14099999999999.986, "currency": "KRW"}, {"date": "2024-12-31", "pct": 1.1460223474357731, "total": 1047099999999999.9, "linked": 11999999999999.98, "currency": "KRW"}, {"date": "2025-12-31", "pct": 1.0781438675176798, "total": 1159400000000000.0, "linked": 12499999999999.979, "currency": "KRW"}]}, "TR": {"name": "Turkey", "slot": "--series-22", "points": [{"date": "2006-12-31", "pct": 0.0, "total": 251470054034.46698, "linked": 0.0, "currency": "TRY"}, {"date": "2007-12-31", "pct": 2.527387490040604, "total": 255309982914.2674, "linked": 6452672568.999998, "currency": "TRY"}, {"date": "2008-12-31", "pct": 3.1502051836290303, "total": 274827296351.4303, "linked": 8657623735.690275, "currency": "TRY"}, {"date": "2009-12-31", "pct": 8.978780306301514, "total": 330004579204.0152, "linked": 29630386167.463303, "currency": "TRY"}, {"date": "2010-12-31", "pct": 15.029648409019794, "total": 352841138463.61005, "linked": 53030782553.463295, "currency": "TRY"}, {"date": "2011-12-31", "pct": 17.436592461708756, "total": 368778427509.11993, "linked": 64302391491.463295, "currency": "TRY"}, {"date": "2012-12-31", "pct": 19.741449319894894, "total": 386541676203.57, "linked": 76308929108.0, "currency": "TRY"}, {"date": "2013-12-31", "pct": 23.88032153120678, "total": 403006953578.11, "linked": 96239356307.57391, "currency": "TRY"}, {"date": "2014-12-31", "pct": 24.328970509041476, "total": 414648522604.2899, "linked": 100879716780.57387, "currency": "TRY"}, {"date": "2015-12-31", "pct": 22.59585804977704, "total": 440124283273.15186, "linked": 99449858290.99998, "currency": "TRY"}, {"date": "2016-12-31", "pct": 22.792864641340994, "total": 468644329253.18994, "linked": 106817467616.0, "currency": "TRY"}, {"date": "2017-12-31", "pct": 22.32972956361524, "total": 535447617963.18994, "linked": 119564005046.0, "currency": "TRY"}, {"date": "2018-12-31", "pct": 23.096328096622585, "total": 586141921597.47, "linked": 135377261323.99997, "currency": "TRY"}, {"date": "2019-12-31", "pct": 22.82290299575507, "total": 755051843019.0999, "linked": 172324749699.91, "currency": "TRY"}, {"date": "2020-12-31", "pct": 23.661618643535114, "total": 1060353528687.6101, "linked": 250896808231.33002, "currency": "TRY"}, {"date": "2021-12-31", "pct": 22.074638659897975, "total": 1321189479076.6099, "linked": 291647803518.75, "currency": "TRY"}, {"date": "2022-12-31", "pct": 20.871026164423956, "total": 1905331206062.1697, "linked": 397662174536.17, "currency": "TRY"}, {"date": "2023-12-31", "pct": 14.314136199511776, "total": 3209251861284.22, "linked": 459376682409.58997, "currency": "TRY"}, {"date": "2024-12-31", "pct": 11.678800024527867, "total": 4959910326330.101, "linked": 579258008408.0, "currency": "TRY"}, {"date": "2025-12-31", "pct": 8.517066569108454, "total": 8152756542182.17, "linked": 694375701915.0, "currency": "TRY"}]}};
const COUNTRY_ORDER = ["US", "UK", "DE", "FR", "CA", "IT", "ES", "SE", "AU", "JP", "DK", "NZ", "MX", "BR", "CL", "CO", "UY", "IL", "ZA", "PL", "KR", "TR"];

const root = document.querySelector('.viz-root');
const svg = document.getElementById('chart');
const W = 900, H = 600;
const M = { top: 16, right: 54, bottom: 32, left: 42 };
const plotW = W - M.left - M.right;
const plotH = H - M.top - M.bottom;

// Every series is annual (see combine.py), but countries don't share a
// year-end convention (US/DE/FR: 31 Dec; UK/CA: 31 Mar) -- positioning by
// the exact date would scatter "the same year" across up to ~3 months of
// x-axis space per country, which is exactly why hover dots didn't line up
// with the crosshair (and why a country's own point never lined up with its
// own year's axis tick, which is always drawn at 1 Jan). Collapsing to just
// the year removes that entirely: every country's point for a given year
// shares one x-position.
function parseDate(s) { return Date.UTC(parseInt(s.slice(0, 4), 10), 0, 1); }

let minDate = Infinity, maxDate = -Infinity, minPct = 0, maxPct = 0;
for (const c of COUNTRY_ORDER) {
  for (const p of DATA[c].points) {
    const t = parseDate(p.date);
    if (t < minDate) minDate = t;
    if (t > maxDate) maxDate = t;
    if (p.pct > maxPct) maxPct = p.pct;
    if (p.pct < minPct) minPct = p.pct;
  }
}
// Fixed at the natural ceiling for a percentage, not derived from the
// observed data max (no headroom multiplier) -- pct_linked can never
// exceed 100 by construction, so 100 is always a true, honest axis top.
maxPct = 100;
minPct = Math.floor(minPct);

function xScale(t) { return M.left + ((t - minDate) / (maxDate - minDate)) * plotW; }
// Symlog-style scale: linear for v <= SYMLOG_THRESHOLD (so 0-5 and 5-10
// render as equal pixel lengths, and the 0% zero-anchor row plots exactly
// at 0 rather than at a clamped tiny floor like plain log/log1p would need),
// then log-compressed above it so the long upper tail still fits under a
// fixed 100% axis top. SYMLOG_STRENGTH is a free rate, decoupled from
// SYMLOG_THRESHOLD, tuned for how much of the chart's height the sub-10%
// cluster (DE/PL/KR/JP/CA/US/AU) gets vs. the 10-30%+ band above it
// (MX/BR/CO/UY/CL/UK/IL). Current: linear region extends all the way to 30
// (the threshold IS the pin point now), so 0-30% is purely proportional --
// 5->12.5%, 10->25%, 15->37.5%, 20->50%, 25->62.5%, 30->75% of height,
// exactly -- and 30-100% is log-compressed into the remaining 1/4.
const SYMLOG_THRESHOLD = 30;
const SYMLOG_STRENGTH = 8.305835;
function symlogTransform(v) {
  return v <= SYMLOG_THRESHOLD ? v : SYMLOG_THRESHOLD + SYMLOG_STRENGTH * Math.log(v / SYMLOG_THRESHOLD);
}
function yScale(v) { return M.top + plotH - (symlogTransform(v) - symlogTransform(minPct)) / (symlogTransform(maxPct) - symlogTransform(minPct)) * plotH; }

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

// gridlines + y axis
const yStep = maxPct <= 8 ? 2 : (maxPct <= 20 ? 4 : 5);
for (let v = 0; v <= maxPct; v += yStep) {
  // Back to thinning right above SYMLOG_THRESHOLD (10), not UPPER_THRESHOLD
  // (30), per explicit request -- even though 10-30% is its own linear
  // segment with room to spare, every-5% gridlines there (15/25) are
  // dropped too, keeping only every multiple of 10 above 10%.
  if (v > SYMLOG_THRESHOLD && v % 10 !== 0) continue;
  const y = yScale(v);
  svg.appendChild(svgEl('line', { class: 'gridline', x1: M.left, x2: W - M.right, y1: y, y2: y }));
  const label = svgEl('text', { class: 'axis-label', x: M.left - 8, y: y + 3, 'text-anchor': 'end' });
  label.textContent = v + '%';
  svg.appendChild(label);
}
svg.appendChild(svgEl('line', { class: 'baseline', x1: M.left, x2: W - M.right, y1: M.top + plotH, y2: M.top + plotH }));

// x axis: year ticks
const startYear = new Date(minDate).getUTCFullYear();
const endYear = new Date(maxDate).getUTCFullYear();
const span = endYear - startYear;
const yearStep = span > 20 ? 5 : (span > 10 ? 2 : 1);
for (let y = Math.ceil(startYear / yearStep) * yearStep; y <= endYear; y += yearStep) {
  const t = Date.UTC(y, 0, 1);
  if (t < minDate || t > maxDate) continue;
  const x = xScale(t);
  const label = svgEl('text', { class: 'axis-label', x: x, y: M.top + plotH + 20, 'text-anchor': 'middle' });
  label.textContent = y;
  svg.appendChild(label);
}

// nudge overlapping end-labels apart vertically
function declutterY(items, minGap, minY, maxY) {
  items.sort((a, b) => a.y - b.y);
  for (let i = 1; i < items.length; i++) {
    if (items[i].y < items[i - 1].y + minGap) items[i].y = items[i - 1].y + minGap;
  }
  items[items.length - 1].y = Math.min(items[items.length - 1].y, maxY);
  for (let i = items.length - 2; i >= 0; i--) {
    items[i].y = Math.min(items[i].y, items[i + 1].y - minGap);
  }
  if (items[0].y < minY) {
    items[0].y = minY;
    for (let i = 1; i < items.length; i++) {
      if (items[i].y < items[i - 1].y + minGap) items[i].y = items[i - 1].y + minGap;
    }
  }
}

const endItems = COUNTRY_ORDER.map(c => {
  const pts = DATA[c].points;
  const last = pts[pts.length - 1];
  return { c, x: xScale(parseDate(last.date)), y: yScale(last.pct), rawY: yScale(last.pct) };
});
declutterY(endItems, 18, M.top, M.top + plotH);
const endByCountry = Object.fromEntries(endItems.map(it => [it.c, it]));

// Hit-test rect for the crosshair/tooltip system below -- created here, BEFORE
// the lines/dots/labels loop, so it paints underneath all of them. Untouched
// transparent SVG canvas doesn't dispatch pointer events at all, so this rect
// exists purely to give the empty space between lines a hit-testable surface;
// painting it first (rather than last) means it only "wins" the hit-test in
// genuinely empty areas, letting each end-label/dot/line receive its own
// native pointer events where they visually overlap this rect's area. This
// doesn't affect the crosshair/tooltip logic below at all, since onMove is
// bound to svg itself and reads only clientX/clientY, never evt.target.
const hitRect = svgEl('rect', { x: M.left, y: M.top, width: plotW, height: plotH, fill: 'transparent' });
svg.appendChild(hitRect);

// Hover-to-highlight: hovering a line (via onMove's per-move nearest-line
// distance check below) or an end-label (via direct pointerenter/pointerleave
// on that label, since it's a small, easily-targetable element in its own
// right) dims every other country's line/dot/label so a single series can be
// traced through the crowded 22-series chart.
let highlightedCountry = null;
const lineEls = {};
function setHighlight(country) {
  if (country === highlightedCountry) return;
  highlightedCountry = country;
  for (const c of COUNTRY_ORDER) {
    const { path, dot, label } = lineEls[c];
    const dim = country !== null && c !== country;
    path.classList.toggle('dimmed', dim);
    path.classList.toggle('highlighted', country !== null && c === country);
    dot.classList.toggle('dimmed', dim);
    label.classList.toggle('dimmed', dim);
  }
}

// lines + end labels
for (const c of COUNTRY_ORDER) {
  const pts = DATA[c].points;
  const colorVar = `var(${DATA[c].slot})`;
  let d = '';
  pts.forEach((p, i) => {
    const x = xScale(parseDate(p.date));
    const y = yScale(p.pct);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
  });
  const path = svgEl('path', { class: 'line-path', d, stroke: colorVar, 'data-country': c });
  svg.appendChild(path);

  const e = endByCountry[c];
  const dot = svgEl('circle', { class: 'end-dot', cx: e.x, cy: e.rawY, r: 4, fill: colorVar, 'data-country': c });
  svg.appendChild(dot);
  const lbl = svgEl('text', { class: 'end-label', x: e.x + 8, y: e.y + 4, fill: colorVar, 'data-country': c });
  lbl.textContent = c;
  svg.appendChild(lbl);
  lbl.addEventListener('pointerenter', () => setHighlight(c));
  lbl.addEventListener('pointerleave', () => setHighlight(null));

  lineEls[c] = { path, dot, label: lbl };
}

// hover layer: crosshair + shared tooltip
const hoverLayer = svgEl('g', { style: 'display:none' });
const crosshair = svgEl('line', { class: 'crosshair', y1: M.top, y2: M.top + plotH });
hoverLayer.appendChild(crosshair);
const hoverDots = {};
for (const c of COUNTRY_ORDER) {
  const dot = svgEl('circle', { class: 'hover-dot', r: 4, fill: `var(${DATA[c].slot})` });
  hoverDots[c] = dot;
  hoverLayer.appendChild(dot);
}
svg.appendChild(hoverLayer);

const tooltip = document.getElementById('tooltip');
const wrap = document.getElementById('chart-wrap');

function nearestIndex(points, t) {
  let lo = 0, hi = points.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (parseDate(points[mid].date) < t) lo = mid + 1; else hi = mid;
  }
  if (lo > 0) {
    const prevDiff = Math.abs(parseDate(points[lo - 1].date) - t);
    const curDiff = Math.abs(parseDate(points[lo].date) - t);
    if (prevDiff < curDiff) return lo - 1;
  }
  return lo;
}

function fmtDate(d) {
  // Every series is annual (one point per calendar/fiscal year -- see
  // combine.py), so only the year is meaningful to show; the underlying
  // date string's month/day is just each country's own year-end convention
  // (31 Dec vs 31 Mar), not a real sub-annual observation.
  return d.slice(0, 4);
}

// Series don't all cover the same date range (e.g. Canada only has data from
// 1992 on) -- a "nearest point" lookup must not silently extrapolate a series
// into dates it has no coverage for. MAX_GAP_MS bounds how far the nearest
// point may be from the hovered date before that series is dropped from the
// readout. Every series is annual, so adjacent points are ~365 days apart;
// half that (with slack) ensures any hovered position finds its nearest
// year's point for every series covering that time, while still excluding a
// series whose data starts/ends far from the hovered date.
const MAX_GAP_MS = 200 * 24 * 3600 * 1000;

// How close (in plot pixels) the pointer's y must be to a series' y at the
// current x for that line to count as "hovered" -- matches the existing 4px
// end-dot radius as a "hoverable near a marker" precedent already used
// elsewhere in this chart. Deliberately NOT used on the horizontal
// (out-of-bounds) early-return below -- see the note there.
const LINE_HOVER_PX = 8;

function onMove(evt) {
  const rect = svg.getBoundingClientRect();
  const scaleX = W / rect.width;
  const scaleY = H / rect.height;
  const px = (evt.clientX - rect.left) * scaleX;
  const py = (evt.clientY - rect.top) * scaleY;
  // NOTE: deliberately does NOT call setHighlight(null) here. onMove fires on
  // every pointermove bubbled to svg, including moves over an end-label
  // sitting in the right/bottom margin (outside this x range) -- clearing
  // highlight here would race against and immediately stomp on that label's
  // own pointerenter, which fires for the same physical mouse-entry event.
  // The two mechanisms don't need to coordinate because their input domains
  // (inside vs. outside the plot rect) don't overlap.
  if (px < M.left || px > W - M.right) { hoverLayer.style.display = 'none'; tooltip.classList.remove('visible'); return; }
  const t = minDate + ((px - M.left) / plotW) * (maxDate - minDate);

  const rows = [];
  for (const c of COUNTRY_ORDER) {
    const pts = DATA[c].points;
    const idx = nearestIndex(pts, t);
    const p = pts[idx];
    const gap = Math.abs(parseDate(p.date) - t);
    if (gap > MAX_GAP_MS) { hoverDots[c].setAttribute('r', 0); continue; }
    hoverDots[c].setAttribute('r', 4);
    const x = xScale(parseDate(p.date));
    const y = yScale(p.pct);
    hoverDots[c].setAttribute('cx', x);
    hoverDots[c].setAttribute('cy', y);
    rows.push({ c, p, x, y, gap });
  }

  if (rows.length === 0) { hoverLayer.style.display = 'none'; tooltip.classList.remove('visible'); setHighlight(null); return; }
  hoverLayer.style.display = '';

  // Highlight whichever series' y is closest to the pointer's y at this x,
  // if it's within LINE_HOVER_PX -- otherwise clear any active highlight
  // (pointer is in the plot area but not meaningfully near any line).
  let nearest = null, nearestDy = Infinity;
  for (const row of rows) {
    const dy = Math.abs(row.y - py);
    if (dy < nearestDy) { nearest = row; nearestDy = dy; }
  }
  setHighlight(nearest && nearestDy <= LINE_HOVER_PX ? nearest.c : null);

  // Use the single closest point (across all in-range series) to place the
  // crosshair and label the date, but keep the tooltip rows themselves in
  // fixed legend order so they don't reshuffle as the reader hovers.
  const closest = rows.reduce((a, b) => (a.gap < b.gap ? a : b));
  const refX = closest.x;
  crosshair.setAttribute('x1', refX);
  crosshair.setAttribute('x2', refX);

  // Only show the tooltip when a single line is actually highlighted (same
  // condition passed to setHighlight above) -- otherwise it stays hidden so
  // the crosshair alone tracks the pointer without a stat readout.
  const hoveredRow = nearest && nearestDy <= LINE_HOVER_PX ? nearest : null;
  if (!hoveredRow) {
    tooltip.classList.remove('visible');
  } else {
    tooltip.innerHTML = '';
    const dateEl = document.createElement('div');
    dateEl.className = 'tooltip-date';
    dateEl.textContent = fmtDate(hoveredRow.p.date);
    tooltip.appendChild(dateEl);
    const row = document.createElement('div');
    row.className = 'tooltip-row highlighted';
    const key = document.createElement('span');
    key.className = 'tooltip-key';
    key.style.background = `var(${DATA[hoveredRow.c].slot})`;
    const name = document.createElement('span');
    name.className = 'tooltip-name';
    name.textContent = DATA[hoveredRow.c].name;
    const val = document.createElement('span');
    val.className = 'tooltip-value';
    val.textContent = hoveredRow.p.pct.toFixed(2) + '%';
    row.appendChild(key);
    row.appendChild(name);
    row.appendChild(val);
    tooltip.appendChild(row);
    tooltip.classList.add('visible');
    const wrapRect = wrap.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const relX = (refX / W) * svgRect.width;
    let left = relX + 16;
    if (left + 170 > wrapRect.width) left = relX - 170 - 16;
    tooltip.style.left = left + 'px';
    tooltip.style.top = '8px';
  }
}

svg.addEventListener('pointermove', onMove);
svg.addEventListener('pointerleave', () => { hoverLayer.style.display = 'none'; tooltip.classList.remove('visible'); setHighlight(null); });

// table view toggle
const tableToggle = document.getElementById('table-toggle');
const tableWrap = document.getElementById('table-wrap');
const chartWrap = document.getElementById('chart-wrap');

function buildTable() {
  // Group by YEAR, not the exact date string: countries with a fiscal
  // year-end (UK/CA, 31 Mar) and calendar-year countries (US/DE/FR, 31 Dec)
  // never share an exact date, so grouping by date would put them in
  // separate rows with blank cells either way -- grouping by year aligns
  // them onto one row each, matching how every series is already annual.
  const allYears = new Set();
  for (const c of COUNTRY_ORDER) for (const p of DATA[c].points) allYears.add(p.date.slice(0, 4));
  const years = Array.from(allYears).sort().reverse();
  const table = document.createElement('table');
  table.className = 'data-table';
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  const thDate = document.createElement('th');
  thDate.textContent = 'Year';
  headRow.appendChild(thDate);
  for (const c of COUNTRY_ORDER) {
    const th = document.createElement('th');
    th.textContent = DATA[c].name;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);
  table.appendChild(thead);
  const tbody = document.createElement('tbody');
  const byCountryMap = {};
  for (const c of COUNTRY_ORDER) {
    byCountryMap[c] = new Map(DATA[c].points.map(p => [p.date.slice(0, 4), p.pct]));
  }
  for (const y of years) {
    const tr = document.createElement('tr');
    const tdDate = document.createElement('td');
    tdDate.textContent = y;
    tr.appendChild(tdDate);
    for (const c of COUNTRY_ORDER) {
      const td = document.createElement('td');
      const v = byCountryMap[c].get(y);
      td.textContent = v === undefined ? '–' : v.toFixed(2) + '%';
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  tableWrap.innerHTML = '';
  tableWrap.appendChild(table);
}

let tableBuilt = false;
tableToggle.addEventListener('click', () => {
  const showing = tableToggle.getAttribute('aria-pressed') === 'true';
  if (!showing) {
    if (!tableBuilt) { buildTable(); tableBuilt = true; }
    chartWrap.style.display = 'none';
    tableWrap.style.display = 'block';
    tableToggle.setAttribute('aria-pressed', 'true');
    tableToggle.textContent = 'View as chart';
  } else {
    chartWrap.style.display = '';
    tableWrap.style.display = 'none';
    tableToggle.setAttribute('aria-pressed', 'false');
    tableToggle.textContent = 'View as table';
  }
});

// notes
const notes = [
  'United States: Treasury Fiscal Data API (debt_to_penny for total debt; MSPD Table 1 for TIPS, inflation-adjusted principal), plus archived Treasury Bulletins for a 1997–1998 gap in the MSPD API. Monthly, 1997–present, resampled to annual for this chart.',
  'United Kingdom: DMO Quarterly Reviews (2007–present) and Annual Reviews (1999–2006), plus Bank of England Quarterly Bulletin articles for 1990–1997 (pre-dating the DMO). Nominal (uplifted) index-linked gilts outstanding vs. total gilts in issue from 1994 on; 1990–1993 instead use the index-linked share of gilts in "market hands" at market prices (a narrower, differently-valued basis) — for 1992/1993 read directly off pie-chart slice labels (image text, not extractable via PDF text layer). Annual, 1990–present.',
  'Germany: Deutsche Finanzagentur Schuldenstatistik workbook (nominal outstanding volume). Monthly, 2006–present — inflation-linked issuance only began in 2006, so the workbook\'s earlier all-zero rows are omitted rather than charted as 0%.',
  'France: Banque de France Bulletin archives for 1998–2008 (OATi launched Sept 1998), then INSEE BDM (mirrors Agence France Trésor figures for OATi + OAT€i) from 2009–present, inflation-uplifted basis throughout. Monthly from 2009, resampled to annual for this chart.',
  'Canada: Dept. of Finance Debt Management Reports for FY1995-96–FY2024-25 (Real Return Bonds outstanding, inflation-adjusted), plus Bank of Canada Valet API for a daily 2025–present cut. FY1991-92–FY1994-95 (RRBs launched Dec 1991) are reconstructed from Bank of Canada\'s issuance records instead, on a NOTIONAL/face-value basis rather than inflation-adjusted like the rest of the series — this slightly understates the true share for those four years, since it excludes accrued CPI uplift.',
  'Italy: MEF Dipartimento del Tesoro’s monthly "Composizione dei Titoli di Stato" bulletin (PDF through 2019, CSV from 2020), BTP€i + BTP Italia/BTP Italia Sì combined (inflation-uplifted "rivalutato" basis) — all of Italy’s inflation-indexed marketable debt, both the euro-area-indexed BTP€i and the Italian-CPI-indexed BTP Italia — vs. total government securities in circulation. Monthly, 2003–present (BTP€i launched Sept 2003; BTP Italia added on top from Mar 2012).',
  'Spain: Tesoro Público’s monthly debt bulletin ("Deuda del Estado en circulación"), inflation-linked bonds (inflation-uplifted basis) vs. Treasury bills and bonds outstanding. Monthly, 2014–present (Spain’s indexed bonds launched 2014).',
  'Sweden: Statistics Sweden (SCB) series sourced from Riksgälden, central government debt vs. inflation-linked bonds ("reala statsobligationer"). Monthly, 1995–present, but on two different bases across a methodology changeover: 1995 through Oct 2001 is face value (pre-dating Riksgälden’s switch to inflation-uplifted accounting), Nov 2001 onward is inflation-uplifted — a real basis seam at that join, similar in kind to Canada’s 1992–1995 seam above.',
  'Australia: RBA Occasional Paper 8 (1985–1995) and the Australian Treasury’s Commonwealth Debt Management Review (1996–2002), then the AOFM’s own monthly settlement workbook (2003–present), inflation-uplifted "Capital Indexed" basis. Annual through 2002, monthly from 2003. The original Capital Indexed Bond program paused new issuance twice (1989–1992, 2004–2008) with outstanding stock plateauing rather than falling to zero, before the 2009 Treasury Indexed Bond relaunch resumed growth — a real historical pattern, not a data gap.',
  'Japan: Ministry of Finance JGB statistics ("General Bonds" outstanding) vs. JGBi (inflation-indexed JGBs) reconstructed from MOF’s own auction and buyback records, since MOF doesn’t publish an outstanding-JGBi time series directly — both on a FACE VALUE basis (not inflation-uplifted, unlike most other countries here). Fiscal year-end, 2003–present. JGBi issuance was suspended 2008–2013 (weak post-financial-crisis demand and deflation risk to principal); outstanding stock roughly halved over that window via buybacks and unreplaced maturities before recovering from 2013’s redesigned, floor-protected structure.',
  'Denmark: Danmarks Nationalbank’s annual "Central government borrowing and debt" report, inflation-linked DGBi bonds (inflation-uplifted basis) vs. total domestic government debt. Annual, 2011–present (DGBi launched 2012); the 2020 dip is pandemic-era nominal T-bill issuance diluting the ratio, and the 2023 dip is the original DGBi bond’s November 2023 maturity — both real market events, not data errors.',
  'New Zealand: New Zealand Debt Management’s monthly bond-on-issue history workbook plus archived Reserve Bank of New Zealand Bulletin articles for 1994–1997, inflation-indexed bonds (IIBs) vs. total government bonds on issue — both on a FACE VALUE basis (NZDM’s own headline totals are face value, not inflation-uplifted, unlike most other countries here). Mixed annual/monthly cadence, 1994–present, with a documented gap in 1995–1996 and 1998–1999 where no sourced balance was found.',
  'Mexico: Banco de México’s SIE data portal, government securities outstanding vs. Ajustabonos (1989–1999, INPC-adjusted) plus Udibonos (1996–present, UDI-denominated, converted to pesos using the UDI’s daily value) — summed during their 1996–1999 handover as one wound down and the other ramped up. Annual, 1988–present. The 1994–95 dip is the peso crisis diluting the linked share via a surge in short-term nominal issuance, not a decline in the linked bonds themselves.',
  'Brazil: Tesouro Nacional’s public debt stock report vs. NTN-B + NTN-C combined (IPCA- and IGP-M-indexed Treasury notes respectively, both inflation-uplifted basis) from 2000 onward, plus OTN/BTN (Brazil’s earlier inflation-indexed Treasury bonds, hand-extracted from Tesouro Nacional’s own published debt history) for 1985–1999 — all of Brazil’s inflation-indexed marketable debt across every currency-regime change, not one flagship product alone. Annual 1985–1999, monthly 2000–present. 1985’s 96.6% (ORTN’s successor OTN) collapses after the 1986 Cruzado Plan abolished monetary correction, bottoming out near-zero through the 1990s before NTN-C (1991) and NTN-B (2002) rebuild the linked share — a real, historically-documented swing, not a data error.',
  'Chile: 1991–present is Ministry of Finance/DIPRES’s official consolidated Central Government + Central Bank gross debt figure vs. UF-denominated (inflation-indexed) bonds — a genuinely combined basis, not Treasury alone, since most of Chile’s historically large UF-linked debt sits on the central bank’s balance sheet (from a 1980s banking-crisis bailout) rather than the Treasury’s; a Treasury-only view would badly understate Chile’s true linked share for most of this history. 1986–1990 uses the Central Bank’s own itemized UF-linked debt paper (from its annual financial statements) against an independent academic estimate of Chile’s consolidated Central Government + Central Bank total debt for those years (Braun et al. 2000, a widely-cited historical-statistics compilation, cross-validated against the Central Bank’s own records) — replacing an earlier, narrower Central-Bank-only denominator that was found to overstate the linked share by roughly 5–11 percentage points; the current approach’s own residual bias is smaller and one-directional, on the order of 1–2 percentage points of overstatement. 1985 itself still couldn’t be recovered under any basis tried — the source document for that year lacks any instrument-level breakdown of the central bank’s own debt paper, the actual blocker regardless of which total-debt denominator is used. No zero-anchor: debt was already substantially UF-linked at every point in this series.',
  'Colombia: Ministry of Finance’s public debt profile, domestic gross debt vs. TES denominated in UVR (Unidad de Valor Real, inflation-uplifted basis). Annual/monthly mix, 1998–present (UVR-denominated TES launched May 1999, per Decreto 856 de 1999); a data gap exists between Dec 1999 and mid-2001 where no interim figures were found.',
  'Uruguay: Debt Management Unit (Ministry of Economy and Finance) reports, Central Government gross debt across all currencies/units vs. CPI-indexed (Unidad Indexada) bonds specifically (excluding wage-indexed debt). Annual, 2001–present — the UI unit and Uruguay’s first UI-denominated bond both launched within days of each other in June 2002, consistent with Uruguay’s well-known post-crisis de-dollarization strategy that makes its linked share among the highest in this dataset.',
  'Israel: Ministry of Finance Debt Management Unit annual reports (fetched via Wayback Machine, since gov.il currently blocks direct access from this project), tradable domestic debt vs. its CPI-linked share. 2009–2016 only — the widely-cited "1955" origin of Israeli bond indexation turned out to have no verifiable primary-source data or named instrument behind it; the actual traceable CPI-linked bond ("Galil") dates to December 1984, but reconstructing a currency-consistent series back through Israel’s two currency redenominations (lira→shekel→New Israeli Shekel) wasn’t achievable from sources found, so no zero-anchor is included here rather than fabricate an unverifiable earlier point.',
  'South Africa: National Treasury Budget Review, total marketable domestic debt vs. Index-Linked Bonds (inflation-uplifted basis). Annual (fiscal year-end 31 March), 1999–present — the first ILB (R189) was issued 20 March 2000, per its own Final Terms and Conditions.',
  'Poland: Ministry of Finance’s own debt-by-instrument time series, marketable domestic Treasury securities vs. CPI-indexed "IZ" bonds (FACE VALUE basis). Monthly, 2003–present (launched August 2004); a real ~10-month gap in 2023–2024 reflects the original IZ series fully maturing before a new CPI-indexed bond was issued, not a data error.',
  'South Korea: Ministry of Economy and Finance Treasury Bond statistics, KTB outstanding vs. KTBi (inflation-linked KTBs, FACE VALUE basis, reconstructed from issuance/maturity cohorts since no outstanding-balance series is published directly). Annual, 2009–present — a 2007 pilot program left no trace in the government’s own ongoing statistics; June 2010 is the effective, continuously-tracked start.',
  'Turkey: Treasury and Finance Ministry’s domestic debt stock by interest-rate type, marketable domestic debt vs. CPI-indexed government bonds (FACE VALUE basis), first auctioned 19 February 2007 — with a legacy, non-marketable CPI-indexed bond issued to the Central Bank during the 2000–2001 banking crisis carefully isolated and excluded from the modern program’s count.',
  'All series use each country’s own definition of "outstanding" (generally inflation-uplifted/accreted value for the linked bonds, matching how it’s embedded in the total debt figure, except Canada 1992–1995, Sweden 1995–2001, Japan, New Zealand, Poland, South Korea, and Turkey as noted above), so the percentage is on a consistent basis within each country for most of its history, but the underlying debt scope (e.g. marketable debt vs. broader gross debt, or Chile’s consolidated Treasury+central-bank basis) differs slightly across countries.'
];
const notesList = document.getElementById('notes-list');
for (const n of notes) {
  const li = document.createElement('li');
  li.textContent = n;
  notesList.appendChild(li);
}
</script>
