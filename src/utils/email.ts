import nodemailer, { Transporter } from 'nodemailer';

// ─────────────────────────────────────────────────────────────────
// Transport — auto-switches between dev (Ethereal) and prod (SMTP)
// ─────────────────────────────────────────────────────────────────
let _transporter: Transporter | null = null;

async function getTransporter(): Promise<Transporter> {
  if (_transporter) return _transporter;

  if (process.env.NODE_ENV === 'production') {
    // Production: use real SMTP credentials from .env
    _transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Development: use Ethereal — free fake SMTP, no account needed
    // Preview URL is logged to console after each send
    const testAccount = await nodemailer.createTestAccount();
    _transporter = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`\n📧 [Ethereal] test account: ${testAccount.user}`);
  }

  return _transporter;
}

// ─────────────────────────────────────────────────────────────────
// Shared HTML wrapper — ShopHub branded
// ─────────────────────────────────────────────────────────────────
function htmlWrapper(bodyContent: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ShopHub</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: #0a0f0b;
      color: #f0faf2;
      padding: 40px 16px;
    }
    .wrapper {
      max-width: 520px;
      margin: 0 auto;
    }
    /* ── Logo ── */
    .logo {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px; height: 48px;
      background: #22c55e;
      border-radius: 12px;
      margin-bottom: 10px;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 700;
      color: #f0faf2;
      letter-spacing: -0.3px;
    }
    .logo-text span { color: #22c55e; }
    /* ── Card ── */
    .card {
      background: #111a13;
      border: 1px solid rgba(34,197,94,0.15);
      border-radius: 16px;
      overflow: hidden;
    }
    /* Top accent bar */
    .accent-bar {
      height: 3px;
      background: linear-gradient(90deg, transparent, #22c55e, transparent);
    }
    .card-body {
      padding: 36px 40px 40px;
    }
    /* ── Icon circle ── */
    .icon-circle {
      width: 64px; height: 64px;
      border-radius: 50%;
      background: rgba(34,197,94,0.1);
      border: 2px solid rgba(34,197,94,0.25);
      display: flex; align-items: center; justify-content: center;
      font-size: 28px;
      margin: 0 auto 24px;
    }
    /* ── Typography ── */
    h1 {
      font-size: 22px;
      font-weight: 700;
      color: #f0faf2;
      margin-bottom: 8px;
      text-align: center;
    }
    .subtitle {
      font-size: 13px;
      color: rgba(240,250,242,0.55);
      line-height: 1.6;
      text-align: center;
      margin-bottom: 28px;
    }
    /* ── CTA Button ── */
    .btn-wrap { text-align: center; margin-bottom: 28px; }
    .btn {
      display: inline-block;
      background: #22c55e;
      color: #000 !important;
      font-weight: 700;
      font-size: 14px;
      padding: 14px 36px;
      border-radius: 10px;
      text-decoration: none;
      letter-spacing: 0.2px;
    }
    /* ── URL fallback box ── */
    .url-box {
      background: rgba(34,197,94,0.05);
      border: 1px solid rgba(34,197,94,0.2);
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 24px;
    }
    .url-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: rgba(34,197,94,0.6);
      margin-bottom: 6px;
    }
    .url-text {
      font-size: 11px;
      color: rgba(240,250,242,0.4);
      word-break: break-all;
      line-height: 1.5;
    }
    /* ── Meta chips ── */
    .chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 28px;
    }
    .chip {
      font-size: 11px;
      font-weight: 600;
      color: #22c55e;
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid rgba(34,197,94,0.3);
      background: rgba(34,197,94,0.08);
    }
    /* ── Divider ── */
    .divider {
      height: 1px;
      background: rgba(34,197,94,0.1);
      margin: 24px 0;
    }
    /* ── Footer ── */
    .footer {
      font-size: 11px;
      color: rgba(240,250,242,0.25);
      text-align: center;
      line-height: 1.7;
      padding-top: 24px;
    }
    .footer a { color: #22c55e; text-decoration: none; }
    .security-note {
      font-size: 11px;
      color: rgba(240,250,242,0.35);
      text-align: center;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Logo -->
    <div class="logo">
      <div class="logo-icon">
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#fff" stroke-width="2.2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <br/>
      <span class="logo-text">Shop<span>Hub</span></span>
    </div>

    <!-- Card -->
    <div class="card">
      <div class="accent-bar"></div>
      <div class="card-body">
        ${bodyContent}
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© ${new Date().getFullYear()} ShopHub Marketplace · All rights reserved</p>
      <p style="margin-top:6px">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}">shophub.rw</a>
        &nbsp;·&nbsp;
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/privacy">Privacy Policy</a>
        &nbsp;·&nbsp;
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/help">Help Centre</a>
      </p>
      <p style="margin-top:6px">If you didn't request this, you can safely ignore this email.</p>
    </div>

  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────
// Send password reset email
// ─────────────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(opts: {
  to:       string;
  name:     string;
  resetURL: string;
}): Promise<void> {
  const { to, name, resetURL } = opts;
  const firstName = name.split(' ')[0];

  const body = `
    <div class="icon-circle">🔐</div>

    <h1>Reset your password</h1>
    <p class="subtitle">
      Hey ${firstName}, we received a request to reset the password
      for your ShopHub account. Click the button below to get started.
    </p>

    <!-- CTA -->
    <div class="btn-wrap">
      <a href="${resetURL}" class="btn">Reset My Password</a>
    </div>

    <!-- Security chips -->
    <div class="chips">
      <span class="chip">🔒 Encrypted link</span>
      <span class="chip">⏱️ Expires in 1 hour</span>
      <span class="chip">✉️ One-time use</span>
    </div>

    <div class="divider"></div>

    <!-- URL fallback -->
    <div class="url-box">
      <p class="url-label">Or copy this link into your browser</p>
      <p class="url-text">${resetURL}</p>
    </div>

    <p class="security-note">
      This link will expire in <strong style="color:#f0faf2">1 hour</strong>.<br/>
      If you didn't request a password reset, no action is needed —
      your account is safe.
    </p>
  `;

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from:    `"ShopHub" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@shophub.rw'}>`,
    to,
    subject: '🔐 Reset your ShopHub password',
    html:    htmlWrapper(body),
    text:    `Reset your ShopHub password\n\nHey ${firstName},\n\nClick this link to reset your password (expires in 1 hour):\n${resetURL}\n\nIf you didn't request this, ignore this email.\n\n— The ShopHub Team`,
  });

  // In dev: log the Ethereal preview URL so you can see the email in browser
  if (process.env.NODE_ENV !== 'production') {
    const previewURL = nodemailer.getTestMessageUrl(info);
    console.log(`\n📧 [Email sent] Preview: ${previewURL}\n`);
  }
}

