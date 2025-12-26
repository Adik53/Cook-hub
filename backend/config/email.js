const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, code, username = 'друг') => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || `"Cook Hub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🍳 Verify your Cook Hub account',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #ff6b35 0%, #f72585 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">🍳 Cook Hub</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Hello, ${username}! 👋</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thanks for signing up for Cook Hub! To complete your registration, enter this verification code:
          </p>
          
          <div style="background: #fff7ed; border: 2px dashed #ff6b35; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
            <div style="font-size: 48px; font-weight: bold; color: #ff6b35; letter-spacing: 8px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            ⏰ This code expires in 10 minutes.
          </p>
          
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin-top: 30px; border-radius: 4px;">
            <p style="color: #991b1b; font-size: 14px; margin: 0;">
              <strong>⚠️ Security Notice:</strong><br>
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Cook Hub. All rights reserved.</p>
          <p>This is an automated email, please do not reply.</p>
        </div>
      </div>
    `,
        text: `
Hello, ${username}!

Your Cook Hub verification code is: ${code}

This code expires in 10 minutes.

If you didn't request this code, please ignore this email.

© ${new Date().getFullYear()} Cook Hub
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email send error:', error);
        throw error;
    }
};

module.exports = { sendVerificationEmail };