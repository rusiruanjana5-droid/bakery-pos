import prisma from '@/db'

export interface NotificationResult {
  success: boolean
  error?: string
}

export interface ShiftNotificationData {
  cashierName: string
  cashierUsername: string
  shiftId: number
  openingBalance: number
  previousClosingBalance?: number
  notes?: string
  timestamp: Date
  storeName: string
}

export interface ShiftEndNotificationData {
  cashierName: string
  cashierUsername: string
  shiftId: number
  openingBalance: number
  totalCashSales: number
  closingCash: number
  expectedCash: number
  discrepancy: number
  notes?: string
  shiftDuration: string
  shiftStartTime: Date
  shiftEndTime: Date
  timestamp: Date
  storeName: string
}

/**
 * Send email notification using Nodemailer
 * Note: Requires SMTP configuration in environment variables
 */
async function sendEmailNotification(
  to: string,
  subject: string,
  htmlBody: string
): Promise<NotificationResult> {
  try {
    // Check if SMTP credentials are configured
    const smtpUser = process.env.EMAIL_SERVER_USER
    const smtpPass = process.env.EMAIL_SERVER_PASSWORD
    const smtpHost = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com'
    const smtpPort = parseInt(process.env.EMAIL_SERVER_PORT || '587')

    if (!smtpUser || !smtpPass) {
      console.warn('Email notification skipped: SMTP credentials not configured (EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD)')
      console.warn('To enable email notifications, set EMAIL_SERVER_USER and EMAIL_SERVER_PASSWORD in your environment variables')
      return { 
        success: false, 
        error: 'SMTP credentials not configured' 
      }
    }

    // Dynamic import to avoid loading nodemailer if not needed
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || smtpUser,
      to,
      subject,
      html: htmlBody,
    })

    console.log('Email notification sent successfully to:', to)
    return { success: true }
  } catch (error) {
    console.error('Email notification error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    }
  }
}

/**
 * Send SMS notification using Dialog or Twilio
 * Note: Requires SMS gateway API credentials in environment variables
 */
async function sendSMSNotification(
  to: string,
  message: string
): Promise<NotificationResult> {
  try {
    // Remove any non-numeric characters except + for phone number
    const cleanPhone = to.replace(/[^\d+]/g, '')

    // Dialog SMS API (Sri Lanka)
    if (process.env.SMS_GATEWAY === 'dialog') {
      const response = await fetch('https://www.dialog.lk/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: process.env.DIALOG_SMS_USERNAME || '',
          password: process.env.DIALOG_SMS_PASSWORD || '',
          destination: cleanPhone,
          source: process.env.DIALOG_SMS_SOURCE || 'BakeryPOS',
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error('Dialog SMS API error')
      }

      return { success: true }
    }
    // Twilio API (International)
    else if (process.env.SMS_GATEWAY === 'twilio') {
      try {
        // @ts-ignore - Twilio is optional dependency
        const twilioModule = await import('twilio');
        const Twilio = (twilioModule as any).default || twilioModule;
        const client = Twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: cleanPhone,
        })

        return { success: true }
      } catch (twilioError) {
        throw new Error('Twilio package not installed or misconfigured')
      }
    }
    // Mock SMS for development
    else {
      console.log('[MOCK SMS] To:', cleanPhone, 'Message:', message)
      return { success: true }
    }
  } catch (error) {
    console.error('SMS notification error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown SMS error' 
    }
  }
}

/**
 * Send Telegram notification using Bot API
 */
async function sendTelegramNotification(
  chatId: string,
  message: string
): Promise<NotificationResult> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      throw new Error('Telegram bot token not configured')
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    const data = await response.json()
    if (!data.ok) {
      throw new Error(data.description || 'Telegram API error')
    }

    return { success: true }
  } catch (error) {
    console.error('Telegram notification error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown Telegram error' 
    }
  }
}

/**
 * Generate email HTML body for shift start notification
 */
