<template>
  <v-list dense>
    <v-list-item
      v-for="item in menuList"
      :key="item.label"
      link
      @click="openMenu(item.name)"
      :class="{'v-list-item--active': activePage === item.name}"
    >
      <v-list-item-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-title> {{ item.label }} </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { menuList } from '@/utils/menuList'

export default {
  data() {
    return {
      menuList,
      activePage: '',
    };
  },
  methods: {
    openMenu(name) {
      this.activePage = name;
      this.$router.push({name});
    },
  },
  mounted() {
    this.activePage = this.$route.name;
  },
};
</script>
