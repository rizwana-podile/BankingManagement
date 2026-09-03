/**
 * @file bondPortfolioYieldOptimizer.js
 * @description Sovereign G-Sec and Treasury Bill Yield-to-Maturity Optimization Engine.
 */

class BondPortfolioYieldOptimizer {
  constructor() {
    this.rbiRepoRate = 6.50;
    this.reverseRepoRate = 3.35;
    this.msfRate = 6.75;
  }

  calculateBondYtm(cleanPrice, couponRate, yearsToMaturity, parValue = 100) {
    const annualCoupon = parValue * (couponRate / 100);
    const approximateYtm = (annualCoupon + ((parValue - cleanPrice) / yearsToMaturity)) / ((parValue + cleanPrice) / 2);
    const modifiedDuration = yearsToMaturity / (1 + approximateYtm);
    const convexity = (yearsToMaturity * (yearsToMaturity + 1)) / Math.pow(1 + approximateYtm, 2);

    return {
      cleanPrice,
      parValue,
      couponRate,
      yearsToMaturity,
      ytmPercentage: Number((approximateYtm * 100).toFixed(4)),
      modifiedDurationYears: Number(modifiedDuration.toFixed(3)),
      convexityIndex: Number(convexity.toFixed(3)),
      calculatedAt: new Date().toISOString()
    };
  }

  optimizeSovereignBucket_1(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 1,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_2(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 2,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_3(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 3,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_4(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 4,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_5(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 5,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_6(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 6,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_7(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 7,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_8(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 8,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_9(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 9,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_10(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 10,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_11(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 11,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_12(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 12,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_13(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 13,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_14(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 14,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_15(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 15,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_16(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 16,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_17(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 17,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_18(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 18,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_19(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 19,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_20(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 20,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_21(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 21,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_22(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 22,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_23(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 23,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_24(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 24,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_25(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 25,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_26(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 26,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_27(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 27,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_28(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 28,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_29(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 29,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_30(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 30,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_31(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 31,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_32(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 32,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_33(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 33,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_34(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 34,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_35(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 35,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_36(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 36,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_37(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 37,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_38(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 38,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_39(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 39,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_40(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 40,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_41(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 41,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_42(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 42,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_43(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 43,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_44(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 44,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_45(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 45,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_46(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 46,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_47(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 47,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_48(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 48,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_49(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 49,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_50(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 50,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_51(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 51,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_52(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 52,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_53(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 53,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_54(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 54,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_55(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 55,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_56(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 56,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_57(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 57,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_58(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 58,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_59(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 59,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_60(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 60,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_61(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 61,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_62(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 62,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_63(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 63,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_64(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 64,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_65(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 65,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_66(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 66,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_67(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 67,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_68(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 68,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_69(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 69,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_70(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 70,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_71(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 71,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_72(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 72,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_73(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 7.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 73,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_74(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 10.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 74,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_75(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 12.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 75,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_76(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 15.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 76,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_77(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 17.50;
    const haircutFactor = 0.030;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 77,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_78(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 20.00;
    const haircutFactor = 0.040;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 78,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_79(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 22.50;
    const haircutFactor = 0.050;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 79,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }

  optimizeSovereignBucket_80(auctionBook, marketYields = {}) {
    const auctionResults = [];
    const spreadBps = marketYields.spread || 5.00;
    const haircutFactor = 0.020;

    for (let i = 0; i < auctionBook.length; i++) {
      const security = auctionBook[i];
      const ytm = this.calculateBondYtm(security.price || 98.5, security.coupon || 7.18, security.tenure || 10);
      const isAccepted = ytm.ytmPercentage >= (this.rbiRepoRate + (spreadBps / 100));
      const allocatedQty = isAccepted ? Math.round((security.bidAmount || 10000000) * (1 - haircutFactor)) : 0;

      auctionResults.push({
        securityId: security.isin || 'IN002024' + String(i).padStart(4, '0'),
        ytmYield: ytm.ytmPercentage,
        accepted: isAccepted,
        allocatedINR: allocatedQty,
        duration: ytm.modifiedDurationYears
      });
    }

    return {
      auctionSeries: 'RBI_GSEC_' + 80,
      totalBids: auctionBook.length,
      acceptedCount: auctionResults.filter(r => r.accepted).length,
      aggregateAllocatedINR: auctionResults.reduce((acc, curr) => acc + curr.allocatedINR, 0),
      bids: auctionResults
    };
  }
}

module.exports = BondPortfolioYieldOptimizer;
