

export interface User {
  username: string;
  isLoggedIn: boolean;
}

export interface Product {
  id: number;
  amount: number;
  price: number;
  priceRub: number;
  bonus: number;
}

export interface Order {
  id: number;
  created_at: string;
  amount_robux: number;
  price_usd: number;
  roblox_username: string;
}

export type Language = 'ru' | 'en';

export interface Translations {
  login: string;
  register: string;
  username: string;
  password: string;
  submit: string;
  welcome: string;
  selectPackage: string;
  buy: string;
  paymentDetails: string;
  robloxUser: string;
  robloxPass: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  pay: string;
  processing: string;
  success: string;
  error: string;
  back: string;
  logout: string;
  securityNotice: string;
  account: string;
  noAccount: string;
  yesAccount: string;
  language: string;
  // New features
  customAmount: string;
  enterAmount: string;
  minAmount: string;
  confirmLogoutTitle: string;
  confirmLogoutText: string;
  cancel: string;
  confirm: string;
  // Navigation
  navHome: string;
  navFaq: string;
  navRules: string;
  navHistory: string;
  navCustom: string;
  // Pages
  faqTitle: string;
  rulesTitle: string;
  historyTitle: string;
  // FAQ Content
  q1: string; a1: string;
  q2: string; a2: string;
  q3: string; a3: string;
  // Rules Content
  r1: string;
  r2: string;
  r3: string;
  // History
  orderDate: string;
  orderAmount: string;
  orderPrice: string;
  orderStatus: string;
  statusCompleted: string;
  noOrders: string;
}