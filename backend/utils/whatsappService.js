const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendWhatsApp = async (to, message) => {
  try {
    // Format phone number properly
    let formattedPhone = to;
    
    // Remove any existing whatsapp: prefix
    formattedPhone = formattedPhone.replace('whatsapp:', '');
    
    // Add + if not present
    if (!formattedPhone.startsWith('+')) {
      // Assume Indian number if no country code
      if (formattedPhone.length === 10) {
        formattedPhone = '+91' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }
    
    console.log(`📱 Attempting to send WhatsApp to: ${to}`);
    console.log(`📱 Formatted phone: ${formattedPhone}`);
    console.log(`📝 Message: ${message.substring(0, 50)}...`);
    console.log(`🔑 Using Twilio SID: ${process.env.TWILIO_ACCOUNT_SID?.substring(0, 10)}...`);
    console.log(`📞 From: ${process.env.TWILIO_WHATSAPP}`);
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP,
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`✅ WhatsApp sent successfully! SID: ${result.sid}`);
    console.log(`📊 Status: ${result.status}`);
    return result;

  } catch (error) {
    console.error("❌ WhatsApp Error:", error.message);
    console.error("❌ Error Code:", error.code);
    console.error("❌ Error Details:", error.moreInfo);
    throw error;
  }
};

module.exports = sendWhatsApp;