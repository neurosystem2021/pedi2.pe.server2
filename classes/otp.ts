import { Twilio } from "twilio";
import * as dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const authToken = process.env.TWILIO_AUTH_TOKEN || '';
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '';
const codeHash = process.env.TWILIO_HASH || 'dgzH6F7xDpL';

export async function EnviarOtp(number:string,texto:string,hashSMS:string){

    try {
      
        const client = new Twilio(accountSid, authToken);

        let rest = await client.messages.create({
            body: texto+"  Att: Team Pedi2.pe - "+hashSMS,
            to: number, // Text this number
            from: twilioNumber, // From a valid Twilio number
        })
        return { success: true, data:rest };

        

    } catch (error) {
        return { success: false, data:error };
    }
}