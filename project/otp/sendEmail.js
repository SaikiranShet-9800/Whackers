const SibApiV3Sdk = require('sib-api-v3-sdk');

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

async function sendOTPEmail(toEmail, otp) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const email = {
    sender: { email: process.env.SENDER_EMAIL },
    to: [{ email: toEmail }],
    subject: "Your OTP Code",
    htmlContent: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 5 minutes.</p>`
  };

  return apiInstance.sendTransacEmail(email);
}

module.exports = sendOTPEmail;
