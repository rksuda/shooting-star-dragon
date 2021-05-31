<template>
  <div class="container">
    <p>デッキ枚数とデッキ内のチューナーの枚数を入力して、シューティング・スター・ドラゴンがチューナーをめくる確率を計算しましょう！</p>

    <label>デッキ枚数<input type="number" min="0" v-model.number="deckSize"></label>
    <label>デッキ内のチューナーの枚数<input type="number" min="0" v-model.number="deckTunerSize"></label>

    <table>
      <caption>チューナーをめくる確率</caption>
      <thead>
        <tr>
          <th class="text-center">枚数</th>
          <th class="text-right">確率（%）</th>
          <th class="text-right">累積確率（%）</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in [5, 4, 3, 2, 1, 0]" :key="n">
          <th class="text-center">{{ n }}枚</th>
          <td class="text-right">{{ formatProbabilityOf(n) }}</td>
          <td class="text-right">{{ formatCumulativeProbabilityOf(n) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { combinations } from 'mathjs'

export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      // Shooting Star Dragon excavates top 5 cards of your deck.
      excavationSize: 5,
      deckSize: 15,
      deckTunerSize: 7,
      precision: 1,
    };
  },
  computed: {
    denominator() {
      return combinations(this.deckSize, this.excavationSize);
    }
  },
  methods: {
    probabilityOf(excavatedTunerSize) {
      const deckNonTunerSize = this.deckSize - this.deckTunerSize;
      const excavatedNonTunerSize = this.excavationSize - excavatedTunerSize;

      // Invalid input patterns
      if (
        excavatedTunerSize < 0 ||
        excavatedTunerSize > this.excavationSize ||
        this.deckSize <= 0 ||
        this.deckTunerSize <= 0 ||
        this.deckSize < this.deckTunerSize ||
        this.deckSize < this.excavationSize ||
        deckNonTunerSize < excavatedNonTunerSize
      ) {
        return 0;
      }

      const tuner = combinations(this.deckTunerSize, excavatedTunerSize);
      const nonTuner = combinations(deckNonTunerSize, excavatedNonTunerSize);
      return tuner * nonTuner / this.denominator;
    },
    cumulativeProbabilityOf(minimumExcavatedTunerSize) {
      let cumulativeProbability = 0;

      for (let excavatedTunerSize = minimumExcavatedTunerSize; excavatedTunerSize <= this.excavationSize; excavatedTunerSize++) {
        cumulativeProbability += this.probabilityOf(excavatedTunerSize);
      }

      return cumulativeProbability;
    },
    formatProbabilityOf(excavatedTunerSize) {
      return (this.probabilityOf(excavatedTunerSize) * 100).toFixed(this.precision);
    },
    formatCumulativeProbabilityOf(minimumExcavatedTunerSize) {
      return (this.cumulativeProbabilityOf(minimumExcavatedTunerSize) * 100).toFixed(this.precision);
    }
  }
}
</script>

<style>
body {
  margin: 0;
}
input {
  box-sizing: border-box;
  width: 100%;
  font-size: 16px;
  text-align: right;
  margin: 4px 0;
  padding: 4px;
}
table {
  border-collapse: collapse;
  width: 100%;
}
table caption {
  margin: 10px 0;
}
thead tr {
  border-bottom: 1px solid #333;
}
tbody tr:nth-child(odd) {
  background: #e3ecf5;
}
th {
  padding: 0 10px;
}
td {
  padding: 4px 30px;
}
p {
  font-size: 12px;
  margin-bottom: 20px;
  padding: 8px;
  border: 4px solid #68b5d6;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 8px;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
</style>
