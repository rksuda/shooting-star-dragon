<template>
  <div>
    <ul>
      <li v-for="(language, index) in languages" :key="index" @click="onSelect(language.value)">
        <span :class="{ active: language.value === activeLanguageValue }">{{ language.text }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'LanguageSelector',
  props: {
    languages: {
      // Array of { text: String, value: any }
      type: Array,
      required: true,
    }
  },
  emits: ['select'],
  data() {
    return {
      activeLanguageValue: '',
    };
  },
  created() {
    this.activeLanguageValue = this.$props.languages[0].value;
  },
  methods: {
    onSelect(languageValue) {
      this.activeLanguageValue = languageValue;
      this.$emit('select', { language: languageValue });
    }
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
li {
  display: inline;
  font-size: 14px;
}
li:hover {
  cursor: pointer;
}
li::after {
  content: " | ";
}
li:last-child::after {
  content: none;
}

.active {
  font-weight: bold;
}
</style>
