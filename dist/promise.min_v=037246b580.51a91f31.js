// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../../../.nvm/versions/node/v14.15.0/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"assets/vendor/polyfills/promise.min_v=037246b580.js":[function(require,module,exports) {
var define;
var process = require("process");
var global = arguments[3];
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * https://github.com/stefanpenner/es6-promise
 */
!function (t, e) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.ES6Promise = e();
}(this, function () {
  "use strict";

  function t(t) {
    return "function" == typeof t || "object" == _typeof(t) && null !== t;
  }

  function e(t) {
    return "function" == typeof t;
  }

  function n(t) {
    I = t;
  }

  function r(t) {
    J = t;
  }

  function o() {
    return function () {
      return process.nextTick(a);
    };
  }

  function i() {
    return "undefined" != typeof H ? function () {
      H(a);
    } : c();
  }

  function s() {
    var t = 0,
        e = new V(a),
        n = document.createTextNode("");
    return e.observe(n, {
      characterData: !0
    }), function () {
      n.data = t = ++t % 2;
    };
  }

  function u() {
    var t = new MessageChannel();
    return t.port1.onmessage = a, function () {
      return t.port2.postMessage(0);
    };
  }

  function c() {
    var t = setTimeout;
    return function () {
      return t(a, 1);
    };
  }

  function a() {
    for (var t = 0; t < G; t += 2) {
      var e = $[t],
          n = $[t + 1];
      e(n), $[t] = void 0, $[t + 1] = void 0;
    }

    G = 0;
  }

  function f() {
    try {
      var t = require,
          e = t("vertx");
      return H = e.runOnLoop || e.runOnContext, i();
    } catch (n) {
      return c();
    }
  }

  function l(t, e) {
    var n = arguments,
        r = this,
        o = new this.constructor(p);
    void 0 === o[et] && k(o);
    var i = r._state;
    return i ? !function () {
      var t = n[i - 1];
      J(function () {
        return x(i, o, t, r._result);
      });
    }() : E(r, o, t, e), o;
  }

  function h(t) {
    var e = this;
    if (t && "object" == _typeof(t) && t.constructor === e) return t;
    var n = new e(p);
    return g(n, t), n;
  }

  function p() {}

  function v() {
    return new TypeError("You cannot resolve a promise with itself");
  }

  function d() {
    return new TypeError("A promises callback cannot return that same promise.");
  }

  function _(t) {
    try {
      return t.then;
    } catch (e) {
      return it.error = e, it;
    }
  }

  function y(t, e, n, r) {
    try {
      t.call(e, n, r);
    } catch (o) {
      return o;
    }
  }

  function m(t, e, n) {
    J(function (t) {
      var r = !1,
          o = y(n, e, function (n) {
        r || (r = !0, e !== n ? g(t, n) : S(t, n));
      }, function (e) {
        r || (r = !0, j(t, e));
      }, "Settle: " + (t._label || " unknown promise"));
      !r && o && (r = !0, j(t, o));
    }, t);
  }

  function b(t, e) {
    e._state === rt ? S(t, e._result) : e._state === ot ? j(t, e._result) : E(e, void 0, function (e) {
      return g(t, e);
    }, function (e) {
      return j(t, e);
    });
  }

  function w(t, n, r) {
    n.constructor === t.constructor && r === l && n.constructor.resolve === h ? b(t, n) : r === it ? j(t, it.error) : void 0 === r ? S(t, n) : e(r) ? m(t, n, r) : S(t, n);
  }

  function g(e, n) {
    e === n ? j(e, v()) : t(n) ? w(e, n, _(n)) : S(e, n);
  }

  function A(t) {
    t._onerror && t._onerror(t._result), P(t);
  }

  function S(t, e) {
    t._state === nt && (t._result = e, t._state = rt, 0 !== t._subscribers.length && J(P, t));
  }

  function j(t, e) {
    t._state === nt && (t._state = ot, t._result = e, J(A, t));
  }

  function E(t, e, n, r) {
    var o = t._subscribers,
        i = o.length;
    t._onerror = null, o[i] = e, o[i + rt] = n, o[i + ot] = r, 0 === i && t._state && J(P, t);
  }

  function P(t) {
    var e = t._subscribers,
        n = t._state;

    if (0 !== e.length) {
      for (var r = void 0, o = void 0, i = t._result, s = 0; s < e.length; s += 3) {
        r = e[s], o = e[s + n], r ? x(n, r, o, i) : o(i);
      }

      t._subscribers.length = 0;
    }
  }

  function T() {
    this.error = null;
  }

  function M(t, e) {
    try {
      return t(e);
    } catch (n) {
      return st.error = n, st;
    }
  }

  function x(t, n, r, o) {
    var i = e(r),
        s = void 0,
        u = void 0,
        c = void 0,
        a = void 0;

    if (i) {
      if (s = M(r, o), s === st ? (a = !0, u = s.error, s = null) : c = !0, n === s) return void j(n, d());
    } else s = o, c = !0;

    n._state !== nt || (i && c ? g(n, s) : a ? j(n, u) : t === rt ? S(n, s) : t === ot && j(n, s));
  }

  function C(t, e) {
    try {
      e(function (e) {
        g(t, e);
      }, function (e) {
        j(t, e);
      });
    } catch (n) {
      j(t, n);
    }
  }

  function O() {
    return ut++;
  }

  function k(t) {
    t[et] = ut++, t._state = void 0, t._result = void 0, t._subscribers = [];
  }

  function Y(t, e) {
    this._instanceConstructor = t, this.promise = new t(p), this.promise[et] || k(this.promise), B(e) ? (this._input = e, this.length = e.length, this._remaining = e.length, this._result = new Array(this.length), 0 === this.length ? S(this.promise, this._result) : (this.length = this.length || 0, this._enumerate(), 0 === this._remaining && S(this.promise, this._result))) : j(this.promise, q());
  }

  function q() {
    return new Error("Array Methods must be provided an Array");
  }

  function F(t) {
    return new Y(this, t).promise;
  }

  function D(t) {
    var e = this;
    return new e(B(t) ? function (n, r) {
      for (var o = t.length, i = 0; i < o; i++) {
        e.resolve(t[i]).then(n, r);
      }
    } : function (t, e) {
      return e(new TypeError("You must pass an array to race."));
    });
  }

  function K(t) {
    var e = this,
        n = new e(p);
    return j(n, t), n;
  }

  function L() {
    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
  }

  function N() {
    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
  }

  function U(t) {
    this[et] = O(), this._result = this._state = void 0, this._subscribers = [], p !== t && ("function" != typeof t && L(), this instanceof U ? C(this, t) : N());
  }

  function W() {
    var t = void 0;
    if ("undefined" != typeof global) t = global;else if ("undefined" != typeof self) t = self;else try {
      t = Function("return this")();
    } catch (e) {
      throw new Error("polyfill failed because global object is unavailable in this environment");
    }
    var n = t.Promise;

    if (n) {
      var r = null;

      try {
        r = Object.prototype.toString.call(n.resolve());
      } catch (e) {}

      if ("[object Promise]" === r && !n.cast) return;
    }

    t.Promise = U;
  }

  var z = void 0;
  z = Array.isArray ? Array.isArray : function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  };

  var B = z,
      G = 0,
      H = void 0,
      I = void 0,
      J = function J(t, e) {
    $[G] = t, $[G + 1] = e, G += 2, 2 === G && (I ? I(a) : tt());
  },
      Q = "undefined" != typeof window ? window : void 0,
      R = Q || {},
      V = R.MutationObserver || R.WebKitMutationObserver,
      X = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
      Z = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
      $ = new Array(1e3),
      tt = void 0;

  tt = X ? o() : V ? s() : Z ? u() : void 0 === Q && "function" == typeof require ? f() : c();
  var et = Math.random().toString(36).substring(16),
      nt = void 0,
      rt = 1,
      ot = 2,
      it = new T(),
      st = new T(),
      ut = 0;
  return Y.prototype._enumerate = function () {
    for (var t = this.length, e = this._input, n = 0; this._state === nt && n < t; n++) {
      this._eachEntry(e[n], n);
    }
  }, Y.prototype._eachEntry = function (t, e) {
    var n = this._instanceConstructor,
        r = n.resolve;

    if (r === h) {
      var o = _(t);

      if (o === l && t._state !== nt) this._settledAt(t._state, e, t._result);else if ("function" != typeof o) this._remaining--, this._result[e] = t;else if (n === U) {
        var i = new n(p);
        w(i, t, o), this._willSettleAt(i, e);
      } else this._willSettleAt(new n(function (e) {
        return e(t);
      }), e);
    } else this._willSettleAt(r(t), e);
  }, Y.prototype._settledAt = function (t, e, n) {
    var r = this.promise;
    r._state === nt && (this._remaining--, t === ot ? j(r, n) : this._result[e] = n), 0 === this._remaining && S(r, this._result);
  }, Y.prototype._willSettleAt = function (t, e) {
    var n = this;
    E(t, void 0, function (t) {
      return n._settledAt(rt, e, t);
    }, function (t) {
      return n._settledAt(ot, e, t);
    });
  }, U.all = F, U.race = D, U.resolve = h, U.reject = K, U._setScheduler = n, U._setAsap = r, U._asap = J, U.prototype = {
    constructor: U,
    then: l,
    "catch": function _catch(t) {
      return this.then(null, t);
    }
  }, U.polyfill = W, U.Promise = U, U;
}), ES6Promise.polyfill();
},{"process":"../../../../.nvm/versions/node/v14.15.0/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../../../../.nvm/versions/node/v14.15.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61172" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../.nvm/versions/node/v14.15.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","assets/vendor/polyfills/promise.min_v=037246b580.js"], null)
//# sourceMappingURL=/promise.min_v=037246b580.51a91f31.js.map