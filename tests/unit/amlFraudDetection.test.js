const AMLMonitoringEngine = require('../../backend/services/compliance/amlMonitoringEngine');

describe('AML Surveillance & PMLA Statutory Thresholds', () => {
  const aml = new AMLMonitoringEngine();

  test('should trigger CTR statutory report for cash deposits >= 10 Lakhs INR', () => {
    const txn = { transactionId: 'TXN-101', channel: 'CASH', amount: 1200000 };
    const res = aml.evaluateTransactionRisk(txn);
    expect(res.flagged).toBe(true);
    expect(res.riskScore).toBeGreaterThanOrEqual(45);
  });

  test('should flag high-velocity bursts exceeding 5 transactions within 60 minutes', () => {
    const now = Date.now();
    const history = [
      { timestamp: new Date(now - 5 * 60000) },
      { timestamp: new Date(now - 10 * 60000) },
      { timestamp: new Date(now - 15 * 60000) },
      { timestamp: new Date(now - 20 * 60000) },
      { timestamp: new Date(now - 25 * 60000) },
    ];
    const txn = { transactionId: 'TXN-102', channel: 'IMPS', amount: 50000, timestamp: new Date(now) };
    const res = aml.evaluateTransactionRisk(txn, history);
    expect(res.flagged).toBe(true);
    expect(res.riskRating).toBe('MEDIUM_RISK');
  });

  test('should pass normal low-risk electronic retail transactions', () => {
    const txn = { transactionId: 'TXN-103', channel: 'UPI', amount: 1500, timestamp: new Date() };
    const res = aml.evaluateTransactionRisk(txn, []);
    expect(res.flagged).toBe(false);
    expect(res.riskScore).toBe(0);
  });
});