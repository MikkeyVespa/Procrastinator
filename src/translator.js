// Translator
// eslint-disable-next-line no-unused-vars
class Translator {
  constructor(options = {}) {
    this.options = { ...this.defaultConfig, ...options};
    this.elements = document.querySelectorAll("[data-translator]");
    this.cache = new Map();

    if (this.options.detectLanguage) {
      this.options.defaultLanguage = this.detectLanguage();
    }

    if (
      this.options.defaultLanguage &&
      typeof this.options.defaultLanguage === "string"
    ) {
      this.getResource(this.options.defaultLanguage);
    }
  }

  detectLanguage() {
    const stored = localStorage.getItem("language");

    if (this.options.persist && stored) {
      return stored;
    }

    const lang = navigator.languages
      ? navigator.languages[0]
      : navigator.language;

    return lang.slice(0, 2);
  }
  
  static async fetch(path) {
    try {
      const response = await fetch(path);
      return await response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Could not load ${path}. Please make sure that the file exists.`);
      throw error;
    }
  }

  async getResource(lang) {
    if (this.cache.has(lang)) {
      return JSON.parse(this.cache.get(lang));
    }

    const translation = await Translator.fetch(
      `${this.options.filesLocation}/${lang}.json`
    );

    if (!this.cache.has(lang)) {
      this.cache.set(lang, JSON.stringify(translation));
    }

    return translation;
  }

  async load(lang) {
    if (!this.options.languages.includes(lang)) {
      return;
    }

    this.translate(await this.getResource(lang));

    document.documentElement.lang = lang;

    if (this.options.persist) {
      localStorage.setItem("language", lang);
    }
  }

  async getTranslationByKey(lang, key) {
    if (!key) throw new Error("Expected a key to translate, got nothing.");

    if (typeof key !== "string")
      throw new Error(
        `Expected a string for the key parameter, got ${typeof key} instead.`
      );

    const translation = await this.getResource(lang);

    return this.getValueFromJSON(key, translation, true);
  }

  getValueFromJSON(key, json, fallback) {
    let text = key.split(".").reduce((obj, i) => obj[i], json);

    if (!text && this.options.defaultLanguage && fallback) {
      const fallbackTranslation = JSON.parse(
        this.cache.get(this.options.defaultLanguage)
      );

      text = this.getValueFromJSON(key, fallbackTranslation, false);
    } else if (!text) {
      text = key;
      // eslint-disable-next-line no-console
      console.warn(`Could not find text for attribute "${key}".`);
    }

    return text;
  }

  translate(translation) {
    const zip = (keys, values) => keys.map((key, i) => [key, values[i]]);
    const nullSafeSplit = (str, separator) => (str ? str.split(separator) : null);

    const replace = element => {
      const keys = nullSafeSplit(element.getAttribute("data-translator"), " ") || [];
      const properties = nullSafeSplit(
        element.getAttribute("data-translator-attr"),
        " "
      ) || ["innerHTML"];

      if (keys.length > 0 && keys.length !== properties.length) {
        // eslint-disable-next-line no-console
        console.error(
          "data-translator and data-translator-attr must contain the same number of items"
        );
      } else {
        const pairs = zip(keys, properties);
        pairs.forEach(pair => {
          const [key, property] = pair;
          const text = this.getValueFromJSON(key, translation, true);

          if (text) {
            // eslint-disable-next-line no-param-reassign
            element[property] = text;
            element.setAttribute(property, text);
          } else {
            // eslint-disable-next-line no-console
            console.error(`Could not find text for attribute "${key}".`);
          }
        });
      }
    };

    this.elements.forEach(replace);
  }

  static defaultConfig() {
    return {
      persist: false,
      languages: ["en"],
      defaultLanguage: "",
      detectLanguage: true,
      filesLocation: "/content"
    };
  }
}
