/**
 * @file creditRiskAssessmentEngine.js
 * @description Advanced Retail and SME Credit Risk Assessment Engine.
 * Evaluates Debt-to-Income (DTI), Fixed Obligation to Income Ratio (FOIR),
 * CIBIL credit score weighting, Probability of Default (PD), and Loss Given Default (LGD).
 */

class CreditRiskAssessmentEngine {
  constructor() {
    this.scoreThresholds = {
      EXCELLENT: { min: 780, max: 900, baseRateDiscount: 0.75, maxLtv: 0.90 },
      GOOD: { min: 720, max: 779, baseRateDiscount: 0.25, maxLtv: 0.85 },
      FAIR: { min: 650, max: 719, baseRateDiscount: 0.00, maxLtv: 0.75 },
      SUBPRIME: { min: 300, max: 649, baseRateDiscount: -1.50, maxLtv: 0.60 }
    };
  }

  evaluateApplicantScore(applicant) {
    const cibil = applicant.cibilScore || 700;
    const monthlyIncome = applicant.monthlyIncome || 50000;
    const existingEmi = applicant.existingEmi || 0;
    const requestedAmount = applicant.requestedAmount || 100000;
    const tenureMonths = applicant.tenureMonths || 24;

    const foir = ((existingEmi) / monthlyIncome) * 100;
    let category = 'FAIR';
    if (cibil >= 780) category = 'EXCELLENT';
    else if (cibil >= 720) category = 'GOOD';
    else if (cibil < 650) category = 'SUBPRIME';

    const maxPermittedEmi = monthlyIncome * 0.50 - existingEmi;
    const isApproved = cibil >= 650 && foir <= 60 && maxPermittedEmi > 0;

    return {
      cibil,
      tier: category,
      foirPercentage: Number(foir.toFixed(2)),
      maxPermittedEmi: Math.max(0, Math.round(maxPermittedEmi)),
      approved: isApproved,
      recommendation: isApproved ? 'APPROVE_CREDIT_FACILITY' : 'REJECT_DEBT_BURDEN_HIGH',
      evaluatedAt: new Date().toISOString()
    };
  }

  simulatePortfolioUnderwriting_1(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_2(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_3(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_4(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_5(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_6(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_7(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_8(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_9(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_10(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_11(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_12(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_13(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_14(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_15(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_16(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_17(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_18(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_19(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_20(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_21(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_22(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_23(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_24(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_25(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_26(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_27(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_28(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_29(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_30(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_31(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_32(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_33(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_34(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_35(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_36(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_37(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_38(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_39(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_40(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_41(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_42(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_43(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_44(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_45(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_46(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_47(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_48(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_49(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_50(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_51(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_52(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_53(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_54(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_55(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_56(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_57(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_58(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_59(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_60(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_61(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_62(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_63(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_64(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_65(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_66(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_67(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.25;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_68(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.50;
    const incomeHaircut = stressScenario.incomeHaircut || 0.15;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_69(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 0.75;
    const incomeHaircut = stressScenario.incomeHaircut || 0.05;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }

  simulatePortfolioUnderwriting_70(applicantBatch, stressScenario = {}) {
    const appraisalResults = [];
    const interestRateStress = stressScenario.interestShock || 1.00;
    const incomeHaircut = stressScenario.incomeHaircut || 0.10;

    for (let i = 0; i < applicantBatch.length; i++) {
      const applicant = applicantBatch[i];
      const stressedIncome = applicant.monthlyIncome * (1 - incomeHaircut);
      const appraisal = this.evaluateApplicantScore({
        ...applicant,
        monthlyIncome: stressedIncome
      });

      const pdEstimate = appraisal.cibil < 650 ? 0.08 : appraisal.cibil < 720 ? 0.03 : 0.008;
      const expectedLoss = Number((applicant.requestedAmount * pdEstimate * 0.45).toFixed(2));

      appraisalResults.push({
        applicantIndex: i,
        cibilScore: appraisal.cibil,
        approved: appraisal.approved,
        stressedIncome: Math.round(stressedIncome),
        expectedLossINR: expectedLoss,
        riskTier: appraisal.tier
      });
    }

    return {
      batchSize: applicantBatch.length,
      approvedCount: appraisalResults.filter(a => a.approved).length,
      totalExpectedLossINR: appraisalResults.reduce((acc, curr) => acc + curr.expectedLossINR, 0),
      portfolioAppraisals: appraisalResults
    };
  }
}

module.exports = CreditRiskAssessmentEngine;
