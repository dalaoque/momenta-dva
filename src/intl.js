import React from "react";
import fmt from "string-format";

const KEY_LS_LOCALE = "locale";

let current = "zh-CN";
let fallback = "en-US";
let handlers = [];
let global = {};

const locale_from_ls = localStorage.getItem(KEY_LS_LOCALE);

if (locale_from_ls != null && locale_from_ls.trim() != "") {
  current = locale_from_ls;
}

const LocaleContext = React.createContext(current);

const createTranslate = (local) => {
  const languages = { ...global, ...local };
  return (key, ...params) => {
    const item = languages[key];
    let text = "NO KEY";

    if (!(key in languages)) {
      console.error(
        `intl:You need to declare a JSON languages object whose key is KEY: [${key}]`,
        "languages: ",
        languages,
        "current: ",
        current
      );
    } else {
      text = item[current];
      if (text === undefined) {
        text = "undefined";
        console.error(
          `intl: Language not found`,
          `[${key}]`,
          "item: ",
          item,
          "current: ",
          current
        );
      } else if (text === null) {
        text = "null";
        console.error(
          `intl: Language not found`,
          `[${key}]`,
          "item: ",
          item,
          "current: ",
          current
        );
      } else if (typeof text !== "string") {
        console.error(
          `Init: [${key}]: value is not a string or number in locales`,
          item,
          "current: ",
          current
        );
        text = "not string";
      }
    }
    // if (text === undefined || typeof text !== 'string') {
    //   throw new Error(`intl:No languages(${current},${fallback}) for the key[${key}]`)
    // }
    return fmt(text, ...params);
  };
};

const intl = (target) => (props) => (
  <LocaleContext.Consumer>
    {(value) => React.createElement(target, { ...props, locale: value })}
  </LocaleContext.Consumer>
);

intl.locale = (...args) => {
  if (args.length === 0) return current;
  else {
    const [currentLocale, fallbackLocale] = args;
    if (current === currentLocale && fallback === fallbackLocale) return;
    setTimeout(() => {
      current = currentLocale;
      fallback = fallbackLocale;
      localStorage.setItem(KEY_LS_LOCALE, current);
      handlers.forEach((handler) => handler(current));
    });
  }
};

intl.global = (languages) => {
  global = languages || {};
};

intl.onChanged = (handler) => {
  if (handler && typeof handler === "function") {
    handlers.push(handler);
  } else {
    throw Error("intl:The parameter of intl.onChanged must be a function");
  }
  return () => {
    handlers = handlers.filter((f) => f !== handler);
  };
};

intl.load = (languages) => createTranslate(languages);

intl.LocaleContextProvider = class extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      locale: current,
    };
    this.removeHandler = intl.onChanged(this.handleChange.bind(this));
  }

  componentWillUnmount() {
    this.removeHandler();
  }

  handleChange(locale) {
    if (this.state.locale === locale) return;
    this.setState({ locale });
  }

  render() {
    if (this.state.locale == null) return null;
    return (
      <LocaleContext.Provider value={this.state.locale}>
        {this.props.children}
      </LocaleContext.Provider>
    );
  }
};

export default intl;