function generateShiftEmailHTML(data: ShiftNotificationData): string {
  const formattedTime = new Date(data.timestamp).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 Cashier Shift Started</h2>
          <p>${data.storeName} - POS System Alert</p>
        </div>
        <div class="content">
          <div class="info-row">
            <span class="info-label">Cashier:</span>
            <span class="info-value">${data.cashierName} (@${data.cashierUsername})</span>
          </div>
          <div class="info-row">
            <span class="info-label">Shift ID:</span>
            <span class="info-value">#${data.shiftId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Start Time:</span>
            <span class="info-value">${formattedTime}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Opening Balance:</span>
            <span class="info-value">Rs. ${data.openingBalance.toFixed(2)}</span>
          </div>
          ${data.previousClosingBalance !== undefined ? `
          <div class="info-row">
            <span class="info-label">Previous Closing Balance:</span>
            <span class="info-value">Rs. ${data.previousClosingBalance.toFixed(2)}</span>
          </div>
          ` : ''}
          ${data.previousClosingBalance !== undefined && data.openingBalance !== data.previousClosingBalance ? `
          <div class="alert-box">
            <strong>⚠️ Discrepancy Detected:</strong><br>
            Opening balance differs from previous closing balance by Rs. ${Math.abs(data.openingBalance - data.previousClosingBalance).toFixed(2)}
          </div>
          ` : ''}
          ${data.notes ? `
          <div class="alert-box">
            <strong>📝 Notes:</strong><br>
            ${data.notes}
          </div>
          ` : ''}
          <div class="footer">
            <p>This is an automated notification from ${data.storeName} Bakery POS System</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate SMS message for shift start notification
 */
function generateShiftSMSMessage(data: ShiftNotificationData): string {
  const formattedTime = new Date(data.timestamp).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
  })

  let message = `[${data.storeName}] Cashier ${data.cashierName} started shift #${data.shiftId} at ${formattedTime}. Opening: Rs.${data.openingBalance.toFixed(2)}`
  
  if (data.previousClosingBalance !== undefined) {
    message += `. Prev Close: Rs.${data.previousClosingBalance.toFixed(2)}`
    
    if (data.openingBalance !== data.previousClosingBalance) {
      message += `. Diff: Rs.${Math.abs(data.openingBalance - data.previousClosingBalance).toFixed(2)}`
    }
  }
  
  if (data.notes) {
    message += `. Note: ${data.notes}`
  }
  
  return message
}

/**
 * Generate Telegram message for shift start notification
 */
function generateShiftTelegramMessage(data: ShiftNotificationData): string {
  const formattedTime = new Date(data.timestamp).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  let message = `
🔔 <b>Cashier Shift Started</b>

🏢 <b>Store:</b> ${data.storeName}
👤 <b>Cashier:</b> ${data.cashierName} (@${data.cashierUsername})
🆔 <b>Shift ID:</b> #${data.shiftId}
🕐 <b>Start Time:</b> ${formattedTime}
💰 <b>Opening Balance:</b> Rs. ${data.openingBalance.toFixed(2)}
  `

  if (data.previousClosingBalance !== undefined) {
    message += `\n💵 <b>Previous Closing Balance:</b> Rs. ${data.previousClosingBalance.toFixed(2)}`
    
    if (data.openingBalance !== data.previousClosingBalance) {
      message += `\n⚠️ <b>Discrepancy:</b> Rs. ${Math.abs(data.openingBalance - data.previousClosingBalance).toFixed(2)}`
    }
  }

  if (data.notes) {
    message += `\n📝 <b>Notes:</b> ${data.notes}`
  }

  return message
}

/**
 * Log notification result to database
 */
async function logNotification(
  type: string,
  recipient: string,
  channel: string,
  status: string,
  error?: string
): Promise<void> {
  try {
    await prisma.notificationLog.create({
      data: {
        type,
        recipient,
        channel,
        status,
        error,
      },
    })
  } catch (logError) {
    console.error('Failed to log notification:', logError)
  }
}

/**
 * Main function to send shift start notification
 * Sends via configured channels and logs results
 */
