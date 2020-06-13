<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="5">
          <h4 id="traffic" class="card-title mb-0">Rendimiento Equipos</h4>
          <div class="small text-muted">Última actualización: {{refreshDatetime}}</div>
        </b-col>
        <b-col sm="7" class="d-none d-md-block">
          <b-button :disabled="loading"
                    type="button" variant="primary" @click.prevent="getPerformance"
                    class="float-right">
            <b-spinner v-if="loading" small label="Small Spinner"/>
            <i v-if="!loading" class="icon-reload"/>
          </b-button>
        </b-col>
      </b-row>
      <chart ref="chart"
             class="chart-wrapper"
             v-if="loaded"
             :chart-data="chartData"
             :options="options"
             style="height:300px;margin-top:40px;">
      </chart>
    </b-card>
    <b-row class="mb-3">
      <b-col>
        <b-row class="justify-content-lg-center" v-for="(chunk, key) in deviceChunks" :key="key">
          <b-col v-for="item in chunk" :key="item.name" lg="3">
              <device-log :device="item" />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Chart from './dashboard/Chart'
  import DeviceLog from "./dashboard/DeviceLog";
  import moment from 'moment'
  import {mapState} from "vuex";
  import _ from 'lodash'
  const ws = new WebSocket('wss://frontend-excercise.dt.timlabtesting.com/eventstream/connect');


  export default {
    name: 'dashboard',
    components: {
      Chart,
      DeviceLog
    },
    data: function () {
      return {
        loading: true,
        loaded: false, // Used to render chart after async request
        refreshDatetime: moment(Date.now()).format('DD-MM-YYYY, hh:mm:ss'),

        // Used to refresh chart data after 5 seconds
        interval: setInterval(() => {
            this.getPerformance();
            this.refreshDatetime = moment(Date.now()).format('DD-MM-YYYY, hh:mm:ss');
          }, 5000),

        // Define data and options for Chart.js
        chartData: {
          labels: [],
          datasets: [
            {
              label: 'Performance',
              pointHoverBackgroundColor: '#fff',
              borderWidth: 2,
              data: []
            },

          ]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              gridLines: {
                drawOnChartArea: false
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 5,
                stepSize: Math.ceil(250 / 5),
                max: 1
              },
              gridLines: {
                display: true
              }
            }]
          },
        }
      }
    },
    beforeMount() {
      // Before mount component, we need to get the devices and setup websockets
      this.$store.dispatch('getDevices');
      ws.onopen = evt => {this.$store.dispatch('socketModule/socketConnect')};
      ws.onmessage = evt => this.$store.dispatch('socketOnMessage', evt.data);
    },
    beforeDestroy() {
      // When this component is destroyed (or we leave) we close websocket connection and remove getPerformance interval
      ws.onclose = evt => this.$store.dispatch('socketModule/socketDisconnect');
      this.interval = clearInterval(this.interval)
    },
    async mounted() {
      // When component is mounted we will request for chart data asynchronously, then set loaded to true so the chart can be rendered
      const thisV = this;
      thisV.loading = true;
      try {
        const response = await thisV.$axios({
          method: "POST",
          url: "/device/performance",
          headers: {"Content-Type": "application/json"},
        });
        thisV.loading = false;
        thisV.loaded = true;
        thisV.chartData.datasets[0].data = response.data.values;
        thisV.chartData.labels = response.data.devices;
        thisV.$toast.success("Rendimientos cargados con éxito", "");
      } catch (error) {
        console.log(error);
        thisV.$toast.error("Problema al cargar rendimientos", "");
        thisV.loading = false;
      }
    },
    computed: {
      ...mapState(['devices']),

      // Divide the devices in chunks so we have max 4 devices logs per row
      deviceChunks() {
        let activeDevices = _.filter(this.devices, 'status')
        return _.chunk(activeDevices, 4);
      }
    },
    methods: {
      async getPerformance() {
        const thisV = this;
        thisV.loading = true;
        try {
          const response = await thisV.$axios({
            method: "POST",
            url: "/device/performance",
            headers: {"Content-Type": "application/json"},
          });
          thisV.loading = false;
          thisV.loaded = true;
          thisV.chartData.datasets[0].data = response.data.values;
          thisV.chartData.labels = response.data.devices;
          // thisV.$toast.success(response.request.message, "");
          thisV.$refs.chart.$data._chart.update();
        } catch (error) {
          console.log(error);
          thisV.$toast.error("Problema al cargar rendimientos", "");
          thisV.loading = false;
        }
      },
    },

  }
</script>

<style>
  /* IE fix */
  #card-chart-01, #card-chart-02 {
    width: 100% !important;
  }

  .scroll {
    max-height: 150px;
    overflow-y: scroll;
  }
</style>
