<template>
  <div class="currency-page d-flex flex-column">
    <v-card v-if="loadingUserData" class="col-12 mb-5 py-12">
      <overlay>
        <v-progress-circular indeterminate color="#fff"/>
      </overlay>
    </v-card>

    <v-card v-else-if="!bill" class="col-12 mb-5">
      <v-card-text>
        <div class="body-1 mb-5">You have not entered your bill to calculate it in different currencies</div>
        <v-btn @click="toProfile">Enter bill</v-btn>
      </v-card-text>
    </v-card>

    <v-card v-else class="col-12 mb-5 pa-0">
      <v-card-title class="align-start justify-space-between">
        <span class="mb-4">{{ bill | currency }} in currencies</span>

        <v-text-field
          class="flex-grow-0"
          label="Bill"
          outlined
          dense
          prefix="₽"
          autocomplete="off"
          :value="bill"
          @input="onInputBill"
        />
      </v-card-title>

      <v-card-text>
        <div
          class="bill-line"
          v-for="billLine in currencyHistoryList"
          :key="billLine.date"
        >
          <span class="bill-line-title">{{ billLine.date }}:</span>
          <span
            v-for="(value, key) in billLine.rates"
            :key="value"
            class="bill-line-item"
          >
            {{ (value * bill) | currency(key) }}
          </span>
        </div>
      </v-card-text>
    </v-card>

    <CurrencyTable/>
  </div>
</template>

<script>
import CurrencyTable from '@/components/CurrencyTable';
import { mapGetters, mapActions } from 'vuex';
import { CURRENCY_HISTORY, USER_DATA } from '@/consts';
import moment from 'moment';

export default {
  components: { CurrencyTable },
  data() {
    return {
      bill: '',
    };
  },
  watch: {
    userData(v) {
      this.bill = v.bill;
    },
  },
  computed: {
    ...mapGetters({
      currencyHistoryList: CURRENCY_HISTORY,
      userData: USER_DATA,
    }),
    loadingUserData() {
      return Object.keys(this.userData).length === 0;
    },
  },
  methods: {
    ...mapActions({
      getCurrencyHistory: CURRENCY_HISTORY,
    }),
    onGetCurrencyHistory() {
      const params = {
        today: moment().format('YYYY-MM-DD'),
        fiveYearsAgo: moment().subtract(5, 'years').format('YYYY-MM-DD'),
        tenYearsAgo: moment().subtract(10, 'years').format('YYYY-MM-DD'),
      };
      this.getCurrencyHistory({ params });
    },
    onInputBill(value) {
      if(isNaN(value) || +value > 1000000 || +value < 1) return;
      this.bill = value;
    },
    toProfile() {
      this.$router.push({ name: 'profile' });
    },
  },
  mounted() {
    this.bill = this.userData?.bill;
    this.onGetCurrencyHistory();
  },
}
</script>

<style scoped>
.currency-page {
  max-width: 900px;
  margin: 0 auto;
}

.bill-line {
  font-size: 15px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 15px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  margin-bottom: 14px;
}
.bill-line-title {
  text-align: left;
  color: #000;
  font-size: 16px;
}
.bill-line-item {
  text-align: right;
}

@media screen and (max-width: 650px) {
  .bill-line {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .bill-line-title {
    width: 100%;
    margin-bottom: 8px;
  }
  .bill-line-item {
    margin-right: 10px;
  }
  .bill-line-item:last-child {
    margin-right: 0px;
  }
}
@media screen and (max-width: 430px) {
  .bill-line-title {
    font-size: 15px;
  }
  .bill-line-item {
    font-size: 14px;
  }
}
</style>