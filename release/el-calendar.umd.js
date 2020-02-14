/**
 * @preserve
 * @mrhanson/el-calendar v0.1.2
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['el-calendar'] = factory());
}(this, (function () { 'use strict';

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  function getMonthMaxDate(year, month) {
    var isGapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31
      case 4:
      case 6:
      case 9:
      case 11:
        return 30
      case 2:
        return isGapYear ? 29 : 28
    }
  }

  function getDayOfWeek(year, month, date) {
    return new Date(year, month - 1, date).getDay()
  }

  function isNaNs() {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    return Array.prototype.map.call(args, function (item) { return isNaN(item); })
  }

  var script = {
    name: 'Calendar',

    props: {
      value: {
        type: Date,
        default: function () { return new Date(); }
      },
      today: {
        type: Date,
        default: function () { return new Date(); }
      },
      weekText: {
        type: Array,
        default: function () { return ['日', '一', '二', '三', '四', '五', '六']; }
      },
      bannerYearText: {
        type: String,
        default: '年'
      },
      bannerMonthText: {
        type: String,
        default: '月'
      },
      // Notice：markArr为boolean数组，长度必须与当前月最大日相等
      markArr: {
        type: Array,
        default: function () { return []; }
      },
      comment: {
        type: String,
        default: ''
      }
    },

    data: function data() {
      return {
        curYear: new Date().getFullYear(),
        curMonth: new Date().getMonth() + 1,
        curDay: new Date().getDay(),
        curDate: new Date().getDate(),
        monthArr: []
      }
    },

    watch: {
      markArr: {
        deep: true,
        immediate: true,
        handler: function handler() {
          this._updateMonthArr();
        }
      }
    },

    created: function created() {
      // set current moment
      this.curYear = this.value.getFullYear();
      this.curMonth = this.value.getMonth() + 1;
      this.curDay = this.value.getDay();
      this.curDate = this.value.getDate();

      this._updateMonthArr();
    },

    methods: {
      backToToday: function backToToday() {
        this.curYear = this.today.getFullYear();
        this.curMonth = this.today.getMonth() + 1;
        this.$emit('input', new Date(this.curYear, this.curMonth - 1, this.today.getDate()));
        this._updateMonthArr();
      },
      toPreMonth: function toPreMonth() {
        if (this.curMonth === 1) {
          this.curYear = this.curYear - 1;
          this.curMonth = 12;
        } else {
          this.curMonth = this.curMonth - 1;
        }
        this._updateMonthArr();
        this.$emit('premonth', { year: this.curYear, month: this.curMonth });
      },
      toNextMonth: function toNextMonth() {
        if (this.curMonth === 12) {
          this.curYear = this.curYear + 1;
          this.curMonth = 1;
        } else {
          this.curMonth = this.curMonth + 1;
        }
        this._updateMonthArr();
        this.$emit('nextmonth', { year: this.curYear, month: this.curMonth });
      },
      toSpecificDate: function toSpecificDate(year, month, date) {
        // v0.1.2 fix bug: params of toSpecificDate must be integer
        var intYear = parseInt(year);
        var intMonth = parseInt(month);
        var intDate = parseInt(date);
        if (isNaNs(intYear, intMonth, intDate).some(function (item) { return item === true; })) { return }

        this.curYear = intYear;
        this.curMonth = intMonth;
        this._updateMonthArr();
        this.$emit('input', new Date(intYear, intMonth - 1, intDate));
      },
      _handleItemSelect: function _handleItemSelect(item) {
        if (item.monthFlag === 1) {
          this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date));
        } else if (item.monthFlag === 0) {
          this.toPreMonth();
          this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date));
        } else {
          this.toNextMonth();
          this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date));
        }
      },
      // monthFlag: 0 previous month, 1 current month, 2 next month
      _getDateArr: function _getDateArr(beginDate, endDate, monthFlag) {
        var this$1 = this;
        if ( beginDate === void 0 ) beginDate = 1;
        if ( endDate === void 0 ) endDate = 31;
        if ( monthFlag === void 0 ) monthFlag = 1;

        if (beginDate > endDate) {
          return []
        }

        var tarMonth = this.curMonth;
        var tarYear = this.curYear;
        if (monthFlag === 0) {
          if (this.curMonth === 1) {
            tarMonth = 12;
            tarYear = this.curYear - 1;
          } else {
            tarMonth = this.curMonth - 1;
          }
        } else if (monthFlag === 2) {
          if (this.curMonth === 12) {
            tarMonth = 1;
            tarYear = this.curYear + 1;
          } else {
            tarMonth = this.curMonth + 1;
          }
        }

        return new Array(endDate - beginDate + 1).fill().map(function (_, index) { return ({
          val: (tarYear + "-" + tarMonth + "-" + (index + beginDate)),
          date: index + beginDate,
          monthFlag: monthFlag,
          marked: monthFlag === 1 && this$1.markArr[index],
          isToday: this$1._getDateStr(this$1.today) === (tarYear + "-" + tarMonth + "-" + (index + beginDate))
        }); })
      },
      _updateMonthArr: function _updateMonthArr() {
        var maxDateOfPreMonth;
        if (this.curMonth === 1) {
          maxDateOfPreMonth = getMonthMaxDate(this.curYear - 1, 12);
        } else {
          maxDateOfPreMonth = getMonthMaxDate(this.curYear, this.curMonth - 1);
        }
        var firstDayOfCurMonth = getDayOfWeek(this.curYear, this.curMonth, 1);
        var preMonthArr = this._getDateArr(
          maxDateOfPreMonth - firstDayOfCurMonth + 1,
          maxDateOfPreMonth,
          0
        );
        var curMonthArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth), 1);
        var nextMonthArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth + 1), 2);

        // 6 line max: 6 * 7 = 42
        this.monthArr = preMonthArr
          .concat(curMonthArr)
          .concat(nextMonthArr)
          .slice(0, 42);
      },
      _getDateStr: function _getDateStr(date) {
        return ((date.getFullYear()) + "-" + (date.getMonth() + 1) + "-" + (date.getDate()))
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook;
      if (moduleIdentifier) {
          // server build
          hook = function (context) {
              // 2.3 injection
              context =
                  context || // cached call
                      (this.$vnode && this.$vnode.ssrContext) || // stateful
                      (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      }
      else if (style) {
          hook = shadowMode
              ? function (context) {
                  style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
              }
              : function (context) {
                  style.call(this, createInjector(context));
              };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          }
          else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' &&
      /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) { return addStyle(id, style); };
  }
  var HEAD;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code +=
                  '\n/*# sourceMappingURL=data:application/json;base64,' +
                      btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                      ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media)
                  { style.element.setAttribute('media', css.media); }
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles
                  .filter(Boolean)
                  .join('\n');
          }
          else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index])
                  { style.element.removeChild(nodes[index]); }
              if (nodes.length)
                  { style.element.insertBefore(textNode, nodes[index]); }
              else
                  { style.element.appendChild(textNode); }
          }
      }
  }

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "calendar" }, [
      _c("div", { staticClass: "banner" }, [
        _c("div", {
          staticClass: "arrow arrow-left",
          on: { click: _vm.toPreMonth }
        }),
        _vm._v(" "),
        _c("span", [_vm._v(_vm._s(_vm.curYear + _vm.bannerYearText))]),
        _vm._v(" "),
        _c("span", [_vm._v(_vm._s(_vm.curMonth + _vm.bannerMonthText))]),
        _vm._v(" "),
        _c("div", {
          staticClass: "arrow arrow-right",
          on: { click: _vm.toNextMonth }
        })
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "week-text" },
        _vm._l(_vm.weekText, function(text) {
          return _c(
            "div",
            { key: text, staticClass: "date-item date-item__week" },
            [_vm._v("\n      " + _vm._s(text) + "\n    ")]
          )
        }),
        0
      ),
      _vm._v(" "),
      _c(
        "div",
        _vm._l(_vm.monthArr, function(item, j) {
          return _c(
            "div",
            {
              key: "cur" + j,
              staticClass: "date-item",
              on: {
                click: function() {
                  return _vm._handleItemSelect(item)
                }
              }
            },
            [
              _c(
                "span",
                {
                  class: {
                    "current-month": item.monthFlag === 1,
                    today: item.isToday,
                    "is-selected":
                      item.monthFlag === 1 &&
                      item.val ===
                        _vm.value.getFullYear() +
                          "-" +
                          (_vm.value.getMonth() + 1) +
                          "-" +
                          _vm.value.getDate(),
                    "is-marked": item.marked
                  }
                },
                [_vm._v("\n        " + _vm._s(item.date) + "\n      ")]
              )
            ]
          )
        }),
        0
      ),
      _vm._v(" "),
      _c("div", { staticClass: "comment" }, [
        _vm._v("\n    " + _vm._s(_vm.comment) + "\n  ")
      ])
    ])
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-1a0a4c24_0", { source: "\n.calendar {\r\n  box-sizing: border-box;\r\n  width: 400px;\r\n  padding: 18px;\r\n  color: #000;\n}\n.calendar span {\r\n  font-size: 16px;\r\n  line-height: 16px;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\n}\n.calendar .banner {\r\n  font-size: 0;\r\n  line-height: 16px;\r\n  text-align: center;\n}\n.arrow {\r\n  display: inline-block;\r\n  width: 0;\r\n  height: 0;\r\n  cursor: pointer;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\r\n  border-top: 8px solid transparent;\r\n  border-bottom: 8px solid transparent;\n}\n.arrow-left {\r\n  margin-right: 16px;\r\n  border-right: 8px solid #409eff;\r\n  border-left: 8px solid transparent;\n}\n.arrow-right {\r\n  margin-left: 16px;\r\n  border-right: 8px solid transparent;\r\n  border-left: 8px solid #409eff;\n}\n.calendar .date-item {\r\n  position: relative;\r\n  box-sizing: border-box;\r\n  display: inline-block;\r\n  width: 52px;\r\n  height: 52px;\r\n  line-height: 52px;\r\n  color: #c0c4cc;\r\n  text-align: center;\r\n  -webkit-user-select: none;\r\n     -moz-user-select: none;\r\n      -ms-user-select: none;\r\n          user-select: none;\n}\n.calendar .date-item span {\r\n  box-sizing: content-box;\r\n  display: inline-block;\r\n  width: 20px;\r\n  height: 20px;\r\n  padding: 8px;\r\n  margin: 6px;\n}\n.calendar .date-item__week {\r\n  color: #000 !important;\n}\n.calendar .current-month {\r\n  color: #000 !important;\n}\n.calendar .current-month:hover {\r\n  cursor: pointer;\r\n  background-color: #f2f8fe;\r\n  border-radius: 50%;\n}\n.calendar .today {\r\n  color: #409eff !important;\n}\n.calendar .is-selected {\r\n  color: #fff !important;\r\n  background-color: #409eff !important;\r\n  border-radius: 50%;\n}\n.calendar .is-marked::after {\r\n  position: absolute;\r\n  bottom: 10px;\r\n  left: 50%;\r\n  content: '';\r\n  border: 1.5px solid #000;\r\n  border-radius: 50%;\r\n  transform: translateX(-50%);\n}\n.calendar .comment {\r\n  padding: 16px;\r\n  color: #c0c4cc;\n}\r\n", map: {"version":3,"sources":["d:\\WebS\\el-calendar\\src\\Calendar.vue"],"names":[],"mappings":";AAuPA;EACA,sBAAA;EACA,YAAA;EACA,aAAA;EACA,WAAA;AACA;AAEA;EACA,eAAA;EACA,iBAAA;EACA,yBAAA;KAAA,sBAAA;MAAA,qBAAA;UAAA,iBAAA;AACA;AAEA;EACA,YAAA;EACA,iBAAA;EACA,kBAAA;AACA;AACA;EACA,qBAAA;EACA,QAAA;EACA,SAAA;EACA,eAAA;EACA,yBAAA;KAAA,sBAAA;MAAA,qBAAA;UAAA,iBAAA;EACA,iCAAA;EACA,oCAAA;AACA;AACA;EACA,kBAAA;EACA,+BAAA;EACA,kCAAA;AACA;AAEA;EACA,iBAAA;EACA,mCAAA;EACA,8BAAA;AACA;AAEA;EACA,kBAAA;EACA,sBAAA;EACA,qBAAA;EACA,WAAA;EACA,YAAA;EACA,iBAAA;EACA,cAAA;EACA,kBAAA;EACA,yBAAA;KAAA,sBAAA;MAAA,qBAAA;UAAA,iBAAA;AACA;AAEA;EACA,uBAAA;EACA,qBAAA;EACA,WAAA;EACA,YAAA;EACA,YAAA;EACA,WAAA;AACA;AAEA;EACA,sBAAA;AACA;AAEA;EACA,sBAAA;AACA;AAEA;EACA,eAAA;EACA,yBAAA;EACA,kBAAA;AACA;AAEA;EACA,yBAAA;AACA;AAEA;EACA,sBAAA;EACA,oCAAA;EACA,kBAAA;AACA;AAEA;EACA,kBAAA;EACA,YAAA;EACA,SAAA;EACA,WAAA;EACA,wBAAA;EACA,kBAAA;EACA,2BAAA;AACA;AAEA;EACA,aAAA;EACA,cAAA;AACA","file":"Calendar.vue","sourcesContent":["<template>\r\n  <div class=\"calendar\">\r\n    <div class=\"banner\">\r\n      <div class=\"arrow arrow-left\" @click=\"toPreMonth\"></div>\r\n      <span>{{ curYear + bannerYearText }}</span>\r\n      <span>{{ curMonth + bannerMonthText }}</span>\r\n      <div class=\"arrow arrow-right\" @click=\"toNextMonth\"></div>\r\n    </div>\r\n    <div class=\"week-text\">\r\n      <div v-for=\"text in weekText\" :key=\"text\" class=\"date-item date-item__week\">\r\n        {{ text }}\r\n      </div>\r\n    </div>\r\n    <div>\r\n      <div\r\n        v-for=\"(item, j) in monthArr\"\r\n        :key=\"'cur' + j\"\r\n        class=\"date-item\"\r\n        @click=\"() => _handleItemSelect(item)\"\r\n      >\r\n        <span\r\n          :class=\"{\r\n            'current-month': item.monthFlag === 1,\r\n            today: item.isToday,\r\n            'is-selected':\r\n              item.monthFlag === 1 &&\r\n              item.val === `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`,\r\n            'is-marked': item.marked\r\n          }\"\r\n        >\r\n          {{ item.date }}\r\n        </span>\r\n      </div>\r\n    </div>\r\n    <div class=\"comment\">\r\n      {{ comment }}\r\n    </div>\r\n  </div>\r\n</template>\r\n\r\n<script>\r\nfunction getMonthMaxDate(year, month) {\r\n  const isGapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0\r\n  switch (month) {\r\n    case 1:\r\n    case 3:\r\n    case 5:\r\n    case 7:\r\n    case 8:\r\n    case 10:\r\n    case 12:\r\n      return 31\r\n    case 4:\r\n    case 6:\r\n    case 9:\r\n    case 11:\r\n      return 30\r\n    case 2:\r\n      return isGapYear ? 29 : 28\r\n  }\r\n}\r\n\r\nfunction getDayOfWeek(year, month, date) {\r\n  return new Date(year, month - 1, date).getDay()\r\n}\r\n\r\nfunction isNaNs(...args) {\r\n  return Array.prototype.map.call(args, item => isNaN(item))\r\n}\r\n\r\nexport default {\r\n  name: 'Calendar',\r\n\r\n  props: {\r\n    value: {\r\n      type: Date,\r\n      default: () => new Date()\r\n    },\r\n    today: {\r\n      type: Date,\r\n      default: () => new Date()\r\n    },\r\n    weekText: {\r\n      type: Array,\r\n      default: () => ['日', '一', '二', '三', '四', '五', '六']\r\n    },\r\n    bannerYearText: {\r\n      type: String,\r\n      default: '年'\r\n    },\r\n    bannerMonthText: {\r\n      type: String,\r\n      default: '月'\r\n    },\r\n    // Notice：markArr为boolean数组，长度必须与当前月最大日相等\r\n    markArr: {\r\n      type: Array,\r\n      default: () => []\r\n    },\r\n    comment: {\r\n      type: String,\r\n      default: ''\r\n    }\r\n  },\r\n\r\n  data() {\r\n    return {\r\n      curYear: new Date().getFullYear(),\r\n      curMonth: new Date().getMonth() + 1,\r\n      curDay: new Date().getDay(),\r\n      curDate: new Date().getDate(),\r\n      monthArr: []\r\n    }\r\n  },\r\n\r\n  watch: {\r\n    markArr: {\r\n      deep: true,\r\n      immediate: true,\r\n      handler() {\r\n        this._updateMonthArr()\r\n      }\r\n    }\r\n  },\r\n\r\n  created() {\r\n    // set current moment\r\n    this.curYear = this.value.getFullYear()\r\n    this.curMonth = this.value.getMonth() + 1\r\n    this.curDay = this.value.getDay()\r\n    this.curDate = this.value.getDate()\r\n\r\n    this._updateMonthArr()\r\n  },\r\n\r\n  methods: {\r\n    backToToday() {\r\n      this.curYear = this.today.getFullYear()\r\n      this.curMonth = this.today.getMonth() + 1\r\n      this.$emit('input', new Date(this.curYear, this.curMonth - 1, this.today.getDate()))\r\n      this._updateMonthArr()\r\n    },\r\n    toPreMonth() {\r\n      if (this.curMonth === 1) {\r\n        this.curYear = this.curYear - 1\r\n        this.curMonth = 12\r\n      } else {\r\n        this.curMonth = this.curMonth - 1\r\n      }\r\n      this._updateMonthArr()\r\n      this.$emit('premonth', { year: this.curYear, month: this.curMonth })\r\n    },\r\n    toNextMonth() {\r\n      if (this.curMonth === 12) {\r\n        this.curYear = this.curYear + 1\r\n        this.curMonth = 1\r\n      } else {\r\n        this.curMonth = this.curMonth + 1\r\n      }\r\n      this._updateMonthArr()\r\n      this.$emit('nextmonth', { year: this.curYear, month: this.curMonth })\r\n    },\r\n    toSpecificDate(year, month, date) {\r\n      // v0.1.2 fix bug: params of toSpecificDate must be integer\r\n      const intYear = parseInt(year)\r\n      const intMonth = parseInt(month)\r\n      const intDate = parseInt(date)\r\n      if (isNaNs(intYear, intMonth, intDate).some(item => item === true)) return\r\n\r\n      this.curYear = intYear\r\n      this.curMonth = intMonth\r\n      this._updateMonthArr()\r\n      this.$emit('input', new Date(intYear, intMonth - 1, intDate))\r\n    },\r\n    _handleItemSelect(item) {\r\n      if (item.monthFlag === 1) {\r\n        this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))\r\n      } else if (item.monthFlag === 0) {\r\n        this.toPreMonth()\r\n        this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))\r\n      } else {\r\n        this.toNextMonth()\r\n        this.$emit('input', new Date(this.curYear, this.curMonth - 1, item.date))\r\n      }\r\n    },\r\n    // monthFlag: 0 previous month, 1 current month, 2 next month\r\n    _getDateArr(beginDate = 1, endDate = 31, monthFlag = 1) {\r\n      if (beginDate > endDate) {\r\n        return []\r\n      }\r\n\r\n      let tarMonth = this.curMonth\r\n      let tarYear = this.curYear\r\n      if (monthFlag === 0) {\r\n        if (this.curMonth === 1) {\r\n          tarMonth = 12\r\n          tarYear = this.curYear - 1\r\n        } else {\r\n          tarMonth = this.curMonth - 1\r\n        }\r\n      } else if (monthFlag === 2) {\r\n        if (this.curMonth === 12) {\r\n          tarMonth = 1\r\n          tarYear = this.curYear + 1\r\n        } else {\r\n          tarMonth = this.curMonth + 1\r\n        }\r\n      }\r\n\r\n      return new Array(endDate - beginDate + 1).fill().map((_, index) => ({\r\n        val: `${tarYear}-${tarMonth}-${index + beginDate}`,\r\n        date: index + beginDate,\r\n        monthFlag,\r\n        marked: monthFlag === 1 && this.markArr[index],\r\n        isToday: this._getDateStr(this.today) === `${tarYear}-${tarMonth}-${index + beginDate}`\r\n      }))\r\n    },\r\n    _updateMonthArr() {\r\n      let maxDateOfPreMonth\r\n      if (this.curMonth === 1) {\r\n        maxDateOfPreMonth = getMonthMaxDate(this.curYear - 1, 12)\r\n      } else {\r\n        maxDateOfPreMonth = getMonthMaxDate(this.curYear, this.curMonth - 1)\r\n      }\r\n      const firstDayOfCurMonth = getDayOfWeek(this.curYear, this.curMonth, 1)\r\n      const preMonthArr = this._getDateArr(\r\n        maxDateOfPreMonth - firstDayOfCurMonth + 1,\r\n        maxDateOfPreMonth,\r\n        0\r\n      )\r\n      const curMonthArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth), 1)\r\n      const nextMonthArr = this._getDateArr(1, getMonthMaxDate(this.curYear, this.curMonth + 1), 2)\r\n\r\n      // 6 line max: 6 * 7 = 42\r\n      this.monthArr = preMonthArr\r\n        .concat(curMonthArr)\r\n        .concat(nextMonthArr)\r\n        .slice(0, 42)\r\n    },\r\n    _getDateStr(date) {\r\n      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`\r\n    }\r\n  }\r\n}\r\n</script>\r\n\r\n<style>\r\n.calendar {\r\n  box-sizing: border-box;\r\n  width: 400px;\r\n  padding: 18px;\r\n  color: #000;\r\n}\r\n\r\n.calendar span {\r\n  font-size: 16px;\r\n  line-height: 16px;\r\n  user-select: none;\r\n}\r\n\r\n.calendar .banner {\r\n  font-size: 0;\r\n  line-height: 16px;\r\n  text-align: center;\r\n}\r\n.arrow {\r\n  display: inline-block;\r\n  width: 0;\r\n  height: 0;\r\n  cursor: pointer;\r\n  user-select: none;\r\n  border-top: 8px solid transparent;\r\n  border-bottom: 8px solid transparent;\r\n}\r\n.arrow-left {\r\n  margin-right: 16px;\r\n  border-right: 8px solid #409eff;\r\n  border-left: 8px solid transparent;\r\n}\r\n\r\n.arrow-right {\r\n  margin-left: 16px;\r\n  border-right: 8px solid transparent;\r\n  border-left: 8px solid #409eff;\r\n}\r\n\r\n.calendar .date-item {\r\n  position: relative;\r\n  box-sizing: border-box;\r\n  display: inline-block;\r\n  width: 52px;\r\n  height: 52px;\r\n  line-height: 52px;\r\n  color: #c0c4cc;\r\n  text-align: center;\r\n  user-select: none;\r\n}\r\n\r\n.calendar .date-item span {\r\n  box-sizing: content-box;\r\n  display: inline-block;\r\n  width: 20px;\r\n  height: 20px;\r\n  padding: 8px;\r\n  margin: 6px;\r\n}\r\n\r\n.calendar .date-item__week {\r\n  color: #000 !important;\r\n}\r\n\r\n.calendar .current-month {\r\n  color: #000 !important;\r\n}\r\n\r\n.calendar .current-month:hover {\r\n  cursor: pointer;\r\n  background-color: #f2f8fe;\r\n  border-radius: 50%;\r\n}\r\n\r\n.calendar .today {\r\n  color: #409eff !important;\r\n}\r\n\r\n.calendar .is-selected {\r\n  color: #fff !important;\r\n  background-color: #409eff !important;\r\n  border-radius: 50%;\r\n}\r\n\r\n.calendar .is-marked::after {\r\n  position: absolute;\r\n  bottom: 10px;\r\n  left: 50%;\r\n  content: '';\r\n  border: 1.5px solid #000;\r\n  border-radius: 50%;\r\n  transform: translateX(-50%);\r\n}\r\n\r\n.calendar .comment {\r\n  padding: 16px;\r\n  color: #c0c4cc;\r\n}\r\n</style>\r\n"]}, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    
    /* style inject shadow dom */
    

    
    var __vue_component__ = normalizeComponent(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      false,
      createInjector,
      undefined,
      undefined
    );

  return __vue_component__;

})));
