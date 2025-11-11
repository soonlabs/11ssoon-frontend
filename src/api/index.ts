import config from '@/config';

const BASE_URL = config.API_BASE_URL;

const ENDPOINTS = {
  // auth
  getSignData: `${BASE_URL}/user/auth_message`,
  login: `${BASE_URL}/user/sign_in`,
  logout: `${BASE_URL}/user/sign_out`,

  currentPrice: `${BASE_URL}/current_price`,
  bet: `${BASE_URL}/payment/bet`,
  betSolana: `${BASE_URL}/solpayment/bet`,
  betOnFly: `${BASE_URL}/bet_on_fly`,
  betList: `${BASE_URL}/bet_list`,
  getBoundedBaseAddress: `${BASE_URL}/get_bind_evm_address`,
  getSignMessage: `${BASE_URL}/get_sign_message`,
  bindBaseAddress: `${BASE_URL}/svm_bind_evm_address`,
};

export default ENDPOINTS;
