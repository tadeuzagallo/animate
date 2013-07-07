;(function(w, d, undefined) {
  'use strict';

  var _defaults = {
    name: null,
    duration: '1s',
    delay: 0,
    easing: 'linear',
    waits: null,
    repeat: 1,
    callback: null,
    'fill-mode': 'forwards',
    direction: 'normal',
    iterations: 1,
    play: 'true',
    bind: 'none'
  },
  _valid_properties = Object.keys(_defaults),
  _init = {},
  _waits = {};

  var _slice = Array.prototype.slice,
  _hop = Object.prototype.hasOwnProperty,
  _on = d.addEventListener || d.attachEvent,
  _off = d.removeEventListener || d.detachEvent,
  _extend = function (target, source) {
    for (var k in source) {
      if (_hop.call(source, k)) {
        target[k] = source[k];
      }
    }

    return target;
  },
  _find_by_id = function() {
    return d.getElementById.apply(d, arguments);
  },
  _find_by_tag = function(el) {
    return el.getElementsByTagName.apply(el, _slice.call(arguments, 1));
  };

  var _instance,
      _style = d.createElement('style'),
      _ID = 0,
      _keyframe_content = '@%key%keyframes %name% {%keyframes% }',
      _crossbrowser_keys = ['-webkit-', '-moz-', '-o-', ''],
      _animation_properties = {
        delay: 'delay',
        direction: 'direction',
        duration: 'duration',
        'fill-mode': 'fill-mode',
        iterations: 'iteration-count',
        'easing': 'timing-function'
      },
      _unit = function(a) {
        return a.replace(String(parseFloat(a)), '').trim();
      },
      _crossbrowser = function(prop, value) {
        var _output = '';

        for (var k = 0, l = _crossbrowser_keys.length, key; k < l; k++) {
          key = _crossbrowser_keys[k];
          if (value === undefined) {
            prop(key);
          } else  {
            _output += key + prop + ':' + value + ';';
          }
        }

        return _output;
      },
      _functions = {
        random: function(a, b)  {
          var _a = parseInt(a, 10),
              _b = parseInt(b, 10);
          console.assert(_unit(a), _unit(b));

          return _a + Math.floor(Math.random() * (_b - _a)) + _unit(b);
        },
        ap: (function() {
          var AP = {};

          return function(initial, ratio) {
            var id = this.original_id || this.id;

            if (!AP[id]) {
             AP[id] = initial;
            } else {
             AP[id] = ParseInt(AP[id], 10) + ratio + _unit(AP[id]);
            }

            return AP[id];
          };
        })(),
        gp: (function() {
          var GP = {};

          return function(initial, ratio) {
            var id = this.original_id || this.id;

            if (!GP[id]) {
             GP[id] = initial;
            } else {
             GP[id] = parseInt(GP[id], 10) * ratio + _unit(GP[id]);
            }

            return GP[id];
          };
        })(),
        log: (function() {
          var LOG = {};

          return function(value, base) {
            var id = this.original_id || this.id;

            base = base || Math.E;

            if (!LOG[id]) {
             LOG[id] = 1;
            } else {
             LOG[id] ++;
            }

            return parseInt(value, 10) * (Math.log(LOG[id]) / Math.log(base)) + _unit(value);
          };
        })(),
        easing: function() {
          var value = [].join.call(arguments, ',');
          return _crossbrowser('animation-timing-function', value);
        },
        calc: function(prop, value) {
          if (!value) {
            return 'calc(' + prop + ')';
          } else {
            var _output = '';

            _crossbrowser(function(key) {
              _output += prop + ':' + key + 'calc(' + value + ');';
            });

            return _output;
          }
        },
        transform: function() {
          var value = [].join.call(arguments, ',');
          return _crossbrowser('transform', value);
        },
        'transform-origin': function() {
          var ch = 120,
              output = '';

          for (var k = 0, l = arguments.length, value; k < l; k++) {
            value = arguments[k];
            output += _crossbrowser('transform-origin-' + String.fromCharCode(ch + k), value);
          }

          return output;
        }
      },
      _functions_regex = /^([a-z\-]+)\((.*)\)$/;

  d.head.appendChild(_style);

  var console = w.console = w.console || {
    log: function() {
    },
    assert: function() {
    }
  };

  w.Animate = new (function Animate() {
    if (_instance) {
      throw 'class Animate should not be instantiated';
    }

    _instance = this;

    Animate.init = function(id) {
      var body = _find_by_id(id || 'animation-body');

      if (!body)  {
        throw 'Animation body not found! Unable to start';
      } else if (_init[body.id] === true) {
        return;
      }

      _init[body.id] = true;

      _crossbrowser(function(key) {
        body.style[key+'backface-visibility'] = 'hidden';
        body.style[key+'transform'] = 'translate3d(0,0,0)';
      });

      var elements = _slice.call(_find_by_tag(body, '*'), 0);

      for (var k = 0, l = elements.length, element; k < l; k++) {
        element = elements[k];

        if (element.attributes.length) {
          _instance.process(body, element);
        }
      }
    };

    Animate.VERSION = '0.0.1';

    this.process = function(body, element) {
      var el = new Animate.Element(element);
      el.parse();
    };

    Animate.Element = (function () {
      function Element(element) {
        this.element = element;
        this.original_id = this.id = ++_ID;

        this._name = '__animate_keyframes_' + this.id;
        this._bind = '';

        if (!element.id) {
          element.id = 'animate-element-' + this.id;
        }
      }

      return Element;
    })();

    Animate.Element.prototype.parse = function() {
      var _prop = /^data-([0-9\-]+)$/,
          _param = /^data-(.*)$/,
          _params = _extend({}, _defaults),
          _keyframes = {},
          _keyframes_str = '',
          _element_style = '',
          _this = this;

      for (var k = 0, l = this.element.attributes.length, attr, n, v, match; k < l; k++) {
        attr = this.element.attributes[k];
        n = attr.nodeName;
        v = attr.value || attr.nodeValue;

        if ((match = n.match(_prop))) {
          var keys = match[1].trim().split('-');
          for (var x = 0, y = keys.length, key; x < y; x++) {
            key = keys[x];
            if (key) {
              if (!_hop.call(_keyframes, key)) {
                _keyframes[key] = '';
              }
              _keyframes[key] += this.parse_css(v);
            }
          }
        } else if ((match = n.match(_param))) {
          if (_valid_properties.indexOf(match[1]) !== -1) {
            _params[match[1]] = this.parse_value(v);
          }
        } else if (n === 'style') {
          this.element.setAttribute(n, this.parse_css(v));
        }
      }

      for (var key in _keyframes) {
        if (_hop.call(_keyframes, key)) {
          _keyframes_str += key + '%{' + _keyframes[key] + '}';
        }
      }

      if (!_keyframes_str.length) {
        return;
      }

      if (_params.repeat > 1 && !this._prevent_repeat) {
        var parse = function (element) {
          return function() {
            element.parse();
          };
        };

        for (k = 0; k < _params.repeat - 1; k++) {
          var clone = this.element.cloneNode(true);
          clone.id = clone.id + '-repeat-' + (k + 1);
          this.element.parentNode.appendChild(clone);
          var element = new Animate.Element(clone);
          element._prevent_repeat = true;
          element.original_id = this.id;

          setTimeout(parse(element), 0);
        }
      }

      _crossbrowser(function(key) {
        _style.innerHTML += _keyframe_content
          .replace('%key%', key)
          .replace('%name%', _this._name)
          .replace('%keyframes%', _keyframes_str);
      });

      _crossbrowser(function(key) {
        _element_style += key + 'animation-play-state:' + (_params.play === 'false' ? 'paused' : 'running') + ';'; 

        for (var k in _animation_properties) {
          if (_hop.call(_animation_properties, k)) {
            _element_style += key + 'animation-' + _animation_properties[k] + ':' + _params[k] + ';';
          }
        }
      });

      _style.innerHTML += '#' + this.element.id + '{' + _element_style + '}';

      var fn = function(e) {
        _off.call(this, 'webkitAnimationEnd', fn, false);
        _off.call(this, 'animationend', fn, false);
        _off.call(this, 'onanimationend', fn, false);

        if (_params.callback && w[_params.callback] && typeof w[_params.callback] === 'function') {
          w[_params.callback].call(_this.element, e || window.event);
        }

        if (_hop.call(_waits, _this.element.id)) {
          var ws = _waits[_this.element.id];
          for (var k = 0, l = ws.length; k < l; k++) {
            ws[k].start();
          }
          delete _waits[_this.element.id];
        }
      };

      _on.call(this.element, 'webkitAnimationEnd', fn, false);
      _on.call(this.element, 'animationend', fn, false);
      _on.call(this.element, 'onanimationend', fn, false);

      if (_params.bind) {
        switch (_params.bind) {
          case 'click':
          case 'onclick':
          case 'active':
            this._bind = ':active';
            break;
          case 'hover':
          case 'over':
          case 'mouseover':
            this._bind = ':hover';
            break;
        }
      }

      if (!_params.waits) {
        this.start();
      } else {
        if (!_hop.call(_waits, _params.waits)) {
          _waits[_params.waits] = [];
        }

        _waits[_params.waits].push(this);
      }
    };

    Animate.Element.prototype.start = function() {
      var _element_style = '',
          _this = this;
      _crossbrowser(function(key) {
        _element_style += key + 'animation-name:' + _this._name + ';'; 
      });

      _style.innerHTML += '#' + this.element.id + this._bind + '{' + _element_style + '}';
    };

    Animate.Element.prototype.parse_value = function(value) {
      var match = value.trim().match(_functions_regex),
          _arguments = match && match[2].split(',').filter(function (a) { return a.trim(); }),
          _fn_name = match && match[1].replace(/\s/g, '');
      if (_hop.call(w, _fn_name)) {
        value = w[_fn_name].apply(this, _arguments);
      } else if (_hop.call(_functions, _fn_name)) {
        value = _functions[_fn_name].apply(this, _arguments);
      }

      return value;
    };

    Animate.Element.prototype.parse_css_entry = function(prop, value) {
      return prop + ':' + this.parse_value(value) + ';';
    };

    Animate.Element.prototype.parse_css = function(styles) { 
      var _output = '';

      styles = styles.split(';');

      for (var k = 0, l = styles.length, style, prop, value; k < l; k++) {
        if ((style = styles[k].split(':')).length !== 2) {
          _output += this.parse_value(styles[k]);
        } else {
          prop = style[0].trim();
          value = style[1].trim();

          _output += this.parse_css_entry(prop, value);
        }
      }

      return _output;
    };

    return Animate;
  })();

    /*!
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   *
   */

  // @win window reference
  // @fn function reference
  function contentLoaded(win, fn) {

    var done = false, top = true,

    doc = win.document, root = doc.documentElement,

    add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
    rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
    pre = doc.addEventListener ? '' : 'on',

    init = function(e) {
      if (e.type === 'readystatechange' && doc.readyState !== 'complete') {
        return;
      }

      (e.type === 'load' ? win : doc)[rem](pre + e.type, init, false);

      if (!done && (done = true)) {
        fn.call(win, e.type || e);
      }
    },

    poll = function() {
      try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
      init('poll');
    };

    if (doc.readyState === 'complete') {
      fn.call(win, 'lazy');
    } else {
      if (doc.createEventObject && root.doScroll) {
        try { top = !win.frameElement; } catch(e) { }
        if (top) {
          poll();
        }
      }
      doc[add](pre + 'DOMContentLoaded', init, false);
      doc[add](pre + 'readystatechange', init, false);
      win[add](pre + 'load', init, false);
    }

  }

  contentLoaded(w, function() {
    w.Animate.init();
  });
})(window, document);
