/**
 * Payment Methods Registry
 * 
 * Single source of truth for all payment method configurations.
 * Used by CollectPaymentPanel for rendering and API payload construction.
 * 
 * TYPES:
 * - "method": Standard payment method (Cash, Card, UPI, Credit)
 * - "action": Special action (Split, ToRoom)
 * 
 * SPECIAL FLAG:
 * - special: true means the method has custom UI handling
 *   (e.g., Split has split payment UI, ToRoom has room picker)
 */

import { Banknote, CreditCard, Smartphone, Split, FileText, ArrowRightLeft } from "lucide-react";

// ============================================================================
// PAYMENT METHODS REGISTRY
// ============================================================================

export const PAYMENT_METHODS = {
  // Primary Payment Methods
  cash: {
    id: "cash",
    icon: Banknote,
    label: "Cash",
    apiValue: "cash",
    type: "method",
    apiFlag: "cash",        // maps to restaurant.paymentMethods.cash
    special: false,
  },
  card: {
    id: "card",
    icon: CreditCard,
    label: "Card",
    apiValue: "card",
    type: "method",
    apiFlag: "card",        // maps to restaurant.paymentMethods.card
    special: false,
  },
  upi: {
    id: "upi",
    icon: Smartphone,
    label: "UPI",
    apiValue: "upi",
    type: "method",
    apiFlag: "upi",         // maps to restaurant.paymentMethods.upi
    special: false,
  },
  credit: {
    id: "credit",
    icon: FileText,
    label: "Credit",
    apiValue: "TAB",        // API expects "TAB" for credit/tab payments
    type: "method",
    apiFlag: "tab",         // maps to restaurant.paymentMethods.tab
    special: false,
  },

  // Action Methods
  split: {
    id: "split",
    icon: Split,
    label: "Split",
    apiValue: "partial",    // API expects "partial" for split payments
    type: "action",
    apiFlag: null,          // Always available
    special: true,          // Has custom split payment UI
  },
  transferToRoom: {
    id: "transferToRoom",
    icon: ArrowRightLeft,
    label: "To Room",
    apiValue: "ROOM",
    type: "action",
    apiFlag: null,          // Availability based on restaurant having rooms
    special: true,          // Has custom room picker UI
    requiresRooms: true,    // Only show if restaurant has rooms
  },
};

// ============================================================================
// DEFAULT LAYOUT CONFIGURATION
// ============================================================================

export const DEFAULT_PAYMENT_LAYOUT = {
  row1: ["cash", "card", "upi"],           // Primary payment methods
  row2: ["split", "credit", "transferToRoom"], // Actions (transferToRoom auto-hidden if no rooms)
  dropdown: [],                             // Additional payment types from API
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get payment method config by ID
 * @param {string} methodId - Payment method ID
 * @returns {Object|null} Payment method config or null
 */
export const getPaymentMethod = (methodId) => {
  return PAYMENT_METHODS[methodId] || null;
};

/**
 * Get icon component for a payment method
 * @param {string} methodId - Payment method ID
 * @returns {Component|null} Lucide icon component or null
 */
export const getPaymentIcon = (methodId) => {
  return PAYMENT_METHODS[methodId]?.icon || null;
};

/**
 * Get API value for a payment method
 * @param {string} methodId - Payment method ID  
 * @returns {string} API value for the payment method
 */
export const getPaymentApiValue = (methodId) => {
  return PAYMENT_METHODS[methodId]?.apiValue || methodId;
};

/**
 * Check if a payment method is enabled based on restaurant settings
 * @param {string} methodId - Payment method ID
 * @param {Object} paymentMethods - Restaurant payment methods flags
 * @param {boolean} hasRooms - Whether restaurant has rooms
 * @returns {boolean} Whether the method should be shown
 */
export const isPaymentMethodEnabled = (methodId, paymentMethods = {}, hasRooms = false) => {
  const method = PAYMENT_METHODS[methodId];
  if (!method) return false;

  // Check if method requires rooms
  if (method.requiresRooms && !hasRooms) {
    return false;
  }

  // If method has an API flag, check if it's enabled
  if (method.apiFlag) {
    return paymentMethods[method.apiFlag] !== false; // Default to true if not set
  }

  // No API flag = always available
  return true;
};

/**
 * Filter layout config by enabled methods
 * @param {Object} layoutConfig - Layout configuration
 * @param {Object} paymentMethods - Restaurant payment methods flags
 * @param {boolean} hasRooms - Whether restaurant has rooms
 * @returns {Object} Filtered layout config
 */
export const filterLayoutByEnabled = (layoutConfig, paymentMethods = {}, hasRooms = false) => {
  const filterMethods = (methodIds) => 
    methodIds.filter(id => isPaymentMethodEnabled(id, paymentMethods, hasRooms));

  return {
    row1: filterMethods(layoutConfig.row1 || []),
    row2: filterMethods(layoutConfig.row2 || []),
    dropdown: filterMethods(layoutConfig.dropdown || []),
  };
};

/**
 * Get all method IDs as array
 * @returns {string[]} Array of all payment method IDs
 */
export const getAllMethodIds = () => {
  return Object.keys(PAYMENT_METHODS);
};

/**
 * Get methods by type
 * @param {string} type - "method" or "action"
 * @returns {Object[]} Array of payment method configs
 */
export const getMethodsByType = (type) => {
  return Object.values(PAYMENT_METHODS).filter(m => m.type === type);
};
