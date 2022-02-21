<template>
  <v-app>
    <v-main class="pa-3">
      <h1>Рисовалка</h1>
      <vue-drawing-canvas
        ref="sketch"
        :canvasId="sketch"
        :image.sync="image"
        :width="width"
        backgroundColor="#fff0"
        :height="height"
        :lineWidth="line"
        saveAs="png"
        :styles="{
          border: 'solid 3px #000',
        }"
      />
      <vue-drawing-canvas
      class="ml-2"
        ref="thumbnail"
        :canvasId="thumbnail"
        :lock=true
        :image.sync="image"
        :width="28"
        :height="28"
        saveAs="png"
        :styles="{
          border: 'solid 1px #000',
        }"
      />
      <div class="button-container">
      <v-btn @click="$refs.sketch.reset()" color="primary" class="pa-5">
        <v-icon class="pr-1">mdi-eraser</v-icon>
          Очистить</v-btn>
        <div class="ml-3">
          <v-btn class="pa-5" color="primary" @click="test()">Тест</v-btn>
        </div>
      </div>
    <!-- </div> -->
    </v-main>
  </v-app>
</template>

<script>
import VueDrawingCanvas from 'vue-drawing-canvas';

export default {
  name: 'App',

  components: {
    VueDrawingCanvas
  },

  data: () => ({
    image: "",
    width: 50,
    height: 50,
    canvas: "canva",
    line: 10,
    imageSmall: '',
    sketch: "sketch",
    thumbnail: "thumbnail",
  }),

  methods: {
    test(){
      let context = document.getElementById('sketch').getContext('2d').getImageData(0, 0, this.width, this.height).data
      let array = Array.from(context)
      // let imgd = context.
      // let pix = imgd.data
      // let array = Array.from(pix)
      let weightMax = 0.3
      let weightMin = -weightMax
      let weightMatrix = []



      array.splice(0,3)
      let newArray = array.filter((_,i) => i % 4 == 0)
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] > 0){
          newArray[i] = 1
        }
      }

      for (let i = 0; i < newArray.length; i++) {
        weightMatrix.push(Number((Math.random() * (weightMax - weightMin) + weightMin).toFixed(2)))        
      }
      console.log(newArray)
      console.log(weightMatrix)
      
      //TODO: сделать сумматор

      


    },

    
  },
};

</script>

<style>
.button-container {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
}


</style>