export async function sendShiftStartNotification(
  data: ShiftNotificationData,
  storeSettings: any
): Promise<void> {
  if (!storeSettings.enableLoginAlerts) {
    return
  }

  const channel = storeSettings.preferredAlertChannel || 'BOTH'

  // Send Email
  if (channel === 'EMAIL' || channel === 'BOTH') {
    if (storeSettings.adminNotificationEmail) {
      const emailHTML = generateShiftEmailHTML(data)
      const result = await sendEmailNotification(
        storeSettings.adminNotificationEmail,
        `Cashier Shift Started - ${data.storeName}`,
        emailHTML
      )
      
      await logNotification(
        'CASHIER_LOGIN',
        storeSettings.adminNotificationEmail,
        'EMAIL',
        result.success ? 'SUCCESS' : 'FAILED',
        result.error
      )
    }
  }

  // Send SMS
  if (channel === 'SMS' || channel === 'BOTH') {
    if (storeSettings.adminNotificationMobile) {
      const smsMessage = generateShiftSMSMessage(data)
      const result = await sendSMSNotification(
        storeSettings.adminNotificationMobile,
        smsMessage
      )
      
      await logNotification(
        'CASHIER_LOGIN',
        storeSettings.adminNotificationMobile,
        'SMS',
        result.success ? 'SUCCESS' : 'FAILED',
        result.error
      )
    }
  }

  // Send Telegram
  if (channel === 'TELEGRAM') {
    if (storeSettings.telegramChatId && storeSettings.telegramBotToken) {
      const telegramMessage = generateShiftTelegramMessage(data)
      const result = await sendTelegramNotification(
        storeSettings.telegramChatId,
        telegramMessage
      )
      
      await logNotification(
        'CASHIER_LOGIN',
        storeSettings.telegramChatId,
        'TELEGRAM',
        result.success ? 'SUCCESS' : 'FAILED',
        result.error
      )
    }
  }
}

/**
 * Generate email HTML body for shift end notification
 */
