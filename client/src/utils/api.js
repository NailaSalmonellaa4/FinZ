const BASE = '/api';

// Storage helpers
export const getToken = () => localStorage.getItem('finz_token');
export const setToken = (t) => localStorage.setItem('finz_token', t);
export const removeToken = () => localStorage.removeItem('finz_token');

async function req(method, path, body, requiresAuth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (requiresAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan.');
  return data;
}

export const api = {
  // Auth & Profile
  register: (body) => req('POST', '/auth/register', body, false),
  login: (body) => req('POST', '/auth/login', body, false),
  getMe: () => req('GET', '/auth/me'),
  updateProfile: (body) => req('PUT', '/auth/profile', body),

  // Transactions
  getTransactions: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return req('GET', `/transactions${qs ? '?' + qs : ''}`);
  },
  addTransaction: (body) => req('POST', '/transactions', body),
  deleteTransaction: (id) => req('DELETE', `/transactions/${id}`),

  // Budgets
  getBudgets: (month) => req('GET', `/budgets${month ? '?month=' + month : ''}`),
  addBudget: (body) => req('POST', '/budgets', body),
  updateBudget: (id, body) => req('PUT', `/budgets/${id}`, body),
  deleteBudget: (id) => req('DELETE', `/budgets/${id}`),

  // Savings
  getSavings: () => req('GET', '/savings'),
  addSavingTarget: (body) => req('POST', '/savings', body),
  depositSaving: (id, body) => req('POST', `/savings/${id}/deposit`, body),
  deleteSaving: (id) => req('DELETE', `/savings/${id}`),

  // Invest
  getInvest: () => req('GET', '/invest'),
  buyAsset: (body) => req('POST', '/invest/buy', body),
  sellAsset: (body) => req('POST', '/invest/sell', body),
  getInvestHistory: () => req('GET', '/invest/history'),

  // Gamification & Shop
  getGamification: () => req('GET', '/gamification'),
  claimQuest: (id) => req('POST', `/gamification/claim/${id}`),
  getQuiz: () => req('GET', '/gamification/quiz'),
  answerQuiz: (body) => req('POST', '/gamification/quiz/answer', body),
  getShop: () => req('GET', '/gamification/shop'),
  buyShopItem: (itemId) => req('POST', '/gamification/shop/buy', { itemId }),
  equipShopItem: (itemId, action) => req('POST', '/gamification/shop/equip', { itemId, action }),
  changeMascot: (mascot) => req('POST', '/gamification/mascot', { mascot })
};
