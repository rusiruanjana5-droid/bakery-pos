'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { saveStoreSettings } from '@/actions/store'
import { z } from 'zod'
import { sanitizeImageUrl } from '@/lib/imageUtils'

// Zod validation schema
const storeSettingsSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
  slogan: z.string().optional(),
  description: z.string().optional(),
  showNoticeOnReceipt: z.boolean().optional(),
  logoUrl: z.string().optional(),
  phone1: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  phone2: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  address: z.string().optional(),
  reportEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  themeType: z.enum(['solid', 'gradient']).optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  gradientFrom: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  gradientTo: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  sidebarBg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
  brNumber: z.string().optional(),
  receiptFooterMessage: z.string().optional(),
  facebookLink: z.string().url('Invalid URL').optional().or(z.literal('')),
  whatsappNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  defaultDeliveryCharge: z.number().min(0, 'Delivery charge must be positive').optional(),
  currencySymbol: z.string().optional(),
  receiptPrinterSize: z.enum(['58mm', '80mm']).optional(),
  businessHoursStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional().or(z.literal('')),
  businessHoursEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format').optional().or(z.literal('')),
  businessDays: z.string().optional(),
  vatRate: z.number().min(0).max(100).optional(),
  nbtRate: z.number().min(0).max(100).optional(),
  taxInclusive: z.boolean().optional(),
  printLogoOnReceipt: z.boolean().optional(),
  displayTaxBreakdown: z.boolean().optional(),
  autoOpenCashDrawer: z.boolean().optional(),
  includeQRCode: z.boolean().optional(),
  receiptHeaderMessage: z.string().optional(),
  kotPrinterIp: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address').optional().or(z.literal('')),
  kotPrinterPort: z.number().min(1).max(65535).optional(),
  cashDrawerTrigger: z.string().optional(),
  qrCodeUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  qrCodeLabel: z.string().optional(),
  paymentQrUrl: z.string().optional(),
  lowStockThreshold: z.number().min(0).max(1000).optional(),
  exportFormat: z.enum(['csv', 'xlsx', 'pdf']).optional(),
  // Notification settings
  adminNotificationEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  adminNotificationMobile: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, 'Invalid phone number').optional().or(z.literal('')),
  enableLoginAlerts: z.boolean().optional(),
  preferredAlertChannel: z.enum(['EMAIL', 'SMS', 'BOTH', 'TELEGRAM']).optional(),
  telegramChatId: z.string().optional(),
  telegramBotToken: z.string().optional(),
  // Delivery platform settings
  uberEatsEnabled: z.boolean().optional(),
  uberEatsMerchantId: z.string().optional(),
  uberEatsApiKey: z.string().optional(),
  uberEatsClientSecret: z.string().optional(),
  uberEatsWebhookUrl: z.string().optional(),
  pickMeEnabled: z.boolean().optional(),
  pickMeMerchantId: z.string().optional(),
  pickMeApiKey: z.string().optional(),
  pickMeSecretToken: z.string().optional(),
  pickMeWebhookUrl: z.string().optional()
})

type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>

interface StoreSettings {
  id?: number
  shopName: string
  slogan?: string
  description?: string
  showNoticeOnReceipt?: boolean
  logoUrl?: string
  phone1?: string
  phone2?: string
  address?: string
  reportEmail?: string
  themeType?: string
  primaryColor?: string
  gradientFrom?: string
  gradientTo?: string
  sidebarBg?: string
  accentColor?: string
  brNumber?: string
  receiptFooterMessage?: string
  facebookLink?: string
  whatsappNumber?: string
  defaultDeliveryCharge?: number
  currencySymbol?: string
  receiptPrinterSize?: string
  businessHoursStart?: string
  businessHoursEnd?: string
  businessDays?: string
  vatRate?: number
  nbtRate?: number
  taxInclusive?: boolean
  printLogoOnReceipt?: boolean
  displayTaxBreakdown?: boolean
  autoOpenCashDrawer?: boolean
  includeQRCode?: boolean
  receiptHeaderMessage?: string
  kotPrinterIp?: string
  kotPrinterPort?: number
  cashDrawerTrigger?: string
  qrCodeUrl?: string
  qrCodeLabel?: string
  paymentQrUrl?: string
  lowStockThreshold?: number
  exportFormat?: 'csv' | 'xlsx' | 'pdf'
  // Notification settings
  adminNotificationEmail?: string
  adminNotificationMobile?: string
  enableLoginAlerts?: boolean
  preferredAlertChannel?: 'EMAIL' | 'SMS' | 'BOTH' | 'TELEGRAM'
  telegramChatId?: string
  telegramBotToken?: string
  // Shift settings
  defaultShiftFloat?: number
  allowEditOpeningBalance?: boolean
  // Delivery platform settings
  uberEatsEnabled?: boolean
  uberEatsMerchantId?: string
  uberEatsApiKey?: string
  uberEatsClientSecret?: string
  uberEatsWebhookUrl?: string
  pickMeEnabled?: boolean
  pickMeMerchantId?: string
  pickMeApiKey?: string
  pickMeSecretToken?: string
  pickMeWebhookUrl?: string
}

interface StoreProfileClientProps {
  initialSettings: any;
}

type TabType = 'general' | 'receipt' | 'tax' | 'hardware' | 'theme' | 'notifications' | 'delivery'

