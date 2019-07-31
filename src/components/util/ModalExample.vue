<template>
              <mdb-card>
            <mdb-card-header>Modals</mdb-card-header>
            <mdb-card-body>
              <section>
                <h4 class="mb-5 mt-4 dark-grey-text text-center font-bold"><strong>Position & Sizes</strong></h4>
                <div class="text-center mb-5">
                  <p class="lead">Click buttons below to launch modals demo</p>
                </div>
                <mdb-row>
                  <mdb-col md="3" class="mb-3">
                    <h5 class="text-center mb-3">Frame modal</h5>
                    <img class="img-fluid z-depth-1" src="https://mdbootstrap.com/img/brandflow/modal4.jpg" alt="frame position"/>
                    <div class="text-center">
                      <h5 class="my-3">Position</h5>
                      <mdb-btn color="primary" size="sm" @click.native="showFrameModalTop = true">Top</mdb-btn>
                      <mdb-modal frame removeBackdrop position="top" v-if="showFrameModalTop" @close="showFrameModalTop = false">
                        <mdb-modal-body class="text-center">
                          <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit nisi quo provident fugiat reprehenderit nostrum quos...</span>
                          <mdb-btn color="secondary" @click.native="showFrameModalTop = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-body>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showFrameModalBottom = true">Bottom</mdb-btn>
                      <mdb-modal frame removeBackdrop position="bottom" v-if="showFrameModalBottom" @close="showFrameModalBottom = false">
                        <mdb-modal-body class="text-center">
                          <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Impedit nisi quo provident fugiat reprehenderit nostrum quos...</span>
                          <mdb-btn color="secondary" @click.native="showFrameModalBottom = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-body>
                      </mdb-modal>
                    </div>
                  </mdb-col>
                  <mdb-col md="3" class="mb-3">
                    <h5 class="text-center mb-3">Side modal</h5>
                    <img class="img-fluid z-depth-1" src="https://mdbootstrap.com/img/brandflow/modal3.jpg" alt="frame position"/>
                    <div class="text-center">
                      <h5 class="my-3">Position</h5>
                      <mdb-btn color="primary" size="sm" @click.native="showSideModalTopRight = true">Top right</mdb-btn>
                      <mdb-modal side position="top-right" v-if="showSideModalTopRight" @close="showSideModalTopRight = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showSideModalTopRight = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showSideModalTopLeft = true">Top left</mdb-btn>
                      <mdb-modal side position="top-left" v-if="showSideModalTopLeft" @close="showSideModalTopLeft = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showSideModalTopLeft = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showSideModalBottomRight = true">Bottom right</mdb-btn>
                      <mdb-modal side position="bottom-right" v-if="showSideModalBottomRight" @close="showSideModalBottomRight = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showSideModalBottomRight = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showSideModalBottomLeft = true">Bottom left</mdb-btn>
                      <mdb-modal side position="bottom-left" v-if="showSideModalBottomLeft" @close="showSideModalBottomLeft = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showSideModalBottomLeft = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                    </div>
                  </mdb-col>
                  <mdb-col md="3" class="mb-3">
                    <h5 class="text-center mb-3">Central modal</h5>
                    <img class="img-fluid z-depth-1" src="https://mdbootstrap.com/img/brandflow/modal2.jpg" alt="frame position"/>
                    <div class="text-center">
                      <h5 class="my-3">Size</h5>
                      <mdb-btn color="primary" size="sm" @click.native="showCentralModalSmall = true">Small</mdb-btn>
                      <mdb-modal size="sm" v-if="showCentralModalSmall" @close="showCentralModalSmall = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn size="sm" color="secondary" @click.native="showCentralModalSmall = false">Close</mdb-btn>
                          <mdb-btn size="sm" color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showCentralModalMedium = true">Medium</mdb-btn>
                      <mdb-modal v-if="showCentralModalMedium" @close="showCentralModalMedium = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showCentralModalMedium = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showCentralModalLarge = true">Large</mdb-btn>
                      <mdb-modal size="lg" v-if="showCentralModalLarge" @close="showCentralModalLarge = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showCentralModalLarge = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showCentralModalFluid = true">Fluid</mdb-btn>
                      <mdb-modal size="fluid" v-if="showCentralModalFluid" @close="showCentralModalFluid = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showCentralModalFluid = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                    </div>
                  </mdb-col>
                  <mdb-col md="3" class="mb-3">
                    <h5 class="text-center mb-3">Fluid modal</h5>
                    <img class="img-fluid z-depth-1" src="https://mdbootstrap.com/img/brandflow/modal1.jpg" alt="frame position"/>
                    <div class="text-center">
                      <h5 class="my-3">Position</h5>
                      <mdb-btn color="primary" size="sm" @click.native="showFluidModalRight = true">Right</mdb-btn>
                      <mdb-modal fullHeight position="right" v-if="showFluidModalRight" @close="showFluidModalRight = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showFluidModalRight = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showFluidModalLeft = true">Left</mdb-btn>
                      <mdb-modal fullHeight position="left" v-if="showFluidModalLeft" @close="showFluidModalLeft = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showFluidModalLeft = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showFluidModalTop = true">Top</mdb-btn>
                      <mdb-modal fullHeight position="top" v-if="showFluidModalTop" @close="showFluidModalTop = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showFluidModalTop = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                      <mdb-btn color="primary" size="sm" @click.native="showFluidModalBottom = true">Bottom</mdb-btn>
                      <mdb-modal fullHeight position="bottom" v-if="showFluidModalBottom" @close="showFluidModalBottom = false">
                        <mdb-modal-header>
                          <mdb-modal-title>Modal title</mdb-modal-title>
                        </mdb-modal-header>
                        <mdb-modal-body>...</mdb-modal-body>
                        <mdb-modal-footer>
                          <mdb-btn color="secondary" @click.native="showFluidModalBottom = false">Close</mdb-btn>
                          <mdb-btn color="primary">Save changes</mdb-btn>
                        </mdb-modal-footer>
                      </mdb-modal>
                    </div>
                  </mdb-col>
                </mdb-row>
              </section>
            </mdb-card-body>
          </mdb-card>