function generateShiftEndEmailHTML(data: ShiftEndNotificationData): string {
  const formattedStartTime = new Date(data.shiftStartTime).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  
  const formattedEndTime = new Date(data.shiftEndTime).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .info-label { font-weight: bold; color: #666; }
        .info-value { color: #333; }
        .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
        .alert-box.danger { background: #fee2e2; border-left: 4px solid #ef4444; }
        .alert-box.success { background: #dcfce7; border-left: 4px solid #22c55e; }
        .footer { text-align: center; margin-top: 20px; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔒 Cashier Shift Ended</h2>
          <p>${data.storeName} - POS System Alert</p>
        </div>
        <div class="content">
          <div class="info-row">
            <span class="info-label">Cashier:</span>
            <span class="info-value">${data.cashierName} (@${data.cashierUsername})</span>
          </div>
          <div class="info-row">
            <span class="info-label">Shift ID:</span>
            <span class="info-value">#${data.shiftId}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Start Time:</span>
            <span class="info-value">${formattedStartTime}</span>
          </div>
          <div class="info-row">
            <span class="info-label">End Time:</span>
            <span class="info-value">${formattedEndTime}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Shift Duration:</span>
            <span class="info-value">${data.shiftDuration}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Opening Balance:</span>
            <span class="info-value">Rs. ${data.openingBalance.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Cash Sales:</span>
            <span class="info-value">Rs. ${data.totalCashSales.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Expected Cash:</span>
            <span class="info-value">Rs. ${data.expectedCash.toFixed(2)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Closing Cash:</span>
            <span class="info-value">Rs. ${data.closingCash.toFixed(2)}</span>
          </div>
          ${data.discrepancy !== 0 ? `
          <div class="alert-box ${data.discrepancy > 0 ? 'success' : 'danger'}">
            <strong>${data.discrepancy > 0 ? '💰 Surplus' : '⚠️ Shortage'} Detected:</strong><br>
            ${data.discrepancy > 0 ? 'Cash exceeds expected by' : 'Cash is short by'} Rs. ${Math.abs(data.discrepancy).toFixed(2)}
          </div>
          ` : `
          <div class="alert-box">
            <strong>✅ Balanced:</strong><br>
            Cash drawer matches expected amount exactly.
          </div>
          `}
          ${data.notes ? `
          <div class="alert-box">
            <strong>📝 Notes:</strong><br>
            ${data.notes}
          </div>
          ` : ''}
          <div class="footer">
            <p>This is an automated notification from ${data.storeName} Bakery POS System</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

/**
 * Generate SMS message for shift end notification
 */
function generateShiftEndSMSMessage(data: ShiftEndNotificationData): string {
  const formattedEndTime = new Date(data.shiftEndTime).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    hour: '2-digit',
    minute: '2-digit',
  })

  let message = `[${data.storeName}] Cashier ${data.cashierName} ended shift #${data.shiftId} at ${formattedEndTime}. Duration: ${data.shiftDuration}. Closing: Rs.${data.closingCash.toFixed(2)}, Expected: Rs.${data.expectedCash.toFixed(2)}`
  
  if (data.discrepancy !== 0) {
    message += `. ${data.discrepancy > 0 ? 'Surplus' : 'Shortage'}: Rs.${Math.abs(data.discrepancy).toFixed(2)}`
  }
  
  if (data.notes) {
    message += `. Note: ${data.notes}`
  }
  
  return message
}

/**
 * Generate Telegram message for shift end notification
 */
function generateShiftEndTelegramMessage(data: ShiftEndNotificationData): string {
  const formattedStartTime = new Date(data.shiftStartTime).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'short',
  })
  
  const formattedEndTime = new Date(data.shiftEndTime).toLocaleString('en-LK', {
    timeZone: 'Asia/Colombo',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  let message = `
🔒 <b>Cashier Shift Ended</b>

🏢 <b>Store:</b> ${data.storeName}
👤 <b>Cashier:</b> ${data.cashierName} (@${data.cashierUsername})
🆔 <b>Shift ID:</b> #${data.shiftId}
🕐 <b>Start Time:</b> ${formattedStartTime}
🕐 <b>End Time:</b> ${formattedEndTime}
⏱️ <b>Duration:</b> ${data.shiftDuration}
💰 <b>Opening Balance:</b> Rs. ${data.openingBalance.toFixed(2)}
💵 <b>Cash Sales:</b> Rs. ${data.totalCashSales.toFixed(2)}
💲 <b>Expected Cash:</b> Rs. ${data.expectedCash.toFixed(2)}
💳 <b>Closing Cash:</b> Rs. ${data.closingCash.toFixed(2)}
  `

  if (data.discrepancy !== 0) {
    message += `\n${data.discrepancy > 0 ? '💰' : '⚠️'} <b>${data.discrepancy > 0 ? 'Surplus' : 'Shortage'}:</b> Rs. ${Math.abs(data.discrepancy).toFixed(2)}`
  } else {
    message += `\n✅ <b>Balanced:</b> Cash drawer matches expected amount`
  }

  if (data.notes) {
    message += `\n📝 <b>Notes:</b> ${data.notes}`
  }

  return message
}

/**
 * Main function to send shift end notification
 * Sends via configured channels and logs results
 */
export async function sendShiftEndNotification(
  data: ShiftEndNotificationData,
  storeSettings: any
): Promise<void> {
  if (!storeSettings.enableLoginAlerts) {
    return
  }

  const channel = storeSettings.preferredAlertChannel || 'BOTH'

  // Send Email
  if (channel === 'EMAIL' || channel === 'BOTH') {
    if (storeSettings.adminNotificationEmail) {
      const emailHTML = generateShiftEndEmailHTML(data)
      const result = await sendEmailNotification(
        storeSettings.adminNotificationEmail,
        `Cashier Shift Ended - ${data.storeName}`,
        emailHTML
      )
      
      await logNotification(
        'CASHIER_LOGOUT',
        storeSettings.adminNotificationEmail,
        'EMAIL',
        result.success ? 'SUCCESS' : 'FAILED',
        result.error
      )
    }
  }

  // Send SMS
  if (channel === 'SMS' || channel === 'BOTH') {
    if (storeSettings.adminNotificationMobile) {
      const smsMessage = generateShiftEndSMSMessage(data)
      const result = await sendSMSNotification(
        storeSettings.adminNotificationMobile,
        smsMessage
      )
      
      await logNotification(
        'CASHIER_LOGOUT',
        storeSettings.adminNotificationMobile,
        'SMS',
        result.success ? 'SUCCESS' : 'FAILED',
        result.error
      )
    }
  }

  // Send Telegram
  if (channel === 'TELEGRAM') {
    if (storeSettings.telegramChatId && storeSettings.telegramBotToken) {
      const telegramMessage = generateShiftEndTelegramMessage(data)
      const result = await sendTelegramNotification(
        storeSettings.telegramChatId,
        telegramMessage
      )
      
      await logNotification(
        'CASHIER_LOGOUT',
        storeSettings.telegramChatId,
        'TELEGRAM',
        result.success ? 'SUCCESS' : 'FAILED',
        result.error
      )
    }
  }
}
