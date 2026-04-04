exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { amount, description, orderId } = JSON.parse(event.body);

  console.log('init-payment received:', { amount, description, orderId });

  const payload = {
    ClientID: process.env.AMERIA_CLIENT_ID,
    Username: process.env.AMERIA_USERNAME,
    Password: process.env.AMERIA_PASSWORD,
    Amount: amount,
    OrderID: orderId,
    BackURL: 'https://tizyan.com/payment-result.html',
    Description: description,
    Currency: '051',
  };

  const response = await fetch('https://servicestest.ameriabank.am/VPOS/api/VPOS/InitPayment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  console.log('Ameriabank response:', JSON.stringify(data));

  if (data.ResponseCode === 1 && data.PaymentID) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        paymentID: data.PaymentID,
        redirectUrl: `https://servicestest.ameriabank.am/VPOS/Payments/Pay?id=${data.PaymentID}&lang=am`,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: data.ResponseMessage || 'Payment init failed' }),
  };
};