</template>
<script>
import { mdbRow, mdbCol, mdbBtn, mdbCard, mdbCardBody, mdbCardHeader, mdbCardText, mdbIcon, mdbTbl, mdbBarChart, mdbPieChart, mdbLineChart, mdbRadarChart, mdbDoughnutChart, mdbListGroup, mdbListGroupItem, mdbBadge, mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter } from 'mdbvue'

export default {
  name: 'ModalExample',
  components: {
    CallControl,
    AgentControl,
    CallerProfile,
    CallHistory,
    mdbRow,
    mdbCol,
    mdbBtn,
    mdbCard,
    mdbCardBody,
    mdbCardHeader,
    mdbCardText,
    mdbIcon,
    mdbTbl,
    mdbBarChart,
    mdbPieChart,
    mdbLineChart,
    mdbRadarChart,
    mdbDoughnutChart,
    mdbListGroup,
    mdbListGroupItem,
    mdbBadge,
    mdbModal,
    mdbModalHeader,
    mdbModalTitle,
    mdbModalBody,
    mdbModalFooter
  },
  data () {
    return {
      showFrameModalTop: false,
      showFrameModalBottom: false,
      showSideModalTopRight: false,
      showSideModalTopLeft: false,
      showSideModalBottomRight: false,
      showSideModalBottomLeft: false,
      showCentralModalSmall: false,
      showCentralModalMedium: false,
      showCentralModalLarge: false,
      showCentralModalFluid: false,
      showFluidModalRight: false,
      showFluidModalLeft: false,
      showFluidModalTop: false,
      showFluidModalBottom: false,

    }
  }
}
</script>