export default function StoreProfileClient({ initialSettings }: StoreProfileClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [saving, setSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<StoreSettings>(() => {
    if (!initialSettings) {
      return {
        shopName: '',
        slogan: '',
        description: '',
        showNoticeOnReceipt: false,
        logoUrl: '',
        phone1: '',
        phone2: '',
        address: '',
        reportEmail: '',
        themeType: 'solid',
        primaryColor: '#f59e0b',
        gradientFrom: '#f59e0b',
        gradientTo: '#ec4899',
        sidebarBg: '#0f172a',
        accentColor: '#e11d48',
        brNumber: '',
        receiptFooterMessage: '',
        facebookLink: '',
        whatsappNumber: '',
        defaultDeliveryCharge: 0,
        currencySymbol: 'Rs.',
        receiptPrinterSize: '80mm',
        businessHoursStart: '',
        businessHoursEnd: '',
        businessDays: '0,1,2,3,4,5,6',
        vatRate: 0,
        nbtRate: 0,
        taxInclusive: false,
        printLogoOnReceipt: true,
        displayTaxBreakdown: true,
        autoOpenCashDrawer: false,
        includeQRCode: false,
        receiptHeaderMessage: '',
        kotPrinterIp: '',
        kotPrinterPort: 9100,
        cashDrawerTrigger: '',
        qrCodeUrl: '',
        qrCodeLabel: '',
        paymentQrUrl: '',
        lowStockThreshold: 5,
        exportFormat: 'csv',
        // Notification settings
        adminNotificationEmail: '',
        adminNotificationMobile: '',
        enableLoginAlerts: true,
        preferredAlertChannel: 'BOTH',
        telegramChatId: '',
        telegramBotToken: '',
        // Shift settings
        defaultShiftFloat: 0,
        allowEditOpeningBalance: true,
        // Delivery platform settings
        uberEatsEnabled: false,
        uberEatsMerchantId: '',
        uberEatsApiKey: '',
        uberEatsClientSecret: '',
        uberEatsWebhookUrl: '',
        pickMeEnabled: false,
        pickMeMerchantId: '',
        pickMeApiKey: '',
        pickMeSecretToken: '',
        pickMeWebhookUrl: ''
      }
    }
    return {
      id: initialSettings.id,
      shopName: initialSettings.shopName,
      slogan: initialSettings.slogan ?? '',
      description: initialSettings.description ?? '',
      showNoticeOnReceipt: initialSettings.showNoticeOnReceipt ?? false,
      logoUrl: initialSettings.logoUrl ?? '',
      phone1: initialSettings.phone1 ?? '',
      phone2: initialSettings.phone2 ?? '',
      address: initialSettings.address ?? '',
      reportEmail: initialSettings.reportEmail ?? '',
      themeType: initialSettings.themeType ?? 'solid',
      primaryColor: initialSettings.primaryColor ?? '#f59e0b',
      gradientFrom: initialSettings.gradientFrom ?? '#f59e0b',
      gradientTo: initialSettings.gradientTo ?? '#ec4899',
      sidebarBg: initialSettings.sidebarBg ?? '#0f172a',
      accentColor: initialSettings.accentColor ?? '#e11d48',
      brNumber: initialSettings.brNumber ?? '',
      receiptFooterMessage: initialSettings.receiptFooterMessage ?? '',
      facebookLink: initialSettings.facebookLink ?? '',
      whatsappNumber: initialSettings.whatsappNumber ?? '',
      defaultDeliveryCharge: initialSettings.defaultDeliveryCharge ?? 0,
      currencySymbol: initialSettings.currencySymbol ?? 'Rs.',
      receiptPrinterSize: initialSettings.receiptPrinterSize ?? '80mm',
      businessHoursStart: initialSettings.businessHoursStart ?? '',
      businessHoursEnd: initialSettings.businessHoursEnd ?? '',
      businessDays: initialSettings.businessDays ?? '0,1,2,3,4,5,6',
      vatRate: initialSettings.vatRate ?? 0,
      nbtRate: initialSettings.nbtRate ?? 0,
      taxInclusive: initialSettings.taxInclusive ?? false,
      printLogoOnReceipt: initialSettings.printLogoOnReceipt ?? true,
      displayTaxBreakdown: initialSettings.displayTaxBreakdown ?? true,
      autoOpenCashDrawer: initialSettings.autoOpenCashDrawer ?? false,
      includeQRCode: initialSettings.includeQRCode ?? false,
      receiptHeaderMessage: initialSettings.receiptHeaderMessage ?? '',
      kotPrinterIp: initialSettings.kotPrinterIp ?? '',
      kotPrinterPort: initialSettings.kotPrinterPort ?? 9100,
      cashDrawerTrigger: initialSettings.cashDrawerTrigger ?? '',
      qrCodeUrl: initialSettings.qrCodeUrl ?? '',
      qrCodeLabel: initialSettings.qrCodeLabel ?? '',
      paymentQrUrl: initialSettings.paymentQrUrl ?? '',
      lowStockThreshold: initialSettings.lowStockThreshold ?? 5,
      exportFormat: initialSettings.exportFormat ?? 'csv',
      // Notification settings
      adminNotificationEmail: initialSettings.adminNotificationEmail ?? '',
      adminNotificationMobile: initialSettings.adminNotificationMobile ?? '',
      enableLoginAlerts: initialSettings.enableLoginAlerts ?? true,
      preferredAlertChannel: initialSettings.preferredAlertChannel ?? 'BOTH',
      telegramChatId: initialSettings.telegramChatId ?? '',
      telegramBotToken: initialSettings.telegramBotToken ?? '',
      // Shift settings
      defaultShiftFloat: initialSettings.defaultShiftFloat ?? 0,
      allowEditOpeningBalance: initialSettings.allowEditOpeningBalance ?? true,
      // Delivery platform settings
      uberEatsEnabled: initialSettings.uberEatsEnabled ?? false,
      uberEatsMerchantId: initialSettings.uberEatsMerchantId ?? '',
      uberEatsApiKey: initialSettings.uberEatsApiKey ?? '',
      uberEatsClientSecret: initialSettings.uberEatsClientSecret ?? '',
      uberEatsWebhookUrl: initialSettings.uberEatsWebhookUrl ?? '',
      pickMeEnabled: initialSettings.pickMeEnabled ?? false,
      pickMeMerchantId: initialSettings.pickMeMerchantId ?? '',
      pickMeApiKey: initialSettings.pickMeApiKey ?? '',
      pickMeSecretToken: initialSettings.pickMeSecretToken ?? '',
      pickMeWebhookUrl: initialSettings.pickMeWebhookUrl ?? ''
    }
  })

  // Sync formData with initialSettings when it changes (after save/revalidation)
  useEffect(() => {
    if (initialSettings) {
      setFormData({
        id: initialSettings.id,
        shopName: initialSettings.shopName,
        slogan: initialSettings.slogan ?? '',
        description: initialSettings.description ?? '',
        showNoticeOnReceipt: initialSettings.showNoticeOnReceipt ?? false,
        logoUrl: initialSettings.logoUrl ?? '',
        phone1: initialSettings.phone1 ?? '',
        phone2: initialSettings.phone2 ?? '',
        address: initialSettings.address ?? '',
        reportEmail: initialSettings.reportEmail ?? '',
        themeType: initialSettings.themeType ?? 'solid',
        primaryColor: initialSettings.primaryColor ?? '#f59e0b',
        gradientFrom: initialSettings.gradientFrom ?? '#f59e0b',
        gradientTo: initialSettings.gradientTo ?? '#ec4899',
        sidebarBg: initialSettings.sidebarBg ?? '#0f172a',
        accentColor: initialSettings.accentColor ?? '#e11d48',
        brNumber: initialSettings.brNumber ?? '',
        receiptFooterMessage: initialSettings.receiptFooterMessage ?? '',
        facebookLink: initialSettings.facebookLink ?? '',
        whatsappNumber: initialSettings.whatsappNumber ?? '',
        defaultDeliveryCharge: initialSettings.defaultDeliveryCharge ?? 0,
        currencySymbol: initialSettings.currencySymbol ?? 'Rs.',
        receiptPrinterSize: initialSettings.receiptPrinterSize ?? '80mm',
        businessHoursStart: initialSettings.businessHoursStart ?? '',
        businessHoursEnd: initialSettings.businessHoursEnd ?? '',
        businessDays: initialSettings.businessDays ?? '0,1,2,3,4,5,6',
        vatRate: initialSettings.vatRate ?? 0,
        nbtRate: initialSettings.nbtRate ?? 0,
        taxInclusive: initialSettings.taxInclusive ?? false,
        printLogoOnReceipt: initialSettings.printLogoOnReceipt ?? true,
        displayTaxBreakdown: initialSettings.displayTaxBreakdown ?? true,
        autoOpenCashDrawer: initialSettings.autoOpenCashDrawer ?? false,
        includeQRCode: initialSettings.includeQRCode ?? false,
        receiptHeaderMessage: initialSettings.receiptHeaderMessage ?? '',
        kotPrinterIp: initialSettings.kotPrinterIp ?? '',
        kotPrinterPort: initialSettings.kotPrinterPort ?? 9100,
        cashDrawerTrigger: initialSettings.cashDrawerTrigger ?? '',
        qrCodeUrl: initialSettings.qrCodeUrl ?? '',
        qrCodeLabel: initialSettings.qrCodeLabel ?? '',
        paymentQrUrl: initialSettings.paymentQrUrl ?? '',
        lowStockThreshold: initialSettings.lowStockThreshold ?? 5,
        exportFormat: initialSettings.exportFormat ?? 'csv',
        // Notification settings
        adminNotificationEmail: initialSettings.adminNotificationEmail ?? '',
        adminNotificationMobile: initialSettings.adminNotificationMobile ?? '',
        enableLoginAlerts: initialSettings.enableLoginAlerts ?? true,
        preferredAlertChannel: initialSettings.preferredAlertChannel ?? 'BOTH',
        telegramChatId: initialSettings.telegramChatId ?? '',
        telegramBotToken: initialSettings.telegramBotToken ?? '',
        // Shift settings
        defaultShiftFloat: initialSettings.defaultShiftFloat ?? 0,
        allowEditOpeningBalance: initialSettings.allowEditOpeningBalance ?? true,
        // Delivery platform settings
        uberEatsEnabled: initialSettings.uberEatsEnabled ?? false,
        uberEatsMerchantId: initialSettings.uberEatsMerchantId ?? '',
        uberEatsApiKey: initialSettings.uberEatsApiKey ?? '',
        uberEatsClientSecret: initialSettings.uberEatsClientSecret ?? '',
        uberEatsWebhookUrl: initialSettings.uberEatsWebhookUrl ?? '',
        pickMeEnabled: initialSettings.pickMeEnabled ?? false,
        pickMeMerchantId: initialSettings.pickMeMerchantId ?? '',
        pickMeApiKey: initialSettings.pickMeApiKey ?? '',
        pickMeSecretToken: initialSettings.pickMeSecretToken ?? '',
        pickMeWebhookUrl: initialSettings.pickMeWebhookUrl ?? ''
      })
    }
  }, [initialSettings])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'logo')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          logoUrl: data.url
        }))
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload image')
      }
    }
  }

  const handlePaymentQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'paymentQr')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const data = await response.json()
        setFormData(prev => ({
          ...prev,
          paymentQrUrl: data.url
        }))
      } catch (error) {
        console.error('Upload error:', error)
        alert('Failed to upload image')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setValidationErrors({})

    try {
      // Validate form data
      const validationResult = storeSettingsSchema.safeParse(formData)
      
      if (!validationResult.success) {
        const errors: Record<string, string> = {}
        validationResult.error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            errors[issue.path[0] as string] = issue.message
          }
        })
        setValidationErrors(errors)
        setToastMessage('Please fix the validation errors')
        setToastType('error')
        setShowToast(true)
        setTimeout(() => setShowToast(false), 3000)
        setSaving(false)
        return
      }

      await saveStoreSettings(formData)
      setToastMessage('Store settings saved successfully!')
      setToastType('success')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      // Refresh the page to fetch updated data from database
      router.refresh()
    } catch (error) {
      console.error('Failed to save settings:', error)
      setToastMessage('Failed to save settings')
      setToastType('error')
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general' as TabType, label: '🏢 General Info', icon: '🏢' },
    { id: 'receipt' as TabType, label: '🧾 Receipt & Branding', icon: '🧾' },
    { id: 'tax' as TabType, label: '💰 Tax & Currency', icon: '💰' },
    { id: 'hardware' as TabType, label: '🖨️ Printers & Hardware', icon: '🖨️' },
    { id: 'theme' as TabType, label: '🎨 Theme Customization', icon: '🎨' },
    { id: 'notifications' as TabType, label: '🔔 Notifications & Alerts', icon: '🔔' },
    { id: 'delivery' as TabType, label: '🚚 Delivery Integrations', icon: '🚚' }
  ]

  return (
    <div className="p-3">
      <div className="max-w-6xl mx-auto">
        {/* Toast Notification */}
        {showToast && (
          <div className={`fixed top-4 right-4 px-3 py-2 rounded-lg shadow-lg z-50 text-xs ${
            toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {toastMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="shadow-sm border border-slate-200 bg-white rounded-lg mb-3">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[150px] px-3 py-2 text-xs font-medium transition-colors h-10 ${
                  activeTab === tab.id
                    ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="shadow-sm border border-slate-200 bg-white rounded-lg p-3">
          {activeTab === 'general' && (
            <GeneralInfoTab formData={formData} setFormData={setFormData} handleFileChange={handleFileChange} validationErrors={validationErrors} />
          )}
          {activeTab === 'receipt' && (
            <ReceiptBrandingTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} handleFileChange={handleFileChange} handlePaymentQrUpload={handlePaymentQrUpload} />
          )}
          {activeTab === 'tax' && (
            <TaxCurrencyTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {activeTab === 'hardware' && (
            <HardwareTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {activeTab === 'theme' && (
            <ThemeCustomizationTab formData={formData} setFormData={setFormData} />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}
          {activeTab === 'delivery' && (
            <DeliveryTab formData={formData} setFormData={setFormData} validationErrors={validationErrors} />
          )}

          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-4 py-1.5 text-xs bg-primary text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed h-8"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// General Info Tab Component
function GeneralInfoTab({ formData, setFormData, handleFileChange, validationErrors }: any) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Logo Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Logo Image</label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-gray-500
                file:mr-2 file:py-1 file:px-2
                file:rounded-lg file:border-0
                file:text-xs file:font-medium
                file:bg-amber-50 file:text-amber-700
                hover:file:bg-amber-100
                cursor-pointer"
            />
            {(() => {
              const sanitizedUrl = sanitizeImageUrl(formData.logoUrl)
              if (sanitizedUrl) {
                return (
                  <div className="relative">
                    <img
                      src={sanitizedUrl}
                      alt="Shop Logo Preview"
                      className="h-20 w-full object-contain rounded-md border border-slate-200 bg-gray-50"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <div className="hidden h-20 w-full flex items-center justify-center rounded-md border border-slate-200 bg-gray-50 text-gray-400 text-xs">
                      Failed to load image
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </div>
        </div>

        {/* Shop Name */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Shop Name *</label>
          <input
            type="text"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
              validationErrors.shopName ? 'border-red-500' : 'border-slate-200'
            }`}
            required
          />
          {validationErrors.shopName && (
            <p className="mt-0.5 text-xs text-red-600">{validationErrors.shopName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Slogan */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Slogan</label>
          <input
            type="text"
            value={formData.slogan}
            onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            placeholder="e.g., Fresh Baked Daily"
          />
        </div>

        {/* Phone 1 */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Primary Phone</label>
          <input
            type="tel"
            value={formData.phone1}
            onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
            className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
              validationErrors.phone1 ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="+94 77 123 4567"
          />
          {validationErrors.phone1 && (
            <p className="mt-0.5 text-xs text-red-600">{validationErrors.phone1}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Phone 2 */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Secondary Phone</label>
          <input
            type="tel"
            value={formData.phone2}
            onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
            className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
              validationErrors.phone2 ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="+94 77 987 6543"
          />
          {validationErrors.phone2 && (
            <p className="mt-0.5 text-xs text-red-600">{validationErrors.phone2}</p>
          )}
        </div>

        {/* Report Email */}
        <div>
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Report Email</label>
          <input
            type="email"
            value={formData.reportEmail}
            onChange={(e) => setFormData({ ...formData, reportEmail: e.target.value })}
            className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
              validationErrors.reportEmail ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="admin@yourbakery.com"
          />
          {validationErrors.reportEmail && (
            <p className="mt-0.5 text-xs text-red-600">{validationErrors.reportEmail}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="123 Main Street, City, Country"
        />
      </div>

      {/* Important Notice (For Receipt) */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">IMPORTANT NOTICE (For Receipt)</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2}
          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          placeholder="e.g., Return Policy: No returns after 24 hours"
        />
        <p className="mt-0.5 text-xs text-gray-500">This text will appear near the bottom of printed receipts when enabled (e.g. Return Policy, Special Instructions).</p>
      </div>

      {/* Show Important Notice on Receipt Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold uppercase text-gray-500">Show Important Notice on Receipt</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.showNoticeOnReceipt}
              onChange={(e) => setFormData({ ...formData, showNoticeOnReceipt: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
        </label>
        <p className="mt-0.5 text-xs text-gray-500">Enable to display the Important Notice text on printed receipts</p>
      </div>

      {/* Low Stock Threshold */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Low Stock Alert Threshold</label>
        <input
          type="number"
          min="0"
          max="1000"
          value={formData.lowStockThreshold}
          onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
          className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
            validationErrors.lowStockThreshold ? 'border-red-500' : 'border-slate-200'
          }`}
          placeholder="5"
        />
        <p className="mt-0.5 text-xs text-gray-500">Products with stock below this quantity will be flagged as low stock</p>
        {validationErrors.lowStockThreshold && (
          <p className="mt-0.5 text-xs text-red-600">{validationErrors.lowStockThreshold}</p>
        )}
      </div>

      {/* Export Format */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Default Export File Format</label>
        <select
          value={formData.exportFormat}
          onChange={(e) => setFormData({ ...formData, exportFormat: e.target.value as 'csv' | 'xlsx' | 'pdf' })}
          className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
        >
          <option value="csv">CSV (.csv)</option>
          <option value="xlsx">Excel (.xlsx)</option>
          <option value="pdf">PDF (.pdf)</option>
        </select>
        <p className="mt-0.5 text-xs text-gray-500">Default format for dashboard sales report exports</p>
      </div>

      {/* Business Hours */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Business Hours</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Opening Time</label>
            <input
              type="time"
              value={formData.businessHoursStart}
              onChange={(e) => setFormData({ ...formData, businessHoursStart: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Closing Time</label>
            <input
              type="time"
              value={formData.businessHoursEnd}
              onChange={(e) => setFormData({ ...formData, businessHoursEnd: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            />
          </div>
        </div>
      </div>

      {/* Theme Customization */}
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Theme Customization</h3>
        <div className="mb-3">
          <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Theme Type</label>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="themeType"
                value="solid"
                checked={formData.themeType === 'solid'}
                onChange={(e) => setFormData({ ...formData, themeType: e.target.value })}
                className="w-3 h-3 text-amber-500 focus:ring-amber-500 border-slate-200"
              />
              <span className="text-xs text-gray-700">Solid Theme</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="themeType"
                value="gradient"
                checked={formData.themeType === 'gradient'}
                onChange={(e) => setFormData({ ...formData, themeType: e.target.value })}
                className="w-3 h-3 text-amber-500 focus:ring-amber-500 border-slate-200"
              />
              <span className="text-xs text-gray-700">Gradient Theme</span>
            </label>
          </div>
        </div>

        {formData.themeType === 'solid' ? (
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Primary Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Gradient Start</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.gradientFrom}
                  onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={formData.gradientFrom}
                  onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Gradient End</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.gradientTo}
                  onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border border-slate-200"
                />
                <input
                  type="text"
                  value={formData.gradientTo}
                  onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Receipt & Branding Tab Component
function ReceiptBrandingTab({ formData, setFormData, validationErrors, handleFileChange, handlePaymentQrUpload }: any) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Receipt Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800">Receipt Settings</h3>
          
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">BR Number / Tax Number (TIN/VNO)</label>
            <input
              type="text"
              value={formData.brNumber}
              onChange={(e) => setFormData({ ...formData, brNumber: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              placeholder="Enter business registration or tax number"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Receipt Header Message</label>
            <textarea
              value={formData.receiptHeaderMessage}
              onChange={(e) => setFormData({ ...formData, receiptHeaderMessage: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Thank you for shopping with us!"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Receipt Footer Message</label>
            <textarea
              value={formData.receiptFooterMessage}
              onChange={(e) => setFormData({ ...formData, receiptFooterMessage: e.target.value })}
              rows={2}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="e.g., Please consume within 4 hours"
            />
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2 pt-3 border-t border-gray-200">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-700">Print Logo on Receipt</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.printLogoOnReceipt}
                  onChange={(e) => setFormData({ ...formData, printLogoOnReceipt: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-700">Display Tax Breakdown</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.displayTaxBreakdown}
                  onChange={(e) => setFormData({ ...formData, displayTaxBreakdown: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-gray-700">Include QR Code</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.includeQRCode}
                  onChange={(e) => setFormData({ ...formData, includeQRCode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Receipt Preview */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 mb-3">Receipt Preview</h3>
          <div className="bg-white border border-slate-200 rounded-lg p-3 font-mono text-xs" style={{ maxWidth: formData.receiptPrinterSize === '58mm' ? '200px' : '300px', margin: '0 auto' }}>
            {formData.printLogoOnReceipt && (() => {
              const sanitizedUrl = sanitizeImageUrl(formData.logoUrl)
              if (sanitizedUrl) {
                return (
                  <div className="text-center mb-2">
                    <img
                      src={sanitizedUrl}
                      alt="Logo"
                      className="h-10 mx-auto object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                )
              }
              return null
            })()}
            <div className="text-center font-bold mb-2">{formData.shopName}</div>
            {formData.slogan && <div className="text-center text-gray-600 mb-2">{formData.slogan}</div>}
            {formData.address && <div className="text-center text-gray-600 mb-2">{formData.address}</div>}
            {formData.phone1 && <div className="text-center text-gray-600 mb-2">{formData.phone1}</div>}
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            <div className="text-center text-gray-600 mb-2">Date: {new Date().toLocaleDateString()}</div>
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            <div className="flex justify-between mb-1">
              <span>Item 1 x 2</span>
              <span>Rs. 200.00</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Item 2 x 1</span>
              <span>Rs. 150.00</span>
            </div>
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rs. 350.00</span>
            </div>
            {formData.displayTaxBreakdown && (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>VAT</span>
                  <span>Rs. 35.00</span>
                </div>
              </>
            )}
            <div className="border-t border-dashed border-gray-400 my-2"></div>
            {formData.receiptHeaderMessage && <div className="text-center text-gray-600 mb-2">{formData.receiptHeaderMessage}</div>}
            {formData.receiptFooterMessage && <div className="text-center text-gray-600 mb-2">{formData.receiptFooterMessage}</div>}
            {formData.includeQRCode && (
              <div className="text-center mt-2">
                <div className="w-16 h-16 bg-gray-200 mx-auto flex items-center justify-center text-gray-400">
                  QR
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Social Links</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Facebook Page Link</label>
            <input
              type="url"
              value={formData.facebookLink}
              onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
              className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                validationErrors.facebookLink ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="https://facebook.com/yourbakery"
            />
            {validationErrors.facebookLink && (
              <p className="mt-0.5 text-xs text-red-600">{validationErrors.facebookLink}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">WhatsApp Number</label>
            <input
              type="tel"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                validationErrors.whatsappNumber ? 'border-red-500' : 'border-slate-200'
              }`}
              placeholder="+94 77 123 4567"
            />
            {validationErrors.whatsappNumber && (
              <p className="mt-0.5 text-xs text-red-600">{validationErrors.whatsappNumber}</p>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Settings */}
      {formData.includeQRCode && (
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Receipt QR Code Settings</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">QR Code URL</label>
              <input
                type="url"
                value={formData.qrCodeUrl}
                onChange={(e) => setFormData({ ...formData, qrCodeUrl: e.target.value })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.qrCodeUrl ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="https://yourbakery.com"
              />
              {validationErrors.qrCodeUrl && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.qrCodeUrl}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">QR Code Label</label>
              <input
                type="text"
                value={formData.qrCodeLabel}
                onChange={(e) => setFormData({ ...formData, qrCodeLabel: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                placeholder="Scan for more info"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment QR Code Settings */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Payment QR Code (LANKAQR / Pay&Go)</h3>
        <p className="text-xs text-gray-600 mb-3">Upload your bank's QR code image for POS payments. This will be displayed in the payment modal when customers select QR payment.</p>
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Upload QR Code Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePaymentQrUpload}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {formData.paymentQrUrl && (
            <div className="mt-3">
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Preview</label>
              <div className="w-32 h-32 bg-white rounded-lg border-2 border-blue-300 p-2 flex items-center justify-center">
                <img
                  src={formData.paymentQrUrl}
                  alt="Payment QR Code Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, paymentQrUrl: '' })}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                Remove QR Code
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Tax & Currency Tab Component
function TaxCurrencyTab({ formData, setFormData, validationErrors }: any) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Currency Settings */}
        <div className="bg-green-50 p-3 rounded-lg border border-green-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Currency Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Currency Symbol</label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              >
                <option value="Rs.">Rs. (Sri Lankan Rupee)</option>
                <option value="LKR">LKR</option>
                <option value="$">$ (US Dollar)</option>
                <option value="€">€ (Euro)</option>
                <option value="£">£ (British Pound)</option>
                <option value="₹">₹ (Indian Rupee)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Default Delivery Charge</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.defaultDeliveryCharge}
                onChange={(e) => setFormData({ ...formData, defaultDeliveryCharge: parseFloat(e.target.value) || 0 })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.defaultDeliveryCharge ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="0.00"
              />
              {validationErrors.defaultDeliveryCharge && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.defaultDeliveryCharge}</p>
              )}
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Tax Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">VAT Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.vatRate}
                onChange={(e) => setFormData({ ...formData, vatRate: parseFloat(e.target.value) || 0 })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.vatRate ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="0"
              />
              {validationErrors.vatRate && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.vatRate}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">NBT Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.nbtRate}
                onChange={(e) => setFormData({ ...formData, nbtRate: parseFloat(e.target.value) || 0 })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.nbtRate ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="0"
              />
              {validationErrors.nbtRate && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.nbtRate}</p>
              )}
            </div>
            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-700">Tax Inclusive Pricing</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.taxInclusive}
                  onChange={(e) => setFormData({ ...formData, taxInclusive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Tax Info */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Tax Information</h3>
        <p className="text-xs text-gray-600">
          <strong>VAT (Value Added Tax):</strong> Applied to taxable goods and services.<br />
          <strong>NBT (Nation Building Tax):</strong> Additional tax applicable in some regions.<br />
          <strong>Tax Inclusive:</strong> When enabled, prices include tax. When disabled, tax is added at checkout.
        </p>
      </div>
    </div>
  )
}

// Hardware Tab Component
function HardwareTab({ formData, setFormData, validationErrors }: any) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Printer Settings */}
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Printer Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Receipt Printer Size</label>
              <select
                value={formData.receiptPrinterSize}
                onChange={(e) => setFormData({ ...formData, receiptPrinterSize: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
              >
                <option value="80mm">80mm (3-inch)</option>
                <option value="58mm">58mm (2-inch)</option>
              </select>
            </div>

            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-gray-200">
              <span className="text-xs text-gray-700">Auto Open Cash Drawer</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.autoOpenCashDrawer}
                  onChange={(e) => setFormData({ ...formData, autoOpenCashDrawer: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </div>
            </label>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Cash Drawer Trigger Command</label>
              <input
                type="text"
                value={formData.cashDrawerTrigger}
                onChange={(e) => setFormData({ ...formData, cashDrawerTrigger: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                placeholder="ESC/POS command sequence"
              />
            </div>
          </div>
        </div>

        {/* KOT Printer Settings */}
        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Kitchen Ticket Printer (KOT)</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">KOT Printer IP Address</label>
              <input
                type="text"
                value={formData.kotPrinterIp}
                onChange={(e) => setFormData({ ...formData, kotPrinterIp: e.target.value })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.kotPrinterIp ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="192.168.1.100"
              />
              {validationErrors.kotPrinterIp && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.kotPrinterIp}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">KOT Printer Port</label>
              <input
                type="number"
                min="1"
                max="65535"
                value={formData.kotPrinterPort}
                onChange={(e) => setFormData({ ...formData, kotPrinterPort: parseInt(e.target.value) || 9100 })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.kotPrinterPort ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="9100"
              />
              {validationErrors.kotPrinterPort && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.kotPrinterPort}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Info */}
      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-2">Hardware Configuration Guide</h3>
        <p className="text-xs text-gray-600">
          <strong>Receipt Printer:</strong> Select the appropriate paper size for your thermal printer (58mm or 80mm).<br />
          <strong>Cash Drawer:</strong> Enable auto-open to automatically trigger the cash drawer on cash payments. Configure the ESC/POS trigger command if needed.<br />
          <strong>KOT Printer:</strong> Configure IP address and port for network-connected kitchen ticket printers.
        </p>
      </div>
    </div>
  )
}

// Theme Customization Tab Component
function ThemeCustomizationTab({ formData, setFormData }: any) {
  // Live preview: Apply theme changes to DOM in real-time
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement
      
      if (formData.primaryColor) {
        root.style.setProperty('--primary-color', formData.primaryColor)
      }
      if (formData.sidebarBg) {
        root.style.setProperty('--sidebar-bg', formData.sidebarBg)
      }
      if (formData.accentColor) {
        root.style.setProperty('--accent-color', formData.accentColor)
      }
      if (formData.gradientFrom) {
        root.style.setProperty('--gradient-from', formData.gradientFrom)
      }
      if (formData.gradientTo) {
        root.style.setProperty('--gradient-to', formData.gradientTo)
      }
    }
  }, [formData.primaryColor, formData.sidebarBg, formData.accentColor, formData.gradientFrom, formData.gradientTo])

  const applyPreset = (preset: string) => {
    const presets: Record<string, any> = {
      'bakery-warm': {
        themeType: 'gradient',
        primaryColor: '#f59e0b',
        gradientFrom: '#f59e0b',
        gradientTo: '#ec4899',
        sidebarBg: '#0f172a',
        accentColor: '#e11d48'
      },
      'modern-emerald': {
        themeType: 'solid',
        primaryColor: '#10b981',
        gradientFrom: '#10b981',
        gradientTo: '#059669',
        sidebarBg: '#1e293b',
        accentColor: '#065f46'
      },
      'corporate-blue': {
        themeType: 'solid',
        primaryColor: '#3b82f6',
        gradientFrom: '#3b82f6',
        gradientTo: '#1d4ed8',
        sidebarBg: '#1e3a8a',
        accentColor: '#1e40af'
      },
      'dark-luxury': {
        themeType: 'gradient',
        primaryColor: '#fbbf24',
        gradientFrom: '#1f2937',
        gradientTo: '#111827',
        sidebarBg: '#000000',
        accentColor: '#fbbf24'
      }
    }
    
    if (presets[preset]) {
      setFormData({ ...formData, ...presets[preset] })
    }
  }

  return (
    <div className="space-y-4">
      {/* Pre-made Presets */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">🎨 Quick Presets</h3>
        <p className="text-xs text-gray-600 mb-3">Choose a pre-designed theme to instantly apply a complete color scheme.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('bakery-warm')}
            className="p-3 rounded-lg border-2 border-orange-300 bg-gradient-to-br from-orange-100 to-pink-100 hover:from-orange-200 hover:to-pink-200 transition-all text-xs font-semibold text-orange-800"
          >
            🥐 Bakery Warm
          </button>
          <button
            type="button"
            onClick={() => applyPreset('modern-emerald')}
            className="p-3 rounded-lg border-2 border-emerald-300 bg-gradient-to-br from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 transition-all text-xs font-semibold text-emerald-800"
          >
            🌿 Modern Emerald
          </button>
          <button
            type="button"
            onClick={() => applyPreset('corporate-blue')}
            className="p-3 rounded-lg border-2 border-blue-300 bg-gradient-to-br from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 transition-all text-xs font-semibold text-blue-800"
          >
            💼 Corporate Blue
          </button>
          <button
            type="button"
            onClick={() => applyPreset('dark-luxury')}
            className="p-3 rounded-lg border-2 border-yellow-300 bg-gradient-to-br from-gray-800 to-black hover:from-gray-900 hover:to-black transition-all text-xs font-semibold text-yellow-400"
          >
            ✨ Dark Luxury
          </button>
        </div>
      </div>

      {/* Theme Mode */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Theme Mode</h3>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="themeType"
              value="solid"
              checked={formData.themeType === 'solid'}
              onChange={(e) => setFormData({ ...formData, themeType: e.target.value })}
              className="w-4 h-4 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-xs text-gray-700">Solid Theme</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="themeType"
              value="gradient"
              checked={formData.themeType === 'gradient'}
              onChange={(e) => setFormData({ ...formData, themeType: e.target.value })}
              className="w-4 h-4 text-amber-500 focus:ring-amber-500"
            />
            <span className="text-xs text-gray-700">Gradient Theme</span>
          </label>
        </div>
      </div>

      {/* Color Pickers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Primary Color */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Primary Color</h3>
          <p className="text-xs text-gray-600 mb-2">Controls active sidebar items, primary buttons, and accent highlights.</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="#f59e0b"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        {/* Sidebar Background */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Sidebar Background</h3>
          <p className="text-xs text-gray-600 mb-2">Controls the left navigation sidebar background color.</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.sidebarBg}
              onChange={(e) => setFormData({ ...formData, sidebarBg: e.target.value })}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formData.sidebarBg}
              onChange={(e) => setFormData({ ...formData, sidebarBg: e.target.value })}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="#0f172a"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-bold text-gray-800 mb-3">Accent Color</h3>
          <p className="text-xs text-gray-600 mb-2">Controls active text color and badge highlights.</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.accentColor}
              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
              className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={formData.accentColor}
              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
              className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="#e11d48"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>

        {/* Gradient Colors (only for gradient theme) */}
        {formData.themeType === 'gradient' && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Gradient Colors</h3>
            <p className="text-xs text-gray-600 mb-2">Configure gradient start and end colors.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Gradient From</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.gradientFrom}
                    onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                    className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.gradientFrom}
                    onChange={(e) => setFormData({ ...formData, gradientFrom: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="#f59e0b"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Gradient To</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.gradientTo}
                    onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                    className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.gradientTo}
                    onChange={(e) => setFormData({ ...formData, gradientTo: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="#ec4899"
                    pattern="^#[0-9A-Fa-f]{6}$"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Live Preview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: formData.sidebarBg }}
          >
            <div
              className="p-2 rounded mb-2 text-white text-xs font-semibold"
              style={{ backgroundColor: formData.primaryColor }}
            >
              Active Menu Item
            </div>
            <div className="text-white text-xs opacity-70">Inactive Menu Item</div>
          </div>
          <div className="space-y-2">
            <button
              className="w-full py-2 rounded-lg text-white text-xs font-semibold"
              style={{ backgroundColor: formData.primaryColor }}
            >
              Primary Button
            </button>
            <div
              className="p-2 rounded text-white text-xs font-semibold text-center"
              style={{ backgroundColor: formData.accentColor }}
            >
              Accent Badge
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Notifications Tab Component
function NotificationsTab({ formData, setFormData, validationErrors }: any) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
        <h3 className="text-sm font-bold text-gray-800 mb-2">🔔 Cashier Login Alert System</h3>
        <p className="text-xs text-gray-600">Configure real-time notifications when cashiers start their shifts. Receive alerts via Email, SMS, or Telegram.</p>
      </div>

      {/* Enable Login Alerts Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold uppercase text-gray-500">Enable Cashier Login Alerts</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.enableLoginAlerts}
              onChange={(e) => setFormData({ ...formData, enableLoginAlerts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
        </label>
        <p className="mt-0.5 text-xs text-gray-500">Send notifications to admin when cashiers start their shifts</p>
      </div>

      {formData.enableLoginAlerts && (
        <>
          {/* Preferred Alert Channel */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Preferred Alert Channel</label>
            <select
              value={formData.preferredAlertChannel}
              onChange={(e) => setFormData({ ...formData, preferredAlertChannel: e.target.value as 'EMAIL' | 'SMS' | 'BOTH' | 'TELEGRAM' })}
              className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            >
              <option value="EMAIL">Email Only</option>
              <option value="SMS">SMS Only</option>
              <option value="BOTH">Email & SMS</option>
              <option value="TELEGRAM">Telegram Bot</option>
            </select>
            <p className="mt-0.5 text-xs text-gray-500">Select how you want to receive cashier login notifications</p>
          </div>

          {/* Admin Notification Email */}
          {(formData.preferredAlertChannel === 'EMAIL' || formData.preferredAlertChannel === 'BOTH') && (
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Admin Notification Email</label>
              <input
                type="email"
                value={formData.adminNotificationEmail}
                onChange={(e) => setFormData({ ...formData, adminNotificationEmail: e.target.value })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.adminNotificationEmail ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="admin@yourbakery.com"
              />
              {validationErrors.adminNotificationEmail && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.adminNotificationEmail}</p>
              )}
              <p className="mt-0.5 text-xs text-gray-500">Email address to receive cashier login alerts</p>
            </div>
          )}

          {/* Admin Notification Mobile */}
          {(formData.preferredAlertChannel === 'SMS' || formData.preferredAlertChannel === 'BOTH') && (
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Admin Notification Mobile</label>
              <input
                type="tel"
                value={formData.adminNotificationMobile}
                onChange={(e) => setFormData({ ...formData, adminNotificationMobile: e.target.value })}
                className={`w-full px-2 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8 ${
                  validationErrors.adminNotificationMobile ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="+94 77 123 4567"
              />
              {validationErrors.adminNotificationMobile && (
                <p className="mt-0.5 text-xs text-red-600">{validationErrors.adminNotificationMobile}</p>
              )}
              <p className="mt-0.5 text-xs text-gray-500">Mobile number to receive SMS alerts (E.164 format)</p>
            </div>
          )}

          {/* Telegram Settings */}
          {formData.preferredAlertChannel === 'TELEGRAM' && (
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-3">
              <h4 className="text-sm font-bold text-gray-800">Telegram Bot Configuration</h4>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Telegram Chat ID</label>
                <input
                  type="text"
                  value={formData.telegramChatId}
                  onChange={(e) => setFormData({ ...formData, telegramChatId: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  placeholder="e.g., -1001234567890"
                />
                <p className="mt-0.5 text-xs text-gray-500">Your Telegram chat ID (get from @userinfobot)</p>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Telegram Bot Token</label>
                <input
                  type="password"
                  value={formData.telegramBotToken}
                  onChange={(e) => setFormData({ ...formData, telegramBotToken: e.target.value })}
                  className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
                  placeholder="e.g., 1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
                />
                <p className="mt-0.5 text-xs text-gray-500">Bot token from @BotFather</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Shift Settings Section */}
      <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-4">
        <h3 className="text-sm font-bold text-gray-800 mb-2">💰 Shift Opening Cash Settings</h3>
        <p className="text-xs text-gray-600">Configure default cash drawer float and cashier permissions for shift openings.</p>
      </div>

      {/* Default Shift Float */}
      <div>
        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Default Shift Float</label>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Rs.</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.defaultShiftFloat}
            onChange={(e) => setFormData({ ...formData, defaultShiftFloat: parseFloat(e.target.value) || 0 })}
            className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent h-8"
            placeholder="0.00"
          />
        </div>
        <p className="mt-0.5 text-xs text-gray-500">Default opening cash balance for new shifts (0 = use previous closing balance)</p>
      </div>

      {/* Allow Edit Opening Balance Toggle */}
      <div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold uppercase text-gray-500">Allow Cashiers to Edit Opening Balance</span>
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.allowEditOpeningBalance}
              onChange={(e) => setFormData({ ...formData, allowEditOpeningBalance: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
          </div>
        </label>
        <p className="mt-0.5 text-xs text-gray-500">When disabled, cashiers must use the default float or previous closing balance</p>
      </div>
    </div>
  )
}

// Delivery Platform Integrations Tab Component
function DeliveryTab({ formData, setFormData, validationErrors }: any) {
  const [testingUberEats, setTestingUberEats] = useState(false)
  const [testingPickMe, setTestingPickMe] = useState(false)
  const [uberEatsStatus, setUberEatsStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [pickMeStatus, setPickMeStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const testUberEatsConnection = async () => {
    setTestingUberEats(true)
    setUberEatsStatus('idle')
    
    try {
      const response = await fetch('/api/delivery/test-uber-eats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: formData.uberEatsMerchantId,
          apiKey: formData.uberEatsApiKey,
          clientSecret: formData.uberEatsClientSecret
        })
      })
      
      const result = await response.json()
      setUberEatsStatus(result.success ? 'success' : 'error')
    } catch (error) {
      setUberEatsStatus('error')
    } finally {
      setTestingUberEats(false)
    }
  }

  const testPickMeConnection = async () => {
    setTestingPickMe(true)
    setPickMeStatus('idle')
    
    try {
      const response = await fetch('/api/delivery/test-pickme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchantId: formData.pickMeMerchantId,
          apiKey: formData.pickMeApiKey,
          secretToken: formData.pickMeSecretToken
        })
      })
      
      const result = await response.json()
      setPickMeStatus(result.success ? 'success' : 'error')
    } catch (error) {
      setPickMeStatus('error')
    } finally {
      setTestingPickMe(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-sm font-bold text-gray-800 mb-2">🚚 Delivery Platform Integrations</h3>
        <p className="text-xs text-gray-600">Connect your POS with Uber Eats and PickMe to receive orders automatically, sync inventory, and manage delivery orders from a single interface.</p>
      </div>

      {/* Uber Eats Integration */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">U</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">Uber Eats</h3>
              <p className="text-xs text-gray-500">Receive orders and sync inventory</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-semibold text-gray-500">Enable</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.uberEatsEnabled}
                onChange={(e) => setFormData({ ...formData, uberEatsEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
            </div>
          </label>
        </div>

        {formData.uberEatsEnabled && (
          <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Merchant ID</label>
                <input
                  type="text"
                  value={formData.uberEatsMerchantId}
                  onChange={(e) => setFormData({ ...formData, uberEatsMerchantId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter Uber Eats Merchant ID"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">API Key</label>
                <input
                  type="password"
                  value={formData.uberEatsApiKey}
                  onChange={(e) => setFormData({ ...formData, uberEatsApiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter API Key"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Client Secret</label>
                <input
                  type="password"
                  value={formData.uberEatsClientSecret}
                  onChange={(e) => setFormData({ ...formData, uberEatsClientSecret: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter Client Secret"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Webhook URL</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.uberEatsWebhookUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/delivery/webhook/uber-eats`}
                    readOnly
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/api/delivery/webhook/uber-eats`)
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-green-600 hover:text-green-800"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={testUberEatsConnection}
              disabled={testingUberEats}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingUberEats ? 'Testing...' : 'Save & Test Connection'}
            </button>
            {uberEatsStatus === 'success' && (
              <p className="text-xs text-green-600 mt-1">✓ Connection successful!</p>
            )}
            {uberEatsStatus === 'error' && (
              <p className="text-xs text-red-600 mt-1">✗ Connection failed. Please check your credentials.</p>
            )}
          </div>
        )}
      </div>

      {/* PickMe Integration */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-bold">P</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800">PickMe</h3>
              <p className="text-xs text-gray-500">Local delivery platform integration</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-semibold text-gray-500">Enable</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.pickMeEnabled}
                onChange={(e) => setFormData({ ...formData, pickMeEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
            </div>
          </label>
        </div>

        {formData.pickMeEnabled && (
          <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Merchant ID</label>
                <input
                  type="text"
                  value={formData.pickMeMerchantId}
                  onChange={(e) => setFormData({ ...formData, pickMeMerchantId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter PickMe Merchant ID"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">API Key</label>
                <input
                  type="password"
                  value={formData.pickMeApiKey}
                  onChange={(e) => setFormData({ ...formData, pickMeApiKey: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter API Key"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Secret Token</label>
                <input
                  type="password"
                  value={formData.pickMeSecretToken}
                  onChange={(e) => setFormData({ ...formData, pickMeSecretToken: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter Secret Token"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Webhook URL</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.pickMeWebhookUrl || `${typeof window !== 'undefined' ? window.location.origin : ''}/api/delivery/webhook/pickme`}
                    readOnly
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(`${window.location.origin}/api/delivery/webhook/pickme`)
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-orange-600 hover:text-orange-800"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={testPickMeConnection}
              disabled={testingPickMe}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingPickMe ? 'Testing...' : 'Save & Test Connection'}
            </button>
            {pickMeStatus === 'success' && (
              <p className="text-xs text-green-600 mt-1">✓ Connection successful!</p>
            )}
            {pickMeStatus === 'error' && (
              <p className="text-xs text-red-600 mt-1">✗ Connection failed. Please check your credentials.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
