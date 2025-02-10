import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export const sendVerificationSMS = async (phone: string, name: string, link: string) => {
  try {
    const message = await client.messages.create({
      body: `Hola, ${name}, te ha llegado este mensaje porque estás intentando ingresar al aplicativo de OneFly. Para ingresar, da clic en el siguiente enlace: ${link}`,
      from: twilioPhoneNumber,
      to: phone,
    });
    console.log(`✅ SMS enviado a ${phone}: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error('❌ Error enviando SMS:', error);
    return { success: false, error };
  }
};

