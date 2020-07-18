<template>
  <Card class="profile-page">
    <ProfileAvatar/>

    <form @submit.prevent="onSubmit" class="mt-7">
      <v-row class="mx-0">
        <v-text-field
          class="col-12 col-sm mr-sm-2"
          label="Name"
          outlined
          dense
          v-model="form.name"
        />
        <v-text-field
          class="col-12 col-sm ml-sm-2"
          label="Last name"
          outlined
          dense
          v-model="form.lastName"
        />
      </v-row>

      <v-row class="mx-0">
        <v-text-field
          class="col-12 col-sm mr-sm-2"
          label="Bill"
          outlined
          dense
          :error-messages="getValidationErrors(profileValidations.bill)"
          prefix="₽"
          v-model="form.bill"
        />

        <drop-list
          class="country-input-wrapper col-12 col-sm ml-sm-2"
          ref="dropList"
          @onClose="onCloseCountrySelect"
        >
          <template #activator>
            <v-text-field
              label="Country"
              outlined
              dense
              autocomplete="off"
              :error-messages="getValidationErrors(profileValidations.country)"
              @click.stop="onOpenCountrySelect"
              @input="countryInputQuery"
              v-model="form.country"
            >
              <template #append>
                <v-fade-transition>
                  <v-progress-circular
                    v-if="form.countryInputLoading"
                    size="24"
                    indeterminate
                  />
                </v-fade-transition>
              </template>
            </v-text-field>
          </template>

          <ul v-if="countriesList.length" class="country-list">
            <li
              v-for="item in countriesList"
              :key="item"
              class="country-list-item"
              :class="{active: item === form.selectedCountry}"
              v-ripple
              @click="onSelectCountry(item)"
            >
              {{ item }}
            </li>
          </ul>
        </drop-list>
      </v-row>
      
      <v-row class="mx-0 mt-2">
        <v-scroll-x-transition>
          <div class="profile-form-error" v-show="form.errors">{{ form.errors }}</div>
        </v-scroll-x-transition>
        <v-spacer/>
        <v-btn
          type="submit"
          class="mr-4 text-capitalize"
          color="primary"
          :disabled="isFormChanged"
        >
          save changes
        </v-btn>
        <v-btn
          @click="formReset"
          class="text-capitalize"
          color="orange"
          outlined
          :disabled="isFormChanged"
        >
          reset
        </v-btn>
      </v-row>

      <v-progress-linear
        :active="form.loading"
        indeterminate
        absolute
        bottom
        color="deep-purple accent-4"
      ></v-progress-linear>
    </form>
  </Card>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ProfileAvatar from '@/components/ProfileAvatar';
import DropList from '@/components/app/DropList';
import Card from '@/components/app/Card';
import { numeric } from 'vuelidate/lib/validators';
import prepareErrors from '@/mixins/prepareErrors.mixin.js';
import { profileValidations } from '@/utils/validationOptions';
import { COUNTRIES, USER_DATA, UPDATE_USER_DATA } from '@/consts';

export default {
  components: { ProfileAvatar, DropList, Card },
  data() {
    return {
      profileValidations,
      formFields: ['name', 'lastName', 'bill', 'country'],
      form: {
        name: '',
        lastName: '',
        bill: '',
        country: '',
        selectedCountry: '',
        countryInputLoading: false,
        countryInputTimer: () => {},
        errors: '',
        loading: false,
      },
    };
  },
  validations: {
    form: {
      bill: { numeric },
      country: {
        isString: val => {
          let hasNumber = val.split('').find(sym => !isNaN(sym) && sym !== ' ');
          return !hasNumber;
        },
      },
    },
  },
  mixins: [prepareErrors],
  computed: {
    ...mapGetters({
      countriesList: COUNTRIES,
      userData: USER_DATA,
    }),
    isFormChanged() {
      let hasChangedFields = this.formFields.find(key => {
        return (this.form[key]).toString() !== (this.userData[key] ? (this.userData[key]).toString() : '');
      });
      return !hasChangedFields;
    },
  },
  methods: {
    ...mapActions({
      countriesSearch: COUNTRIES,
      loadUserData: USER_DATA,
      updateUserData: UPDATE_USER_DATA,
    }),
    ...mapMutations({
      countriesListMutation: COUNTRIES,
    }),
    onOpenCountrySelect() {
      this.$refs.dropList.onOpen();
    },
    countryInputQuery() {
      clearTimeout(this.form.countryInputTimer);
      if(this.$v.form.country.$invalid) {
        this.$v.form.country.$touch()
        this.countriesListMutation([]);
        this.form.countryInputLoading = false;
        return
      }
      this.form.countryInputLoading = true;

      this.form.countryInputTimer = setTimeout(async () => {
        try {
          this.form.country
          ? await this.countriesSearch(this.form.country)
          : this.countriesListMutation([]);
          this.form.countryInputLoading = false;
        } catch {
          this.form.countryInputLoading = false;
        }

        this.$nextTick(() => this.onOpenCountrySelect());
      }, 350);
    },
    onSelectCountry(countryName) {
      this.form.country = countryName;
      this.form.selectedCountry = countryName;
    },
    onCloseCountrySelect() {
      if (this.form.country === '') return;
      let fullCountryName = this.countriesList.find(item => {
        return item.trim().toLowerCase() === this.form.country.trim().toLowerCase();
      });
      !fullCountryName && this.countriesListMutation([]);
      this.onSelectCountry(fullCountryName || this.userData.country || '');
    },
    onSubmit() {
      if(this.$v.form.$invalid) return this.$v.form.$touch();
      this.form.loading = true;

      this.form.errors = '';
      const body = { ...this.userData };
      this.formFields.forEach(key => body[key] = this.form[key]);

      this.updateUserData({ body })
      .then(() => this.$notification({ text: 'Your data has been updated successfully !' }))
      .catch(e => this.form.errors = this.getServerErrors(e))
      .finally(() => this.form.loading = false);
    },
    formReset() {
      this.formFields.forEach(key => this.form[key] = this.userData[key] || '');
      this.form.errors = '';
    },
  },
  mounted() {
    this.loadUserData()
    .then(() => this.formFields.forEach(key => this.form[key] = this.userData[key] || ''))
    .catch(() => this.$notification({ text: 'Data loading failed', color: 'red lighten-2' }));
  },
  beforeDestroy() {
    this.countriesListMutation([]);
  },
}
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  position: relative;
}

.country-input-wrapper {
  padding: 0;
  height: 40px;
}
.country-list {
  padding: 8px 0;
  background: #fff;
  font-size: 13px;
}
.country-list-item {
  padding: 10px 18px;
  transition: 0.3s;
  background: #fff;
  cursor: pointer;
}
.country-list-item:hover {
  background: #E9EBEC;
}
.country-list-item.active {
  background: #c5dbe6;
}

.profile-form-error {
  color: #ff5252;
  font-size: 12px;
}

@media (min-width: 600px) {
  .col-sm {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
  }
}
</style>