import twilio from 'twilio';
import { env } from '../config/env.js';

let client;

if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
  client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
  console.log('✅ Twilio client initialized');
} else {
  console.warn('⚠️ Twilio credentials not found. SMS service will be disabled.');
}

/**
 * Sends an SMS message.
 * @param {string} to - The recipient's phone number (e.g., '+15551234567')
 * @param {string} body - The text message content.
 */
export async function sendSms(to, body) {
  if (!client) {
    console.error('Twilio client not initialized. Cannot send SMS.');
    return;
  }
  
  if (!env.TWILIO_PHONE_NUMBER) {
    console.error('TWILIO_PHONE_NUMBER not set. Cannot send SMS.');
    return;
  }

  try {
    const message = await client.messages.create({
      body: body,
      from: env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
  }
}