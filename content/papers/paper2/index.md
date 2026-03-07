---
title: "Queueing and inventories on the limit order book"
date: 2025-09-01
tags: ["limit order markets", "financial markets", "liquidity","bond markets","HFT","market making"]
category: "Academic"
venue: "JFM"
author: ["Corey Garriott", "Vincent van Kervel", "Marius Zoican"]
description: "A model of queueing applied to limit-order market data finds depth losses of up to 8% attributable to queueing. Published in the Journal of Financial Markets, 2025."
summary: "Queue position is a form of risk, not just a time delay, and that market makers react to that risk by withholding liquidity. A queueing model applied to a price-time priority market finds losses to depth of as much as 8%. This inefficiency does not exist in pro-rata systems (though they have their own problems)."
#cover:
#    image: "paper2.jpeg"
#    alt: "A long queue of annoyed people."
#    relative: true
editPost:
    URL: "https://www.sciencedirect.com/science/article/pii/S1386418125000229"
    Text: "Journal of Financial Markets"

---

---

##### Download

+ [Paper](https://www.sciencedirect.com/science/article/pii/S1386418125000229)
<!--
+ [Presentation](presentation)
+ [Online appendix](appendix1.pdf)
+ [Code and data](https://github.com/pmichaillat/feru)
-->

---

##### Abstract

Limit order markets use a queuing system in which limit orders must wait in line to execute. We show that the queue position of a limit order influences its adverse selection risk and inhibits inventory risk management. Trade may worsen market maker risk sharing, unlike many protocols without queuing. We uncover a crowding-out effect: An inventory shock reduces liquidity provision by market makers later in the queue. Using futures data, we confirm both low risk sharing and the crowding-out effect. These two results imply a trade-off, as the queuing sequence that optimizes risk sharing decreases quoted depth up to 8.4%.

---

##### Figure 3: Correlation of market maker inventory with queue position

![](figure3.png)

---

##### Citation

Garriott, C., van Kervel, V., & Zoican, M. (2025). Queuing and inventories in limit order markets. *Journal of Financial Markets*, 100982.

```latex
@article{garriott2025queueing,
  title={Queueing and inventories in limit order markets},
  author={Garriott, Corey and van Kervel, Vincent and Zoican, Marius},
  journal={Journal of Financial Markets},
  volume={75},
  pages={100982},
  year={2025},
  publisher={Elsevier}
}
```

---

<!--
##### Related material

+ [Presentation slides](presentation1.pdf)
+ [Summary of the paper](https://www.penguinrandomhouse.com/books/110403/unusual-uses-for-olive-oil-by-alexander-mccall-smith/)
-->
