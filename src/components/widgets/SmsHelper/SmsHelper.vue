<template>
  <mdb-container fluid>
    <mdb-card class="mb-0">
      <mdb-card-header color="special-color">
        SMS Helper
        <a @click="toggleShowWidget">
          <transition name="fade" mode="out-in">
            <mdb-icon v-if="showWidget" icon="window-minimize" class="float-right"></mdb-icon>
            <mdb-icon v-else icon="bars" class="float-right"></mdb-icon>
          </transition>
        </a>
      </mdb-card-header>
      <mdb-card-body class="px-1" v-show-slide="showWidget" :class="{'p-0': !showWidget}">
        <!-- <mdb-card-text><strong>Test Bench</strong></mdb-card-text> -->
        <mdb-container fluid>
          <div v-if="cli">
            <label>The SMS will be sent to:</label>
            <span v-if="cli.length>0">{{cli}}</span>
            <select class="browser-default custom-select mb-4" v-model="smsContentType">
              <option disabled selected value>SMS Content</option>
              <option value="0">Reset Password</option>
              <option value="1">Registration Link</option>
            </select>
            <mdb-btn block color="mdb-color" @click="onSendSmsClick">Send SMS</mdb-btn>
          </div>
          <div v-else>
            <h3 class="grey-text">Waiting for call</h3>
          </div>
        </mdb-container>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import {
  mdbContainer,
  mdbRow,
  mdbCol,
  mdbBtn,
  mdbCard,
  mdbCardBody,
  mdbCardHeader,
  mdbCardText,
  mdbInput,
  mdbIcon
} from 'mdbvue'
import { AGENT_STATES, CALL_STATES } from '@/defines.js'

export default {
  name: 'SmsHelper',
  components: {
    mdbContainer,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbInput,
    mdbIcon
  },
  mounted() {},
  props: {},

  data() {
    return {
      showWidget: true,
      smsContentType: '',
      message: [
        'Dear customer, to reset your password, please visit http://dummyurl.com/resetPassword',
        'Dear customer, you can begin your registration process by visiting http://dummyurl.com/register',
      ]
    }
  },

  computed: {
    cli() {
      let cli = this.$store.getters.getPrimaryCall.callingAddress
      console.log('calling number changed to=' + cli)
      return cli
    }
  },

  methods: {
    toggleShowWidget() {
      this.showWidget = !this.showWidget
    },

    onSendSmsClick() {
      if (this.smsContentType.length>0) {
        let request = {
          cli: this.cli,
          message: this.message[this.smsContentType]
        }
        this.$store.dispatch('requestSendSms', request)
      } else {
        this.$store.dispatch(
          'showErrorBanner'[
            ('Select SMS Type', 'Please select an SMS type before sending')
          ]
        )
      }
    }
  }
}
</script>