// ─────────────────────────────────────────────────────────────────
// Send welcome email (after successful registration)
// ─────────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(opts: {
  to:   string;
  name: string;
  role: string;
}): Promise<void> {
  const { to, name, role } = opts;
  const firstName = name.split(' ')[0];

  const roleEmoji = role === 'seller' ? '🏪' : role === 'wholesaler' ? '🏭' : '🛍️';
  const roleCTA   = role === 'buyer'
    ? 'Start browsing thousands of products from verified sellers.'
    : 'Your shop is ready — start listing your products today.';

  const dashboardURL = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/${role}/dashboard`;

  const body = `
    <div class="icon-circle">${roleEmoji}</div>

    <h1>Welcome to ShopHub!</h1>
    <p class="subtitle">
      Hey ${firstName}, your account is all set up.<br/>
      ${roleCTA}
    </p>

    <div class="btn-wrap">
      <a href="${dashboardURL}" class="btn">Go to My Dashboard</a>
    </div>

    <div class="chips">
      <span class="chip">✅ Account verified</span>
      <span class="chip">${roleEmoji} ${role.charAt(0).toUpperCase() + role.slice(1)}</span>
      <span class="chip">🌍 ShopHub Marketplace</span>
    </div>

    <div class="divider"></div>

    <p class="security-note">
      If you have any questions, reply to this email or visit our
      <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/help" style="color:#22c55e">Help Centre</a>.
    </p>
  `;

  const transporter = await getTransporter();

  const info = await transporter.sendMail({
    from:    `"ShopHub" <${process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@shophub.rw'}>`,
    to,
    subject: `${roleEmoji} Welcome to ShopHub, ${firstName}!`,
    html:    htmlWrapper(body),
    text:    `Welcome to ShopHub, ${firstName}!\n\n${roleCTA}\n\nGo to your dashboard: ${dashboardURL}\n\n— The ShopHub Team`,
  });

  if (process.env.NODE_ENV !== 'production') {
    const previewURL = nodemailer.getTestMessageUrl(info);
    console.log(`\n📧 [Welcome email sent] Preview: ${previewURL}\n`);
  }
}