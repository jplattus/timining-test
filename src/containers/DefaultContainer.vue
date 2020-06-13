<template>
  <div class="app">
<!--    The main app header-->
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="#">
        <img class="navbar-brand-full" src="img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo">
        <img class="navbar-brand-minimized" src="img/brand/sygnet.svg" width="30" height="30" alt="CoreUI Logo">
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" />
      <b-navbar-nav class="d-md-down-none ml-auto">
        <b-nav-item class="d-md-down-none">

<!--          User name, picture and dropdown component-->
          <DefaultHeaderDropdown/>

        </b-nav-item>
      </b-navbar-nav>
    </AppHeader>
    <div class="app-body">

<!--      Customized sidebar to allow toggling of devices -->
      <AppSidebar fixed>
        <div class="c-sidebar c-sidebar-dark c-sidebar-show">
          <b-list-group >
            <b-list-group-item class="text-light font-weight-bold" style="background: #2f353a" >DEVICES</b-list-group-item>
            <template v-for="(device, key) in devices">
              <b-list-group-item class="text-light" style="background: #2f353a" button @click="toogleDevice(key)">
                <i :class="itemListClass(device.status)"/> {{device.name}}
              </b-list-group-item>
            </template>
          </b-list-group>
        </div>
      </AppSidebar>
      <main class="main">
        <Breadcrumb :list="list"/>
        <div class="container-fluid">

<!--          This router view render the views. In this case, dashboard only. In a SPA, we should render the content here -->
          <router-view/>
        </div>
      </main>
    </div>
    <TheFooter>
      <!--footer-->
      <div>

      </div>
      <div class="ml-auto">
        <span class="mr-1">Created by</span>
        <a href="https://www.linkedin.com/in/jeanpierrelattus/">Jean Pierre Lattus</a>
      </div>
    </TheFooter>
  </div>
</template>

<script>
import { Header as AppHeader, SidebarToggler, Sidebar as AppSidebar, Footer as TheFooter, Breadcrumb } from '@coreui/vue'
import DefaultHeaderDropdown from './DefaultHeaderDropdown'
import {mapState} from "vuex";

export default {
  name: 'DefaultContainer',
  components: {
    AppHeader,
    AppSidebar,
    TheFooter,
    Breadcrumb,
    DefaultHeaderDropdown,
    SidebarToggler,
  },
  methods: {
    debug(evt) {
      alert(evt);
    },
    itemListClass (status) {
      return status === true ? 'fa fa-circle text-success' : 'fa fa-circle-thin text-light'
    },
    toogleDevice(itemIndex) {
      this.$store.dispatch('toggleDevice', itemIndex);
    }
  },
  computed: {
    ...mapState(['devices']),
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched.filter((route) => route.name || route.meta.label )
    }
  }
}
</script>
