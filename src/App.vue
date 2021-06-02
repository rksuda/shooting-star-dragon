<template>
  <div class="container">
    <div class="align-right">
      <language-selector :languages="languages" @select="handleSelectLanguage" />
    </div>

    <div class="hint-toggle-wrapper">
      <span class="hint-toggle" @click="handleToggleHint">
        {{ showHint ? $t('hideHint') : $t('showHint') }}
      </span>
    </div>
    <div v-if="showHint" class="hint">{{ $t('hint') }}</div>

    <label>{{ $t('deckSize') }}<input type="number" min="0" v-model.number="deckSize"></label>
    <label>{{ $t('deckTunerSize') }}<input type="number" min="0" v-model.number="deckTunerSize"></label>

    <p class="result-header">{{ $t('resultHeader') }}</p>

    <div class="result-wrapper">
      <span class="result-command-icon" @click="handleAddSnapshot">
        <i class="fas fa-thumbtack"></i>
      </span>
      <result-table :deckSize="deckSize" :deckTunerSize="deckTunerSize" />
    </div>

    <div class="snapshot-wrapper" v-for="snapshot in snapshots" :key="snapshot.key">
      <span class="result-command-icon" @click="handleDeleteSnapshotByKey(snapshot.key)">
        <i class="fas fa-times"></i>
      </span>
      <result-table :deckSize="snapshot.deckSize" :deckTunerSize="snapshot.deckTunerSize" />
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import LanguageSelector from './components/LanguageSelector.vue'
import ResultTable from './components/ResultTable.vue';

export default {
  name: 'App',
  components: {
    LanguageSelector,
    ResultTable
  },
  data() {
    return {
      deckSize: 15,
      deckTunerSize: 7,
      languages: [
        { text: '日本語', value: 'ja' },
        { text: 'English', value: 'en' },
      ],
      showHint: false,

      // Array of { deckSize: Number, deckTunerSize: Number, key: String }
      snapshots: [],
    };
  },
  methods: {
    handleSelectLanguage({ language }) {
      this.$i18n.locale = language;
    },
    handleToggleHint() {
      this.showHint = !this.showHint;
    },
    handleAddSnapshot() {
      this.snapshots.push({
        deckSize: this.deckSize,
        deckTunerSize: this.deckTunerSize,
        key: uuidv4(),
      });
    },
    handleDeleteSnapshotByKey(key) {
      const index = this.snapshots.findIndex(snapshot => snapshot.key === key);

      if (index >= 0) {
        this.snapshots.splice(index, 1);
      }
    },
  },
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
.result-header {
  text-align: center;
  margin: 20px 0 20px;
}
.result-wrapper {
  position: relative;
  margin-top: 16px;
}
.result-command-icon {
  position: absolute;
  top: 0px;
  right: 2px;
}
.result-command-icon:hover {
  cursor: pointer;
}
.snapshot-wrapper {
  position: relative;
  border-top: 1px dashed #333;
  margin: 4px 0 0;
  padding: 16px 0 0;
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
    "resultHeader": "チューナーをめくる確率"
  },
  "en": {
    "showHint": "Show hint",
    "hideHint": "Hide hint",
    "hint": "You can easily calculate probabilities that Shooting Star Dragon excavates Tuners from your Deck!",
    "deckSize": "Remaining Cards in Deck",
    "deckTunerSize": "Remaining Tuners in Deck",
    "resultHeader": "Probabilities to Excavate Tuners"
  }
}
</i18n>
