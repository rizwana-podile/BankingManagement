const CreditRiskAssessmentEngine = require('../../backend/services/risk/creditRiskAssessmentEngine');

describe('Credit Risk Appraisal & CIBIL Underwriting', () => {
  const engine = new CreditRiskAssessmentEngine();

  test('should approve eligible applicant with strong CIBIL score and low FOIR', () => {
    const applicant = {
      cibilScore: 780,
      monthlyIncome: 100000,
      existingEmi: 15000,
      requestedAmount: 300000,
      tenureMonths: 24
    };
    const res = engine.evaluateApplicantScore(applicant);
    expect(res.approved).toBe(true);
    expect(res.tier).toBe('EXCELLENT');
    expect(res.foirPercentage).toBe(15.0);
  });

  test('should reject applicant with excessive FOIR debt burden > 60%', () => {
    const applicant = {
      cibilScore: 740,
      monthlyIncome: 50000,
      existingEmi: 35000, // 70% FOIR
      requestedAmount: 200000,
      tenureMonths: 24
    };
    const res = engine.evaluateApplicantScore(applicant);
    expect(res.approved).toBe(false);
  });

  test('should classify applicant with score < 650 into subprime category', () => {
    const applicant = {
      cibilScore: 610,
      monthlyIncome: 60000,
      existingEmi: 5000,
      requestedAmount: 100000,
      tenureMonths: 12
    };
    const res = engine.evaluateApplicantScore(applicant);
    expect(res.tier).toBe('SUBPRIME');
    expect(res.approved).toBe(false);
  });
});