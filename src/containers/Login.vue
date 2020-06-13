<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="8">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <b-form @submit.stop.prevent="onSubmit">
                  <h1>TI Mining Test - Jean Pierre Lattus</h1>
                  <h5>Login</h5>
                  <b-input-group class="mb-3">
                    <b-input-group-prepend><b-input-group-text><i class="icon-user"/></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="text" class="form-control"
                                  placeholder="email"
                                  v-model="$v.form.email.$model"
                                  :state="$v.form.email.$dirty ? !$v.form.email.$error : null"
                                  autocomplete="off" />
                    <b-form-invalid-feedback>Por favor ingrese su email.</b-form-invalid-feedback>
                  </b-input-group>
                  <b-input-group class="mb-4">
                    <b-input-group-prepend><b-input-group-text><i class="icon-lock"/></b-input-group-text></b-input-group-prepend>
                    <b-form-input type="password"
                                  class="form-control"
                                  placeholder="Password"
                                  v-model="$v.form.password.$model"
                                  :state="$v.form.password.$dirty ? !$v.form.password.$error : null"
                                  autocomplete="off" />
                    <b-form-invalid-feedback>Por favor ingrese su password.</b-form-invalid-feedback>
                  </b-input-group>
                  <p class="text-danger">{{msg}}</p>
                  <b-row>
                    <b-col cols="6">
                      <b-button variant="primary" type="submit" class="px-4">Login</b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import {required, email} from 'vuelidate/lib/validators'

  export default {
    name: 'Login',
    data() {
      return {
        msg: null,
        form: {
          email: null,
          password: null,
        }
      }
    },
    methods :{
      async onSubmit() {
        const thisV = this;
        thisV.$v.form.$touch();
        if (thisV.$v.form.$anyError) {
          return;
        }
        const payload = thisV.form;
        try {
          const response = await this.$store.dispatch('login', payload)
          if(response.status==200) {
            await thisV.$router.push({name: 'Dashboard'})
          }
        } catch (error) {
          this.$toast.error("Usuario o contraseña incorrecta");
          this.form.password = null;
          this.form.email = null;
          console.log(error)
        }
      }
    },
    validations: {
      form: {
        email: {required, email},
        password: {required}
      }
    }
  }
</script>
