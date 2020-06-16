import axios from 'axios';
import { CURRENCY_RANG, CURRENCY_HISTORY } from '@/consts';
import urls from '@/api/urls';

function wrapUrl(method, params) {
  let url = urls[method];
  if(!params) return url;
  
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}:`, params[key]);
  });
  return encodeURI(url)
}

const rates = 'USD,EUR,CNY';

const state = {
  currencyHistoryList: [],
  currencyRangList: [],
};

const getters = {
  [CURRENCY_HISTORY]: s => s.currencyHistoryList,
  [CURRENCY_RANG]: s => s.currencyRangList,
};

const actions = {
  [CURRENCY_HISTORY]({ commit }, { params }) {
    let requests = Object.keys(params)
    .map(key => axios.get(wrapUrl(CURRENCY_HISTORY, { rates, date: params[key] } )));

    return Promise.allSettled(requests)
    .then(response => commit(CURRENCY_HISTORY, response));
  },
  [CURRENCY_RANG]({ commit }, { params }) {
    params.rates = rates;

    return axios.get(wrapUrl(CURRENCY_RANG, params))
    .then(({ data }) => commit(CURRENCY_RANG, data));
  },
};

const mutations = {
  [CURRENCY_HISTORY](state, data) {
    let listItem = data.map(item => item.value.data);
    listItem.sort((next, prev) => next.date > prev.date ? -1 : 0 );
    
    state.currencyHistoryList = listItem || [];
  },
  [CURRENCY_RANG](state, data) {
    let currencyRangList = Object.keys(data.rates).map(date => {
      let listItem = { date };
      Object.keys(data.rates[date]).forEach(rate => listItem[rate] = (1 / data.rates[date][rate]).toFixed(3))
      return listItem;
    });

    state.currencyRangList = currencyRangList || [];
  },
};

export default {
  state,
  getters,
  actions,
  mutations
}