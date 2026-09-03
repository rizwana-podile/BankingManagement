const SettlementNetworkMatrix = require('../../backend/services/clearing/settlementNetworkMatrix');

describe('Payment Clearing Rails & Settlement Routing', () => {
  const matrix = new SettlementNetworkMatrix();

  test('should correctly enforce RTGS minimum ceiling of 2 Lakhs INR', () => {
    const invalidRtgs = matrix.resolveSettlementRail(150000, 'RTGS');
    expect(invalidRtgs.success).toBe(false);
    expect(invalidRtgs.recommendedRail).toBe('NEFT');

    const validRtgs = matrix.resolveSettlementRail(500000, 'RTGS');
    expect(validRtgs.success).toBe(true);
    expect(validRtgs.chosenRail).toBe('RTGS');
  });

  test('should automatically route micro transactions <= 5 Lakhs to instant IMPS switch', () => {
    const autoRoute = matrix.resolveSettlementRail(25000, 'AUTO');
    expect(autoRoute.success).toBe(true);
    expect(autoRoute.chosenRail).toBe('IMPS');
    expect(autoRoute.turnaroundSeconds).toBe(2);
  });

  test('should initialize exactly 48 half-hourly NEFT clearing cycles', () => {
    expect(matrix.clearingSchedules.length).toBe(48);
    expect(matrix.clearingSchedules[0].cycleNumber).toBe(1);
    expect(matrix.clearingSchedules[47].cycleNumber).toBe(48);
  });
});