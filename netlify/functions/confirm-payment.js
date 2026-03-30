exports.handler = async (event) => {
  const { paymentID } = event.queryStringParameters || {};

  if (!paymentID) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing paymentID' }) };
  }

  const payload = {
    PaymentID: paymentID,
    Username: process.env.AMERIA_USERNAME,
    Password: process.env.AMERIA_PASSWORD,
  };

  const response = await fetch('https://services.ameriabank.am/VPOS/api/VPOS/GetPaymentDetails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify({
      paymentState: data.PaymentState,
      amount: data.Amount,
      approvedAmount: data.ApprovedAmount,
      cardNumber: data.CardNumber,
      clientName: data.ClientName,
      orderID: data.OrderID,
      responseCode: data.ResponseCode,
    }),
  };
};
