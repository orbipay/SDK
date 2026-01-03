import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
}

export async function getUncachableResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export async function sendCardCreatedEmail(toEmail: string, cardName: string) {
  const { client, fromEmail } = await getUncachableResendClient();
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0;">Orbi Pay</h1>
      </div>
      
      <h2 style="color: #333;">Dear User,</h2>
      
      <p style="color: #555; line-height: 1.6;">
        We are pleased to inform you that your virtual card <strong>"${cardName}"</strong> has been successfully created and is now active.
      </p>
      
      <p style="color: #555; line-height: 1.6;">
        You can start managing your card in the dashboard, including:
      </p>
      
      <ul style="color: #555; line-height: 1.8;">
        <li>Setting spending limits</li>
        <li>Enabling or disabling transactions</li>
        <li>Configuring security options</li>
        <li>Viewing transaction history</li>
      </ul>
      
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin: 20px 0;">
        <p style="color: #856404; margin: 0; font-weight: bold;">For your security, please remember:</p>
        <ul style="color: #856404; margin: 10px 0 0 0;">
          <li>Never share your full card number or CVV</li>
          <li>Enable freeze mode if you suspect unusual activity</li>
        </ul>
      </div>
      
      <p style="color: #555; line-height: 1.6;">
        If you did not request this card creation, please contact support immediately.
      </p>
      
      <p style="color: #555; line-height: 1.6;">
        Thank you for using our service.
      </p>
      
      <p style="color: #555; margin-top: 30px;">
        Best regards,<br>
        <strong>Orbi Pay Team</strong>
      </p>
      
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      
      <p style="color: #999; font-size: 12px; text-align: center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;

  const result = await client.emails.send({
    from: fromEmail || 'Orbi Pay <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Your Virtual Card Has Been Created - Orbi Pay',
    html: emailHtml,
  });

  return result;
}
