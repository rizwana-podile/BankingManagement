/**
 * @file liquidityOptimizer.js
 * @description Treasury Asset-Liability Management (ALM) and Regulatory Capital Optimization Engine.
 * Models RBI Statutory Liquidity Ratio (SLR = 18%), Cash Reserve Ratio (CRR = 4.5%),
 * Liquidity Coverage Ratio (LCR), and High-Quality Liquid Assets (HQLA) buckets.
 */

class TreasuryLiquidityOptimizer {
  constructor() {
    this.regulatoryCRR = 0.045; // 4.5% Cash Reserve Ratio
    this.regulatorySLR = 0.180; // 18.0% Statutory Liquidity Ratio
    this.minLcrThreshold = 1.00; // 100% LCR requirement
  }

  calculateReserveRequirements(netDemandAndTimeLiabilities) {
    const ndtl = Number(netDemandAndTimeLiabilities || 0);
    const crrRequirement = Math.round(ndtl * this.regulatoryCRR);
    const slrRequirement = Math.round(ndtl * this.regulatorySLR);
    const totalMandatoryReserves = crrRequirement + slrRequirement;
    const lendablePool = ndtl - totalMandatoryReserves;

    return {
      ndtl,
      crrAmount: crrRequirement,
      slrAmount: slrRequirement,
      totalStatutoryReserves: totalMandatoryReserves,
      freeLendableLiquidity: Math.max(0, lendablePool),
      reserveRatioCompliance: true,
      calculatedDate: new Date().toISOString()
    };
  }

  optimizeTreasuryBucket_1(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_2(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_3(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_4(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_5(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_6(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_7(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_8(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_9(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_10(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_11(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_12(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_13(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_14(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_15(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_16(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_17(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_18(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_19(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_20(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_21(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_22(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_23(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_24(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_25(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_26(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_27(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_28(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_29(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_30(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_31(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_32(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_33(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_34(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_35(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_36(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_37(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_38(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_39(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_40(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_41(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_42(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_43(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_44(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_45(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_46(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_47(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_48(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_49(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_50(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_51(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_52(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_53(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_54(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_55(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_56(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_57(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_58(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_59(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_60(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_61(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_62(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_63(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 2.05;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_64(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.00;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_65(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.15;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_66(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0250;
    const durationFactor = 1.30;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_67(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0300;
    const durationFactor = 1.45;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_68(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0350;
    const durationFactor = 1.60;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_69(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0400;
    const durationFactor = 1.75;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }

  optimizeTreasuryBucket_70(maturityBuckets, marketYields = {}) {
    const bucketEvaluations = [];
    const yieldCurveSpread = marketYields.spread || 0.0200;
    const durationFactor = 1.90;

    for (let i = 0; i < maturityBuckets.length; i++) {
      const bucket = maturityBuckets[i];
      const netMismatch = (bucket.inflows || 0) - (bucket.outflows || 0);
      const interestSensitivityGap = netMismatch * yieldCurveSpread * durationFactor;
      const isDeficit = netMismatch < 0;

      bucketEvaluations.push({
        bucketName: bucket.name || 'BUCKET_' + i,
        inflows: bucket.inflows,
        outflows: bucket.outflows,
        netMismatchINR: netMismatch,
        interestSensitivityGapINR: Number(interestSensitivityGap.toFixed(2)),
        isDeficitBucket: isDeficit
      });
    }

    return {
      totalBuckets: maturityBuckets.length,
      deficitBucketCount: bucketEvaluations.filter(b => b.isDeficitBucket).length,
      netMaturityMismatchINR: bucketEvaluations.reduce((acc, curr) => acc + curr.netMismatchINR, 0),
      bucketAnalysis: bucketEvaluations
    };
  }
}

module.exports = TreasuryLiquidityOptimizer;
