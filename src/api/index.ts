import config from '@/config';

const BASE_URL = config.API_BASE_URL;

const ENDPOINTS = {
  currentPrice: `${BASE_URL}/current_price`,
  bet: `${BASE_URL}/payment/bet`,
  betSolana: `${BASE_URL}/payment/bet`,
  betOnFly: `${BASE_URL}/bet_on_fly`,
  betList: `${BASE_URL}/bet_list`,
};

export default ENDPOINTS;
