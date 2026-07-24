import nodemailer from 'nodemailer'

function getTransporter() {
  const host = process.env.EMAIL_SERVER_HOST
  const user = process.env.EMAIL_SERVER_USER
  const pass = process.env.EMAIL_SERVER_PASSWORD
  const port = parseInt(process.env.EMAIL_SERVER_PORT || '587', 10)

  if (!host || !user || !pass) {
    throw new Error(
      'Email not configured. Set EMAIL_SERVER_HOST, EMAIL_SERVER_USER, and EMAIL_SERVER_PASSWORD.'
    )
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendDailyReportToAdmin(
  adminEmail: string,
  excelBuffer: Buffer,
  options: {
    shopName: string
    filename: string
    dateRangeLabel: string
  }
): Promise<void> {
  const transporter = getTransporter()
  const from = process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER

  await transporter.sendMail({
    from: `"${options.shopName}" <${from}>`,
    to: adminEmail,
    subject: `Daily Sales Report — ${options.shopName} (${options.dateRangeLabel})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #1F3A60;">Daily Sales Report</h2>
        <p>Hello,</p>
        <p>Please find attached the sales report for <strong>${options.dateRangeLabel}</strong>.</p>
        <p style="color: #666; font-size: 14px;">This report was generated automatically by ${options.shopName} POS.</p>
      </div>
    `,
    attachments: [
      {
        filename: options.filename,
        content: excelBuffer,
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  })
}
