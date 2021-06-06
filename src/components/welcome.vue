<template>
  <div>
    <h3>welcome page</h3>
    <div class="chip">
      <div class="body" :style="{height:(bodyPara.offsetXY * 2 + bodyPara.pinCount * 30) + 'px', width:(bodyPara.offsetXY * 2 + bodyPara.pinCount * 30) + 'px'}">
        <div v-for="index in bodyPara.pinCount" :key="index" :class="['hPin']" :style="{top:(bodyPara.offsetXY + (index - 1) * 30) + 'px'}">
          <span :id="index" @click="pinClick($event)">Pin{{index}}</span>
        </div>
        <div v-for="index in bodyPara.pinCount" :key="(index + 3) * bodyPara.pinCount" :class="['vPin']" :style="{top:bodyPara.offsetXY * 2 + bodyPara.pinCount * 30 + 'px', left:(bodyPara.offsetXY + (index - 1) * 30) + 'px'}">
          <span :id="index + bodyPara.pinCount" class="vbox" @click="pinClick($event)">Pin{{index + bodyPara.pinCount}}</span>
        </div>
        <div v-for="index in bodyPara.pinCount" :key="(index + 2) * bodyPara.pinCount" :class="['hPin']" :style="{top:(bodyPara.offsetXY + bodyPara.pinCount * 30 - index * 30) + 'px', left:bodyPara.offsetXY * 2 + bodyPara.pinCount * 30 + 'px'}">
          <span :id="index + bodyPara.pinCount * 2" @click="pinClick($event)">Pin{{index + bodyPara.pinCount * 2}}</span>
        </div>
        <div v-for="index in bodyPara.pinCount" :key="(index + 1) * bodyPara.pinCount" :class="['vPin']" :style="{left:(bodyPara.offsetXY + bodyPara.pinCount * 30 - index * 30) + 'px'}">
          <span :id="index + bodyPara.pinCount * 3" class="vbox" @click="pinClick($event)">Pin{{index + bodyPara.pinCount * 3}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chipPara: {
        zoomRate: 1
      },
      bodyPara: {
        offsetXY: 20,
        pinCount: 7
      },
      leftPin: {
        offset: 10,
        bkcolor: '#fff'
      }
    }
  },
  methods: {
    // zoomIn () {
    //   this.zoomIn = this.zoomIn() + 0.1
    // :style="{transform: scale(chipPara.zoomRate)}"
    // }
    pinClick (object) {
      console.log(object.target.id)
      alert(object.target.id)
    }
  }
}
</script>

<style lang="less" scoped>

.chip{

}

.body{
  position: relative;
  left: 600px;
  top: 200px;
  background:red;
}

.hPin{
  position: absolute;
  left: -60px;
  width: 60px;
  height: 20px;
  background-color: #55a532;
}

.vbox {
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
  display:block;
  align-content: center;
}

.vPin{
  position: absolute;
  top: -60px;
  width: 20px;
  height: 60px;
  background-color: #55a532;
}

</style>
