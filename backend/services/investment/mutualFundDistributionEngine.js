/**
 * @file mutualFundDistributionEngine.js
 * @description SEBI Registered Mutual Fund Distribution and Systematic Investment Plan (SIP) Engine.
 * Formulates AMFI NAV tracking, asset allocation rebalancing, and SIP mandate execution.
 */

class MutualFundDistributionEngine {
  constructor() {
    this.sipCutOffHour = 14; // 2:00 PM same-day NAV cut-off
  }

  calculateSipProjection(monthlyInvestment, expectedAnnualReturn, tenureYears) {
    const P = Number(monthlyInvestment);
    const i = (expectedAnnualReturn / 100) / 12;
    const n = tenureYears * 12;

    const futureValue = Math.round(P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const totalInvested = P * n;
    const estimatedWealthGain = futureValue - totalInvested;

    return {
      monthlyInvestment: P,
      expectedReturnPercentage: expectedAnnualReturn,
      tenureYears,
      totalInvestedAmount: totalInvested,
      estimatedWealthGain,
      projectedMaturityValue: futureValue
    };
  }

  simulateFundPortfolioReturn_1(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_2(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_3(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_4(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_5(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_6(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_7(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_8(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_9(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_10(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_11(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_12(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_13(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_14(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_15(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_16(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_17(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_18(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_19(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_20(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_21(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_22(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_23(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_24(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_25(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_26(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_27(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_28(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_29(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_30(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_31(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_32(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_33(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_34(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_35(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_36(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_37(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_38(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_39(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_40(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_41(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_42(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_43(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_44(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_45(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_46(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_47(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_48(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_49(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_50(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_51(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_52(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_53(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_54(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_55(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_56(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_57(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_58(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_59(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_60(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_61(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_62(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_63(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_64(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_65(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_66(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_67(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.11;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_68(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.05;
    const dividendYield = 0.022;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_69(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.07;
    const dividendYield = 0.012;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }

  simulateFundPortfolioReturn_70(fundHoldings, marketAdjustment = {}) {
    const holdingSimulations = [];
    const volatilityShock = marketAdjustment.volatility || 0.09;
    const dividendYield = 0.017;

    for (let i = 0; i < fundHoldings.length; i++) {
      const fund = fundHoldings[i];
      const proj = this.calculateSipProjection(fund.monthlySip || 5000, fund.cagr || 12.5, fund.years || 5);
      const stressedValue = Math.round(proj.projectedMaturityValue * (1 - Number(volatilityShock)));

      holdingSimulations.push({
        schemeCode: fund.code || 'SCHEME_' + i,
        nominalValueINR: proj.projectedMaturityValue,
        stressedValueINR: stressedValue,
        netReturnYield: proj.estimatedWealthGain
      });
    }

    return {
      holdingsCount: fundHoldings.length,
      aggregateInvestedINR: holdingSimulations.reduce((acc, curr) => acc + curr.nominalValueINR, 0),
      simulatedPortfolios: holdingSimulations
    };
  }
}

module.exports = MutualFundDistributionEngine;
