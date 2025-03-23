const verifyEmailTemplate = ({name, url}) => {
    return `
    <title>Email Verification</title>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table align="center" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <tr>
            <td align="center" style="padding: 20px;">
                <img src="https://your-logo-url.com/logo.png" alt="Binkeyit Logo" style="width: 150px;">
                <h2 style="color: #333;">Dear ${name}</h2>
                <h2 style="color: #333;">Verify Your Email Address</h2>
                <p style="color: #666; font-size: 16px;">You're almost there! Click the button below to verify your email and start shopping with Binkeyit.</p>
                <a href=${url} style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block; margin-top: 15px;">Verify Email</a>
                <p style="color: #666; font-size: 14px; margin-top: 20px;">If you didn’t request this email, you can safely ignore it.</p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">&copy; 2025 Binkeyit. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
    `
}

export default verifyEmailTemplate;