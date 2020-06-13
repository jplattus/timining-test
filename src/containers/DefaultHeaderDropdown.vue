<template>
  <AppHeaderDropdown right no-caret>
    <template slot="header">
      <span>
        {{user.firstName}} {{user.lastName}}
      </span>
      <img
        :src="user.profilePictureUrl"
        class="img-avatar"/>
    </template>
    <template slot="dropdown">
      <div>
        <ol>
          <li @click="handleLogout">Cerrar sesión</li>
        </ol>
      </div>
    </template>
  </AppHeaderDropdown>
</template>

<script>
import { HeaderDropdown as AppHeaderDropdown } from '@coreui/vue'
import {mapState} from "vuex";

export default {
  name: 'DefaultHeaderDropdown',
  components: {
    AppHeaderDropdown
  },
  computed: {
    ...mapState(['user'])

  },
  methods: {
    handleLogout() {
      this.$store.dispatch('logout')
    }
  }
}
</script>

