import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface WelcomeEmailData {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  memberNumber: number;
  isFoundingMember: boolean;
  referralLink: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const { email, firstName, lastName, username, memberNumber, isFoundingMember, referralLink } = data;
  const dashboardUrl = referralLink ? referralLink.replace(`/join/${username}`, '/dashboard') : '/dashboard';

  const foundingMemberBadge = isFoundingMember 
    ? `<div style="background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); color: white; padding: 12px 24px; border-radius: 8px; text-align: center; margin: 20px 0; font-weight: bold;">
        🌟 FOUNDING MEMBER #${memberNumber} 🌟
      </div>`
    : '';

  try {
    await resend.emails.send({
      from: 'The FR2P Club <onboarding@resend.dev>',
      to: email,
      subject: `Welcome to The FR2P Club${isFoundingMember ? ' - Founding Member!' : ''}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to The FR2P Club!</h1>
              <p style="color: #F5F5DC; margin: 10px 0 0 0;">Financial Roadway 2 Prosperity</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              ${foundingMemberBadge}
              
              <p style="font-size: 18px; margin-top: 0;">Hello ${firstName} ${lastName}!</p>
              
              <p>Congratulations on joining The FR2P Club! We're excited to have you on board as you begin your journey to financial prosperity.</p>
              
              <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #8B0000; margin-top: 0; font-size: 20px;">Your Account Details</h2>
                <p style="margin: 5px 0;"><strong>Username:</strong> ${username}</p>
                <p style="margin: 5px 0;"><strong>Member Number:</strong> #${memberNumber}</p>
                ${isFoundingMember ? '<p style="margin: 5px 0; color: #D4AF37;"><strong>Status:</strong> Founding Member ⭐</p>' : ''}
              </div>
              
              <div style="background: linear-gradient(135deg, rgba(139, 0, 0, 0.1) 0%, rgba(212, 175, 55, 0.1) 100%); padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B0000;">
                <h2 style="color: #8B0000; margin-top: 0; font-size: 20px;">Your Unique Referral Link</h2>
                <p>Share this link with others to grow your network and earn commissions:</p>
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0; word-break: break-all;">
                  <a href="${referralLink}" style="color: #8B0000; text-decoration: none; font-weight: bold;">${referralLink}</a>
                </div>
                <p style="font-size: 14px; color: #666; margin-bottom: 0;">💡 Tip: For every person who joins through your link, you'll earn commissions and build your network!</p>
              </div>
              
              <div style="margin: 30px 0;">
                <h2 style="color: #8B0000; font-size: 20px;">Next Steps</h2>
                <ul style="padding-left: 20px;">
                  <li>Log in to your dashboard to view your network and earnings</li>
                  <li>Share your referral link with friends and family</li>
                  <li>Explore the resources and tools available to you</li>
                  <li>Start building your path to financial prosperity!</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #8B0000 0%, #D4AF37 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Go to Dashboard</a>
              </div>
              
              <div style="border-top: 1px solid #e0e0e0; margin-top: 30px; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
                <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
                <p style="margin-bottom: 0;">© ${new Date().getFullYear()} The FR2P Club. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    console.log(`Welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
}

interface MagazineWelcomeEmailData {
  email: string;
  firstName: string;
}

export async function sendMagazineWelcomeEmail(data: MagazineWelcomeEmailData): Promise<void> {
  const { email, firstName } = data;

  try {
    await resend.emails.send({
      from: 'The FR2P Club <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to FR2P Wealth Monthly!',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #001f3f 0%, #003366 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #FFD700; margin: 0; font-size: 28px;">FR2P Wealth Monthly</h1>
              <p style="color: #F5F5DC; margin: 10px 0 0 0;">Your Monthly Wealth & Progress Digest</p>
            </div>
            
            <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
              <h2 style="color: #001f3f;">Welcome, ${firstName}!</h2>
              <p>You're now subscribed to <strong>FR2P Wealth Monthly</strong> - our exclusive digital magazine delivered straight to your inbox every month.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FFD700;">
                <h3 style="color: #001f3f; margin-top: 0;">What You'll Get Each Month:</h3>
                <ul style="color: #555;">
                  <li><strong>Member Success Stories</strong> - Real wins from our community</li>
                  <li><strong>Six-Figure Blueprint</strong> - Monthly online business model breakdown</li>
                  <li><strong>FR2P Program Updates</strong> - New tools, certificates & opportunities</li>
                  <li><strong>Protection & Progress Tips</strong> - Move smart, not just fast</li>
                  <li><strong>Derrick's Corner</strong> - Leadership insights from the founder</li>
                  <li><strong>Free Monthly Resource</strong> - Checklists, templates & guides</li>
                </ul>
              </div>
              
              <p>Your first issue is coming soon. Get ready to level up your financial game!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background: linear-gradient(135deg, #001f3f, #003366); color: #FFD700; padding: 15px 30px; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Welcome to the FR2 People Movement
                </div>
              </div>
              
              <div style="text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 15px;">
                <p>The FR2P Club - Financial Roadway 2 Prosperity</p>
                <p style="margin-bottom: 0;">&copy; ${new Date().getFullYear()} The FR2P Club. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
    
    console.log(`Magazine welcome email sent successfully to ${email}`);
  } catch (error) {
    console.error('Failed to send magazine welcome email:', error);
    throw error;
  }
}
