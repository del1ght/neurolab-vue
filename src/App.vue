<template>
  <v-app class="">
    <div class="pa-3">

      <v-sheet class="">
        <h1 class="">Рисовалка</h1>
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
      </v-sheet>

      <v-sheet class="my-2">
        <div class="mr-4">
          <v-btn color="primary" @click="$refs.sketch.reset()" class="mr-2"><v-icon>mdi-eraser</v-icon></v-btn>
          <v-btn color="primary" @click="predict()">Распознать</v-btn>
        </div>
        <div class="py-2">
          <v-btn color="primary" @click="recalculateWeights()" class="mr-4">Корректировка</v-btn>
        </div>
        <div class="">
          <v-btn color="primary" @click="save(weightMatrix)">Сохранить веса</v-btn>
           <!-- <input type="file" id="load" @change="(e) => load(e)"> Загрузить веса -->
           <!-- <v-btn @click="test()"></v-btn> -->
        </div>
      </v-sheet>

    </div>
  </v-app>
</template>

<script>
import VueDrawingCanvas from 'vue-drawing-canvas';
import store from './store/index'

export default {
  name: 'App',

  components: {
    VueDrawingCanvas
  },

  data: () => ({
    image: "",
    width: 150,
    height: 150,
    canvas: "canva",
    line: 10,
    imageSmall: '',
    sketch: "sketch",
    thumbnail: "thumbnail",
    imageArray: null,
    weightMatrix: null,
    neuroSum: 0,
    empty: true,
  }),

  methods: {
    test(){
      console.log(this.imageArray)
    },

    calculateWeights(){
      let weightMax = 0.3
      let weightMin = -weightMax
      this.weightMatrix = this.initWeights(this.width, this.height, weightMax, weightMin)
    },
    
    predict(){
      if (this.$refs.sketch.isEmpty() == false){
        this.imageArray = this.imageData(this.width, this.height)
        this.neuroSum = this.calculateSum(this.imageArray, this.weightMatrix)
        if (this.neuroSum >= 0){
          alert('Крест')
        }
        else{
          alert('Круг')
        }
      }
      else alert('Нарисуйте что-нибудь')
    },

    recalculateWeights(){
      let speedLearn = 0.3
      let error = 1 - this.neuroSum
      for (let i = 0; i < this.imageArray.length; i++) {
        if (this.imageArray[i] === 1){
          this.weightMatrix[i] = Number((this.weightMatrix[i] + speedLearn * error * this.imageArray[i]).toFixed(2))
        }       
      }
      console.log('')
      console.log(this.weightMatrix)
    },
    imageData(width, height){
      let context = document.getElementById('sketch').getContext('2d').getImageData(0, 0, width, height).data
      let array = Array.from(context)

      array.splice(0,3)
      let newArray = array.filter((_,i) => i % 4 == 0)
      for (let i = 0; i < newArray.length; i++) {
        if (newArray[i] > 0){
          newArray[i] = 1
        }
      }
      return newArray
    },

    initWeights(width, height, max, min) {
      let weights = []
      for (let i = 0; i < width * height; i++) {
        weights.push(Number((Math.random() * (max - min) + min).toFixed(2)))        
      }
      console.log(weights)
      return weights
    },
    
    calculateSum(array, weight){
      let sum = 0
      for (let i = 0; i < array.length; i++) {
        sum += array[i] * weight[i]
      }
      console.log(sum)
      return sum
    },

    save(content) {
      const a = document.createElement('a');

      const file = new Blob([content], { type: 'text/plain' });

      a.href = URL.createObjectURL(file);
      a.download = 'weights.txt';
      a.click();

      URL.revokeObjectURL(a.href);
    },
    load(e) {
      const file = e.target.files[0];

      let reader = new FileReader();

      reader.readAsText(file);

      reader.onload = function (f) {
        return function(e){

          let res = reader.result;

          res = res.split(',');
          res = res.map((e) => Number(e));
          
          store.commit('setWeight', res)
          console.log('Загруженные веса:');

          console.log(store.state.weight)
        }
      }(file);
      console.log(store.state.weight)

      reader.onerror = function () {
        console.log(reader.error);
      };
    }
    
  },
  computed: {

  },
  mounted(){
    this.calculateWeights()
  }
  
};

</script>

<style>
.button-container {
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
}


</style>
