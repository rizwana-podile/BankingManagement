const DepositCompoundingCalculator = require('../../backend/services/products/depositCompoundingCalculator');

describe('Fixed Deposit Compounding & Tax Accrual', () => {
  const calc = new DepositCompoundingCalculator();

  test('should calculate quarterly compounded maturity value accurately', () => {
    const res = calc.calculateFixedDepositYield(100000, 7.0, 12, false, true);
    expect(res.principal).toBe(100000);
    expect(res.maturityAmount).toBeGreaterThan(107000);
    expect(res.tdsDeducted).toBe(0);
  });

  test('should award 0.50% step-up bonus for senior citizen depositors', () => {
    const general = calc.calculateFixedDepositYield(100000, 7.0, 12, false, true);
    const senior = calc.calculateFixedDepositYield(100000, 7.0, 12, true, true);
    expect(senior.effectiveRate).toBe(7.5);
    expect(senior.maturityAmount).toBeGreaterThan(general.maturityAmount);
  });

  test('should deduct Section 194A TDS when interest exceeds 40,000 threshold without Form 15G', () => {
    const res = calc.calculateFixedDepositYield(1000000, 8.0, 24, false, false);
    expect(res.tdsDeducted).toBeGreaterThan(0);
    expect(res.maturityAmount).toBeLessThan(res.principal + res.grossInterestEarned);
  });
});