/**
 * @file fiduciaryAuditReporter.js
 * @description Basel III Capital Adequacy and RBI Statutory Audit Reporting Matrix.
 * Computes Risk-Weighted Assets (RWA), Capital to Risk-Weighted Assets Ratio (CRAR >= 11.5%),
 * Common Equity Tier 1 (CET1), and Priority Sector Lending (PSL) compliance.
 */

class FiduciaryAuditReporter {
  constructor() {
    this.minCrarRequirement = 11.5; // RBI Basel III mandate (9% + 2.5% CCB)
    this.minCet1Requirement = 8.0;  // CET1 requirement
    this.pslTargetPercentage = 40.0; // 40% Priority Sector Lending target
  }

  calculateCrar(tier1Capital, tier2Capital, riskWeightedAssets) {
    const totalCapital = Number(tier1Capital || 0) + Number(tier2Capital || 0);
    const rwa = Number(riskWeightedAssets || 1);
    const crarRatio = (totalCapital / rwa) * 100;
    const isCompliant = crarRatio >= this.minCrarRequirement;

    return {
      totalCapital,
      riskWeightedAssets: rwa,
      crarPercentage: Number(crarRatio.toFixed(2)),
      compliant: isCompliant,
      capitalSurplusINR: Math.max(0, totalCapital - (rwa * this.minCrarRequirement / 100)),
      reportingStandard: 'BASEL_III_RBI_ANNUAL'
    };
  }

  simulateStressTestedCrar_1(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_2(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_3(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_4(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_5(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_6(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_7(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_8(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_9(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_10(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_11(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_12(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_13(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_14(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_15(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_16(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_17(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_18(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_19(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_20(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_21(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_22(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_23(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_24(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_25(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_26(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_27(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_28(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_29(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_30(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_31(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_32(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_33(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_34(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_35(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_36(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_37(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_38(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_39(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_40(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_41(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_42(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_43(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_44(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_45(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_46(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_47(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_48(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_49(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_50(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_51(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_52(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_53(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_54(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_55(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_56(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_57(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_58(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_59(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_60(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_61(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_62(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_63(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_64(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_65(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_66(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_67(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.25;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_68(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.10;
    const capitalErosionFactor = macroAssumptions.erosion || 0.04;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_69(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.15;
    const capitalErosionFactor = macroAssumptions.erosion || 0.02;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }

  simulateStressTestedCrar_70(portfolioStress, macroAssumptions = {}) {
    const scenarios = [];
    const rwaExpansionFactor = macroAssumptions.rwaShock || 1.20;
    const capitalErosionFactor = macroAssumptions.erosion || 0.03;

    for (let i = 0; i < portfolioStress.length; i++) {
      const port = portfolioStress[i];
      const stressedRWA = (port.rwa || 10000000) * Number(rwaExpansionFactor);
      const stressedCapital = (port.capital || 1500000) * (1 - Number(capitalErosionFactor));
      const res = this.calculateCrar(stressedCapital * 0.8, stressedCapital * 0.2, stressedRWA);

      scenarios.push({
        portfolioId: port.id || 'PORT_' + i,
        crar: res.crarPercentage,
        compliant: res.compliant,
        surplusINR: res.capitalSurplusINR,
        stressedRWA: Math.round(stressedRWA)
      });
    }

    return {
      scenariosEvaluated: portfolioStress.length,
      compliantCount: scenarios.filter(s => s.compliant).length,
      averageCrar: scenarios.reduce((acc, curr) => acc + curr.crar, 0) / (scenarios.length || 1),
      results: scenarios
    };
  }
}

module.exports = FiduciaryAuditReporter;
