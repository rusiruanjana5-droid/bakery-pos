'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createPOSOrder, getTodayOrders } from '@/actions/order'
import { checkOfferEligibility } from '@/actions/specialOffer'
import { switchUserByPin, verifyManagerPin, verifyPinForScreenUnlock } from '@/actions/auth'
import { startShift } from '@/actions/shift'
import PinPadModal from '@/components/PinPadModal'
import ShiftStartModal from '@/components/ShiftStartModal'
import { PrinterService } from '@/lib/printerService'

interface DbProduct {
  id: number
  name: string
  category: string
  imageUrl?: string | null
  categoryId?: number | null
  subCategoryId?: number | null
  categoryRef?: {
    id: number
    name: string
  } | null
  subCategoryRef?: {
    id: number
    name: string
  } | null
  costPrice: number
  sellingPrice: number
  currentStock: number
  supplierId: number
  supplier?: {
    id: number
    name: string
  }
}

interface Product {
  id: number
  name: string
  price: number
  category: string
  image?: string
  imageUrl?: string | null
  currentStock: number
  isOffer?: boolean
  items?: string
}

interface CartItem {
  product: Product
  quantity: number
  note?: string
}

interface ExtraCharge {
  label: string
  amount: number
}

interface Order {
  id: string
  items: string
  qty: number
  totalAmount: number
  paymentMethod: string
  orderType: string
  timestamp: Date
  discount?: number
  discountType?: 'percentage' | 'flat'
  packagingCost: number
  orderNote?: string
  subtotal: number
  cartSnapshot: CartItem[]
  extraCharges?: ExtraCharge[]
  cashReceived?: number
}

interface StoreSettings {
  id?: number
  shopName: string
  slogan?: string | null
  description?: string | null
  showNoticeOnReceipt?: boolean | null
  logoUrl?: string | null
  phone1?: string | null
  phone2?: string | null
  address?: string | null
  reportEmail?: string | null
  themeType?: string | null
  primaryColor?: string | null
  gradientFrom?: string | null
  gradientTo?: string | null
  brNumber?: string | null
  receiptHeaderMessage?: string | null
  receiptFooterMessage?: string | null
  facebookLink?: string | null
  whatsappNumber?: string | null
  defaultDeliveryCharge?: number | null
  currencySymbol?: string | null
  receiptPrinterSize?: string | null
  paymentQrUrl?: string | null
}

interface POSPageClientProps {
  initialSettings?: StoreSettings | null
  initialProducts?: DbProduct[]
  initialSpecialOffers?: any[]
  initialCategories?: any[]
  initialActiveShift?: any
  initialLastShift?: any
  currentUserId?: number
  currentUsername?: string
  currentUserRole?: string
  defaultShiftFloat?: number
  allowEditOpeningBalance?: boolean
}

