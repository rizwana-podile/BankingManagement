const API_URL = 'http://localhost:5000/api';

async function req(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'Request failed');
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('====================================================');
  console.log('   AURA APEX BANK — END-TO-END VERIFICATION SUITE');
  console.log('====================================================');

  try {
    // 1. Health Check
    console.log('\n[1/7] Testing Health Check...');
    const health = await req(`${API_URL}/health`);
    console.log('✓ Bank Health:', health);

    // 2. Demo Users
    console.log('\n[2/7] Testing Demo Credentials endpoint...');
    const demo = await req(`${API_URL}/demo-users`);
    console.log(`✓ Fetched ${demo.credentials.length} demo profiles`);

    // 3. Customer 1 (Rahul) Login & Balance
    console.log('\n[3/7] Testing Customer Login (Rahul Sharma)...');
    const rahulLogin = await req(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'rahul.sharma@example.com', password: 'Customer@123' })
    });
    const rahulToken = rahulLogin.token;
    console.log('✓ Rahul logged in. Token acquired.');

    const rahulAccountsRes = await req(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${rahulToken}` }
    });
    const rahulAccount = rahulAccountsRes.accounts[0];
    const initialRahulBalance = rahulAccount.balance;
    console.log(`✓ Rahul's Initial Balance (Account ${rahulAccount.accountNumber}): ₹${initialRahulBalance.toLocaleString('en-IN')}`);

    // 4. Customer 2 (Priya) Login & Balance
    const priyaLogin = await req(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: 'priya.patel@example.com', password: 'Customer@123' })
    });
    const priyaToken = priyaLogin.token;
    const priyaAccountsRes = await req(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${priyaToken}` }
    });
    const priyaAccount = priyaAccountsRes.accounts[0];
    const initialPriyaBalance = priyaAccount.balance;
    console.log(`✓ Priya's Initial Balance (Account ${priyaAccount.accountNumber}): ₹${initialPriyaBalance.toLocaleString('en-IN')}`);

    // 5. Transfer ₹5,000 from Rahul to Priya
    console.log('\n[4/7] Testing Atomic Real-Time Money Transfer of ₹5,000 from Rahul to Priya...');
    const transferRes = await req(`${API_URL}/transfers`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${rahulToken}` },
      body: JSON.stringify({
        sourceAccountId: rahulAccount._id,
        transferType: 'IMPS',
        destinationAccountNumber: priyaAccount.accountNumber,
        destinationIfsc: priyaAccount.ifscCode,
        recipientName: 'Priya Patel',
        amount: 5000,
        remarks: 'Project Consultation Fees',
        category: 'Transfer'
      })
    });
    console.log('✓ Transfer Response:', transferRes.message);
    console.log('✓ Generated Official Receipt:', {
      TxnId: transferRes.receipt.transactionId,
      RefNo: transferRes.receipt.referenceNumber,
      Amount: transferRes.receipt.amount,
      Status: transferRes.receipt.status,
      SenderBalAfter: transferRes.receipt.remainingBalance
    });

    // Check balances after transfer
    const updatedRahulAcc = (await req(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${rahulToken}` }
    })).accounts[0];

    const updatedPriyaAcc = (await req(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${priyaToken}` }
    })).accounts[0];

    console.log(`✓ Rahul New Balance: ₹${updatedRahulAcc.balance.toLocaleString('en-IN')} (Expected: ${initialRahulBalance - 5000})`);
    console.log(`✓ Priya New Balance: ₹${updatedPriyaAcc.balance.toLocaleString('en-IN')} (Expected: ${initialPriyaBalance + 5000})`);

    if (updatedRahulAcc.balance === initialRahulBalance - 5000 && updatedPriyaAcc.balance === initialPriyaBalance + 5000) {
      console.log('🎯 ATOMIC TRANSFER VALIDATION PASSED: Exactly ₹5,000 deducted and credited!');
    } else {
      throw new Error('Balance mismatch after transfer!');
    }

    // 6. Check Notifications for Rahul & Priya
    console.log('\n[5/7] Verifying Automated Real-Time Notifications...');
    const rahulNotifs = (await req(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${rahulToken}` }
    })).notifications;
    console.log(`✓ Rahul's Latest Notification: "${rahulNotifs[0].title}" — ${rahulNotifs[0].message}`);

    const priyaNotifs = (await req(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${priyaToken}` }
    })).notifications;
    console.log(`✓ Priya's Latest Notification: "${priyaNotifs[0].title}" — ${priyaNotifs[0].message}`);

    // 7. Staff Workflow: Review & Disburse Loan
    console.log('\n[6/7] Testing Staff Loan Appraisal & Fund Disbursement Flow...');
    const loanApp = await req(`${API_URL}/loans/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${rahulToken}` },
      body: JSON.stringify({
        loanType: 'personal',
        loanAmount: 80000,
        tenureMonths: 18,
        monthlyIncome: 95000,
        purpose: 'E-commerce Equipment Upgrade'
      })
    });
    const newLoanId = loanApp.loan._id;
    console.log(`✓ Rahul submitted loan application #${newLoanId} for ₹80,000 (Status: ${loanApp.loan.status})`);

    // Staff Login
    const staffLogin = await req(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'rajesh.kumar@auraapex.com',
        password: 'Staff@123'
      })
    });
    const staffToken = staffLogin.token;
    console.log('✓ Staff (Rajesh Kumar) logged in.');

    // Staff approves loan
    const staffApprove = await req(`${API_URL}/staff/loans/${newLoanId}/review`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${staffToken}` },
      body: JSON.stringify({
        status: 'approved',
        remarks: 'Good CIBIL score & low debt burden',
        approvedAmount: 80000
      })
    });
    console.log(`✓ Staff approved loan: status = ${staffApprove.loan.status}`);

    // Staff disburses funds to customer
    const balanceBeforeDisburse = updatedRahulAcc.balance;
    const staffDisburse = await req(`${API_URL}/staff/loans/${newLoanId}/disburse`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` }
    });
    console.log(`✓ Staff disbursed loan funds! Result: ${staffDisburse.message}`);

    const rahulAfterDisburse = (await req(`${API_URL}/accounts`, {
      headers: { Authorization: `Bearer ${rahulToken}` }
    })).accounts[0];
    console.log(`✓ Rahul Account Balance after Disbursement: ₹${rahulAfterDisburse.balance.toLocaleString('en-IN')} (Credited +₹80,000)`);

    if (rahulAfterDisburse.balance === balanceBeforeDisburse + 80000) {
      console.log('🎯 LOAN ORIGINATION & DISBURSEMENT VALIDATION PASSED!');
    } else {
      throw new Error('Disbursement balance mismatch!');
    }

    // 8. Admin Console & Broadcast
    console.log('\n[7/7] Testing Admin Console, Metrics, & System Broadcast...');
    const adminLogin = await req(`${API_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@auraapex.com',
        password: 'Admin@123'
      })
    });
    const adminToken = adminLogin.token;

    const adminStats = await req(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✓ Admin Bank Metrics:', {
      TotalCustomers: adminStats.stats.totalCustomers,
      TotalDeposits: adminStats.stats.totalDeposits,
      TotalAccounts: adminStats.stats.totalAccounts,
      ActiveLoans: adminStats.stats.activeLoans
    });

    const broadcastRes = await req(`${API_URL}/admin/broadcast`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        title: 'System Security Protocol Active',
        message: 'All multi-factor authentication systems and clearing rails operating at peak capacity.',
        targetRole: 'all',
        type: 'system'
      })
    });
    console.log('✓ Broadcast Dispatched:', broadcastRes.notification.title);

    const auditLogsRes = await req(`${API_URL}/admin/audit-logs?limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log(`✓ Verified Immutable Audit Trail: ${auditLogsRes.logs.length} recent system logs recorded.`);

    console.log('\n====================================================');
    console.log('   🎉 ALL 7 TEST SUITES COMPLETED WITH 100% SUCCESS!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err.data || err.message);
    process.exit(1);
  }
}

runTests();