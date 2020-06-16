<template>
  <v-card class="col-12 pa-0">
    <transition-card ref="transitionCard" v-model="isDatePickerOpen">
      <template #activator> <div style="width: 230px;"></div> </template>
      <div @click.stop>
        <v-date-picker
          :max="today"
          min="2011-01-01"
          @input="changePicker"
          @change="onGetCurrencyRang"
          v-model="dates"
          range
          no-title
        />
      </div>
    </transition-card>  
    <v-data-table
      :headers="headers"
      :items="currencyRangList"
      :items-per-page="5"
      class="mt-n4"
    >
      <template #top>
        <v-text-field
          v-model="dateInputPlaceholder"
          label="Date range"
          outlined
          dense
          class="currency-date"
          readonly
          @click.stop="onDatePickerOpen"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { CURRENCY_RANG } from '@/consts';
import moment from 'moment';
import TransitionCard from '@/components/app/TransitionCard';

export default {
  components: { TransitionCard },
  data () {
    return {
      isDatePickerOpen: false,
      headers: [
        { text: 'Date', value: 'date' },
        { text: 'USD', value: 'USD' },
        { text: 'EUR', value: 'EUR' },
        { text: 'CNY', value: 'CNY' },
      ],
      dates: [moment().subtract(7, 'days').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
      today: moment().format('YYYY-MM-DD'),
    };
  },
  computed: {
    ...mapGetters({
      currencyRangList: CURRENCY_RANG,
    }),
    dateInputPlaceholder () {
      let dates = [...this.dates];
      dates.sort((next, prev) => next < prev ? -1 : 0);
      return dates.map(item => moment(item).format('DD MMM YYYY')).join(' - ');
    },
  },
  methods: {
    ...mapActions({
      getCurrencyRang: CURRENCY_RANG,
    }),
    onDatePickerOpen() {
      this.isDatePickerOpen = true;
    },
    changePicker() {
      if(this.dates.length === 1) {
        this.isDatePickerOpen = false;
        this.$refs.transitionCard.$on('afterLeave', () => (this.dates.length === 1) && (this.isDatePickerOpen = true));
      }
    },
    onGetCurrencyRang() {
      this.isDatePickerOpen = false;
      let dates = [...this.dates];
      dates.sort((next, prev) => next < prev ? -1 : 0);

      const params = { start: dates[0], end: dates[1] };
      this.getCurrencyRang({ params })
      .catch(() => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }));
    },
  },
  mounted() {
    this.onGetCurrencyRang();
  },
}
</script>

<style scoped>
.currency-date {
  height: 40px;
  margin: 10px;
  display: inline-block;
}
</style>