export default function POSPageClient({ 
  initialSettings, 
  initialProducts, 
  initialSpecialOffers, 
  initialCategories, 
  initialActiveShift, 
  initialLastShift, 
  currentUserId, 
  currentUsername,
  currentUserRole,
  defaultShiftFloat = 0,
  allowEditOpeningBalance = true
}: POSPageClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isMounted, setIsMounted] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [showDiscountModal, setShowDiscountModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showHoldOrdersModal, setShowHoldOrdersModal] = useState(false)
  const [showItemNoteModal, setShowItemNoteModal] = useState(false)
  const [lastOrder, setLastOrder] = useState<Order | null>(null)
  const [selectedCartItem, setSelectedCartItem] = useState<CartItem | null>(null)
  const [eligibleOffers, setEligibleOffers] = useState<any[]>([])
  const [showOfferPrompt, setShowOfferPrompt] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash')
  const [cashReceived, setCashReceived] = useState(0)
  const [cardAuthCode, setCardAuthCode] = useState('')
  const [cardType, setCardType] = useState<'Visa' | 'MasterCard' | 'AMEX' | 'Other'>('Visa')
  const [qrRefNo, setQrRefNo] = useState('')
  const [heldOrders, setHeldOrders] = useState<{ id: string; cart: CartItem[]; timestamp: Date }[]>([])
  const [discountSettings, setDiscountSettings] = useState({
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 0,
    extraCharges: [] as ExtraCharge[],
    orderNote: ''
  })
  const [isLocked, setIsLocked] = useState(false)
  const [showLockPinModal, setShowLockPinModal] = useState(false)
  const [showManagerPinModal, setShowManagerPinModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [focusedProductIndex, setFocusedProductIndex] = useState<number>(-1)
  const [focusedQuickCashIndex, setFocusedQuickCashIndex] = useState<number>(-1)
  const [showShiftModal, setShowShiftModal] = useState(false)
  const [isShiftLoading, setIsShiftLoading] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const cardAuthCodeRef = useRef<HTMLInputElement>(null)
  const cashReceivedRef = useRef<HTMLInputElement>(null)
  const quickCashButtonsRef = useRef<(HTMLButtonElement | null)[]>([])

  const applyOfferReward = (offer: any) => {
    try {
      const rewardItems = JSON.parse(offer.rewardItems)
      rewardItems.forEach((reward: any) => {
        const existingItem = cart.find(item => item.product.id === reward.productId)
        if (existingItem) {
          setCart(cart.map(item => 
            item.product.id === reward.productId 
              ? { ...item, quantity: item.quantity + reward.quantity }
              : item
          ))
        } else {
          const product = initialProducts?.find((p: any) => p.id === reward.productId)
          if (product) {
            const cartProduct: Product = {
              id: product.id,
              name: product.name,
              price: reward.isFree ? 0 : reward.discountPrice || product.sellingPrice,
              category: product.category,
              currentStock: product.currentStock,
              isOffer: true
            }
            setCart([...cart, { product: cartProduct, quantity: reward.quantity }])
          }
        }
      })
      setShowOfferPrompt(false)
      setEligibleOffers([])
    } catch (error) {
      console.error('Error applying offer reward:', error)
    }
  }

  // Load data from localStorage after component mounts to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    
    // Load cart from localStorage
    try {
      const savedCart = localStorage.getItem('pos_cart_items')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }

    // Load order type from localStorage
    try {
      const savedOrderType = localStorage.getItem('pos_order_type')
      if (savedOrderType === 'dine-in' || savedOrderType === 'takeaway') {
        setOrderType(savedOrderType)
      }
    } catch (error) {
      console.error('Error loading order type from localStorage:', error)
    }

    // Load discount settings from localStorage
    try {
      const savedDiscountSettings = localStorage.getItem('pos_discount_settings')
      if (savedDiscountSettings) {
        setDiscountSettings(JSON.parse(savedDiscountSettings))
      }
    } catch (error) {
      console.error('Error loading discount settings from localStorage:', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('pos_cart_items', JSON.stringify(cart))
    }
  }, [cart, isMounted])

  // Save order type to localStorage whenever it changes
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('pos_order_type', orderType)
    }
  }, [orderType, isMounted])

  // Save discount settings to localStorage whenever they change
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('pos_discount_settings', JSON.stringify(discountSettings))
    }
  }, [discountSettings, isMounted])

  useEffect(() => {
    const checkEligibleOffers = async () => {
      if (cart.length === 0) {
        setEligibleOffers([])
        setShowOfferPrompt(false)
        return
      }

      const cartItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity
      }))

      try {
        const offers = await checkOfferEligibility(cartItems)
        setEligibleOffers(offers)
        if (offers.length > 0) {
          setShowOfferPrompt(true)
        }
      } catch (error) {
        console.error('Error checking offer eligibility:', error)
      }
    }

    checkEligibleOffers()
  }, [cart])

  // Determine shift modal state based on initial data
  useEffect(() => {
    // Simulate brief loading to prevent flash of wrong state
    const timer = setTimeout(() => {
      setIsShiftLoading(false)
      
      // Only show shift modal for non-admin users if no active shift exists (from server data)
      // Admin users bypass shift management
      if (currentUserRole === 'ADMIN') {
        setShowShiftModal(false)
      } else if (!initialActiveShift) {
        setShowShiftModal(true)
      } else {
        setShowShiftModal(false)
      }
    }, 200)
    
    return () => clearTimeout(timer)
  }, [initialActiveShift, currentUserRole])

  const storeSettings = initialSettings || {
    shopName: 'Bakery POS',
    slogan: '',
    address: '123 Main Street, City',
    phone1: '',
    phone2: '',
    brNumber: '',
    facebookLink: '',
    whatsappNumber: '',
    receiptFooterMessage: '',
    currencySymbol: 'Rs.',
    receiptPrinterSize: '80mm',
    logoUrl: ''
  }

  const currencySymbol = storeSettings.currencySymbol || 'Rs.'
  
  const categoryNames = (initialCategories || []).map((cat: any) => cat.name)
  const categories = ['All', ...categoryNames, '🎁 Special Offers']

  const specialOffers: Product[] = (initialSpecialOffers || []).map((offer: any) => ({
    id: offer.id,
    name: offer.name,
    price: offer.promoPrice,
    category: 'Special Offers',
    currentStock: 999,
    isOffer: true,
    items: offer.items
  }))

  const products: Product[] = [
    ...(initialProducts || []).map((dbProduct: DbProduct) => ({
      id: dbProduct.id,
      name: dbProduct.name,
      price: dbProduct.sellingPrice,
      category: dbProduct.categoryRef?.name || dbProduct.category,
      imageUrl: dbProduct.imageUrl,
      currentStock: dbProduct.currentStock,
      isOffer: false
    })),
    ...specialOffers
  ]

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || 
                          (selectedCategory === '🎁 Special Offers' ? product.isOffer : product.category === selectedCategory)
    return matchesSearch && matchesCategory
  })

  // Reset focus when category or search changes
  useEffect(() => {
    setFocusedProductIndex(-1)
  }, [selectedCategory, searchTerm])

  // Fetch today's orders on mount
  useEffect(() => {
    const fetchTodayOrders = async () => {
      try {
        const dbOrders = await getTodayOrders()
        // Transform database orders to local Order format
        const transformedOrders: Order[] = dbOrders.map(dbOrder => {
          const customerPhoneData = dbOrder.customerPhone ? JSON.parse(dbOrder.customerPhone) : {}
          const items = customerPhoneData.items || []
          const itemsSummary = items.map((item: any) => `${item.productName || dbOrder.product.name} x${item.quantity}`).join(', ')
          const totalQty = items.reduce((sum: number, item: any) => sum + item.quantity, 0) || dbOrder.quantity

          const cartSnapshot: CartItem[] = items.map((item: any) => ({
            product: {
              id: item.productId,
              name: item.productName || dbOrder.product.name,
              category: dbOrder.product.category,
              price: dbOrder.product.sellingPrice
            } as any,
            quantity: item.quantity,
            note: item.note
          }))

          return {
            id: dbOrder.id.toString(),
            items: itemsSummary,
            qty: totalQty,
            totalAmount: dbOrder.totalPrice,
            paymentMethod: dbOrder.paymentMethod,
            orderType: dbOrder.customerName || 'takeaway',
            timestamp: dbOrder.createdAt,
            discount: dbOrder.discount || undefined,
            discountType: 'flat',
            packagingCost: 0,
            orderNote: customerPhoneData.orderNote,
            subtotal: dbOrder.subtotal || dbOrder.totalPrice,
            cartSnapshot: cartSnapshot,
            extraCharges: customerPhoneData.extraCharges || [],
            cashReceived: undefined
          }
        })
        setOrders(transformedOrders)
      } catch (error) {
        console.error('Error fetching today orders:', error)
      }
    }

    fetchTodayOrders()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Check if user is typing in an input field - don't trigger shortcuts
      const activeElement = document.activeElement
      const isInputFocused = activeElement && (
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.getAttribute('contenteditable') === 'true'
      )

      // Lock screen shortcut (Ctrl+L or Alt+L) - works even in inputs
      if ((e.ctrlKey || e.altKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        handleLockScreen()
        return
      }

      // Focus search (F2) - works even in inputs
      if (e.key === 'F2') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setFocusedProductIndex(-1)
        return
      }

      // Open discount modal (F4) - works even in inputs
      if (e.key === 'F4') {
        e.preventDefault()
        setShowDiscountModal(true)
        return
      }

      // For other shortcuts, only trigger if not typing in input
      if (isInputFocused) {
        // Arrow key navigation for payment tabs when payment modal is open
        if (showPaymentModal) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            if (paymentMethod === 'card') setPaymentMethod('cash')
            else if (paymentMethod === 'online') setPaymentMethod('card')
            return
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            if (paymentMethod === 'cash') setPaymentMethod('card')
            else if (paymentMethod === 'card') setPaymentMethod('online')
            return
          }
        }
        return
      }

      // Arrow key navigation for payment tabs when payment modal is open
      if (showPaymentModal) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          if (paymentMethod === 'card') setPaymentMethod('cash')
          else if (paymentMethod === 'online') setPaymentMethod('card')
          return
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          if (paymentMethod === 'cash') setPaymentMethod('card')
          else if (paymentMethod === 'card') setPaymentMethod('online')
          return
        }
      }

      // Arrow key navigation for product grid
      if (!showDiscountModal && !showPaymentModal && !showHoldOrdersModal && !showItemNoteModal && !showReceiptModal && !showLockPinModal && !showManagerPinModal) {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          const gridColumns = window.innerWidth >= 1024 ? 3 : 2
          const newIndex = focusedProductIndex >= gridColumns ? focusedProductIndex - gridColumns : 0
          setFocusedProductIndex(newIndex)
          return
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          const gridColumns = window.innerWidth >= 1024 ? 3 : 2
          const newIndex = focusedProductIndex + gridColumns < filteredProducts.length ? focusedProductIndex + gridColumns : filteredProducts.length - 1
          setFocusedProductIndex(newIndex)
          return
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          const newIndex = focusedProductIndex > 0 ? focusedProductIndex - 1 : 0
          setFocusedProductIndex(newIndex)
          return
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          const newIndex = focusedProductIndex < filteredProducts.length - 1 ? focusedProductIndex + 1 : filteredProducts.length - 1
          setFocusedProductIndex(newIndex)
          return
        }
      }

      // GLOBAL ENTER KEY BEHAVIOR - Checkout/Print Only
      // Enter key exclusively triggers checkout/print, never adds products to cart
      if ((e.key === 'Enter' || e.key === 'NumpadEnter') && !showLockPinModal && !showManagerPinModal && !isInputFocused) {
        e.preventDefault()
        e.stopPropagation()
        
        if (showReceiptModal) {
          // window.print() // Disabled automatic print dialog
          setShowReceiptModal(false)
        } else if (showPaymentModal) {
          // Validate payment fields before completing
          const isValidPayment = 
            (paymentMethod === 'cash' && cashReceived >= calculateGrandTotal()) ||
            (paymentMethod === 'card' && cardAuthCode.trim().length > 0) ||
            (paymentMethod === 'online' && qrRefNo.trim().length > 0)
          
          if (isValidPayment) {
            handleCompletePayment()
          }
        } else if (cart.length > 0) {
          // Only trigger checkout if cart is not empty
          setShowPaymentModal(true)
        }
        return
      }

      // Close modals / clear cart (Escape)
      if (e.key === 'Escape') {
        e.preventDefault()
        if (showDiscountModal) {
          setShowDiscountModal(false)
        } else if (showPaymentModal) {
          setShowPaymentModal(false)
        } else if (showHoldOrdersModal) {
          setShowHoldOrdersModal(false)
        } else if (showItemNoteModal) {
          setShowItemNoteModal(false)
        } else if (cart.length > 0) {
          if (confirm('Clear cart?')) {
            clearCart()
          }
        }
        setFocusedProductIndex(-1)
        return
      }

      // Increase quantity of last cart item (+)
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1]
          updateQuantity(lastItem.product.id, 1)
        }
        return
      }

      // Decrease quantity of last cart item (-)
      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        if (cart.length > 0) {
          const lastItem = cart[cart.length - 1]
          updateQuantity(lastItem.product.id, -1)
        }
        return
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [cart, discountSettings, orderType, showReceiptModal, showPaymentModal, showHoldOrdersModal, showItemNoteModal, filteredProducts, focusedProductIndex, showLockPinModal, showManagerPinModal])

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id)
      if (existingItem) {
        if (existingItem.quantity >= product.currentStock) {
          alert('Out of stock!')
          return prevCart
        }
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      if (product.currentStock <= 0) {
        alert('Out of stock!')
        return prevCart
      }
      return [...prevCart, { product, quantity: 1, note: '' }]
    })
  }

  const updateQuantity = (productId: number, delta: number) => {
    const item = cart.find(i => i.product.id === productId)
    
    // If removing item (delta < 0 and would result in 0), require manager approval
    if (delta < 0 && item && item.quantity === 1) {
      requireManagerApproval(() => {
        setCart(prevCart => {
          return prevCart.map(cartItem => {
            if (cartItem.product.id === productId) {
              const newQuantity = Math.max(0, cartItem.quantity + delta)
              return { ...cartItem, quantity: newQuantity }
            }
            return cartItem
          }).filter(cartItem => cartItem.quantity > 0)
        })
      })
      return
    }

    setCart(prevCart => {
      return prevCart.map(cartItem => {
        if (cartItem.product.id === productId) {
          const newQuantity = Math.max(0, cartItem.quantity + delta)
          if (delta > 0 && newQuantity > cartItem.product.currentStock) {
            alert('Out of stock!')
            return cartItem
          }
          return { ...cartItem, quantity: newQuantity }
        }
        return cartItem
      }).filter(cartItem => cartItem.quantity > 0)
    })
  }

  const clearCart = () => {
    setCart([])
    setDiscountSettings({
      discountType: 'percentage',
      discountValue: 0,
      extraCharges: [],
      orderNote: ''
    })
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('pos_cart_items')
      localStorage.removeItem('pos_discount_settings')
    }
  }

  const addExtraCharge = () => {
    setDiscountSettings(prev => ({
      ...prev,
      extraCharges: [...prev.extraCharges, { label: '', amount: 0 }]
    }))
  }

  const removeExtraCharge = (index: number) => {
    setDiscountSettings(prev => ({
      ...prev,
      extraCharges: prev.extraCharges.filter((_, i) => i !== index)
    }))
  }

  const updateExtraCharge = (index: number, field: 'label' | 'amount', value: string | number) => {
    setDiscountSettings(prev => ({
      ...prev,
      extraCharges: prev.extraCharges.map((charge, i) =>
        i === index ? { ...charge, [field]: field === 'amount' ? Number(value) : value } : charge
      )
    }))
  }

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountSettings.discountType === 'percentage') {
      return subtotal * (discountSettings.discountValue / 100)
    } else {
      return discountSettings.discountValue
    }
  }

  const calculateExtraChargesTotal = () => {
    return discountSettings.extraCharges.reduce((total, charge) => total + charge.amount, 0)
  }

  const calculateGrandTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateExtraChargesTotal()
  }

  const getItemsBreakdown = (items: string) => {
    try {
      const comboItems = JSON.parse(items)
      return comboItems
        .map((item: any) => {
          const freeLabel = item.isFree ? ' (Free)' : ''
          return `${item.quantity}x${freeLabel}`
        })
        .join(', ')
    } catch {
      return ''
    }
  }

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }
    setShowPaymentModal(true)
  }

  const handleCompletePayment = async () => {
    try {
      const result = await createPOSOrder({
        items: cart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          note: item.note
        })),
        totalAmount: calculateGrandTotal(),
        paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
        orderType: orderType,
        discount: calculateDiscount(),
        discountType: discountSettings.discountType,
        subtotal: calculateSubtotal(),
        orderNote: discountSettings.orderNote,
        extraCharges: discountSettings.extraCharges,
        cardAuthCode: paymentMethod === 'card' ? cardAuthCode : undefined,
        cardType: paymentMethod === 'card' ? cardType : undefined,
        qrRefNo: paymentMethod === 'online' ? qrRefNo : undefined
      })

      if (result.success) {
        const itemsSummary = cart.map(item => `${item.product.name} x${item.quantity}${item.note ? ` (${item.note})` : ''}`).join(', ')
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0)
        const currentSubtotal = calculateSubtotal()

        const newOrder: Order = {
          id: result.order.id,
          items: itemsSummary,
          qty: totalQty,
          totalAmount: calculateGrandTotal(),
          paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
          orderType: orderType,
          timestamp: result.order.createdAt,
          discount: calculateDiscount(),
          discountType: discountSettings.discountType,
          packagingCost: 0,
          orderNote: discountSettings.orderNote,
          subtotal: currentSubtotal,
          cartSnapshot: JSON.parse(JSON.stringify(cart)),
          extraCharges: discountSettings.extraCharges,
          cashReceived: paymentMethod === 'cash' ? cashReceived : undefined
        }

        setLastOrder(newOrder)
        setShowPaymentModal(false)
        setShowReceiptModal(true)
        setCashReceived(0)
        clearCart()

        // Refetch today's orders to keep UI in sync with DB
        try {
          const dbOrders = await getTodayOrders()
          // Transform database orders to local Order format
          const transformedOrders: Order[] = dbOrders.map(dbOrder => {
            const customerPhoneData = dbOrder.customerPhone ? JSON.parse(dbOrder.customerPhone) : {}
            const items = customerPhoneData.items || []
            const itemsSummary = items.map((item: any) => `${item.productName || dbOrder.product.name} x${item.quantity}`).join(', ')
            const totalQty = items.reduce((sum: number, item: any) => sum + item.quantity, 0) || dbOrder.quantity

            const cartSnapshot: CartItem[] = items.map((item: any) => ({
              product: {
                id: item.productId,
                name: item.productName || dbOrder.product.name,
                category: dbOrder.product.category,
                price: dbOrder.product.sellingPrice
              } as any,
              quantity: item.quantity,
              note: item.note
            }))

            return {
              id: dbOrder.id.toString(),
              items: itemsSummary,
              qty: totalQty,
              totalAmount: dbOrder.totalPrice,
              paymentMethod: dbOrder.paymentMethod,
              orderType: dbOrder.customerName || 'takeaway',
              timestamp: dbOrder.createdAt,
              discount: dbOrder.discount || undefined,
              discountType: 'flat',
              packagingCost: 0,
              orderNote: customerPhoneData.orderNote,
              subtotal: dbOrder.subtotal || dbOrder.totalPrice,
              cartSnapshot: cartSnapshot,
              extraCharges: customerPhoneData.extraCharges || [],
              cashReceived: undefined
            }
          })
          setOrders(transformedOrders)
        } catch (error) {
          console.error('Error refetching today orders:', error)
        }
        
        // Trigger print receipt with cash drawer kick
        try {
          await PrinterService.printReceipt({
            orderData: {
              items: cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                note: item.note,
                productName: item.product.name,
                unitPrice: item.product.price,
                subtotal: item.product.price * item.quantity
              })),
              totalAmount: calculateGrandTotal(),
              paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
              orderType: orderType,
              discount: calculateDiscount(),
              discountType: discountSettings.discountType,
              subtotal: calculateSubtotal(),
              orderNote: discountSettings.orderNote,
              extraCharges: discountSettings.extraCharges,
              cashGiven: paymentMethod === 'cash' ? cashReceived : undefined,
              cashChange: paymentMethod === 'cash' ? (cashReceived - calculateGrandTotal()) : undefined,
              cashierName: 'Cashier'
            },
            orderDetails: {
              id: result.order.id,
              createdAt: result.order.createdAt
            }
          })
        } catch (printError) {
          console.error('Print error:', printError)
          // Don't block the order completion if printing fails
        }
        
        router.refresh()
      }
    } catch (error: any) {
      alert(error.message || 'Failed to complete payment. Please try again.')
    }
  }

  const handleHoldOrder = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!')
      return
    }
    const heldOrder = {
      id: `HOLD-${Date.now()}`,
      cart: JSON.parse(JSON.stringify(cart)),
      timestamp: new Date()
    }
    setHeldOrders(prev => [...prev, heldOrder])
    clearCart()
    alert('Order held successfully!')
  }

  const handleRecallOrder = (heldOrder: { id: string; cart: CartItem[] }) => {
    setCart(heldOrder.cart)
    setHeldOrders(prev => prev.filter(order => order.id !== heldOrder.id))
    setShowHoldOrdersModal(false)
  }

  const handleAddItemNote = (cartItem: CartItem) => {
    setSelectedCartItem(cartItem)
    setShowItemNoteModal(true)
  }

  const handleSaveItemNote = (note: string) => {
    if (selectedCartItem) {
      setCart(prevCart => prevCart.map(item => 
        item.product.id === selectedCartItem.product.id
          ? { ...item, note }
          : item
      ))
    }
    setShowItemNoteModal(false)
    setSelectedCartItem(null)
  }

  const calculateChange = () => {
    if (paymentMethod === 'cash') {
      return cashReceived - calculateGrandTotal()
    }
    return 0
  }

  const setQuickCashAmount = (amount: number) => {
    if (amount === 0) {
      setCashReceived(calculateGrandTotal())
    } else {
      setCashReceived(amount)
    }
  }

  const handleLockScreen = () => {
    setIsLocked(true)
    setShowLockPinModal(true)
  }

  const handleUnlock = async (pin: string) => {
    const result = await verifyPinForScreenUnlock(pin)
    if (result.success) {
      setIsLocked(false)
      setShowLockPinModal(false)
      // Switch user session to the unlocking user
      const switchResult = await switchUserByPin(pin)
      
      // Redirect based on user role
      if (switchResult.success && switchResult.user) {
        const userRole = switchResult.user.role
        if (userRole === 'ADMIN' || userRole === 'MANAGER') {
          // Redirect to admin dashboard for admin/manager roles
          router.push('/')
        } else if (userRole === 'CASHIER') {
          // Keep cashiers on POS screen
          router.push('/pos')
        } else {
          // Other roles go to dashboard
          router.push('/')
        }
      } else {
        router.refresh()
      }
    } else {
      // Return error for display in modal
      return { success: false, error: result.error || 'Invalid or Unauthorized PIN. Admin approval required to unlock.' }
    }
    return result
  }

  const requireManagerApproval = (action: () => void) => {
    setPendingAction(() => action)
    setShowManagerPinModal(true)
  }

  const handleManagerApproval = async (pin: string) => {
    const result = await verifyManagerPin(pin)
    if (result.success) {
      setShowManagerPinModal(false)
      if (pendingAction) {
        pendingAction()
        setPendingAction(null)
      }
    }
    return result
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return <div className="flex h-screen overflow-hidden bg-white" />
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body > *:not(.receipt-modal-content) {
              visibility: hidden;
            }
            .receipt-modal-content, .receipt-modal-content * {
              visibility: visible;
            }
            .receipt-modal-content * {
              color: #000 !important;
              background: transparent !important;
              box-shadow: none !important;
              text-shadow: none !important;
            }
            .receipt-modal-content {
              position: absolute;
              left: 0;
              top: 0;
              width: ${storeSettings.receiptPrinterSize === '58mm' ? '58mm' : '80mm'};
              max-width: ${storeSettings.receiptPrinterSize === '58mm' ? '58mm' : '80mm'};
              margin: 0;
              padding: 20px;
              background: #ffffff !important;
              box-shadow: none !important;
              font-size: ${storeSettings.receiptPrinterSize === '58mm' ? '11px' : '14px'};
              word-break: break-word !important;
              overflow-wrap: break-word !important;
              hyphens: auto !important;
            }
            .receipt-modal-content .border-t,
            .receipt-modal-content .border-b {
              border-top: 1px dashed #000 !important;
              border-bottom: 1px dashed #000 !important;
            }
            .receipt-modal-content .border-dashed {
              border-style: dashed !important;
              border-color: #000 !important;
            }
            .receipt-modal-content .flex.gap-3 {
              display: none !important;
            }
            .receipt-modal-content .noprint {
              display: none !important;
            }
            .receipt-modal-content img {
              filter: grayscale(100%) !important;
              -webkit-filter: grayscale(100%) !important;
            }
            @page {
              margin: 0;
              size: ${storeSettings.receiptPrinterSize === '58mm' ? '58mm auto' : '80mm auto'};
            }
          }
        `
      }} />

      <div className="flex h-[calc(100vh-48px)] w-full bg-slate-100 overflow-hidden">
        {/* LEFT: Categories Sidebar */}
        <div className="w-48 bg-white border-r border-slate-200 p-3 overflow-y-auto flex-shrink-0">
          <div className="mb-3">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search items... (F2)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 px-2 py-1.5 text-xs rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 py-1.5 rounded-lg text-left text-xs font-medium transition-colors h-8 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE: Products & Recent Orders */}
        <div className="flex-1 flex flex-col h-full overflow-hidden p-4 space-y-4">
          {/* Top Section: Products Grid (Scrollable) */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredProducts.map((product: Product, index: number) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.currentStock <= 0}
                  className={`bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left border border-slate-200 flex flex-col overflow-hidden ${
                    product.currentStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    focusedProductIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''
                  }`}
                >
                  <div className="relative w-full h-32 flex-shrink-0">
                    {product.isOffer && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                        PROMO
                      </span>
                    )}
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center select-none ${
                        product.isOffer 
                          ? 'bg-gradient-to-br from-orange-200 to-red-200' 
                          : 'bg-gradient-to-br from-amber-100 to-amber-200'
                      }`}>
                        <span className="text-4xl">🥐</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 leading-tight">{product.name}</h3>
                    <p className={`text-base font-bold ${product.isOffer ? 'text-orange-600' : 'text-amber-600'}`}>{currencySymbol} {product.price.toFixed(2)}</p>
                    {!product.isOffer && (
                      <p className="text-xs text-gray-500 mt-1">Stock: {product.currentStock}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section: Recent Orders (Fixed Height) */}
          <div className="h-44 bg-white rounded-lg border border-slate-200 p-3 flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Orders Today</h2>
              <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
                Total: {orders.length}
              </span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-slate-100 sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Order ID</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Items</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider text-center">Qty</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                      <th className="px-3 py-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                          No orders placed today yet
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-3 py-2 text-xs text-slate-800 font-medium whitespace-nowrap">{order.id}</td>
                          <td className="px-3 py-2 text-xs text-slate-600 max-w-xs truncate" title={order.items}>
                            {order.items}
                          </td>
                          <td className="px-3 py-2 text-xs text-slate-600 text-center">{order.qty}</td>
                          <td className="px-3 py-2 text-xs text-slate-800 font-semibold">{currencySymbol} {order.totalAmount.toFixed(2)}</td>
                          <td className="px-3 py-2 text-xs text-slate-600 capitalize">{order.orderType}</td>
                          <td className="px-3 py-2">
                            <div className="flex gap-1">
                              <button
                                onClick={() => {
                                  setLastOrder(order);
                                  setShowReceiptModal(true);
                                }}
                                className="h-7 px-2 py-1 text-xs font-medium text-white bg-primary rounded transition-colors"
                              >
                                Re-Print
                              </button>
                              <button
                                onClick={() => {
                                  requireManagerApproval(() => {
                                    // Void the order - remove from orders list
                                    setOrders(prevOrders => prevOrders.filter(o => o.id !== order.id))
                                  })
                                }}
                                className="h-7 px-2 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                                title="Void Transaction"
                              >
                                Void
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Cart & Checkout Section (Fixed Height Stack) */}
        <div className="w-80 lg:w-96 bg-white border-l border-slate-200 flex flex-col h-full p-4 flex-shrink-0">
          {/* 1. Header & Order Type (Fixed) */}
          <div className="mb-3 flex-shrink-0">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Type</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setOrderType('takeaway')}
                className={`flex-1 h-8 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  orderType === 'takeaway' ? 'bg-primary text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Takeaway
              </button>
              <button
                onClick={() => setOrderType('dine-in')}
                className={`flex-1 h-8 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  orderType === 'dine-in' ? 'bg-primary text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Dine-In
              </button>
            </div>
          </div>

          {/* 2. Cart Items List (Scrolls if items exceed height) */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1 border-y border-slate-200 py-2 min-h-0">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                🛒 Cart is empty
              </div>
            ) : (
              cart.map((item: CartItem) => (
                <div key={item.product.id} className={`bg-slate-50 rounded-lg p-2 border ${
                  item.quantity > item.product.currentStock ? 'border-red-300 bg-red-50' : 'border-slate-100'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.product.name}</h3>
                      {item.product.isOffer && item.product.items && (
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Includes: {getItemsBreakdown(item.product.items)}
                        </p>
                      )}
                      {item.note && (
                        <p className="text-[10px] text-blue-600 mt-0.5 italic">📝 {item.note}</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-800 whitespace-nowrap ml-2">
                      {currencySymbol} {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{currencySymbol} {item.product.price.toFixed(2)} each</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-5 h-5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-bold text-xs flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className={`w-5 text-center text-xs font-bold ${
                        item.quantity > item.product.currentStock ? 'text-red-600' : 'text-slate-800'
                      }`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-5 h-5 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 font-bold text-xs flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleAddItemNote(item)}
                        className="w-5 h-5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 font-bold text-xs flex items-center justify-center ml-1"
                        title="Add Note"
                      >
                        📝
                      </button>
                    </div>
                  </div>
                  {item.quantity > item.product.currentStock && (
                    <p className="text-[10px] text-red-600 mt-1 font-medium">⚠️ Exceeds stock ({item.product.currentStock})</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 3. Totals & Checkout (Pinned to Bottom) */}
          <div className="flex-shrink-0 space-y-3 pt-2">
            {/* Add Discount / Extras Button */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDiscountModal(true)}
                className="flex-1 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors font-medium text-xs h-8"
              >
                % Discount (F4)
              </button>
              <button
                onClick={handleHoldOrder}
                className="flex-1 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors font-medium text-xs h-8"
              >
                Hold Order
              </button>
            </div>

            {/* Lock Screen Button */}
            <button
              onClick={handleLockScreen}
              className="w-full py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors font-medium text-xs h-8 flex items-center justify-center gap-2"
            >
              🔒 Lock Screen
            </button>

            {/* Recall Orders Badge */}
            {heldOrders.length > 0 && (
              <button
                onClick={() => setShowHoldOrdersModal(true)}
                className="w-full py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors font-medium text-xs flex items-center justify-center gap-1 h-8"
              >
                <span>📋</span>
                <span>Recall Orders ({heldOrders.length})</span>
              </button>
            )}

            {/* Bill Summary */}
            <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-lg">
              <div className="space-y-1 mb-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{currencySymbol} {calculateSubtotal().toFixed(2)}</span>
                </div>
                {calculateDiscount() > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({discountSettings.discountType === 'percentage' ? `${discountSettings.discountValue}%` : 'Flat'})</span>
                    <span>- {currencySymbol} {calculateDiscount().toFixed(2)}</span>
                  </div>
                )}
                {discountSettings.extraCharges.map((charge, index) => (
                  <div key={index} className="flex justify-between text-gray-600">
                    <span>{charge.label || 'Extra Charge'}</span>
                    <span>{currencySymbol} {charge.amount.toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bold text-gray-800 pt-1 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-amber-600">{currencySymbol} {calculateGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={clearCart}
                    className="flex-1 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors h-8"
                  >
                    Clear (Esc)
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-[2] py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors h-8"
                  >
                    Checkout (Enter)
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center">F2: Search | F4: Discount | Esc: Clear | Enter: Checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Select Payment Method</h2>
            
            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-lg font-medium transition-all duration-200 text-xs h-10 ${
                  paymentMethod === 'cash' 
                    ? 'bg-green-500 text-white transform scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💵 Cash
              </button>
              <button
                onClick={() => {
                  setPaymentMethod('card')
                  setTimeout(() => cardAuthCodeRef.current?.focus(), 100)
                }}
                className={`py-3 rounded-lg font-medium transition-all duration-200 ${
                  paymentMethod === 'card' 
                    ? 'bg-blue-500 text-white transform scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💳 Card
              </button>
              <button
                onClick={() => setPaymentMethod('online')}
                className={`py-3 rounded-lg font-medium transition-all duration-200 ${
                  paymentMethod === 'online' 
                    ? 'bg-purple-500 text-white transform scale-105 shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📱 QR
              </button>
            </div>

            {/* Cash Payment Section */}
            {paymentMethod === 'cash' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cash Received</label>
                  <input
                    ref={cashReceivedRef}
                    type="number"
                    value={cashReceived}
                    onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        setFocusedQuickCashIndex(0)
                        setTimeout(() => quickCashButtonsRef.current[0]?.focus(), 0)
                      } else if (e.key === 'Enter') {
                        e.preventDefault()
                        if (cashReceived >= calculateGrandTotal()) {
                          handleCompletePayment()
                        } else {
                          alert('Insufficient Cash Received')
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Quick Cash Presets */}
                <div className="grid grid-cols-5 gap-2">
                  {[100, 500, 1000, 5000, 0].map((amount, index) => (
                    <button
                      key={amount}
                      ref={(el) => { quickCashButtonsRef.current[index] = el }}
                      onClick={() => setQuickCashAmount(amount)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft' && index > 0) {
                          e.preventDefault()
                          setFocusedQuickCashIndex(index - 1)
                          setTimeout(() => quickCashButtonsRef.current[index - 1]?.focus(), 0)
                        } else if (e.key === 'ArrowRight' && index < 4) {
                          e.preventDefault()
                          setFocusedQuickCashIndex(index + 1)
                          setTimeout(() => quickCashButtonsRef.current[index + 1]?.focus(), 0)
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          setFocusedQuickCashIndex(-1)
                          setTimeout(() => cashReceivedRef.current?.focus(), 0)
                        } else if (e.key === 'Enter') {
                          e.preventDefault()
                          setQuickCashAmount(amount)
                          setFocusedQuickCashIndex(-1)
                        }
                      }}
                      className={`py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 font-medium text-sm transition-colors ${
                        focusedQuickCashIndex === index ? 'ring-2 ring-green-500 ring-offset-2' : ''
                      }`}
                      tabIndex={focusedQuickCashIndex === index ? 0 : -1}
                    >
                      {amount === 0 ? 'Exact' : amount}
                    </button>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Change Due:</span>
                    <span className={`font-bold ${calculateChange() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {currencySymbol} {calculateChange().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Card Payment Section */}
            {paymentMethod === 'card' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Card Type</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value as 'Visa' | 'MasterCard' | 'AMEX' | 'Other')}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-medium"
                  >
                    <option value="Visa">💳 Visa</option>
                    <option value="MasterCard">💳 MasterCard</option>
                    <option value="AMEX">💳 AMEX</option>
                    <option value="Other">💳 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Authorization Code</label>
                  <input
                    ref={cardAuthCodeRef}
                    type="text"
                    value={cardAuthCode}
                    onChange={(e) => setCardAuthCode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (cardAuthCode.trim().length > 0) {
                          handleCompletePayment()
                        } else {
                          alert('Please enter authorization code')
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm font-medium"
                    placeholder="Enter authorization code"
                  />
                </div>
              </div>
            )}

            {/* QR Payment Section */}
            {paymentMethod === 'online' && (
              <div className="space-y-4">
                {/* QR Code Display */}
                <div className="flex flex-col items-center">
                  {storeSettings.paymentQrUrl ? (
                    <div className="relative">
                      <img
                        src={storeSettings.paymentQrUrl}
                        alt="Payment QR Code"
                        className="w-48 h-48 object-contain rounded-lg border-2 border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-xs text-gray-500">No QR Code Uploaded</p>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-gray-600 mt-2 text-center">
                    Scan with any Bank App / LankaQR to Pay
                  </p>
                </div>

                {/* Reference Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                  <input
                    type="text"
                    value={qrRefNo}
                    onChange={(e) => setQrRefNo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (qrRefNo.trim().length > 0) {
                          handleCompletePayment()
                        } else {
                          alert('Please enter reference number')
                        }
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Enter reference number"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompletePayment}
                disabled={paymentMethod === 'cash' && cashReceived < calculateGrandTotal()}
                className="flex-[2] py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discount Modal */}
      {showDiscountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Apply Discount</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiscountSettings(prev => ({ ...prev, discountType: 'percentage' }))}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      discountSettings.discountType === 'percentage' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    onClick={() => setDiscountSettings(prev => ({ ...prev, discountType: 'flat' }))}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      discountSettings.discountType === 'flat' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Flat Amount
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {discountSettings.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                </label>
                <input
                  type="number"
                  value={discountSettings.discountValue}
                  onChange={(e) => setDiscountSettings(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder={discountSettings.discountType === 'percentage' ? '0' : '0.00'}
                  min="0"
                  step={discountSettings.discountType === 'percentage' ? '1' : '0.01'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order Note</label>
                <textarea
                  value={discountSettings.orderNote}
                  onChange={(e) => setDiscountSettings(prev => ({ ...prev, orderNote: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Add a note to this order"
                  rows={2}
                />
              </div>

              {/* Extra Charges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra Charges</label>
                {discountSettings.extraCharges.map((charge, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={charge.label}
                      onChange={(e) => updateExtraCharge(index, 'label', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="Label (e.g., Packaging)"
                    />
                    <input
                      type="number"
                      value={charge.amount}
                      onChange={(e) => updateExtraCharge(index, 'amount', e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      placeholder="0.00"
                      step="0.01"
                    />
                    <button
                      onClick={() => removeExtraCharge(index)}
                      className="px-2 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={addExtraCharge}
                  className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors text-sm"
                >
                  + Add Extra Charge
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Require manager approval for discounts > 10%
                    const discountValue = discountSettings.discountValue
                    const isHighDiscount = discountSettings.discountType === 'percentage' 
                      ? discountValue > 10 
                      : (discountValue / calculateSubtotal()) > 0.10

                    if (isHighDiscount) {
                      requireManagerApproval(() => {
                        setShowDiscountModal(false)
                      })
                    } else {
                      setShowDiscountModal(false)
                    }
                  }}
                  className="flex-[2] py-2 bg-primary text-white rounded-lg font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hold Orders Modal */}
      {showHoldOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Held Orders</h2>
            
            {heldOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No held orders</p>
            ) : (
              <div className="space-y-2">
                {heldOrders.map((heldOrder) => (
                  <div key={heldOrder.id} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{heldOrder.id}</p>
                        <p className="text-xs text-gray-500">
                          {heldOrder.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-xs font-bold text-gray-800">
                        {currencySymbol} {heldOrder.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRecallOrder(heldOrder)}
                        className="flex-1 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium text-xs transition-colors"
                      >
                        Recall
                      </button>
                      <button
                        onClick={() => {
                          setHeldOrders(prev => prev.filter(order => order.id !== heldOrder.id))
                          setShowHoldOrdersModal(false)
                        }}
                        className="flex-1 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowHoldOrdersModal(false)}
              className="w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Item Note Modal */}
      {showItemNoteModal && selectedCartItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Add Note to Item</h2>
            <p className="text-xs text-gray-600 mb-3">{selectedCartItem.product.name}</p>
            
            <textarea
              value={selectedCartItem.note || ''}
              onChange={(e) => setSelectedCartItem({ ...selectedCartItem, note: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter item note (e.g., no onions, extra spicy)"
              rows={3}
            />

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowItemNoteModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveItemNote(selectedCartItem.note || '')}
                className="flex-[2] py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-bold transition-colors"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && lastOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="receipt-modal-content bg-white rounded-lg shadow-xl p-6"
            style={{
              width: storeSettings.receiptPrinterSize === '58mm' ? '58mm' : '80mm',
              maxWidth: storeSettings.receiptPrinterSize === '58mm' ? '58mm' : '80mm',
              fontSize: storeSettings.receiptPrinterSize === '58mm' ? '11px' : '14px',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto'
            }}
          >
            <style jsx>{`
              @media print {
                body * {
                  visibility: hidden;
                }
                .receipt-modal-content, .receipt-modal-content * {
                  visibility: visible;
                }
                .receipt-modal-content {
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translate(-50%, -50%);
                  width: ${storeSettings.receiptPrinterSize === '58mm' ? '58mm' : '80mm'};
                  max-width: ${storeSettings.receiptPrinterSize === '58mm' ? '58mm' : '80mm'};
                  padding: 10px;
                  box-shadow: none;
                  border-radius: 0;
                  font-size: ${storeSettings.receiptPrinterSize === '58mm' ? '11px' : '14px'};
                  word-break: break-word !important;
                  overflow-wrap: break-word !important;
                  hyphens: auto !important;
                }
                .noprint {
                  display: none !important;
                }
                @page {
                  size: ${storeSettings.receiptPrinterSize === '58mm' ? '58mm auto' : '80mm auto'};
                  margin: 0;
                }
              }
            `}</style>
            
            {/* Header Section */}
            <div className="text-center mb-4">
              {storeSettings.logoUrl && (
                <img src={storeSettings.logoUrl} alt="Logo" className="w-16 h-16 mx-auto mb-2" />
              )}
              <h2 className="text-lg font-bold text-gray-800 uppercase">{storeSettings.shopName}</h2>
              {storeSettings.slogan && <p className="text-xs text-gray-600">{storeSettings.slogan}</p>}
              <p className="text-xs text-gray-600 mt-1">{storeSettings.address}</p>
              <p className="text-xs text-gray-600">{storeSettings.phone1} {storeSettings.phone2 && `/ ${storeSettings.phone2}`}</p>
              {storeSettings.brNumber && <p className="text-xs text-gray-600">BR/Tax No: {storeSettings.brNumber}</p>}
              {storeSettings.receiptHeaderMessage && <p className="text-xs text-gray-600 mt-1">{storeSettings.receiptHeaderMessage}</p>}
            </div>

            {/* Order Details Section */}
            <div className="border-t border-b border-dashed py-2 mb-2">
              <div className="flex justify-between text-xs">
                <span>ORDER #:</span>
                <span className="font-semibold">ORD-{String(lastOrder.id).replace(/\D/g, '').padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>DATE:</span>
                <span>{new Date(lastOrder.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}, {new Date(lastOrder.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>TYPE:</span>
                <span className="uppercase">{lastOrder.orderType}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>SERVED BY:</span>
                <span>Cashier</span>
              </div>
            </div>

            {/* Items Section with Unit Price Breakdown */}
            <div className="mb-2">
              {lastOrder.cartSnapshot.map((item, index) => (
                <div key={index} className="mb-2">
                  <div className="text-xs font-semibold">{item.product.name}</div>
                  <div className="flex justify-between text-xs">
                    <span>{item.quantity} x {currencySymbol}{item.product.price.toFixed(2)}</span>
                    <span className="font-semibold">{currencySymbol} {(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                  {item.note && <div className="text-xs text-gray-500 italic">Note: {item.note}</div>}
                </div>
              ))}
            </div>

            {/* Price Breakdown Section */}
            <div className="border-t border-b border-dashed py-2 mb-2">
              <div className="flex justify-between text-xs">
                <span>SUBTOTAL:</span>
                <span>{currencySymbol} {lastOrder.subtotal.toFixed(2)}</span>
              </div>
             {Boolean(lastOrder?.discount && Number(lastOrder.discount) > 0) ? (
                <div className="flex justify-between text-xs text-green-600">
                  <span>DISCOUNT ({lastOrder.discountType}):</span>
                  <span>- {currencySymbol} {Number(lastOrder.discount).toFixed(2)}</span>
                </div>
              ) : null}
              {lastOrder.extraCharges && lastOrder.extraCharges.filter(charge => charge.amount > 0).map((charge, index) => (
                <div key={index} className="flex justify-between text-xs">
                  <span className="uppercase">{charge.label}:</span>
                  <span>{currencySymbol} {charge.amount.toFixed(2)}</span>
                </div>
 ))}
              <div className="flex justify-between text-sm font-bold mt-1">
                <span>TOTAL:</span>
                <span>{currencySymbol} {lastOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment & Cash Change Details */}
            <div className="border-t border-b border-dashed py-2 mb-2">
              <div className="flex justify-between text-xs">
                <span>PAYMENT METHOD:</span>
                <span className="uppercase">{lastOrder.paymentMethod}</span>
              </div>
              {lastOrder.paymentMethod.toLowerCase() === 'cash' && lastOrder.cashReceived && (
                <>
                  <div className="flex justify-between text-xs">
                    <span>CASH PAID:</span>
                    <span>{currencySymbol} {lastOrder.cashReceived.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>CHANGE RETURNED:</span>
                    <span>{currencySymbol} {(lastOrder.cashReceived - lastOrder.totalAmount).toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {storeSettings.showNoticeOnReceipt && storeSettings.description && (
              <div className="border-t border-dashed py-2 mb-2">
                <p className="text-xs text-gray-600 text-center italic">{storeSettings.description}</p>
              </div>
            )}

            {storeSettings.receiptFooterMessage && (
              <p className="text-xs text-gray-600 text-center mb-2">{storeSettings.receiptFooterMessage}</p>
            )}

            <div className="flex gap-2 noprint">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {/* window.print() */}} // Disabled automatic print dialog
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors text-xs"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer Prompt Modal */}
      {showOfferPrompt && eligibleOffers.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 w-full max-w-md">
            <h2 className="text-sm font-bold text-gray-800 mb-3">🎁 Special Offer Available!</h2>
            
            <div className="space-y-2">
              {eligibleOffers.map((offer) => (
                <div key={offer.id} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-sm font-semibold text-gray-800">{offer.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{offer.description}</p>
                  <button
                    onClick={() => applyOfferReward(offer)}
                    className="mt-2 w-full py-1.5 bg-primary text-white rounded-lg font-medium text-xs transition-colors"
                  >
                    Claim Offer
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowOfferPrompt(false)
                setEligibleOffers([])
              }}
              className="w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors text-xs"
            >
              Skip Offers
            </button>
          </div>
        </div>
      )}

      {/* Lock Screen Overlay */}
      {isLocked && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-95 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Screen Locked</h2>
            <p className="text-slate-300 mb-6">Enter your PIN to unlock or switch user</p>
            <button
              onClick={() => setShowLockPinModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Enter PIN
            </button>
          </div>
        </div>
      )}

      {/* Lock PIN Modal */}
      <PinPadModal
        isOpen={showLockPinModal}
        onClose={() => {
          setShowLockPinModal(false)
          if (!isLocked) setIsLocked(true)
        }}
        onVerify={handleUnlock}
        title="Unlock Screen"
        description="Enter your 4-digit PIN to unlock or switch user"
      />

      {/* Manager Approval PIN Modal */}
      <PinPadModal
        isOpen={showManagerPinModal}
        onClose={() => {
          setShowManagerPinModal(false)
          setPendingAction(null)
        }}
        onVerify={handleManagerApproval}
        title="Manager Approval Required"
        description="Enter Manager/Admin PIN to authorize this action"
        requireManager={true}
      />

      {/* Shift Start Modal - Only show when not loading and no active shift */}
      {!isShiftLoading && (
        <ShiftStartModal
          isOpen={showShiftModal}
          cashierName={currentUsername || 'Cashier'}
          lastShiftClosingBalance={initialLastShift?.endingCash}
          defaultShiftFloat={defaultShiftFloat}
          allowEditOpeningBalance={allowEditOpeningBalance}
          onSubmit={async (openingBalance, notes) => {
            if (currentUserId) {
              const result = await startShift(currentUserId, openingBalance, notes)
              if (result.success) {
                setShowShiftModal(false)
                // Dispatch custom event to notify Header component immediately
                window.dispatchEvent(new CustomEvent('shift-refresh'))
                // Force immediate router refresh to invalidate cache
                router.refresh()
                // Small delay to allow server revalidation to complete
                setTimeout(() => {
                  // Dispatch another event to ensure Header updates
                  window.dispatchEvent(new CustomEvent('shift-refresh'))
                }, 100)
                // Clean up URL
                router.replace('/pos')
              } else {
                alert(result.error || 'Failed to start shift')
              }
            }
          }}
        />
      )}

      {/* Loading Spinner for Initial Load */}
      {isShiftLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700">Loading shift status...</p>
          </div>
        </div>
      )}
    </>
  )
}
