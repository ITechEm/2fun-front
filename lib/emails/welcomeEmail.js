export function getWelcomeEmailTemplate(name) {
  const year = new Date().getFullYear();
  return `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; text-align: center;">
      <img src="https://2funshops.com/logo.png" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
      <h2 style="color: #333;">Welcome to 2fun.shops, ${name}!</h2>
      <p style="font-size: 16px; color: #555;">We're thrilled to have you join our community.</p>
      <p style="font-size: 14px; color: #555;">Start exploring and enjoy our platform!</p>
      <a href="https://2funshops.com"
         style="display:inline-block; margin-top: 20px; padding: 12px 25px; background:#1f1f1f; color:white; border-radius:8px; text-decoration:none; font-size:16px;">
         Go to 2funshops
      </a>
      <p style="font-size: 12px; color: #aaa; margin-top: 20px;">©${year} 2funshops.com — All rights reserved</p>
    </div>
  `;
}
