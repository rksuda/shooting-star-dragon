<template>
  <div class="container">
    <div class="align-right">
      <language-selector :languages="languages" @select="handleSelectLanguage" />
    </div>

    <div class="hint-toggle-wrapper">
      <span class="hint-toggle" @click="onToggleHint">
        {{ showHint ? $t('hideHint') : $t('showHint') }}
      </span>
    </div>
    <div v-if="showHint" class="hint">{{ $t('hint') }}</div>

    <label>{{ $t('deckSize') }}<input type="number" min="0" v-model.number="deckSize"></label>
    <label>{{ $t('deckTunerSize') }}<input type="number" min="0" v-model.number="deckTunerSize"></label>

    <table>
      <caption>{{ $t('resultCaption') }}</caption>
      <thead>
        <tr>
          <th class="text-center">{{ $t('resultTunerSize') }}</th>
          <th class="text-right">{{ $t('resultProbability') }}</th>
          <th class="text-right">{{ $t('resultCumulativeProbability') }}</th>
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
import LanguageSelector from './components/LanguageSelector.vue'

export default {
  name: 'App',
  components: {
    LanguageSelector
  },
  data() {
    return {
      // Shooting Star Dragon excavates top 5 cards of your deck.
      excavationSize: 5,
      deckSize: 15,
      deckTunerSize: 7,
      precision: 1,
      languages: [
        { text: '日本語', value: 'ja' },
        { text: 'English', value: 'en' },
      ],
      showHint: false,
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
    handleSelectLanguage({ language }) {
      this.$i18n.locale = language;
    },
    onToggleHint() {
      this.showHint = !this.showHint;
    }
  }
}
</script>

<style scoped>
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
  margin: 20px 0 10px;
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
.align-right {
  display: flex;
  justify-content: flex-end;
}
.hint-toggle-wrapper {
  margin: 0 0 10px;
}
.hint-toggle {
  font-size: 12px;
  color: #333;
  text-decoration: underline;
}
.hint-toggle:hover {
  cursor: pointer;
}
.hint {
  font-size: 12px;
  padding: 8px;
  margin: 10px 0 20px;
  border: 4px solid #68b5d6;
}
</style>

<i18n>
{
  "ja": {
    "showHint": "ヒントを表示する",
    "hideHint": "ヒントを隠す",
    "hint": "デッキ枚数とデッキ内のチューナーの枚数を入力して、シューティング・スター・ドラゴンがチューナーをめくる確率を計算しましょう！",
    "deckSize": "デッキ枚数",
    "deckTunerSize": "デッキ内のチューナーの枚数",
    "resultCaption": "チューナーをめくる確率",
    "resultTunerSize": "枚数",
    "resultProbability": "確率 (%)",
    "resultCumulativeProbability": "累積確率 (%)"
  },
  "en": {
    "showHint": "Show hint",
    "hideHint": "Hide hint",
    "hint": "You can easily calculate probabilities that Shooting Star Dragon excavates Tuners from your Deck!",
    "deckSize": "Remaining Cards in Deck",
    "deckTunerSize": "Remaining Tuners in Deck",
    "resultCaption": "Probabilities to Excavate Tuners",
    "resultTunerSize": "Tuners",
    "resultProbability": "Prob. (%)",
    "resultCumulativeProbability": "Cum. Prob. (%)"
  }
}
</i18n>
