<template>
  <b-card border-variant="secondary"
          :header="device.name"
          header-class="font-weight-bold"
          header-border-variant="secondary"
          align="center">
    <b-card-text class="scroll text-left">
      <span v-for="log in device.logs"><i :class="iconDisplay(log.isOnline)"/> {{log.datetime}} | {{log.isOnline}}<br></span>
    </b-card-text>
  </b-card>
</template>

<script>
  import {mapState} from "vuex";

 export default {
   name: "Device",
   props: {
     device: {
       type: Object,
       default: null
     }
   },
   computed: {
     ...mapState('socketModule', ['socketMessages', 'connected']),
   },
   methods: {
     iconDisplay (isOn) {
       return isOn === 'OK' ? 'fa fa-check-circle text-success' : 'fa fa-warning text-warning'
     }
   }
 }
</script>

<style scoped>

</style>
