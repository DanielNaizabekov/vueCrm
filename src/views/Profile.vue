<template>
  <div class="profile-wrapper">
    <div class="d-flex align-center">
      <v-avatar tile class="mr-7" color="indigo" min-height="84" min-width="84">
        <v-icon dark>account_circle</v-icon>
      </v-avatar>

      <div>
        <p class="my-0">Angelo Sashington</p>
        <v-btn class="mt-2 mr-4 text-capitalize" color="primary">change avatar</v-btn>
        <v-btn class="mt-2 text-capitalize" color="red" outlined>remove avatar</v-btn>
      </div>
    </div>

    <form class="mt-7">
      <v-row class="mx-0">
        <v-text-field
          class="col-12 col-sm mr-sm-2"
          label="Name"
          outlined
          dense
        />
        <v-text-field
          class="col-12 col-sm ml-sm-2"
          label="Last name"
          outlined
          dense
        />
      </v-row>

      <v-row class="mx-0">
        <v-text-field
          class="col-12 col-sm mr-sm-2"
          label="Bill"
          autocomplete="off"
          outlined
          dense
        />

        <drop-list class="country-input-wrapper col-12 col-sm ml-sm-2" ref="dropList">
          <template #activator>
            <v-text-field
              label="Country"
              outlined
              dense
              autocomplete="off"
              @click.stop="onOpenCountrySelect"
              @input="countryInputQuery"
              v-model="form.country"
            />
          </template>

          <ul class="country-list">
            <li
              v-for="item in countryList"
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
        <v-spacer/>
        <v-btn class="mr-4 text-capitalize" color="primary">save changes</v-btn>
        <v-btn class="text-capitalize" color="orange" outlined>reset</v-btn>
      </v-row>
    </form>
  </div>
</template>

<script>
import DropList from './DropList';

export default {
  components: {
    DropList,
  },
  data() {
    return {
      form: {
        country: '',
        selectedCountry: '',
      },
      countryList: [],
    };
  },
  methods: {
    onOpenCountrySelect() {
      this.$refs.dropList.onOpen();
    },
    async countryInputQuery() {
      try {
        let response = await fetch('https://restcountries.eu/rest/v2/name/' + this.form.country);
        let data = await response.json();
        this.countryList = data.map(item => item.name);
      } catch (e) {
        this.countryList = [];
        console.log(e);
      }

      this.$nextTick(() => this.onOpenCountrySelect());
    },
    onSelectCountry(countryName) {
      this.form.country = countryName;
      this.form.selectedCountry = countryName;
    },
  },
}
</script>

<style scoped>
.profile-wrapper {
  border-radius: 7px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, .2);
  padding: 30px;
  max-width: 800px;
}

@media(max-width: 450px)  {
  .profile-wrapper {
    padding: 15px;
  }
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
</style>

<style>
.entered-letters {
  background: #E9EBEC;
}
</style>