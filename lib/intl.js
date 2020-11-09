"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _stringFormat = require("string-format");

var _stringFormat2 = _interopRequireDefault(_stringFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEY_LS_LOCALE = "locale";

var current = "zh-CN";
var fallback = "en-US";
var handlers = [];
var global = {};

var locale_from_ls = localStorage.getItem(KEY_LS_LOCALE);

if (locale_from_ls != null && locale_from_ls.trim() != "") {
  current = locale_from_ls;
}

var LocaleContext = _react2.default.createContext(current);

var createTranslate = function createTranslate(local) {
  var languages = _extends({}, global, local);
  return function (key) {
    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var item = languages[key];
    var text = "NO KEY";

    if (!(key in languages)) {
      console.error("intl:You need to declare a JSON languages object whose key is [" + key + "]", "languages: ", languages, "current: ", current);
    } else {
      text = item[current];
      if (text === undefined) {
        text = "undefined";
        console.error("intl: Language not found", "[" + key + "]", "languages: ", languages, "current: ", current);
      } else if (text === null) {
        text = "null";
        console.error("intl: Language not found", "[" + key + "]", "languages: ", languages, "current: ", current);
      } else if (typeof text !== "string") {
        console.error("Init: [" + key + "]: value is not a string or number in locales", languages, "current: ", current);
        text = "not string";
      }
    }
    // if (text === undefined || typeof text !== 'string') {
    //   throw new Error(`intl:No languages(${current},${fallback}) for the key[${key}]`)
    // }
    return _stringFormat2.default.apply(undefined, [text].concat(params));
  };
};

var intl = function intl(target) {
  return function (props) {
    return _react2.default.createElement(
      LocaleContext.Consumer,
      null,
      function (value) {
        return _react2.default.createElement(target, _extends({}, props, { locale: value }));
      }
    );
  };
};

intl.locale = function () {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (args.length === 0) return current;else {
    var currentLocale = args[0],
        fallbackLocale = args[1];

    if (current === currentLocale && fallback === fallbackLocale) return;
    setTimeout(function () {
      current = currentLocale;
      fallback = fallbackLocale;
      localStorage.setItem(KEY_LS_LOCALE, current);
      handlers.forEach(function (handler) {
        return handler(current);
      });
    });
  }
};

intl.global = function (languages) {
  global = languages || {};
};

intl.onChanged = function (handler) {
  if (handler && typeof handler === "function") {
    handlers.push(handler);
  } else {
    throw Error("intl:The parameter of intl.onChanged must be a function");
  }
  return function () {
    handlers = handlers.filter(function (f) {
      return f !== handler;
    });
  };
};

intl.load = function (languages) {
  return createTranslate(languages);
};

intl.LocaleContextProvider = function (_React$PureComponent) {
  _inherits(_class, _React$PureComponent);

  function _class(props) {
    _classCallCheck(this, _class);

    var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

    _this.state = {
      locale: current
    };
    _this.removeHandler = intl.onChanged(_this.handleChange.bind(_this));
    return _this;
  }

  _createClass(_class, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.removeHandler();
    }
  }, {
    key: "handleChange",
    value: function handleChange(locale) {
      if (this.state.locale === locale) return;
      this.setState({ locale: locale });
    }
  }, {
    key: "render",
    value: function render() {
      if (this.state.locale == null) return null;
      return _react2.default.createElement(
        LocaleContext.Provider,
        { value: this.state.locale },
        this.props.children
      );
    }
  }]);

  return _class;
}(_react2.default.PureComponent);

exports.default = intl;