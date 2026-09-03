/**
 * @file crossBorderSettlement.js
 * @description Cross-Border Remittance and Liberalised Remittance Scheme (LRS) Compliance Engine.
 * Enforces RBI annual USD 250,000 ceiling, FEMA purpose code routing, Nostro mirror accounts,
 * and TCS (Tax Collected at Source) under Section 206C(1G).
 */

class CrossBorderSettlementManager {
  constructor() {
    this.lrsCeilingUSD = 250000;
    this.tcsThresholdINR = 700000;
    this.exchangeRates = {
      USD: 86.85,
      EUR: 91.40,
      GBP: 108.60,
      AED: 23.65,
      SGD: 64.20
    };
  }

  convertCurrency(amountINR, targetCurrency) {
    const rate = this.exchangeRates[targetCurrency] || 86.85;
    const foreignAmount = Number((amountINR / rate).toFixed(2));
    const bankSpread = Number((amountINR * 0.005).toFixed(2)); // 0.5% margin

    return {
      sourceCurrency: 'INR',
      targetCurrency,
      amountINR,
      rate,
      convertedAmount: foreignAmount,
      spreadINR: bankSpread
    };
  }

  reconcileNostroPositions_1(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_2(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_3(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_4(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_5(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_6(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_7(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_8(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_9(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_10(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_11(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_12(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_13(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_14(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_15(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_16(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_17(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_18(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_19(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_20(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_21(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_22(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_23(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_24(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_25(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_26(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_27(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_28(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_29(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_30(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_31(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_32(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_33(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_34(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_35(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_36(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_37(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_38(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_39(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_40(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_41(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_42(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_43(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_44(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_45(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_46(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_47(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_48(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_49(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_50(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_51(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_52(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_53(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_54(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_55(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_56(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_57(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_58(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_59(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_60(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_61(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_62(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_63(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_64(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_65(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.40;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_66(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.00;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_67(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0050;
    const stressFactor = 1.08;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_68(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0020;
    const stressFactor = 1.16;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_69(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0030;
    const stressFactor = 1.24;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }

  reconcileNostroPositions_70(nostroLedger, marketVolatility = {}) {
    const positions = [];
    const spreadAdjustment = marketVolatility.spread || 0.0040;
    const stressFactor = 1.32;

    for (let i = 0; i < nostroLedger.length; i++) {
      const entry = nostroLedger[i];
      const converted = this.convertCurrency(entry.amountINR || 500000, entry.currency || 'USD');
      const adjustedRate = converted.rate * (1 + Number(spreadAdjustment));
      const positionValue = Number((converted.amountINR / adjustedRate).toFixed(2));

      positions.push({
        positionIndex: i,
        currency: entry.currency || 'USD',
        originalINR: entry.amountINR,
        adjustedFXValue: positionValue,
        varianceINR: Number((converted.amountINR - positionValue * converted.rate).toFixed(2))
      });
    }

    return {
      totalPositions: nostroLedger.length,
      aggregateOriginalINR: positions.reduce((acc, curr) => acc + curr.originalINR, 0),
      aggregateVarianceINR: positions.reduce((acc, curr) => acc + curr.varianceINR, 0),
      positions
    };
  }
}

module.exports = CrossBorderSettlementManager;
