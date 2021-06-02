<template>
  <div>
    <table>
      <caption>{{ $t('caption', { deckSize: deckSize, tunerSize: deckTunerSize }) }}</caption>

      <thead>
        <tr>
          <th class="text-center">{{ $t('tunerSize') }}</th>
          <th class="text-right">{{ $t('probability') }}</th>
          <th class="text-right">{{ $t('cumulativeProbability') }}</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="n in [5, 4, 3, 2, 1, 0]" :key="n">
          <th class="text-center">{{ n }}</th>
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
  name: 'ResultTable',
  props: {
    deckSize: {
      type: Number,
      required: true,
    },
    deckTunerSize: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // Shooting Star Dragon excavates top 5 cards of your deck.
      excavationSize: 5,
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
    },
  },
}
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
caption {
  margin: 0 0 10px;
  font-size: 12px;
}
thead tr {
  border-bottom: 1px solid #333;
}
tbody tr:nth-child(odd) {
  background: #e3ecf5;
}
th {
  font-size: 14px;
  padding: 0 10px;
}
td {
  padding: 6px 30px;
}

.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
</style>

<i18n>
{
  "ja": {
    "caption": "デッキ枚数 = {deckSize}、チューナー枚数 = {tunerSize}",
    "tunerSize": "枚数",
    "probability": "確率 (%)",
    "cumulativeProbability": "累積確率 (%)"
  },
  "en": {
    "caption": "#Cards = {deckSize}, #Tuners = {tunerSize}",
    "tunerSize": "Tuners",
    "probability": "Prob. (%)",
    "cumulativeProbability": "Cum. Prob. (%)"
  }
}
</i18n>
