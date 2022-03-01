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
        <div class="mr-4 my-2">
          <v-btn color="primary" @click="setCross(); recalculateWeights()" class="mr-2">Крестик </v-btn>
          <v-btn color="primary" @click="setCircle(); recalculateWeights()">Нолик</v-btn>
        </div>
        <div class="">
          <v-btn color="primary" @click="save(weightMatrix)">Сохранить веса</v-btn>
        </div>
        <div class="mt-2">
          <v-btn color="primary" @click="$refs.inputUpload.click()">Загрузить веса</v-btn> 
          <input v-show="false" ref="inputUpload" type="file" id="load" @change="(e) => processFile(e)">
        </div>        
      </v-sheet>

    </div>
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
    width: 150,
    height: 150,
    line: 25,
    sketch: "sketch",
    thumb: "thumbnail",
    imageArray: null,
    weightMatrix: null,
    neuroSum: 0,
    error: 0,
  }),

  methods: {
    calculateWeights(){
      let weightMax = 0.3
      let weightMin = -weightMax
      this.weightMatrix = this.initWeights(this.width, this.height, weightMax, weightMin)
    },
    
    predict(){
      if (this.$refs.sketch.isEmpty() == true){
        return alert('Нарисуйте что-нибудь')
      }
      this.imageArray = this.imageData(this.width, this.height)
      this.neuroSum = this.calculateSum(this.imageArray, this.weightMatrix)
      if (this.neuroSum >= 0){
        alert('Крест')
      }
      else{
        alert('Круг')
      }
      this.$refs.sketch.reset()
    },

    recalculateWeights(){
      let speedLearn = 0.7
      for (let i = 0; i < this.imageArray.length; i++) {
        if (this.imageArray[i] === 1){
          this.weightMatrix[i] = Number((this.weightMatrix[i] + speedLearn * this.error * this.imageArray[i]).toFixed(2))
        }       
      }
      console.log('Корректировка весов')
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
      console.log('Веса инициализированы')
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

    setCross(){
      this.error = 1
    },
    setCircle(){
      this.error = -1
    },

    save(content) {
      const a = document.createElement('a');

      const file = new Blob([content], { type: 'text/plain' });

      a.href = URL.createObjectURL(file);
      a.download = 'weights.txt';
      a.click();
      console.log('Веса сохранены')

      URL.revokeObjectURL(a.href);
    },
    
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsText(file);
      })
    },

    async processFile(e) {
      try {
        let file = e.target.files[0];
        let text = await this.readFileAsync(file);
        text = text.split(',')
        text = text.map((n) => Number(n))
        this.weightMatrix = text
        console.log('Веса загружены')
      } catch(err) {
        console.log(err);
      }
  }

  },

  mounted(){
    this.calculateWeights()
  }
  
};

</script>

