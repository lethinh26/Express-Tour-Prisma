// Test script for SePay IPN endpoint
const crypto = require('crypto');

// Cấu hình
const SECRET_KEY = '0123456789'; // Phải giống với SEPAY_SECRET_KEY trong .env
const IPN_URL = 'http://localhost:3000/api/payments/sepay-ipn';

// Dữ liệu test
const testData = {
  transaction_id: 'TXN123456789',
  payment_id: 'your-payment-uuid-here', // Thay bằng payment ID thật từ database
  amount: 485000,
  status: 'SUCCESS' // SUCCESS, FAILED, hoặc PENDING
};

// Tạo signature
function generateSignature(data) {
  const signString = `${data.transaction_id}${data.payment_id}${data.amount}${data.status}`;
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(signString)
    .digest('hex');
  return signature;
}

// Gửi IPN request
async function testIPN() {
  const signature = generateSignature(testData);
  
  const payload = {
    ...testData,
    signature
  };

  console.log('Sending IPN test request...');
  console.log('Payload:', JSON.stringify(payload, null, 2));
  console.log('Signature:', signature);

  try {
    const response = await fetch(IPN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    console.log('\n--- Response ---');
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(result, null, 2));
    
    if (response.ok && result.success) {
      console.log('\n✅ IPN test SUCCESSFUL!');
    } else {
      console.log('\n❌ IPN test FAILED!');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Test với signature sai
async function testInvalidSignature() {
  console.log('\n\n=== Testing with INVALID signature ===');
  
  const payload = {
    ...testData,
    signature: 'invalid-signature-12345'
  };

  console.log('Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(IPN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    
    console.log('\n--- Response ---');
    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(result, null, 2));
    
    if (response.status === 400 && result.error === 'Invalid signature') {
      console.log('\n✅ Invalid signature correctly REJECTED!');
    } else {
      console.log('\n❌ Invalid signature was NOT rejected properly!');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

// Chạy tests
console.log('=== SePay IPN Test Script ===\n');
console.log('IMPORTANT: Update payment_id in testData before running!\n');

testIPN().then(() => {
  return testInvalidSignature();
});
