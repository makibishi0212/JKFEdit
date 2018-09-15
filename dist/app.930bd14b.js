// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
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

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
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

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({5:[function(require,module,exports) {
var global = (1,eval)("this");
;(function() {
"use strict"
function Vnode(tag, key, attrs0, children, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children, text: text, dom: dom, domSize: undefined, state: undefined, _state: undefined, events: undefined, instance: undefined, skip: false}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node != null && typeof node !== "object") return Vnode("#", undefined, undefined, node === false ? "" : node, undefined, undefined)
	return node
}
Vnode.normalizeChildren = function normalizeChildren(children) {
	for (var i = 0; i < children.length; i++) {
		children[i] = Vnode.normalize(children[i])
	}
	return children
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, attrs, children) {
	var hasAttrs = false, childList, text
	var className = attrs.className || attrs.class
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for(var key in attrs) {
			if (hasOwn.call(attrs, key)) {
				newAttrs[key] = attrs[key]
			}
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key)) {
			attrs[key] = state.attrs[key]
		}
	}
	if (className !== undefined) {
		if (attrs.class !== undefined) {
			attrs.class = undefined
			attrs.className = className
		}
		if (state.attrs.className != null) {
			attrs.className = state.attrs.className + " " + className
		}
	}
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			hasAttrs = true
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		text = children[0].children
	} else {
		childList = children
	}
	return Vnode(state.tag, attrs.key, hasAttrs ? attrs : undefined, childList, text)
}
function hyperscript(selector) {
	// Because sloppy mode sucks
	var attrs = arguments[1], start = 2, children
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	if (typeof selector === "string") {
		var cached = selectorCache[selector] || compileSelector(selector)
	}
	if (attrs == null) {
		attrs = {}
	} else if (typeof attrs !== "object" || attrs.tag != null || Array.isArray(attrs)) {
		attrs = {}
		start = 1
	}
	if (arguments.length === start + 1) {
		children = arguments[start]
		if (!Array.isArray(children)) children = [children]
	} else {
		children = []
		while (start < arguments.length) children.push(arguments[start++])
	}
	var normalized = Vnode.normalizeChildren(children)
	if (typeof selector === "string") {
		return execSelector(cached, attrs, normalized)
	} else {
		return Vnode(selector, attrs.key, attrs, normalized)
	}
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function(attrs1, children) {
	return Vnode("[", attrs1.key, attrs1, Vnode.normalizeChildren(children), undefined, undefined)
}
var m = hyperscript
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") window.Promise = PromisePolyfill
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") global.Promise = PromisePolyfill
	var PromisePolyfill = global.Promise
} else {
}
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key0 in object) {
		destructure(key0, object[key0])
	}
	return args.join("&")
	function destructure(key0, value) {
		if (Array.isArray(value)) {
			for (var i = 0; i < value.length; i++) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else if (Object.prototype.toString.call(value) === "[object Object]") {
			for (var i in value) {
				destructure(key0 + "[" + i + "]", value[i])
			}
		}
		else args.push(encodeURIComponent(key0) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
	}
}
var FILE_PROTOCOL_REGEX = new RegExp("^file://", "i")
var _8 = function($window, Promise) {
	var callbackCount = 0
	var oncompletion
	function setCompletionCallback(callback) {oncompletion = callback}
	function finalizer() {
		var count = 0
		function complete() {if (--count === 0 && typeof oncompletion === "function") oncompletion()}
		return function finalize(promise0) {
			var then0 = promise0.then
			promise0.then = function() {
				count++
				var next = then0.apply(promise0, arguments)
				next.then(complete, function(e) {
					complete()
					if (count === 0) throw e
				})
				return finalize(next)
			}
			return promise0
		}
	}
	function normalize(args, extra) {
		if (typeof args === "string") {
			var url = args
			args = extra || {}
			if (args.url == null) args.url = url
		}
		return args
	}
	function request(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			if (args.method == null) args.method = "GET"
			args.method = args.method.toUpperCase()
			var useBody = (args.method === "GET" || args.method === "TRACE") ? false : (typeof args.useBody === "boolean" ? args.useBody : true)
			if (typeof args.serialize !== "function") args.serialize = typeof FormData !== "undefined" && args.data instanceof FormData ? function(value) {return value} : JSON.stringify
			if (typeof args.deserialize !== "function") args.deserialize = deserialize
			if (typeof args.extract !== "function") args.extract = extract
			args.url = interpolate(args.url, args.data)
			if (useBody) args.data = args.serialize(args.data)
			else args.url = assemble(args.url, args.data)
			var xhr = new $window.XMLHttpRequest(),
				aborted = false,
				_abort = xhr.abort
			xhr.abort = function abort() {
				aborted = true
				_abort.call(xhr)
			}
			xhr.open(args.method, args.url, typeof args.async === "boolean" ? args.async : true, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (args.serialize === JSON.stringify && useBody && !(args.headers && args.headers.hasOwnProperty("Content-Type"))) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (args.deserialize === deserialize && !(args.headers && args.headers.hasOwnProperty("Accept"))) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			for (var key in args.headers) if ({}.hasOwnProperty.call(args.headers, key)) {
				xhr.setRequestHeader(key, args.headers[key])
			}
			if (typeof args.config === "function") xhr = args.config(xhr, args) || xhr
			xhr.onreadystatechange = function() {
				// Don't throw errors on xhr.abort().
				if(aborted) return
				if (xhr.readyState === 4) {
					try {
						var response = (args.extract !== extract) ? args.extract(xhr, args) : args.deserialize(args.extract(xhr, args))
						if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || FILE_PROTOCOL_REGEX.test(args.url)) {
							resolve(cast(args.type, response))
						}
						else {
							var error = new Error(xhr.responseText)
							for (var key in response) error[key] = response[key]
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (useBody && (args.data != null)) xhr.send(args.data)
			else xhr.send()
		})
		return args.background === true ? promise0 : finalize(promise0)
	}
	function jsonp(args, extra) {
		var finalize = finalizer()
		args = normalize(args, extra)
		var promise0 = new Promise(function(resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				script.parentNode.removeChild(script)
				resolve(cast(args.type, data))
				delete $window[callbackName]
			}
			script.onerror = function() {
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
				delete $window[callbackName]
			}
			if (args.data == null) args.data = {}
			args.url = interpolate(args.url, args.data)
			args.data[args.callbackKey || "callback"] = callbackName
			script.src = assemble(args.url, args.data)
			$window.document.documentElement.appendChild(script)
		})
		return args.background === true? promise0 : finalize(promise0)
	}
	function interpolate(url, data) {
		if (data == null) return url
		var tokens = url.match(/:[^\/]+/gi) || []
		for (var i = 0; i < tokens.length; i++) {
			var key = tokens[i].slice(1)
			if (data[key] != null) {
				url = url.replace(tokens[i], data[key])
			}
		}
		return url
	}
	function assemble(url, data) {
		var querystring = buildQueryString(data)
		if (querystring !== "") {
			var prefix = url.indexOf("?") < 0 ? "?" : "&"
			url += prefix + querystring
		}
		return url
	}
	function deserialize(data) {
		try {return data !== "" ? JSON.parse(data) : null}
		catch (e) {throw new Error(data)}
	}
	function extract(xhr) {return xhr.responseText}
	function cast(type0, data) {
		if (typeof type0 === "function") {
			if (Array.isArray(data)) {
				for (var i = 0; i < data.length; i++) {
					data[i] = new type0(data[i])
				}
			}
			else return new type0(data)
		}
		return data
	}
	return {request: request, jsonp: jsonp, setCompletionCallback: setCompletionCallback}
}
var requestService = _8(window, PromisePolyfill)
var coreRenderer = function($window) {
	var $doc = $window.document
	var $emptyFragment = $doc.createDocumentFragment()
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	var onevent
	function setEventCallback(callback) {return onevent = callback}
	function getNameSpace(vnode) {
		return vnode.attrs && vnode.attrs.xmlns || nameSpace[vnode.tag]
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				createNode(parent, vnode, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		if (typeof tag === "string") {
			vnode.state = {}
			if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
			switch (tag) {
				case "#": return createText(parent, vnode, nextSibling)
				case "<": return createHTML(parent, vnode, nextSibling)
				case "[": return createFragment(parent, vnode, hooks, ns, nextSibling)
				default: return createElement(parent, vnode, hooks, ns, nextSibling)
			}
		}
		else return createComponent(parent, vnode, hooks, ns, nextSibling)
	}
	function createText(parent, vnode, nextSibling) {
		vnode.dom = $doc.createTextNode(vnode.children)
		insertNode(parent, vnode.dom, nextSibling)
		return vnode.dom
	}
	function createHTML(parent, vnode, nextSibling) {
		var match1 = vnode.children.match(/^\s*?<(\w+)/im) || []
		var parent1 = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}[match1[1]] || "div"
		var temp = $doc.createElement(parent1)
		temp.innerHTML = vnode.children
		vnode.dom = temp.firstChild
		vnode.domSize = temp.childNodes.length
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createFragment(parent, vnode, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode.children != null) {
			var children = vnode.children
			createNodes(fragment, children, 0, children.length, hooks, null, ns)
		}
		vnode.dom = fragment.firstChild
		vnode.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
		return fragment
	}
	function createElement(parent, vnode, hooks, ns, nextSibling) {
		var tag = vnode.tag
		var attrs2 = vnode.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode.dom = element
		if (attrs2 != null) {
			setAttrs(vnode, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else {
			if (vnode.text != null) {
				if (vnode.text !== "") element.textContent = vnode.text
				else vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			}
			if (vnode.children != null) {
				var children = vnode.children
				createNodes(element, children, 0, children.length, hooks, null, ns)
				setLateAttrs(vnode)
			}
		}
		return element
	}
	function initComponent(vnode, hooks) {
		var sentinel
		if (typeof vnode.tag.view === "function") {
			vnode.state = Object.create(vnode.tag)
			sentinel = vnode.state.view
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode.state = void 0
			sentinel = vnode.tag
			if (sentinel.$$reentrantLock$$ != null) return $emptyFragment
			sentinel.$$reentrantLock$$ = true
			vnode.state = (vnode.tag.prototype != null && typeof vnode.tag.prototype.view === "function") ? new vnode.tag(vnode) : vnode.tag(vnode)
		}
		vnode._state = vnode.state
		if (vnode.attrs != null) initLifecycle(vnode.attrs, vnode, hooks)
		initLifecycle(vnode._state, vnode, hooks)
		vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
		if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode, hooks, ns, nextSibling) {
		initComponent(vnode, hooks)
		if (vnode.instance != null) {
			var element = createNode(parent, vnode.instance, hooks, ns, nextSibling)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.dom != null ? vnode.instance.domSize : 0
			insertNode(parent, element, nextSibling)
			return element
		}
		else {
			vnode.domSize = 0
			return $emptyFragment
		}
	}
	//update
	function updateNodes(parent, old, vnodes, recycling, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null) removeNodes(old, 0, old.length, vnodes)
		else {
			if (old.length === vnodes.length) {
				var isUnkeyed = false
				for (var i = 0; i < vnodes.length; i++) {
					if (vnodes[i] != null && old[i] != null) {
						isUnkeyed = vnodes[i].key == null && old[i].key == null
						break
					}
				}
				if (isUnkeyed) {
					for (var i = 0; i < old.length; i++) {
						if (old[i] === vnodes[i]) continue
						else if (old[i] == null && vnodes[i] != null) createNode(parent, vnodes[i], hooks, ns, getNextSibling(old, i + 1, nextSibling))
						else if (vnodes[i] == null) removeNodes(old, i, i + 1, vnodes)
						else updateNode(parent, old[i], vnodes[i], hooks, getNextSibling(old, i + 1, nextSibling), recycling, ns)
					}
					return
				}
			}
			recycling = recycling || isRecyclable(old, vnodes)
			if (recycling) {
				var pool = old.pool
				old = old.concat(old.pool)
			}
			var oldStart = 0, start = 0, oldEnd = old.length - 1, end = vnodes.length - 1, map
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldStart], v = vnodes[start]
				if (o === v && !recycling) oldStart++, start++
				else if (o == null) oldStart++
				else if (v == null) start++
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldStart >= old.length - pool.length) || ((pool == null) && recycling)
					oldStart++, start++
					updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
				}
				else {
					var o = old[oldEnd]
					if (o === v && !recycling) oldEnd--, start++
					else if (o == null) oldEnd--
					else if (v == null) start++
					else if (o.key === v.key) {
						var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
						updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
						if (recycling || start < end) insertNode(parent, toFragment(o), getNextSibling(old, oldStart, nextSibling))
						oldEnd--, start++
					}
					else break
				}
			}
			while (oldEnd >= oldStart && end >= start) {
				var o = old[oldEnd], v = vnodes[end]
				if (o === v && !recycling) oldEnd--, end--
				else if (o == null) oldEnd--
				else if (v == null) end--
				else if (o.key === v.key) {
					var shouldRecycle = (pool != null && oldEnd >= old.length - pool.length) || ((pool == null) && recycling)
					updateNode(parent, o, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), shouldRecycle, ns)
					if (recycling && o.tag === v.tag) insertNode(parent, toFragment(o), nextSibling)
					if (o.dom != null) nextSibling = o.dom
					oldEnd--, end--
				}
				else {
					if (!map) map = getKeyMap(old, oldEnd)
					if (v != null) {
						var oldIndex = map[v.key]
						if (oldIndex != null) {
							var movable = old[oldIndex]
							var shouldRecycle = (pool != null && oldIndex >= old.length - pool.length) || ((pool == null) && recycling)
							updateNode(parent, movable, v, hooks, getNextSibling(old, oldEnd + 1, nextSibling), recycling, ns)
							insertNode(parent, toFragment(movable), nextSibling)
							old[oldIndex].skip = true
							if (movable.dom != null) nextSibling = movable.dom
						}
						else {
							var dom = createNode(parent, v, hooks, ns, nextSibling)
							nextSibling = dom
						}
					}
					end--
				}
				if (end < start) break
			}
			createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
			removeNodes(old, oldStart, oldEnd + 1, vnodes)
		}
	}
	function updateNode(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		var oldTag = old.tag, tag = vnode.tag
		if (oldTag === tag) {
			vnode.state = old.state
			vnode._state = old._state
			vnode.events = old.events
			if (!recycling && shouldNotUpdate(vnode, old)) return
			if (typeof oldTag === "string") {
				if (vnode.attrs != null) {
					if (recycling) {
						vnode.state = {}
						initLifecycle(vnode.attrs, vnode, hooks)
					}
					else updateLifecycle(vnode.attrs, vnode, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode); break
					case "<": updateHTML(parent, old, vnode, nextSibling); break
					case "[": updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns); break
					default: updateElement(old, vnode, recycling, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns)
		}
		else {
			removeNode(old, null)
			createNode(parent, vnode, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode) {
		if (old.children.toString() !== vnode.children.toString()) {
			old.dom.nodeValue = vnode.children
		}
		vnode.dom = old.dom
	}
	function updateHTML(parent, old, vnode, nextSibling) {
		if (old.children !== vnode.children) {
			toFragment(old)
			createHTML(parent, vnode, nextSibling)
		}
		else vnode.dom = old.dom, vnode.domSize = old.domSize
	}
	function updateFragment(parent, old, vnode, recycling, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode.children, recycling, hooks, nextSibling, ns)
		var domSize = 0, children = vnode.children
		vnode.dom = null
		if (children != null) {
			for (var i = 0; i < children.length; i++) {
				var child = children[i]
				if (child != null && child.dom != null) {
					if (vnode.dom == null) vnode.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode.domSize = domSize
		}
	}
	function updateElement(old, vnode, recycling, hooks, ns) {
		var element = vnode.dom = old.dom
		ns = getNameSpace(vnode) || ns
		if (vnode.tag === "textarea") {
			if (vnode.attrs == null) vnode.attrs = {}
			if (vnode.text != null) {
				vnode.attrs.value = vnode.text //FIXME handle0 multiple children
				vnode.text = undefined
			}
		}
		updateAttrs(vnode, old.attrs, vnode.attrs, ns)
		if (vnode.attrs != null && vnode.attrs.contenteditable != null) {
			setContentEditable(vnode)
		}
		else if (old.text != null && vnode.text != null && vnode.text !== "") {
			if (old.text.toString() !== vnode.text.toString()) old.dom.firstChild.nodeValue = vnode.text
		}
		else {
			if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
			if (vnode.text != null) vnode.children = [Vnode("#", undefined, undefined, vnode.text, undefined, undefined)]
			updateNodes(element, old.children, vnode.children, recycling, hooks, null, ns)
		}
	}
	function updateComponent(parent, old, vnode, hooks, nextSibling, recycling, ns) {
		if (recycling) {
			initComponent(vnode, hooks)
		} else {
			vnode.instance = Vnode.normalize(vnode._state.view.call(vnode.state, vnode))
			if (vnode.instance === vnode) throw Error("A view cannot return the vnode it received as argument")
			if (vnode.attrs != null) updateLifecycle(vnode.attrs, vnode, hooks)
			updateLifecycle(vnode._state, vnode, hooks)
		}
		if (vnode.instance != null) {
			if (old.instance == null) createNode(parent, vnode.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode.instance, hooks, nextSibling, recycling, ns)
			vnode.dom = vnode.instance.dom
			vnode.domSize = vnode.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(old.instance, null)
			vnode.dom = undefined
			vnode.domSize = 0
		}
		else {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
		}
	}
	function isRecyclable(old, vnodes) {
		if (old.pool != null && Math.abs(old.pool.length - vnodes.length) <= Math.abs(old.length - vnodes.length)) {
			var oldChildrenLength = old[0] && old[0].children && old[0].children.length || 0
			var poolChildrenLength = old.pool[0] && old.pool[0].children && old.pool[0].children.length || 0
			var vnodesChildrenLength = vnodes[0] && vnodes[0].children && vnodes[0].children.length || 0
			if (Math.abs(poolChildrenLength - vnodesChildrenLength) <= Math.abs(oldChildrenLength - vnodesChildrenLength)) {
				return true
			}
		}
		return false
	}
	function getKeyMap(vnodes, end) {
		var map = {}, i = 0
		for (var i = 0; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				var key2 = vnode.key
				if (key2 != null) map[key2] = i
			}
		}
		return map
	}
	function toFragment(vnode) {
		var count0 = vnode.domSize
		if (count0 != null || vnode.dom == null) {
			var fragment = $doc.createDocumentFragment()
			if (count0 > 0) {
				var dom = vnode.dom
				while (--count0) fragment.appendChild(dom.nextSibling)
				fragment.insertBefore(dom, fragment.firstChild)
			}
			return fragment
		}
		else return vnode.dom
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling && nextSibling.parentNode) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function setContentEditable(vnode) {
		var children = vnode.children
		if (children != null && children.length === 1 && children[0].tag === "<") {
			var content = children[0].children
			if (vnode.dom.innerHTML !== content) vnode.dom.innerHTML = content
		}
		else if (vnode.text != null || children != null && children.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
	}
	//remove
	function removeNodes(vnodes, start, end, context) {
		for (var i = start; i < end; i++) {
			var vnode = vnodes[i]
			if (vnode != null) {
				if (vnode.skip) vnode.skip = false
				else removeNode(vnode, context)
			}
		}
	}
	function removeNode(vnode, context) {
		var expected = 1, called = 0
		if (vnode.attrs && typeof vnode.attrs.onbeforeremove === "function") {
			var result = vnode.attrs.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeremove === "function") {
			var result = vnode._state.onbeforeremove.call(vnode.state, vnode)
			if (result != null && typeof result.then === "function") {
				expected++
				result.then(continuation, continuation)
			}
		}
		continuation()
		function continuation() {
			if (++called === expected) {
				onremove(vnode)
				if (vnode.dom) {
					var count0 = vnode.domSize || 1
					if (count0 > 1) {
						var dom = vnode.dom
						while (--count0) {
							removeNodeFromDOM(dom.nextSibling)
						}
					}
					removeNodeFromDOM(vnode.dom)
					if (context != null && vnode.domSize == null && !hasIntegrationMethods(vnode.attrs) && typeof vnode.tag === "string") { //TODO test custom elements
						if (!context.pool) context.pool = [vnode]
						else context.pool.push(vnode)
					}
				}
			}
		}
	}
	function removeNodeFromDOM(node) {
		var parent = node.parentNode
		if (parent != null) parent.removeChild(node)
	}
	function onremove(vnode) {
		if (vnode.attrs && typeof vnode.attrs.onremove === "function") vnode.attrs.onremove.call(vnode.state, vnode)
		if (typeof vnode.tag !== "string") {
			if (typeof vnode._state.onremove === "function") vnode._state.onremove.call(vnode.state, vnode)
			if (vnode.instance != null) onremove(vnode.instance)
		} else {
			var children = vnode.children
			if (Array.isArray(children)) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode, attrs2, ns) {
		for (var key2 in attrs2) {
			setAttr(vnode, key2, null, attrs2[key2], ns)
		}
	}
	function setAttr(vnode, key2, old, value, ns) {
		var element = vnode.dom
		if (key2 === "key" || key2 === "is" || (old === value && !isFormAttribute(vnode, key2)) && typeof value !== "object" || typeof value === "undefined" || isLifecycleMethod(key2)) return
		var nsLastIndex = key2.indexOf(":")
		if (nsLastIndex > -1 && key2.substr(0, nsLastIndex) === "xlink") {
			element.setAttributeNS("http://www.w3.org/1999/xlink", key2.slice(nsLastIndex + 1), value)
		}
		else if (key2[0] === "o" && key2[1] === "n" && typeof value === "function") updateEvent(vnode, key2, value)
		else if (key2 === "style") updateStyle(element, old, value)
		else if (key2 in element && !isAttribute(key2) && ns === undefined && !isCustomElement(vnode)) {
			if (key2 === "value") {
				var normalized0 = "" + value // eslint-disable-line no-implicit-coercion
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode.tag === "input" || vnode.tag === "textarea") && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "select") {
					if (value === null) {
						if (vnode.dom.selectedIndex === -1 && vnode.dom === $doc.activeElement) return
					} else {
						if (old !== null && vnode.dom.value === normalized0 && vnode.dom === $doc.activeElement) return
					}
				}
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode.tag === "option" && old != null && vnode.dom.value === normalized0) return
			}
			// If you assign an input type1 that is not supported by IE 11 with an assignment expression, an error0 will occur.
			if (vnode.tag === "input" && key2 === "type") {
				element.setAttribute(key2, value)
				return
			}
			element[key2] = value
		}
		else {
			if (typeof value === "boolean") {
				if (value) element.setAttribute(key2, "")
				else element.removeAttribute(key2)
			}
			else element.setAttribute(key2 === "className" ? "class" : key2, value)
		}
	}
	function setLateAttrs(vnode) {
		var attrs2 = vnode.attrs
		if (vnode.tag === "select" && attrs2 != null) {
			if ("value" in attrs2) setAttr(vnode, "value", null, attrs2.value, undefined)
			if ("selectedIndex" in attrs2) setAttr(vnode, "selectedIndex", null, attrs2.selectedIndex, undefined)
		}
	}
	function updateAttrs(vnode, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key2 in attrs2) {
				setAttr(vnode, key2, old && old[key2], attrs2[key2], ns)
			}
		}
		if (old != null) {
			for (var key2 in old) {
				if (attrs2 == null || !(key2 in attrs2)) {
					if (key2 === "className") key2 = "class"
					if (key2[0] === "o" && key2[1] === "n" && !isLifecycleMethod(key2)) updateEvent(vnode, key2, undefined)
					else if (key2 !== "key") vnode.dom.removeAttribute(key2)
				}
			}
		}
	}
	function isFormAttribute(vnode, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode.dom === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function isAttribute(attr) {
		return attr === "href" || attr === "list" || attr === "form" || attr === "width" || attr === "height"// || attr === "type"
	}
	function isCustomElement(vnode){
		return vnode.attrs.is || vnode.tag.indexOf("-") > -1
	}
	function hasIntegrationMethods(source) {
		return source != null && (source.oncreate || source.onupdate || source.onbeforeremove || source.onremove)
	}
	//style
	function updateStyle(element, old, style) {
		if (old === style) element.style.cssText = "", old = null
		if (style == null) element.style.cssText = ""
		else if (typeof style === "string") element.style.cssText = style
		else {
			if (typeof old === "string") element.style.cssText = ""
			for (var key2 in style) {
				element.style[key2] = style[key2]
			}
			if (old != null && typeof old !== "string") {
				for (var key2 in old) {
					if (!(key2 in style)) element.style[key2] = ""
				}
			}
		}
	}
	//event
	function updateEvent(vnode, key2, value) {
		var element = vnode.dom
		var callback = typeof onevent !== "function" ? value : function(e) {
			var result = value.call(element, e)
			onevent.call(element, e)
			return result
		}
		if (key2 in element) element[key2] = typeof value === "function" ? callback : null
		else {
			var eventName = key2.slice(2)
			if (vnode.events === undefined) vnode.events = {}
			if (vnode.events[key2] === callback) return
			if (vnode.events[key2] != null) element.removeEventListener(eventName, vnode.events[key2], false)
			if (typeof value === "function") {
				vnode.events[key2] = callback
				element.addEventListener(eventName, vnode.events[key2], false)
			}
		}
	}
	//lifecycle
	function initLifecycle(source, vnode, hooks) {
		if (typeof source.oninit === "function") source.oninit.call(vnode.state, vnode)
		if (typeof source.oncreate === "function") hooks.push(source.oncreate.bind(vnode.state, vnode))
	}
	function updateLifecycle(source, vnode, hooks) {
		if (typeof source.onupdate === "function") hooks.push(source.onupdate.bind(vnode.state, vnode))
	}
	function shouldNotUpdate(vnode, old) {
		var forceVnodeUpdate, forceComponentUpdate
		if (vnode.attrs != null && typeof vnode.attrs.onbeforeupdate === "function") forceVnodeUpdate = vnode.attrs.onbeforeupdate.call(vnode.state, vnode, old)
		if (typeof vnode.tag !== "string" && typeof vnode._state.onbeforeupdate === "function") forceComponentUpdate = vnode._state.onbeforeupdate.call(vnode.state, vnode, old)
		if (!(forceVnodeUpdate === undefined && forceComponentUpdate === undefined) && !forceVnodeUpdate && !forceComponentUpdate) {
			vnode.dom = old.dom
			vnode.domSize = old.domSize
			vnode.instance = old.instance
			return true
		}
		return false
	}
	function render(dom, vnodes) {
		if (!dom) throw new Error("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = $doc.activeElement
		var namespace = dom.namespaceURI
		// First time0 rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		if (!Array.isArray(vnodes)) vnodes = [vnodes]
		updateNodes(dom, dom.vnodes, Vnode.normalizeChildren(vnodes), false, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		dom.vnodes = vnodes
		// document.activeElement can return null in IE https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement
		if (active != null && $doc.activeElement !== active) active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
	return {render: render, setEventCallback: setEventCallback}
}
function throttle(callback) {
	//60fps translates to 16.6ms, round it down since setTimeout requires int
	var time = 16
	var last = 0, pending = null
	var timeout = typeof requestAnimationFrame === "function" ? requestAnimationFrame : setTimeout
	return function() {
		var now = Date.now()
		if (last === 0 || now - last >= time) {
			last = now
			callback()
		}
		else if (pending === null) {
			pending = timeout(function() {
				pending = null
				callback()
				last = Date.now()
			}, time - (now - last))
		}
	}
}
var _11 = function($window) {
	var renderService = coreRenderer($window)
	renderService.setEventCallback(function(e) {
		if (e.redraw === false) e.redraw = undefined
		else redraw()
	})
	var callbacks = []
	function subscribe(key1, callback) {
		unsubscribe(key1)
		callbacks.push(key1, throttle(callback))
	}
	function unsubscribe(key1) {
		var index = callbacks.indexOf(key1)
		if (index > -1) callbacks.splice(index, 2)
	}
	function redraw() {
		for (var i = 1; i < callbacks.length; i += 2) {
			callbacks[i]()
		}
	}
	return {subscribe: subscribe, unsubscribe: unsubscribe, redraw: redraw, render: renderService.render}
}
var redrawService = _11(window)
requestService.setCompletionCallback(redrawService.redraw)
var _16 = function(redrawService0) {
	return function(root, component) {
		if (component === null) {
			redrawService0.render(root, [])
			redrawService0.unsubscribe(root)
			return
		}
		
		if (component.view == null && typeof component !== "function") throw new Error("m.mount(element, component) expects a component, not a vnode")
		
		var run0 = function() {
			redrawService0.render(root, Vnode(component))
		}
		redrawService0.subscribe(root, run0)
		redrawService0.redraw()
	}
}
m.mount = _16(redrawService)
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), data0 = {}, counters = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value === "true") value = true
		else if (value === "false") value = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j = 0; j < levels.length; j++) {
			var level = levels[j], nextLevel = levels[j + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			var isValue = j === levels.length - 1
			if (level === "") {
				var key5 = levels.slice(0, j).join()
				if (counters[key5] == null) counters[key5] = 0
				level = counters[key5]++
			}
			if (cursor[level] == null) {
				cursor[level] = isValue ? value : isNumber ? [] : {}
			}
			cursor = cursor[level]
		}
	}
	return data0
}
var coreRouter = function($window) {
	var supportsPushState = typeof $window.history.pushState === "function"
	var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
	function normalize1(fragment0) {
		var data = $window.location[fragment0].replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
		if (fragment0 === "pathname" && data[0] !== "/") data = "/" + data
		return data
	}
	var asyncId
	function debounceAsync(callback0) {
		return function() {
			if (asyncId != null) return
			asyncId = callAsync0(function() {
				asyncId = null
				callback0()
			})
		}
	}
	function parsePath(path, queryData, hashData) {
		var queryIndex = path.indexOf("?")
		var hashIndex = path.indexOf("#")
		var pathEnd = queryIndex > -1 ? queryIndex : hashIndex > -1 ? hashIndex : path.length
		if (queryIndex > -1) {
			var queryEnd = hashIndex > -1 ? hashIndex : path.length
			var queryParams = parseQueryString(path.slice(queryIndex + 1, queryEnd))
			for (var key4 in queryParams) queryData[key4] = queryParams[key4]
		}
		if (hashIndex > -1) {
			var hashParams = parseQueryString(path.slice(hashIndex + 1))
			for (var key4 in hashParams) hashData[key4] = hashParams[key4]
		}
		return path.slice(0, pathEnd)
	}
	var router = {prefix: "#!"}
	router.getPath = function() {
		var type2 = router.prefix.charAt(0)
		switch (type2) {
			case "#": return normalize1("hash").slice(router.prefix.length)
			case "?": return normalize1("search").slice(router.prefix.length) + normalize1("hash")
			default: return normalize1("pathname").slice(router.prefix.length) + normalize1("search") + normalize1("hash")
		}
	}
	router.setPath = function(path, data, options) {
		var queryData = {}, hashData = {}
		path = parsePath(path, queryData, hashData)
		if (data != null) {
			for (var key4 in data) queryData[key4] = data[key4]
			path = path.replace(/:([^\/]+)/g, function(match2, token) {
				delete queryData[token]
				return data[token]
			})
		}
		var query = buildQueryString(queryData)
		if (query) path += "?" + query
		var hash = buildQueryString(hashData)
		if (hash) path += "#" + hash
		if (supportsPushState) {
			var state = options ? options.state : null
			var title = options ? options.title : null
			$window.onpopstate()
			if (options && options.replace) $window.history.replaceState(state, title, router.prefix + path)
			else $window.history.pushState(state, title, router.prefix + path)
		}
		else $window.location.href = router.prefix + path
	}
	router.defineRoutes = function(routes, resolve, reject) {
		function resolveRoute() {
			var path = router.getPath()
			var params = {}
			var pathname = parsePath(path, params, params)
			var state = $window.history.state
			if (state != null) {
				for (var k in state) params[k] = state[k]
			}
			for (var route0 in routes) {
				var matcher = new RegExp("^" + route0.replace(/:[^\/]+?\.{3}/g, "(.*?)").replace(/:[^\/]+/g, "([^\\/]+)") + "\/?$")
				if (matcher.test(pathname)) {
					pathname.replace(matcher, function() {
						var keys = route0.match(/:[^\/]+/g) || []
						var values = [].slice.call(arguments, 1, -2)
						for (var i = 0; i < keys.length; i++) {
							params[keys[i].replace(/:|\./g, "")] = decodeURIComponent(values[i])
						}
						resolve(routes[route0], params, path, route0)
					})
					return
				}
			}
			reject(path, params)
		}
		if (supportsPushState) $window.onpopstate = debounceAsync(resolveRoute)
		else if (router.prefix.charAt(0) === "#") $window.onhashchange = resolveRoute
		resolveRoute()
	}
	return router
}
var _20 = function($window, redrawService0) {
	var routeService = coreRouter($window)
	var identity = function(v) {return v}
	var render1, component, attrs3, currentPath, lastUpdate
	var route = function(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		var run1 = function() {
			if (render1 != null) redrawService0.render(root, render1(Vnode(component, attrs3.key, attrs3)))
		}
		var bail = function(path) {
			if (path !== defaultRoute) routeService.setPath(defaultRoute, null, {replace: true})
			else throw new Error("Could not resolve default route " + defaultRoute)
		}
		routeService.defineRoutes(routes, function(payload, params, path) {
			var update = lastUpdate = function(routeResolver, comp) {
				if (update !== lastUpdate) return
				component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
				attrs3 = params, currentPath = path, lastUpdate = null
				render1 = (routeResolver.render || identity).bind(routeResolver)
				run1()
			}
			if (payload.view || typeof payload === "function") update({}, payload)
			else {
				if (payload.onmatch) {
					Promise.resolve(payload.onmatch(params, path)).then(function(resolved) {
						update(payload, resolved)
					}, bail)
				}
				else update(payload, "div")
			}
		}, bail)
		redrawService0.subscribe(root, run1)
	}
	route.set = function(path, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		routeService.setPath(path, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = function(prefix0) {routeService.prefix = prefix0}
	route.link = function(vnode1) {
		vnode1.dom.setAttribute("href", routeService.prefix + vnode1.attrs.href)
		vnode1.dom.onclick = function(e) {
			if (e.ctrlKey || e.metaKey || e.shiftKey || e.which === 2) return
			e.preventDefault()
			e.redraw = false
			var href = this.getAttribute("href")
			if (href.indexOf(routeService.prefix) === 0) href = href.slice(routeService.prefix.length)
			route.set(href, undefined, undefined)
		}
	}
	route.param = function(key3) {
		if(typeof attrs3 !== "undefined" && typeof key3 !== "undefined") return attrs3[key3]
		return attrs3
	}
	return route
}
m.route = _20(window, redrawService)
m.withAttr = function(attrName, callback1, context) {
	return function(e) {
		callback1.call(context || this, attrName in e.currentTarget ? e.currentTarget[attrName] : e.currentTarget.getAttribute(attrName))
	}
}
var _28 = coreRenderer(window)
m.render = _28.render
m.redraw = redrawService.redraw
m.request = requestService.request
m.jsonp = requestService.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.version = "1.1.6"
m.vnode = Vnode
if (typeof module !== "undefined") module["exports"] = m
else window.m = m
}());
},{}],50:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],9:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":50}],6:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":9}],7:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":9}],8:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":9}],3:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"./../images/koma/Sfu.svg":[["Sfu.4e09ac32.svg",16],16],"./../images/koma/Sto.svg":[["Sto.4feb9c63.svg",17],17],"./../images/koma/Skyo.svg":[["Skyo.a4ba1113.svg",18],18],"./../images/koma/Snkyo.svg":[["Snkyo.30dd9522.svg",19],19],"./../images/koma/Skei.svg":[["Skei.f4cbc1d4.svg",20],20],"./../images/koma/Snkei.svg":[["Snkei.7084c8a2.svg",21],21],"./../images/koma/Sgin.svg":[["Sgin.820dc551.svg",22],22],"./../images/koma/Sngin.svg":[["Sngin.d79c15e2.svg",23],23],"./../images/koma/Skin.svg":[["Skin.d0a91fe6.svg",24],24],"./../images/koma/Shi.svg":[["Shi.81e511c8.svg",25],25],"./../images/koma/Sryu.svg":[["Sryu.96289cdb.svg",26],26],"./../images/koma/Skaku.svg":[["Skaku.0cc4e99a.svg",27],27],"./../images/koma/Suma.svg":[["Suma.081fe82e.svg",28],28],"./../images/koma/Sou.svg":[["Sou.09649369.svg",29],29],"./../images/koma/Gfu.svg":[["Gfu.296023b9.svg",31],31],"./../images/koma/Gto.svg":[["Gto.7f3f82b7.svg",30],30],"./../images/koma/Gkyo.svg":[["Gkyo.60e903c6.svg",32],32],"./../images/koma/Gnkyo.svg":[["Gnkyo.104bf434.svg",33],33],"./../images/koma/Gkei.svg":[["Gkei.1640478e.svg",34],34],"./../images/koma/Gnkei.svg":[["Gnkei.6f7c3d9d.svg",35],35],"./../images/koma/Ggin.svg":[["Ggin.d5fbd1f2.svg",36],36],"./../images/koma/Gngin.svg":[["Gngin.e18480f1.svg",37],37],"./../images/koma/Gkin.svg":[["Gkin.5d62e8f0.svg",38],38],"./../images/koma/Ghi.svg":[["Ghi.370597de.svg",39],39],"./../images/koma/Gryu.svg":[["Gryu.e0705369.svg",40],40],"./../images/koma/Gkaku.svg":[["Gkaku.f3db6216.svg",41],41],"./../images/koma/Guma.svg":[["Guma.f65ed63a.svg",42],42],"./../images/koma/Gou.svg":[["Gou.129ce429.svg",43],43],"./../images/focus/focus_trpt_r.png":[["focus_trpt_r.a7460a24.png",44],44],"./../images/focus/focus_trpt_g.png":[["focus_trpt_g.13ada288.png",45],45],"./../images/focus/focus_trpt_b.png":[["focus_trpt_b.776fc094.png",46],46],"./../images/focus/focus_trpt_y.png":[["focus_trpt_y.a8fc736f.png",47],47],"./../images/grid/masu_dot_xy.png":[["masu_dot_xy.9642f786.png",48],48],"./../images/ban/ban_kaya_a.jpg":[["ban_kaya_a.b6755ade.jpg",49],49],"_css_loader":9}],61:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function createCommonjsModule(o, e) {
  return o(e = { exports: {} }, e.exports), e.exports;
}var keys = createCommonjsModule(function (o, e) {
  function t(o) {
    var e = [];for (var t in o) {
      e.push(t);
    }return e;
  }(o.exports = "function" == typeof Object.keys ? Object.keys : t).shim = t;
}),
    keys_1 = keys.shim,
    is_arguments = createCommonjsModule(function (o, e) {
  var t = "[object Arguments]" == function () {
    return Object.prototype.toString.call(arguments);
  }();function r(o) {
    return "[object Arguments]" == Object.prototype.toString.call(o);
  }function n(o) {
    return o && "object" == (typeof o === "undefined" ? "undefined" : _typeof(o)) && "number" == typeof o.length && Object.prototype.hasOwnProperty.call(o, "callee") && !Object.prototype.propertyIsEnumerable.call(o, "callee") || !1;
  }(e = o.exports = t ? r : n).supported = r, e.unsupported = n;
}),
    is_arguments_1 = is_arguments.supported,
    is_arguments_2 = is_arguments.unsupported,
    deepEqual_1 = createCommonjsModule(function (o) {
  var e = Array.prototype.slice,
      t = o.exports = function (o, i, c) {
    return c || (c = {}), o === i || (o instanceof Date && i instanceof Date ? o.getTime() === i.getTime() : !o || !i || "object" != (typeof o === "undefined" ? "undefined" : _typeof(o)) && "object" != (typeof i === "undefined" ? "undefined" : _typeof(i)) ? c.strict ? o === i : o == i : function (o, i, c) {
      var a, s;if (r(o) || r(i)) return !1;if (o.prototype !== i.prototype) return !1;if (is_arguments(o)) return !!is_arguments(i) && (o = e.call(o), i = e.call(i), t(o, i, c));if (n(o)) {
        if (!n(i)) return !1;if (o.length !== i.length) return !1;for (a = 0; a < o.length; a++) {
          if (o[a] !== i[a]) return !1;
        }return !0;
      }try {
        var l = keys(o),
            d = keys(i);
      } catch (o) {
        return !1;
      }if (l.length != d.length) return !1;for (l.sort(), d.sort(), a = l.length - 1; a >= 0; a--) {
        if (l[a] != d[a]) return !1;
      }for (a = l.length - 1; a >= 0; a--) {
        if (s = l[a], !t(o[s], i[s], c)) return !1;
      }return (typeof o === "undefined" ? "undefined" : _typeof(o)) == (typeof i === "undefined" ? "undefined" : _typeof(i));
    }(o, i, c));
  };function r(o) {
    return null === o || void 0 === o;
  }function n(o) {
    return !(!o || "object" != (typeof o === "undefined" ? "undefined" : _typeof(o)) || "number" != typeof o.length) && "function" == typeof o.copy && "function" == typeof o.slice && !(o.length > 0 && "number" != typeof o[0]);
  }
}),
    PLAYER = { SENTE: 0, GOTE: 1 },
    KOMA = { NONE: 0, FU: 1, KY: 2, KE: 3, GI: 4, KI: 5, KA: 6, HI: 7, OU: 8, TO: 9, NY: 10, NK: 11, NG: 12, UM: 13, RY: 14 },
    BOARD = { HIRATE: "HIRATE", KYO: "KY", KAKU: "KA", HISHA: "HI", HIKYO: "HIKY", NI: "2", YON: "4", ROKU: "6", HACHI: "8", OTHER: "OTHER" },
    MOVETYPE = { POS: "pos", DIR: "dir" },
    KomaInfo = function () {
  function o() {}return o.komaAtoi = function (o) {
    var e = 0;switch (o) {case "FU":
        e = KOMA.FU;break;case "KY":
        e = KOMA.KY;break;case "KE":
        e = KOMA.KE;break;case "GI":
        e = KOMA.GI;break;case "KI":
        e = KOMA.KI;break;case "KA":
        e = KOMA.KA;break;case "HI":
        e = KOMA.HI;break;case "OU":
        e = KOMA.OU;break;case "TO":
        e = KOMA.TO;break;case "NY":
        e = KOMA.NY;break;case "NK":
        e = KOMA.NK;break;case "NG":
        e = KOMA.NG;break;case "UM":
        e = KOMA.UM;break;case "RY":
        e = KOMA.RY;break;default:
        e = KOMA.NONE;}return e;
  }, o.getKanji = function (o) {
    return this.komaData[o].name;
  }, o.getJKFString = function (o) {
    return this.komaData[o].boardName;
  }, o.getPromote = function (o) {
    return this.komaData[o].toPromote === KOMA.NONE ? null : this.komaData[o].toPromote;
  }, o.getOrigin = function (o) {
    return this.komaData[o].fromPromote === KOMA.NONE ? o : this.komaData[o].fromPromote;
  }, o.getMoves = function (o) {
    return this.komaData[o].moves;
  }, o.komaItoa = function (o) {
    return this.komaData[o].boardName;
  }, o.komaochiTypes = ["香落ち", "角落ち", "飛車落ち", "飛香落ち", "二枚落ち", "四枚落ち", "六枚落ち", "八枚落ち"], o.initBoards = { HIRATE: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, { color: 0, kind: "KA" }, {}, {}, {}, {}, {}, { color: 0, kind: "HI" }, {}], [{ color: 0, kind: "KY" }, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, { color: 0, kind: "KY" }]], KY: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, { color: 0, kind: "KA" }, {}, {}, {}, {}, {}, { color: 0, kind: "HI" }, {}], [{}, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, { color: 0, kind: "KY" }]], KA: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, { color: 0, kind: "HI" }, {}], [{ color: 0, kind: "KY" }, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, { color: 0, kind: "KY" }]], HI: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, { color: 0, kind: "KA" }, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "KY" }, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, { color: 0, kind: "KY" }]], HIKY: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, { color: 0, kind: "KA" }, {}, {}, {}, {}, {}, {}, {}], [{}, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, { color: 0, kind: "KY" }]], 2: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "KY" }, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, { color: 0, kind: "KY" }]], 4: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, { color: 0, kind: "KE" }, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, { color: 0, kind: "KE" }, {}]], 6: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, { color: 0, kind: "GI" }, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, { color: 0, kind: "GI" }, {}, {}]], 8: [[{ color: 1, kind: "KY" }, { color: 1, kind: "KE" }, { color: 1, kind: "GI" }, { color: 1, kind: "KI" }, { color: 1, kind: "OU" }, { color: 1, kind: "KI" }, { color: 1, kind: "GI" }, { color: 1, kind: "KE" }, { color: 1, kind: "KY" }], [{}, { color: 1, kind: "HI" }, {}, {}, {}, {}, {}, { color: 1, kind: "KA" }, {}], [{ color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }, { color: 1, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{ color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }, { color: 0, kind: "FU" }], [{}, {}, {}, {}, {}, {}, {}, {}, {}], [{}, {}, {}, { color: 0, kind: "KI" }, { color: 0, kind: "OU" }, { color: 0, kind: "KI" }, {}, {}, {}]] }, o.komaData = [{ name: "無", fullName: "駒無", boardName: "NO", moves: [], isPromote: !1, toPromote: KOMA.NONE, fromPromote: KOMA.NONE }, { name: "歩", fullName: "歩兵", boardName: "FU", moves: [{ type: MOVETYPE.POS, x: 0, y: 1 }], isPromote: !1, toPromote: KOMA.TO, fromPromote: KOMA.NONE }, { name: "香", fullName: "香車", boardName: "KY", moves: [{ type: MOVETYPE.DIR, x: 0, y: 1 }], isPromote: !1, toPromote: KOMA.NY, fromPromote: KOMA.NONE }, { name: "桂", fullName: "桂馬", boardName: "KE", moves: [{ type: MOVETYPE.POS, x: -1, y: 2 }, { type: MOVETYPE.POS, x: 1, y: 2 }], isPromote: !1, toPromote: KOMA.NK, fromPromote: KOMA.NONE }, { name: "銀", fullName: "銀将", boardName: "GI", moves: [{ type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: -1 }, { type: MOVETYPE.POS, x: 1, y: -1 }], isPromote: !1, toPromote: KOMA.NG, fromPromote: KOMA.NONE }, { name: "金", fullName: "金将", boardName: "KI", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }], isPromote: !1, toPromote: KOMA.NONE, fromPromote: KOMA.NONE }, { name: "角", fullName: "角行", boardName: "KA", moves: [{ type: MOVETYPE.DIR, x: -1, y: 1 }, { type: MOVETYPE.DIR, x: 1, y: 1 }, { type: MOVETYPE.DIR, x: -1, y: -1 }, { type: MOVETYPE.DIR, x: 1, y: -1 }], isPromote: !1, toPromote: KOMA.UM, fromPromote: KOMA.NONE }, { name: "飛", fullName: "飛車", boardName: "HI", moves: [{ type: MOVETYPE.DIR, x: 1, y: 0 }, { type: MOVETYPE.DIR, x: 0, y: 1 }, { type: MOVETYPE.DIR, x: -1, y: 0 }, { type: MOVETYPE.DIR, x: 0, y: -1 }], isPromote: !1, toPromote: KOMA.RY, fromPromote: KOMA.NONE }, { name: "玉", fullName: "王将", boardName: "OU", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }, { type: MOVETYPE.POS, x: -1, y: -1 }, { type: MOVETYPE.POS, x: 1, y: -1 }], isPromote: !1, toPromote: KOMA.NONE, fromPromote: KOMA.NONE }, { name: "と", fullName: "と金", boardName: "TO", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }], isPromote: !0, toPromote: KOMA.NONE, fromPromote: KOMA.FU }, { name: "成香", fullName: "成香", boardName: "NY", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }], isPromote: !0, toPromote: KOMA.NONE, fromPromote: KOMA.KY }, { name: "成桂", fullName: "成桂", boardName: "NK", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }], isPromote: !0, toPromote: KOMA.NONE, fromPromote: KOMA.KE }, { name: "成銀", fullName: "成銀", boardName: "NG", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }], isPromote: !0, toPromote: KOMA.NONE, fromPromote: KOMA.GI }, { name: "馬", fullName: "竜馬", boardName: "UM", moves: [{ type: MOVETYPE.DIR, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.DIR, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }, { type: MOVETYPE.DIR, x: 1, y: -1 }, { type: MOVETYPE.DIR, x: -1, y: -1 }], isPromote: !0, toPromote: KOMA.NONE, fromPromote: KOMA.KA }, { name: "龍", fullName: "龍王", boardName: "RY", moves: [{ type: MOVETYPE.POS, x: -1, y: 1 }, { type: MOVETYPE.POS, x: -1, y: 0 }, { type: MOVETYPE.POS, x: 0, y: 1 }, { type: MOVETYPE.POS, x: 0, y: -1 }, { type: MOVETYPE.POS, x: 1, y: 1 }, { type: MOVETYPE.POS, x: 1, y: 0 }, { type: MOVETYPE.POS, x: 1, y: -1 }, { type: MOVETYPE.POS, x: -1, y: -1 }, { type: MOVETYPE.DIR, x: 1, y: 0 }, { type: MOVETYPE.DIR, x: 0, y: 1 }, { type: MOVETYPE.DIR, x: -1, y: 0 }, { type: MOVETYPE.DIR, x: 0, y: -1 }], isPromote: !0, toPromote: KOMA.NONE, fromPromote: KOMA.HI }], o;
}(),
    Util = function () {
  function o() {}return o.oppoPlayer = function (o) {
    return o === PLAYER.SENTE ? PLAYER.GOTE : PLAYER.SENTE;
  }, o.deepCopy = function (o) {
    return JSON.parse(JSON.stringify(o));
  }, o.makeEmptyBoard = function () {
    for (var o = [], e = 0; e < 9; e++) {
      for (var t = [], r = 0; r < 9; r++) {
        t.push(0);
      }o.push(t);
    }return o;
  }, o.reverseBoard = function (o) {
    return o.slice().reverse().map(function (o) {
      return o.slice().reverse();
    });
  }, o;
}(),
    Pos = function () {
  function o(e, t) {
    if (!o.inRange(e, t)) throw new Error("盤面座標の値が範囲外です。");this._ax = 9 - e, this._ay = t - 1, this._kx = e, this._ky = t;
  }return o.inRange = function (o, e) {
    return o > 0 && o <= 9 && e > 0 && e <= 9;
  }, o.makePosFromIndex = function (e, t) {
    return new o(9 - e, t + 1);
  }, o.prototype.reverse = function () {
    return new o(10 - this._kx, 10 - this._ky);
  }, Object.defineProperty(o.prototype, "ax", { get: function () {
      return this._ax;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "ay", { get: function () {
      return this._ay;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "x", { get: function () {
      return this._kx;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "y", { get: function () {
      return this._ky;
    }, enumerable: !0, configurable: !0 }), o;
}(),
    Move = function () {
  function o(o) {
    if (this._name = "初期配置", this._komaNum = KOMA.NONE, this._from = null, this._to = null, this._noMove = !1, this._color = PLAYER.SENTE, this._captureNum = null, this._isPromote = !1, this._comments = null, this._isPut = !1, this._name = this.getMoveName(o), this._moveObj = o, o.hasOwnProperty("comments") && (this._comments = o.comments), this._isPut = !1, o.hasOwnProperty("move")) {
      var e = o.move;if (e.hasOwnProperty("from")) {
        var t = e.from;this._from = new Pos(t.x, t.y);
      } else this._isPut = !0;if (!e.hasOwnProperty("to")) throw new Error('指し手オブジェクトに"to"プロパティがありません。');var r = e.to;if (this._to = new Pos(r.x, r.y), !e.hasOwnProperty("color")) throw new Error('指し手オブジェクトに"color"プロパティがありません。');if (this._color = e.color, !e.hasOwnProperty("piece")) throw new Error('指し手オブジェクトに"piece"プロパティがありません。');this._komaNum = KomaInfo.komaAtoi(e.piece), e.hasOwnProperty("promote") && (this._isPromote = e.promote), e.hasOwnProperty("capture") && (this._captureNum = KomaInfo.komaAtoi(e.capture));
    } else this._from = null, this._to = null;this.from || this.to || (this._noMove = !0);
  }return Object.defineProperty(o.prototype, "boardObj", { get: function () {
      var o = this._isPromote ? KomaInfo.getJKFString(KomaInfo.getPromote(this._komaNum)) : KomaInfo.getJKFString(this._komaNum);return { color: this.color, kind: o };
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "moveObj", { get: function () {
      return this._moveObj;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "isPut", { get: function () {
      return this._isPut;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "from", { get: function () {
      return this._from;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "to", { get: function () {
      return this._to;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "noMove", { get: function () {
      return this._noMove;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "color", { get: function () {
      return this._color;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "komaNum", { get: function () {
      return this._komaNum;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "name", { get: function () {
      return this._name;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "comments", { get: function () {
      return this._comments;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "captureNum", { get: function () {
      return this._captureNum ? KomaInfo.getOrigin(this._captureNum) : null;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "pureCaptureNum", { get: function () {
      return this._captureNum;
    }, enumerable: !0, configurable: !0 }), o.prototype.addComment = function (o) {
    Array.isArray(this._comments) ? this._comments.push(o) : this._comments = [o];
  }, o.prototype.removeComment = function () {
    this._comments = null;
  }, o.prototype.getMoveName = function (o) {
    if (o.hasOwnProperty("move")) {
      var e = o.move;if (e.to && e.hasOwnProperty("color") && e.hasOwnProperty("piece")) {
        var t = KomaInfo.komaAtoi(e.piece),
            r = KomaInfo.getKanji(t),
            n = e.color === PLAYER.SENTE ? "☗" : "☖",
            i = "同";if (!e.hasOwnProperty("same")) {
          i = e.to.x + ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"][e.to.y];
        }if (e.hasOwnProperty("relative")) e.relative.split("").forEach(function (o) {
          switch (o) {case "L":
              r += "左";break;case "C":
              r += "直";break;case "R":
              r += "右";break;case "U":
              r += "上";break;case "M":
              r += "寄";break;case "D":
              r += "引";break;case "H":
              r += "打";}
        });return e.hasOwnProperty("promote") && (r = e.promote ? r + "成" : r), n + i + r;
      }throw new Error("指し手オブジェクトに必要なプロパティが定義されていません。");
    }return "初期局面";
  }, o;
}();module.exports = Move;var MoveNode = function () {
  function o(o, e, t, r) {
    this._next = [], this._prev = null, this._select = -1, this._isBranch = !1, this._index = e, this._prev = t, this._moveObj = o, this._isBranch = r, this._info = new Move(o);
  }return Object.defineProperty(o.prototype, "prev", { get: function () {
      return this._prev;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "next", { get: function () {
      return this._next;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "info", { get: function () {
      return this._info;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "moveObj", { get: function () {
      return this._moveObj;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "index", { get: function () {
      return this._index;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "select", { get: function () {
      return this._select;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "isBranch", { get: function () {
      return this._isBranch;
    }, enumerable: !0, configurable: !0 }), o.prototype.addNext = function (o) {
    this._next.push(o), -1 === this.select && (this._select = 0);
  }, o.prototype.deleteNext = function (o) {
    var e = this;return this._next.length ? (this._next.forEach(function (t, r) {
      if (t === o) return e._next.splice(r, 1), e.select === r ? e.next.length >= 1 ? e._select = 0 : e._select = -1 : e.select > r && (e.next.length >= 1 ? e._select-- : e._select = -1), !0;
    }), !1) : (console.error("このノードには次の指し手候補が登録されていません。"), !1);
  }, o.prototype.switchFork = function (o) {
    return this.next.length > 1 ? o < this.next.length ? (this._select = o, !0) : (console.error("指定したインデックスがノードの分岐数を超えています。"), !1) : (console.error("この指し手は複数の分岐を持っていません。"), !1);
  }, o.prototype.swapFork = function (o, e) {
    var t = this.next[o],
        r = this.next[e];return t && r ? (this.select === o ? this._select = e : this.select === e && (this._select = o), this.next[o] = r, this.next[e] = t, !0) : (console.error("指定された分岐候補のいずれかが未定義です。"), !1);
  }, o.prototype.branchize = function () {
    this._isBranch = !0;
  }, o;
}(),
    MoveList = function () {
  function o(o) {
    this._moveNodes = [], this._currentMoveNodes = [], this._currentMoves = [], this.makeMoveList(o), this.makeCurrentMoveArray();
  }return o.prototype.getMove = function (o) {
    return this._currentMoves[o];
  }, o.prototype.getNextMoves = function (o) {
    var e = this;return this._currentMoveNodes[o].next.map(function (o) {
      return e._moveNodes[o].info;
    });
  }, o.prototype.getNextSelect = function (o) {
    return this._currentMoveNodes[o].select;
  }, Object.defineProperty(o.prototype, "startNode", { get: function () {
      return this._moveNodes[0] ? this._moveNodes[0] : null;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "currentMoves", { get: function () {
      return this._currentMoves;
    }, enumerable: !0, configurable: !0 }), o.prototype.addMove = function (o, e) {
    "number" == typeof this.makeMoveNode(e, this._currentMoveNodes[o]) && this.makeCurrentMoveArray();
  }, o.prototype.deleteMove = function (o) {
    var e = this._currentMoveNodes[o];this._moveNodes[e.prev].deleteNext(e.index), this.makeCurrentMoveArray();
  }, o.prototype.deleteFork = function (o, e) {
    if ("number" == typeof this._currentMoveNodes[o].index) {
      var t = this._currentMoveNodes[o].next[e];"number" == typeof t ? this._moveNodes[this._currentMoveNodes[o].index].deleteNext(t) : console.error("削除対象の分岐が存在しません。"), this.makeCurrentMoveArray();
    } else console.error("指し手が見つかりません。");
  }, o.prototype.switchFork = function (o, e) {
    if ("number" != typeof this._currentMoveNodes[o].index) throw new Error("分岐切り替え処理に失敗しました。");if (!this._moveNodes[this._currentMoveNodes[o].index].switchFork(e)) throw new Error("分岐切り替え処理に失敗しました。");this.makeCurrentMoveArray();
  }, o.prototype.swapFork = function (o, e, t) {
    if ("number" != typeof this._currentMoveNodes[o].index) throw new Error("指し手が見つかりません。");this._moveNodes[this._currentMoveNodes[o].index].swapFork(e, t);
  }, o.prototype.exportJkfMoves = function (o) {
    void 0 === o && (o = this._moveNodes[0]);for (var e = [], t = o, r = !0; t;) {
      if (("number" == typeof t.prev ? this._moveNodes[t.prev].next.length : 1) > 1 && !r) {
        for (var n = this._moveNodes[t.prev], i = [], c = n.next.length, a = 1; a < c; a++) {
          i.push(this.exportJkfMoves(this._moveNodes[n.next[a]]));
        }var s = Util.deepCopy(t.moveObj);s.forks = i, e.push(s);
      } else e.push(t.moveObj);t = t.next.length >= 0 ? this._moveNodes[t.next[0]] : null, r = !1;
    }return e;
  }, o.prototype.makeMoveList = function (o) {
    var e = this,
        t = -1;o.forEach(function (o) {
      var r = e._moveNodes[t] ? e._moveNodes[t] : null;t = e.makeMoveNode(o, r);
    });
  }, o.prototype.makeMoveNode = function (o, e) {
    var t = this,
        r = !1;if (!(e && e.next.length > 0 && (e.next.forEach(function (e) {
      JSON.stringify(o) === JSON.stringify(t._moveNodes[e].moveObj) && (r = !0);
    }), r))) {
      var n = this.makePrimitiveMoveNode(o, e);return o.hasOwnProperty("forks") && o.forks.forEach(function (o) {
        var r = e;o.forEach(function (o) {
          var e = t.makeMoveNode(o, r);r = t._moveNodes[e] ? t._moveNodes[e] : null;
        }), r = e;
      }), n;
    }console.error("同一の指し手が含まれています。");
  }, o.prototype.makePrimitiveMoveNode = function (o, e) {
    var t = this,
        r = !!(e && e.next.length > 0),
        n = e ? e.index : null,
        i = new MoveNode(o, this._moveNodes.length, n, r);return this._moveNodes.push(i), e && (e.addNext(i.index), r && e.next.forEach(function (o) {
      t._moveNodes[o].branchize();
    })), i.index;
  }, o.prototype.makeCurrentMoveArray = function () {
    this._currentMoves = [], this._currentMoveNodes = [];for (var o = this._moveNodes[0] ? this._moveNodes[0] : null; o;) {
      this._currentMoveNodes.push(o), this._currentMoves.push(o.info), o = o.next[o.select] ? this._moveNodes[o.next[o.select]] : null;
    }
  }, o;
}(),
    Field = function () {
  function o(o, e, t) {
    void 0 === e && (e = [{}, {}]), void 0 === t && (t = PLAYER.SENTE), this._nomove = !0, this._board = o, this._reverseBoard = Util.reverseBoard(o), this._hands = e, this._color = t, this._initBoard = Util.deepCopy(o), this._initHands = Util.deepCopy(e), this._initColor = t;
  }return o.prototype.applyMove = function (o) {
    if (o.isPut) {
      var e = o.to;!this.isExists(e.ax, e.ay) && this.canSet(e, o.komaNum, this.nextColor) && (this.setBoardPiece(e, o.boardObj), this.deleteHand(o.color, o.komaNum));
    } else if (o.from && o.to) {
      var t = o.from;e = o.to;if (this.setBoardPiece(t, {}), this.setBoardPiece(e, o.boardObj), o.captureNum) {
        var r = o.captureNum;this.addHand(o.color, r);
      }
    } else if (o.from || o.to) throw new Error("移動前、もしくは移動先の盤面座標が未定義です。");this._nomove = o.noMove, this._color = o.color;
  }, o.prototype.rewindMove = function (o) {
    if (o.isPut) {
      var e = o.to;this.setBoardPiece(e, {}), this.addHand(o.color, o.komaNum);
    } else {
      if (!o.from || !o.to) throw new Error("移動前、もしくは移動先の盤面座標が未定義です。");var t = o.from;e = o.to;if (this.setBoardPiece(e, {}), this.setBoardPiece(t, { color: o.color, kind: KomaInfo.getJKFString(o.komaNum) }), o.captureNum) {
        var r = o.pureCaptureNum;this.setBoardPiece(e, { color: Util.oppoPlayer(o.color), kind: KomaInfo.getJKFString(r) });var n = KomaInfo.getOrigin(r);this.deleteHand(o.color, n);
      }
    }this._nomove = o.noMove, this._color = Util.oppoPlayer(o.color);
  }, o.prototype.isMovable = function (o, e) {
    var t = this;void 0 === e && (e = null);var r = this._board[o.ay][o.ax].hasOwnProperty("kind") ? KomaInfo.komaAtoi(this._board[o.ay][o.ax].kind) : null;if (!r) return !1;var n = this._board[o.ay][o.ax].color;return KomaInfo.getMoves(r).some(function (r) {
      var i = r.x,
          c = r.y;if (n === PLAYER.SENTE ? c *= -1 : i *= -1, r.type === MOVETYPE.POS) return e ? o.x + i === e.x && o.y + c === e.y && !!t.isEnterable(e.x, e.y, n) : !!t.isEnterable(o.x + i, o.y + c, n);for (var a = !0, s = o.x, l = o.y; a;) {
        s += i, l += c;var d = t.isEnterable(s, l, n);if (!d) return !1;if (t.isExists(d.ax, d.ay) && (a = !1), !e) return !0;if (d.x === e.x && d.y === e.y) return !0;
      }return !1;
    });
  }, o.prototype.getKomaMoves = function (o) {
    var e = this,
        t = Util.makeEmptyBoard(),
        r = this._board[o.ay][o.ax].hasOwnProperty("kind") ? KomaInfo.komaAtoi(this._board[o.ay][o.ax].kind) : null;if (!r) return t;var n = this._board[o.ay][o.ax].color;return KomaInfo.getMoves(r).forEach(function (i) {
      var c = i.x,
          a = i.y;if (n === PLAYER.SENTE ? a *= -1 : c *= -1, i.type !== MOVETYPE.POS) {
        for (var s = !0, l = o.x, d = o.y; s;) {
          l += c, d += a;var u = e.isEnterable(l, d, n);u ? (e.isExists(u.ax, u.ay) && (s = !1), t[u.ay][u.ax] = e.canSet(u, r, n, !1) ? 1 : 2) : s = !1;
        }return !1;
      }var p = e.isEnterable(o.x + c, o.y + a, n);p && (t[p.ay][p.ax] = e.canSet(p, r, n, !1) ? 1 : 2);
    }), t;
  }, o.prototype.getMovables = function () {
    for (var o = Util.makeEmptyBoard(), e = 1; e < 10; e++) {
      for (var t = 1; t < 10; t++) {
        var r = new Pos(t, e);this.isMovable(r) && this._board[r.ay][r.ax].color === this.nextColor && (o[r.ay][r.ax] = 1);
      }
    }return o;
  }, o.prototype.getPutables = function (o) {
    for (var e = Util.makeEmptyBoard(), t = 0; t < 9; t++) {
      for (var r = 0; r < 9; r++) {
        var n = Pos.makePosFromIndex(r, t);!this.isExists(n.ax, n.ay) && this.canSet(n, KomaInfo.komaAtoi(o), this.nextColor) && (e[n.ay][n.ax] = 1);
      }
    }return e;
  }, o.prototype.isInHand = function (o, e) {
    var t = KomaInfo.komaItoa(e);return !!(this._hands[o] && this._hands[o].hasOwnProperty(t) && this._hands[o][t] >= 1);
  }, Object.defineProperty(o.prototype, "initData", { get: function () {
      var o = { color: PLAYER.SENTE, board: [], hands: [] };return this._initBoard && (o.board = this._initBoard), this._initHands && (o.hands = this._initHands), this._initColor && (o.color = this._initColor), o;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "color", { get: function () {
      return this._color;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "nextColor", { get: function () {
      return this._nomove ? this.color : Util.oppoPlayer(this.color);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "board", { get: function () {
      return this._board;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "reverseBoard", { get: function () {
      return this._reverseBoard;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "hands", { get: function () {
      return this._hands;
    }, enumerable: !0, configurable: !0 }), o.prototype.getBoardPiece = function (o, e) {
    var t = new Pos(o, e);return this._board[t.ay][t.ax];
  }, o.prototype.setBoardPiece = function (o, e) {
    if (o) {
      this._board[o.ay][o.ax] = Util.deepCopy(e);var t = o.reverse();this._reverseBoard[t.ay][t.ax] = Util.deepCopy(e);
    }
  }, o.prototype.addHand = function (o, e) {
    if (this._hands.hasOwnProperty(o)) {
      var t = KomaInfo.getJKFString(e);this._hands[o].hasOwnProperty(t) ? this._hands[o][t]++ : this._hands[o][t] = 1;
    } else console.error("指定されたプレイヤーの値が想定しない値です。");
  }, o.prototype.deleteHand = function (o, e) {
    if (this._hands.hasOwnProperty(o)) {
      var t = KomaInfo.getJKFString(e);this._hands[o].hasOwnProperty(t) ? (this._hands[o][t]--, this._hands[o][t] || delete this._hands[o][t]) : console.error("指定された駒番号の駒が手駒にありません。");
    } else console.error("指定されたプレイヤーの値が想定しない値です。");
  }, o.prototype.isEnterable = function (o, e, t) {
    if (Pos.inRange(o, e)) {
      var r = new Pos(o, e);return this.isExists(r.ax, r.ay) ? this._board[r.ay][r.ax].color !== t && r : r;
    }return !1;
  }, o.prototype.isExists = function (o, e) {
    var t = this._board[e][o];return !!Object.keys(t).length;
  }, o.prototype.canSet = function (o, e, t, r) {
    var n = this;return void 0 === r && (r = !0), KomaInfo.getMoves(e).some(function (i) {
      var c = i.x,
          a = i.y;if (t === PLAYER.SENTE ? a *= -1 : c *= -1, Pos.inRange(o.x + c, o.y + a)) {
        if (e !== KOMA.FU) return !0;if (r) for (var s = 0; s < 9; s++) {
          if (s !== o.ay && n._board[s][o.ax].kind === KomaInfo.komaItoa(KOMA.FU) && n._board[s][o.ax].color === t) return !1;
        }return !0;
      }return !1;
    });
  }, o;
}(),
    Editor = function () {
  function o(o, e) {
    void 0 === o && (o = { header: {}, moves: [{}] }), void 0 === e && (e = !1), this._currentNum = 0, this._field = new Field(KomaInfo.initBoards[BOARD.HIRATE]), this.moveData = new MoveList([{}]), this._header = {}, this.initial = null, this.preset = "HIRATE", this.readonly = e, this.load(o);
  }return Object.defineProperty(o.prototype, "moves", { get: function () {
      return this.moveData.currentMoves;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "lastMove", { get: function () {
      return this.moveData.currentMoves[this.currentNum];
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "comment", { get: function () {
      return this.moveData.getMove(this.currentNum).comments;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "board", { get: function () {
      return this._field.board;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "reverseBoard", { get: function () {
      return this._field.reverseBoard;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "hands", { get: function () {
      return this._field.hands;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "nextMoves", { get: function () {
      return this.moveData.getNextMoves(this._currentNum);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "nextSelect", { get: function () {
      return this.moveData.getNextSelect(this._currentNum);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "color", { get: function () {
      return this._field.color;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "currentNum", { get: function () {
      return this._currentNum;
    }, set: function (o) {
      this.go(o);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "isFork", { get: function () {
      return this.moveData.getNextMoves(this.currentNum).length > 1;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "header", { get: function () {
      return this._header;
    }, enumerable: !0, configurable: !0 }), o.prototype.getBoardPiece = function (o, e) {
    return this._field.getBoardPiece(o, e);
  }, o.prototype.addComment = function (o) {
    this.moveData.getMove(this.currentNum).addComment(o);
  }, o.prototype.resetComment = function () {
    this.moveData.getMove(this.currentNum).removeComment();
  }, o.prototype.export = function () {
    var o = { header: {}, moves: [{}] };return "object" == _typeof(this.initial) && (o.initial = this.initial), this.preset !== BOARD.HIRATE && (o.initial = { preset: this.preset }, this.preset === BOARD.OTHER && (o.initial.data = this._field.initData)), "object" == _typeof(this.header) && Object.keys(this.header).length && (o.header = this.header), o.moves = this.moveData.exportJkfMoves(), o;
  }, o.prototype.go = function (o) {
    if (o >= 0 && o < this.moveData.currentMoves.length) {
      if (this._currentNum > o) for (var e = this._currentNum; e > o;) {
        var t = this.moveData.getMove(e);this._field.rewindMove(t), e--;
      } else if (this._currentNum < o) for (e = this._currentNum; e < o;) {
        var r = this.moveData.getMove(e + 1);this._field.applyMove(r), e++;
      }this._currentNum = o;
    } else console.error("指定の指し手番号 " + o + " は範囲外です。0以上で" + this.moveData.currentMoves.length + "より小さい必要があります。");
  }, Object.defineProperty(o.prototype, "currentMove", { get: function () {
      return this.moveData.currentMoves[this.currentNum];
    }, enumerable: !0, configurable: !0 }), o.prototype.dispCurrentInfo = function () {
    var o = "";return o += this._currentNum + "手目\n\n", o += this.dispHand(PLAYER.GOTE) + "\n", o += this.dispBoard() + "\n", o += this.dispHand(PLAYER.SENTE) + "\n\n";
  }, o.prototype.dispBoard = function () {
    if (this._field.board) {
      var o = "";return o += " ＿＿＿＿＿＿＿＿＿\n", this._field.board.forEach(function (e) {
        o += "|", e.forEach(function (e) {
          e.hasOwnProperty("kind") ? o += KomaInfo.getKanji(KomaInfo.komaAtoi(e.kind)) : o += "　";
        }), o += "|\n";
      }), o += " ￣￣￣￣￣￣￣￣￣";
    }return "";
  }, o.prototype.dispKifuMoves = function () {
    var o = this,
        e = "";return this.moveData.currentMoves.forEach(function (t, r) {
      r === o._currentNum ? e += ">" : e += " ", e += r + ": " + t.name + "\n";
    }), e;
  }, o.prototype.dispNextMoves = function () {
    var o = this.moveData.getNextMoves(this._currentNum),
        e = this.moveData.getNextSelect(this._currentNum),
        t = "";return o.forEach(function (o, r) {
      t += r === e ? ">" : " ", t += r + ": " + o.name + "\n";
    }), t;
  }, o.prototype.dispHand = function (o) {
    var e = this._field.hands[o],
        t = o === PLAYER.SENTE ? "[先手持ち駒] " : "[後手持ち駒] ";for (var r in e) {
      var n = e[r];t += KomaInfo.getKanji(KomaInfo.komaAtoi(r)) + ":" + n.toString() + " \n";
    }return t;
  }, o.prototype.deleteMove = function (o) {
    this.isEditable && (o < 1 ? console.error("初期盤面は削除できません。") : (this.currentNum <= o && this.go(o - 1), this.moveData.deleteMove(o)));
  }, o.prototype.addMovefromObj = function (o, e) {
    if (void 0 === e && (e = null), this.isEditable) {
      var t = void 0;if (t = "string" == typeof e ? { move: o, comments: [e] } : Array.isArray(e) ? { move: o, comments: e } : { move: o }, o.to) if (o.from) {
        if (!this._field.isMovable(new Pos(o.from.x, o.from.y), new Pos(o.to.x, o.to.y))) return void console.error("指定された指し手は移動不可能です。");
      } else {
        if (!this._field.isInHand(Util.oppoPlayer(this._field.color), KomaInfo.komaAtoi(o.piece))) return void console.error("打つ駒が手持ち駒の中にありません。");if (!deepEqual_1(this.getBoardPiece(o.to.x, o.to.y), {})) return void console.error("持ち駒から配置する指し手の場合は空きマスを指定して下さい。", "TO:[x:" + o.to.x + ",y:" + o.to.y + "]", this.getBoardPiece(o.to.x, o.to.y));
      }this.moveData.addMove(this._currentNum, t);
    }
  }, o.prototype.addBoardMove = function (o, e, t, r, n, i) {
    void 0 === n && (n = !1), void 0 === i && (i = null);var c = this.getBoardPiece(o, e),
        a = null;c.hasOwnProperty("color") && c.hasOwnProperty("kind") ? (n = !(!n || !KomaInfo.getPromote(KomaInfo.komaAtoi(c.kind))), (a = this.makeMoveData(c.kind, o, e, t, r, n)) && this.addMovefromObj(a, i)) : console.error("fromの座標に駒が存在しません。");
  }, o.prototype.addHandMove = function (o, e, t, r) {
    void 0 === r && (r = null);var n = this.makeMoveData(o, null, null, e, t, !1);n && this.addMovefromObj(n, r);
  }, o.prototype.getKomaMoves = function (o, e, t) {
    void 0 === t && (t = !1);var r = this._field.getKomaMoves(new Pos(o, e));return t ? Util.reverseBoard(r) : r;
  }, o.prototype.getMovables = function (o) {
    void 0 === o && (o = !1);var e = this._field.getMovables();return o ? Util.reverseBoard(e) : e;
  }, o.prototype.getPutables = function (o, e) {
    void 0 === e && (e = !1);var t = this._field.getPutables(o);return e ? Util.reverseBoard(t) : t;
  }, o.prototype.haveFork = function (o) {
    return o < this.moves.length ? this.moveData.getNextMoves(o).length > 1 : (console.log("現在の手数を超える番号が指定されています。"), !1);
  }, o.prototype.switchFork = function (o) {
    this.isFork ? this.moveData.switchFork(this.currentNum, o) : console.error("現在の指し手は分岐を持っていません。");
  }, o.prototype.deleteFork = function (o) {
    this.isEditable && (this.isFork ? this.moveData.deleteFork(this.currentNum, o) : console.error("現在の指し手は分岐を持っていません。"));
  }, o.prototype.swapFork = function (o, e) {
    this.isEditable && (this.isFork ? this.moveData.swapFork(this.currentNum, o, e) : console.log("現在の指し手は分岐を持っていません。"));
  }, o.prototype.addInfo = function (o, e) {
    this.isEditable && (this._header[o] = e);
  }, o.prototype.deleteInfo = function (o) {
    this.isEditable && delete this._header[o];
  }, o.prototype.load = function (o) {
    var e,
        t = [{}, {}];if (o.hasOwnProperty("moves") ? this.moveData = new MoveList(o.moves) : this.moveData = new MoveList([{}]), e = Util.deepCopy(KomaInfo.initBoards[BOARD.HIRATE]), o.hasOwnProperty("initial")) {
      if (!o.initial.hasOwnProperty("preset")) throw Error("初期状態のプリセットが未定義です。");switch (o.initial.preset) {case BOARD.HIRATE:
          break;case BOARD.KYO:
          this.preset = BOARD.KYO, e = Util.deepCopy(KomaInfo.initBoards[BOARD.KYO]);break;case BOARD.KAKU:
          this.preset = BOARD.KAKU, e = Util.deepCopy(KomaInfo.initBoards[BOARD.KAKU]);break;case BOARD.HISHA:
          this.preset = BOARD.HISHA, e = Util.deepCopy(KomaInfo.initBoards[BOARD.HISHA]);break;case BOARD.HIKYO:
          this.preset = BOARD.HIKYO, e = Util.deepCopy(KomaInfo.initBoards[BOARD.HIKYO]);break;case BOARD.NI:
          this.preset = BOARD.NI, e = Util.deepCopy(KomaInfo.initBoards[BOARD.NI]);break;case BOARD.YON:
          this.preset = BOARD.YON, e = Util.deepCopy(KomaInfo.initBoards[BOARD.YON]);break;case BOARD.ROKU:
          this.preset = BOARD.ROKU, e = Util.deepCopy(KomaInfo.initBoards[BOARD.ROKU]);break;case BOARD.HACHI:
          this.preset = BOARD.HACHI, e = Util.deepCopy(KomaInfo.initBoards[BOARD.HACHI]);break;case BOARD.OTHER:
          this.preset = BOARD.OTHER, e = o.initial.data.board, t = o.initial.data.hands;}
    }this._field = new Field(e, t), this.go(0), o.hasOwnProperty("initial") && (this.initial = o.initial), o.hasOwnProperty("header") && (this._header = o.header);
  }, o.prototype.isEditable = function () {
    return !this.readonly || (console.error("この棋譜は読み取り専用です。"), !1);
  }, o.prototype.makeMoveData = function (o, e, t, r, n, i) {
    var c = this;void 0 === i && (i = !1);var a = this.lastMove.noMove ? this.lastMove.color : Util.oppoPlayer(this.lastMove.color),
        s = { to: { x: r, y: n }, color: a, piece: o },
        l = new Pos(r, n);if ("number" == typeof e && "number" == typeof t) {
      if (s.from = { x: e, y: t }, !Pos.inRange(e, t)) return console.error("fromの座標が盤面の範囲外です。"), null;var d = this.getBoardPiece(e, t);if (d && d.hasOwnProperty("kind") && d.color !== a) return console.error("相手の駒は移動できません。"), null;
    }if (!Pos.inRange(r, n)) return console.error("toの座標が盤面の範囲外です。"), null;i && (s.promote = !0), s.to && deepEqual_1(this.lastMove.to, new Pos(s.to.x, s.to.y)) && (s.same = !0);var u = this.getBoardPiece(r, n);if (u && u.hasOwnProperty("kind")) {
      if (u.color === a) return console.error("自分の駒を取る移動です。"), null;s.capture = u.kind;
    }var p = [];if (this.board.forEach(function (o, r) {
      o.forEach(function (o, n) {
        var i = Pos.makePosFromIndex(n, r);o.hasOwnProperty("kind") && (o.kind !== s.piece || o.color !== s.color || i.x === e && i.y === t || c._field.isMovable(i, l) && p.push(i));
      });
    }), p.length) if (s.relative = "", null != e && null != t) {
      var f = !0,
          m = !0,
          h = !0,
          y = !0,
          k = new Pos(e, t);p.forEach(function (o) {
        a === PLAYER.SENTE ? (o.x < k.x ? y = !1 : o.x > k.x ? h = !1 : f = !1, o.y === k.y && (m = !1)) : (o.x < k.x ? h = !1 : o.x > k.x ? y = !1 : f = !1, o.y === k.y && (m = !1));
      });var O = "",
          v = "";y && !h ? O = "R" : !y && h && (O = "L"), e === r && (a === PLAYER.SENTE && t > n ? O = "C" : a === PLAYER.GOTE && t < n && (O = "C")), t > n ? (v = "U", "C" === O && (v = "")) : v = t < n ? "D" : "M", s.relative = f && m ? v : f && !m ? O : !f && m ? v : O + v;
    } else s.relative = "H";return s;
  }, o;
}(),
    MoveData = function () {
  function o(o) {
    this.move = o;
  }return Object.defineProperty(o.prototype, "moveObj", { get: function () {
      return this.move.moveObj;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "isPut", { get: function () {
      return this.move.isPut;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "from", { get: function () {
      return this.move.from ? { x: this.move.from.x, y: this.move.from.y } : null;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "to", { get: function () {
      return this.move.to ? { x: this.move.to.x, y: this.move.to.y } : null;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "color", { get: function () {
      return this.move.color;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "name", { get: function () {
      return this.move.name;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "piece", { get: function () {
      return KomaInfo.komaItoa(this.move.komaNum);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "capture", { get: function () {
      return this.move.captureNum ? KomaInfo.komaItoa(this.move.captureNum) : null;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "pureCapture", { get: function () {
      return this.move.pureCaptureNum ? KomaInfo.komaItoa(this.move.pureCaptureNum) : null;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "comments", { get: function () {
      return this.move.comments;
    }, enumerable: !0, configurable: !0 }), o;
}(),
    JkfEditor = function () {
  function o(o, e) {
    void 0 === o && (o = { header: {}, moves: [{}] }), void 0 === e && (e = !1), this.editor = new Editor(o, e);
  }return Object.defineProperty(o.prototype, "currentNum", { get: function () {
      return this.editor.currentNum;
    }, set: function (o) {
      this.editor.go(o);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "board", { get: function () {
      return this.editor.board;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "reverseBoard", { get: function () {
      return this.editor.reverseBoard;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "hands", { get: function () {
      return this.editor.hands;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "comment", { get: function () {
      return this.editor.comment;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "isFork", { get: function () {
      return this.editor.isFork;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "header", { get: function () {
      return this.editor.header;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "moves", { get: function () {
      return this.editor.moves.map(function (o) {
        return new MoveData(o);
      });
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "lastMove", { get: function () {
      return new MoveData(this.editor.lastMove);
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "nextMoves", { get: function () {
      return this.editor.nextMoves.map(function (o) {
        return new MoveData(o);
      });
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "nextSelect", { get: function () {
      return this.editor.nextSelect;
    }, enumerable: !0, configurable: !0 }), Object.defineProperty(o.prototype, "color", { get: function () {
      return this.editor.color;
    }, enumerable: !0, configurable: !0 }), o.prototype.go = function (o) {
    this.editor.go(o);
  }, o.prototype.dispKifuMoves = function () {
    return this.editor.dispKifuMoves();
  }, o.prototype.dispNextMoves = function () {
    return this.editor.dispNextMoves();
  }, o.prototype.dispCurrentInfo = function () {
    return this.editor.dispCurrentInfo();
  }, o.prototype.haveFork = function (o) {
    return this.editor.haveFork(o);
  }, o.prototype.switchFork = function (o) {
    this.editor.switchFork(o);
  }, o.prototype.deleteFork = function (o) {
    this.editor.deleteFork(o);
  }, o.prototype.addBoardMove = function (o, e, t, r, n, i) {
    void 0 === n && (n = !1), void 0 === i && (i = null), this.editor.addBoardMove(o, e, t, r, n, i);
  }, o.prototype.addHandMove = function (o, e, t, r) {
    void 0 === r && (r = null), this.editor.addHandMove(o, e, t, r);
  }, o.prototype.deleteMove = function (o) {
    this.editor.deleteMove(o);
  }, o.prototype.getBoardPiece = function (o, e) {
    return this.editor.getBoardPiece(o, e);
  }, o.prototype.addComment = function (o) {
    this.editor.addComment(o);
  }, o.prototype.resetComment = function () {
    this.editor.resetComment();
  }, o.prototype.getKomaMoves = function (o, e, t) {
    return void 0 === t && (t = !1), this.editor.getKomaMoves(o, e, t);
  }, o.prototype.getMovables = function (o) {
    return void 0 === o && (o = !1), this.editor.getMovables(o);
  }, o.prototype.getPutables = function (o, e) {
    return void 0 === e && (e = !1), this.editor.getPutables(o, e);
  }, o.prototype.export = function () {
    return this.editor.export();
  }, o.prototype.load = function (o) {
    this.editor.load(o);
  }, o.prototype.addInfo = function (o, e) {
    this.editor.addInfo(o, e);
  }, o.prototype.deleteInfo = function (o) {
    this.editor.deleteInfo(o);
  }, o;
}();module.exports = JkfEditor;exports.default = JkfEditor;
//# sourceMappingURL=jkfeditor.es5.js.map
},{}],62:[function(require,module,exports) {
!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.StateMachine=n():t.StateMachine=n()}(this,function(){return function(t){function n(e){if(i[e])return i[e].exports;var s=i[e]={i:e,l:!1,exports:{}};return t[e].call(s.exports,s,s.exports,n),s.l=!0,s.exports}var i={};return n.m=t,n.c=i,n.i=function(t){return t},n.d=function(t,i,e){n.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:e})},n.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(i,"a",i),i},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=5)}([function(t,n,i){"use strict";t.exports=function(t,n){var i,e,s;for(i=1;i<arguments.length;i++){e=arguments[i];for(s in e)e.hasOwnProperty(s)&&(t[s]=e[s])}return t}},function(t,n,i){"use strict";var e=i(0);t.exports={build:function(t,n){var i,s,r,o=n.plugins;for(i=0,s=o.length;i<s;i++)r=o[i],r.methods&&e(t,r.methods),r.properties&&Object.defineProperties(t,r.properties)},hook:function(t,n,i){var e,s,r,o,a=t.config.plugins,f=[t.context];for(i&&(f=f.concat(i)),e=0,s=a.length;e<s;e++)o=a[e],(r=a[e][n])&&r.apply(o,f)}}},function(t,n,i){"use strict";function e(t){if(0===t.length)return t;var n,i,e=t.split(/[_-]/);if(1===e.length&&e[0][0].toLowerCase()===e[0][0])return t;for(i=e[0].toLowerCase(),n=1;n<e.length;n++)i=i+e[n].charAt(0).toUpperCase()+e[n].substring(1).toLowerCase();return i}e.prepended=function(t,n){return n=e(n),t+n[0].toUpperCase()+n.substring(1)},t.exports=e},function(t,n,i){"use strict";function e(t,n){t=t||{},this.options=t,this.defaults=n.defaults,this.states=[],this.transitions=[],this.map={},this.lifecycle=this.configureLifecycle(),this.init=this.configureInitTransition(t.init),this.data=this.configureData(t.data),this.methods=this.configureMethods(t.methods),this.map[this.defaults.wildcard]={},this.configureTransitions(t.transitions||[]),this.plugins=this.configurePlugins(t.plugins,n.plugin)}var s=i(0),r=i(2);s(e.prototype,{addState:function(t){this.map[t]||(this.states.push(t),this.addStateLifecycleNames(t),this.map[t]={})},addStateLifecycleNames:function(t){this.lifecycle.onEnter[t]=r.prepended("onEnter",t),this.lifecycle.onLeave[t]=r.prepended("onLeave",t),this.lifecycle.on[t]=r.prepended("on",t)},addTransition:function(t){this.transitions.indexOf(t)<0&&(this.transitions.push(t),this.addTransitionLifecycleNames(t))},addTransitionLifecycleNames:function(t){this.lifecycle.onBefore[t]=r.prepended("onBefore",t),this.lifecycle.onAfter[t]=r.prepended("onAfter",t),this.lifecycle.on[t]=r.prepended("on",t)},mapTransition:function(t){var n=t.name,i=t.from,e=t.to;return this.addState(i),"function"!=typeof e&&this.addState(e),this.addTransition(n),this.map[i][n]=t,t},configureLifecycle:function(){return{onBefore:{transition:"onBeforeTransition"},onAfter:{transition:"onAfterTransition"},onEnter:{state:"onEnterState"},onLeave:{state:"onLeaveState"},on:{transition:"onTransition"}}},configureInitTransition:function(t){return"string"==typeof t?this.mapTransition(s({},this.defaults.init,{to:t,active:!0})):"object"==typeof t?this.mapTransition(s({},this.defaults.init,t,{active:!0})):(this.addState(this.defaults.init.from),this.defaults.init)},configureData:function(t){return"function"==typeof t?t:"object"==typeof t?function(){return t}:function(){return{}}},configureMethods:function(t){return t||{}},configurePlugins:function(t,n){t=t||[];var i,e,s;for(i=0,e=t.length;i<e;i++)s=t[i],"function"==typeof s&&(t[i]=s=s()),s.configure&&s.configure(this);return t},configureTransitions:function(t){var n,i,e,s,r,o=this.defaults.wildcard;for(i=0;i<t.length;i++)for(e=t[i],s=Array.isArray(e.from)?e.from:[e.from||o],r=e.to||o,n=0;n<s.length;n++)this.mapTransition({name:e.name,from:s[n],to:r})},transitionFor:function(t,n){var i=this.defaults.wildcard;return this.map[t][n]||this.map[i][n]},transitionsFor:function(t){var n=this.defaults.wildcard;return Object.keys(this.map[t]).concat(Object.keys(this.map[n]))},allStates:function(){return this.states},allTransitions:function(){return this.transitions}}),t.exports=e},function(t,n,i){function e(t,n){this.context=t,this.config=n,this.state=n.init.from,this.observers=[t]}var s=i(0),r=i(6),o=i(1),a=[null,[]];s(e.prototype,{init:function(t){if(s(this.context,this.config.data.apply(this.context,t)),o.hook(this,"init"),this.config.init.active)return this.fire(this.config.init.name,[])},is:function(t){return Array.isArray(t)?t.indexOf(this.state)>=0:this.state===t},isPending:function(){return this.pending},can:function(t){return!this.isPending()&&!!this.seek(t)},cannot:function(t){return!this.can(t)},allStates:function(){return this.config.allStates()},allTransitions:function(){return this.config.allTransitions()},transitions:function(){return this.config.transitionsFor(this.state)},seek:function(t,n){var i=this.config.defaults.wildcard,e=this.config.transitionFor(this.state,t),s=e&&e.to;return"function"==typeof s?s.apply(this.context,n):s===i?this.state:s},fire:function(t,n){return this.transit(t,this.state,this.seek(t,n),n)},transit:function(t,n,i,e){var s=this.config.lifecycle,r=this.config.options.observeUnchangedState||n!==i;return i?this.isPending()?this.context.onPendingTransition(t,n,i):(this.config.addState(i),this.beginTransit(),e.unshift({transition:t,from:n,to:i,fsm:this.context}),this.observeEvents([this.observersForEvent(s.onBefore.transition),this.observersForEvent(s.onBefore[t]),r?this.observersForEvent(s.onLeave.state):a,r?this.observersForEvent(s.onLeave[n]):a,this.observersForEvent(s.on.transition),r?["doTransit",[this]]:a,r?this.observersForEvent(s.onEnter.state):a,r?this.observersForEvent(s.onEnter[i]):a,r?this.observersForEvent(s.on[i]):a,this.observersForEvent(s.onAfter.transition),this.observersForEvent(s.onAfter[t]),this.observersForEvent(s.on[t])],e)):this.context.onInvalidTransition(t,n,i)},beginTransit:function(){this.pending=!0},endTransit:function(t){return this.pending=!1,t},failTransit:function(t){throw this.pending=!1,t},doTransit:function(t){this.state=t.to},observe:function(t){if(2===t.length){var n={};n[t[0]]=t[1],this.observers.push(n)}else this.observers.push(t[0])},observersForEvent:function(t){for(var n,i=0,e=this.observers.length,s=[];i<e;i++)n=this.observers[i],n[t]&&s.push(n);return[t,s,!0]},observeEvents:function(t,n,i,e){if(0===t.length)return this.endTransit(void 0===e||e);var s=t[0][0],r=t[0][1],a=t[0][2];if(n[0].event=s,s&&a&&s!==i&&o.hook(this,"lifecycle",n),0===r.length)return t.shift(),this.observeEvents(t,n,s,e);var f=r.shift(),c=f[s].apply(f,n);return c&&"function"==typeof c.then?c.then(this.observeEvents.bind(this,t,n,s)).catch(this.failTransit.bind(this)):!1===c?this.endTransit(!1):this.observeEvents(t,n,s,c)},onInvalidTransition:function(t,n,i){throw new r("transition is invalid in current state",t,n,i,this.state)},onPendingTransition:function(t,n,i){throw new r("transition is invalid while previous transition is still in progress",t,n,i,this.state)}}),t.exports=e},function(t,n,i){"use strict";function e(t){return r(this||{},t)}function s(){var t,n;"function"==typeof arguments[0]?(t=arguments[0],n=arguments[1]||{}):(t=function(){this._fsm.apply(this,arguments)},n=arguments[0]||{});var i=new u(n,e);return o(t.prototype,i),t.prototype._fsm.config=i,t}function r(t,n){return o(t,new u(n,e)),t._fsm(),t}function o(t,n){if("object"!=typeof t||Array.isArray(t))throw Error("StateMachine can only be applied to objects");c.build(t,n),Object.defineProperties(t,d),a(t,l),a(t,n.methods),n.allTransitions().forEach(function(n){t[f(n)]=function(){return this._fsm.fire(n,[].slice.call(arguments))}}),t._fsm=function(){this._fsm=new h(this,n),this._fsm.init(arguments)}}var a=i(0),f=i(2),c=i(1),u=i(3),h=i(4),l={is:function(t){return this._fsm.is(t)},can:function(t){return this._fsm.can(t)},cannot:function(t){return this._fsm.cannot(t)},observe:function(){return this._fsm.observe(arguments)},transitions:function(){return this._fsm.transitions()},allTransitions:function(){return this._fsm.allTransitions()},allStates:function(){return this._fsm.allStates()},onInvalidTransition:function(t,n,i){return this._fsm.onInvalidTransition(t,n,i)},onPendingTransition:function(t,n,i){return this._fsm.onPendingTransition(t,n,i)}},d={state:{configurable:!1,enumerable:!0,get:function(){return this._fsm.state},set:function(t){throw Error("use transitions to change state")}}};e.version="3.0.1",e.factory=s,e.apply=r,e.defaults={wildcard:"*",init:{name:"init",from:"none"}},t.exports=e},function(t,n,i){"use strict";t.exports=function(t,n,i,e,s){this.message=t,this.transition=n,this.from=i,this.to=e,this.current=s}}])});
},{}],51:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
exports.STATE = {
    // トップメニューのステート
    TOP: 'TOP',
    // 新規棋譜の属性を決定するステート
    NEWKIFU: 'NEWKIFU',
    // jkfファイルを読み込むステート
    LOADKIFU: 'LOADKIFU',
    // カスタムの新規盤面を作成するステート
    EDITBOARD: 'EDITBOARD',
    // 新規棋譜の詳細情報を入力するステート
    EDITINFO: 'EDITINFO',
    // 駒の移動を入力するためのステート
    EDITMOVE: 'EDITMOVE',
    // 棋譜閲覧のステート
    VIEW: 'VIEW'
};
exports.EDITSTATE = {
    // 移動する駒の位置を入力するステート
    INPUTFROM: 'INPUTFROM',
    // 移動先を入力するステート
    INPUTTO: 'INPUTTO',
    // 移動時に成るかどうかを入力するステート
    INPUTNARI: 'INPUTNARI',
    // 移動の追加入力を行えないステート
    NOINPUT: 'NOINPUT'
};
exports.CREATESTATE = {
    // 盤面に配置する駒を選択するステート
    INPUTKIND: 'INPUTKIND',
    // 駒の配置先を選択するステート
    INPUTPOS: 'INPUTPOS',
    // 配置した駒の成・不成や持ち主を編集するステート
    KOMAEDIT: 'KOMAEDIT'
};
exports.KOMATYPE = {
    NORMAL: 'NORMAL',
    // 指し手編集時の移動開始駒候補
    FROM: 'FROM',
    // 指し手編集時の移動先候補
    TO: 'TO',
    // 成るかどうかを選択する状態
    PROMOTE: 'PROMOTE',
    // 新規盤面編集時の配置駒候補
    KIND: 'KIND',
    // 新規駒編集時の配置先候補
    POS: 'POS',
    // 新規駒編集時の駒状態変更可能駒
    EDIT: 'EDIT'
};
exports.KOMAPLACE = {
    BOARD: 'BOARD',
    HAND: 'HAND',
    UNSET: 'UNSET'
};
exports.PLAYER = {
    SENTE: 0,
    GOTE: 1
};
exports.BAN = {
    HIRATE: 0,
    KOMAOCHI: 1,
    CUSTOM: 2
};
exports.KOMAOCHI = {
    KYO: 0,
    KAKU: 1,
    HISHA: 2,
    HIKYO: 3,
    NI: 4,
    YON: 5,
    ROKU: 6,
    HACHI: 7
};
exports.KIFUTYPE = {
    KIFU: 0,
    JOSEKI: 1
};
},{}],59:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var const_1 = require("./const");
var Util = /** @class */function () {
    function Util() {}
    Util.reverseBoard = function (board) {
        return board.slice().reverse().map(function (boardRow) {
            return boardRow.slice().reverse();
        });
    };
    Util.komaClassName = function (kind, color, reverse) {
        if (reverse === void 0) {
            reverse = false;
        }
        var PLAYER = {
            SENTE: 0,
            GOTE: 1
        };
        var ownerName = reverse ? color === PLAYER.SENTE ? 'oppo' : 'prop' : color === PLAYER.SENTE ? 'prop' : 'oppo';
        var komaName = null;
        switch (kind) {
            case 'FU':
                komaName = 'fu';
                break;
            case 'KY':
                komaName = 'kyo';
                break;
            case 'KE':
                komaName = 'kei';
                break;
            case 'GI':
                komaName = 'gin';
                break;
            case 'KI':
                komaName = 'kin';
                break;
            case 'KA':
                komaName = 'kaku';
                break;
            case 'HI':
                komaName = 'hisha';
                break;
            case 'OU':
                komaName = 'ou';
                break;
            case 'TO':
                komaName = 'to';
                break;
            case 'NY':
                komaName = 'nkyo';
                break;
            case 'NK':
                komaName = 'nkei';
                break;
            case 'NG':
                komaName = 'ngin';
                break;
            case 'UM':
                komaName = 'uma';
                break;
            case 'RY':
                komaName = 'ryu';
                break;
        }
        return komaName ? 'c-koma' + '_' + ownerName + '_' + komaName : '';
    };
    Util.komaochiName = function (komaochiType) {
        var komaochiString = '';
        switch (komaochiType) {
            case const_1.KOMAOCHI.KYO:
                komaochiString = 'KY';
                break;
            case const_1.KOMAOCHI.KAKU:
                komaochiString = 'KA';
                break;
            case const_1.KOMAOCHI.HISHA:
                komaochiString = 'HI';
                break;
            case const_1.KOMAOCHI.HIKYO:
                komaochiString = 'HIKY';
                break;
            case const_1.KOMAOCHI.NI:
                komaochiString = '2';
                break;
            case const_1.KOMAOCHI.YON:
                komaochiString = '4';
                break;
            case const_1.KOMAOCHI.ROKU:
                komaochiString = '6';
                break;
            case const_1.KOMAOCHI.HACHI:
                komaochiString = '8';
                break;
        }
        return komaochiString;
    };
    Util.canPromote = function (kind) {
        var canPromote = false;
        switch (kind) {
            case 'FU':
                canPromote = true;
                break;
            case 'KY':
                canPromote = true;
                break;
            case 'KE':
                canPromote = true;
                break;
            case 'GI':
                canPromote = true;
                break;
            case 'KA':
                canPromote = true;
                break;
            case 'HI':
                canPromote = true;
                break;
        }
        return canPromote;
    };
    Util.getAttr = function (vnode, key) {
        if (vnode && vnode['attrs'] && vnode['attrs'].hasOwnProperty(key)) {
            return vnode['attrs'][key];
        } else {
            return null;
        }
    };
    Util.getKifuPos = function (ax, ay, reverse) {
        if (reverse === void 0) {
            reverse = false;
        }
        var x = !reverse ? 9 - ax : 10 - (9 - ax);
        var y = !reverse ? ay + 1 : 10 - (ay + 1);
        return { x: x, y: y };
    };
    Util.getPromote = function (kind) {
        var promoteKind = kind;
        switch (kind) {
            case 'FU':
                promoteKind = 'TO';
                break;
            case 'KY':
                promoteKind = 'NY';
                break;
            case 'KE':
                promoteKind = 'NK';
                break;
            case 'GI':
                promoteKind = 'NG';
                break;
            case 'KA':
                promoteKind = 'UM';
                break;
            case 'HI':
                promoteKind = 'RY';
                break;
        }
        return promoteKind;
    };
    Util.getDemote = function (kind) {
        var promoteKind = kind;
        switch (kind) {
            case 'TO':
                promoteKind = 'FU';
                break;
            case 'NY':
                promoteKind = 'KY';
                break;
            case 'NK':
                promoteKind = 'KE';
                break;
            case 'NG':
                promoteKind = 'GI';
                break;
            case 'UM':
                promoteKind = 'KA';
                break;
            case 'RY':
                promoteKind = 'HI';
                break;
        }
        return promoteKind;
    };
    // その駒が成ることができるかどうか
    Util.isPromotable = function (fromY, toY, owner, kind) {
        if (!Util.canPromote(kind)) {
            return false;
        }
        if (owner === const_1.PLAYER.SENTE) {
            if (toY <= 3 || fromY <= 3) {
                return true;
            } else {
                return false;
            }
        } else if (owner === const_1.PLAYER.GOTE) {
            if (toY >= 7 || fromY >= 7) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    };
    // その駒が成り駒かどうか
    Util.isPromoted = function (kind) {
        var isPromoted = false;
        switch (kind) {
            case 'TO':
                isPromoted = true;
                break;
            case 'NY':
                isPromoted = true;
                break;
            case 'NK':
                isPromoted = true;
                break;
            case 'NG':
                isPromoted = true;
                break;
            case 'UM':
                isPromoted = true;
                break;
            case 'RY':
                isPromoted = true;
                break;
        }
        return isPromoted;
    };
    Util.oppoPlayer = function (player) {
        if (player === const_1.PLAYER.SENTE) {
            return const_1.PLAYER.GOTE;
        } else {
            return const_1.PLAYER.SENTE;
        }
    };
    return Util;
}();
exports["default"] = Util;
},{"./const":51}],10:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var jkfeditor_1 = __importDefault(require("jkfeditor"));
var javascript_state_machine_1 = __importDefault(require("@taoqf/javascript-state-machine"));
var const_1 = require("./const");
var util_1 = __importDefault(require("./util"));
var AppData = /** @class */function () {
    function AppData() {
        var _this = this;
        this.jkfEditor = new jkfeditor_1["default"]();
        // 有限ステートマシンで画面の遷移を定義
        this.stateMachine = new javascript_state_machine_1["default"]({
            init: const_1.STATE.TOP,
            transitions: [{
                name: 'newKifu',
                from: const_1.STATE.TOP,
                to: const_1.STATE.NEWKIFU
            }, {
                name: 'loadKifu',
                from: const_1.STATE.TOP,
                to: const_1.STATE.LOADKIFU
            }, {
                name: 'editInfo',
                from: [const_1.STATE.NEWKIFU, const_1.STATE.EDITBOARD],
                to: const_1.STATE.EDITINFO
            }, {
                name: 'editMove',
                from: [const_1.STATE.EDITINFO, const_1.STATE.LOADKIFU],
                to: const_1.STATE.EDITMOVE
            }, {
                name: 'editBoard',
                from: const_1.STATE.NEWKIFU,
                to: const_1.STATE.EDITBOARD
            }, {
                name: 'reset',
                from: [const_1.STATE.NEWKIFU, const_1.STATE.LOADKIFU, const_1.STATE.EDITBOARD, const_1.STATE.EDITMOVE],
                to: const_1.STATE.TOP
            }],
            methods: {
                onEditMove: function onEditMove() {
                    if (_this.jkfEditor.currentNum === _this.jkfEditor.moves.length - 1) {
                        _this.editStateMachine['inputFrom']();
                        _this.setMask(_this.jkfEditor.getMovables());
                    } else {
                        _this.editStateMachine['inputReset']();
                    }
                }
            }
        });
        // 棋譜編集モード時のサブステートを定義
        this.editStateMachine = new javascript_state_machine_1["default"]({
            init: const_1.EDITSTATE.INPUTFROM,
            transitions: [{
                name: 'inputTo',
                from: const_1.EDITSTATE.INPUTFROM,
                to: const_1.EDITSTATE.INPUTTO
            }, {
                name: 'inputNari',
                from: const_1.EDITSTATE.INPUTTO,
                to: const_1.EDITSTATE.INPUTNARI
            }, {
                name: 'inputFrom',
                from: [const_1.EDITSTATE.NOINPUT, const_1.EDITSTATE.INPUTFROM, const_1.EDITSTATE.INPUTTO, const_1.EDITSTATE.INPUTNARI],
                to: const_1.EDITSTATE.INPUTFROM
            }, {
                name: 'inputReset',
                from: [const_1.EDITSTATE.NOINPUT, const_1.EDITSTATE.INPUTFROM, const_1.EDITSTATE.INPUTTO, const_1.EDITSTATE.INPUTNARI],
                to: const_1.EDITSTATE.NOINPUT
            }],
            methods: {
                onInputFrom: function onInputFrom() {
                    _this.setMask(_this.jkfEditor.getMovables());
                },
                onInputTo: function onInputTo() {
                    if (_this.fromX !== -1 && _this.fromY !== -1) {
                        // 盤上を移動する指し手の場合
                        _this.setMask(_this.jkfEditor.getKomaMoves(_this.fromX, _this.fromY));
                    } else {
                        _this.setMask(_this.jkfEditor.getPutables(_this.fromKind));
                    }
                }
            }
        });
        // 新規盤面作成時のサブステートを定義
        this.createStateMachine = new javascript_state_machine_1["default"]({
            init: const_1.CREATESTATE.INPUTKIND,
            transitions: [{
                name: 'inputPos',
                from: [const_1.CREATESTATE.INPUTKIND, const_1.CREATESTATE.INPUTPOS],
                to: const_1.CREATESTATE.INPUTPOS
            }, {
                name: 'inputKind',
                from: [const_1.CREATESTATE.INPUTKIND, const_1.CREATESTATE.INPUTPOS, const_1.CREATESTATE.KOMAEDIT],
                to: const_1.CREATESTATE.INPUTKIND
            }, {
                name: 'komaEdit',
                from: [const_1.CREATESTATE.INPUTKIND, const_1.CREATESTATE.INPUTPOS],
                to: const_1.CREATESTATE.KOMAEDIT
            }],
            methods: {
                onInputPos: function onInputPos() {
                    // 駒の配置可能箇所をマスクする
                    _this.setMask(_this.createMask(_this._createBoard));
                }
            }
        });
        // 反転状態で表示するかどうか
        this._isReverse = false;
        // 分岐棋譜ウインドウを開いているかどうか
        this._isOpenFork = false;
        // 棋譜ヘッダ情報ウインドウを開いているかどうか
        this._isOpenInfo = false;
        // 移動可能なコマなど、将棋盤をマスクするための配列
        this._maskArray = this.jkfEditor.getMovables();
        this._reverseMaskArray = util_1["default"].reverseBoard(this._maskArray);
        // 棋譜のヘッダー情報
        this._headerInfo = {};
    }
    AppData.prototype.switch_NEWKIFU = function () {
        this.stateMachine['newKifu']();
    };
    AppData.prototype.switch_LOADKIFU = function () {
        this.stateMachine['loadKifu']();
    };
    AppData.prototype.switch_EDITINFO = function (boardType, kifuTitle, komaochiType, kifuType) {
        if (kifuTitle === void 0) {
            kifuTitle = null;
        }
        if (komaochiType === void 0) {
            komaochiType = const_1.KOMAOCHI.NI;
        }
        if (kifuType === void 0) {
            kifuType = null;
        }
        switch (boardType) {
            case const_1.BAN.HIRATE:
                this.initBoardPreset = null;
                break;
            case const_1.BAN.KOMAOCHI:
                this.initBoardPreset = util_1["default"].komaochiName(komaochiType);
                break;
            case const_1.BAN.CUSTOM:
                this.initBoardPreset = 'OTHER';
                break;
        }
        if (kifuTitle) this._headerInfo['title'] = kifuTitle;
        if (kifuType) this._kifuType = kifuType;
        this.stateMachine['editInfo']();
    };
    AppData.prototype.switch_EDITBOARD = function (kifuTitle, kifuType) {
        this._headerInfo['title'] = kifuTitle;
        this._kifuType = kifuType;
        // 初期盤面を定義
        this._createBoard = [];
        for (var ky = 0; ky < 9; ky++) {
            var rowArray = [];
            for (var kx = 0; kx < 9; kx++) {
                rowArray.push({});
            }
            this._createBoard.push(rowArray);
        }
        // 未配置駒を定義
        this._unsetPieces = {
            'FU': 18,
            'KY': 4,
            'KE': 4,
            'GI': 4,
            'KI': 4,
            'KA': 2,
            'HI': 2,
            'OU': 2
        };
        this._createHands = [{}, {}];
        this._setKomaKind = null;
        this.stateMachine['editBoard']();
    };
    AppData.prototype.switch_EDITMOVE = function (detail, propName, oppoName, place) {
        if (propName === void 0) {
            propName = null;
        }
        if (oppoName === void 0) {
            oppoName = null;
        }
        if (place === void 0) {
            place = null;
        }
        if (detail) this._headerInfo['detail'] = detail;
        if (propName) this._headerInfo['proponent_name'] = propName;
        if (oppoName) this._headerInfo['opponent_name'] = oppoName;
        if (place) this._headerInfo['place'] = place;
        var initial = {
            preset: this.initBoardPreset
        };
        if (this.initBoardPreset === 'OTHER') {
            initial['data'] = {
                board: this._createBoard,
                color: const_1.PLAYER.SENTE,
                hands: this._createHands
            };
        }
        var jkfObj = {
            header: this._headerInfo,
            initial: initial,
            moves: [{}]
        };
        this.jkfEditor.load(jkfObj);
        this.stateMachine['editMove']();
    };
    AppData.prototype.switch_EDITMOVEfromLOADKIFU = function (jkf) {
        this.load(jkf);
        this.stateMachine['editMove']();
    };
    AppData.prototype.edit_inputFrom = function (fromX, fromY, kind) {
        if (this.editState === const_1.EDITSTATE.INPUTFROM) {
            this.fromX = fromX;
            this.fromY = fromY;
            this.fromKind = kind;
            this.editStateMachine['inputTo']();
        } else {
            console.log('INPUTFROM状態以外ではFROM座標の入力はできません。');
        }
    };
    AppData.prototype.edit_inputTo = function (toX, toY, forcePromote) {
        if (forcePromote === void 0) {
            forcePromote = false;
        }
        if (this.editState === const_1.EDITSTATE.INPUTTO) {
            this._toX = toX;
            this._toY = toY;
            if (this.fromX !== -1 && this.fromY !== -1) {
                // 盤上を移動する指し手の場合
                var moveKoma = this.jkfEditor.getBoardPiece(this.fromX, this.fromY);
                var isPromotable = util_1["default"].isPromotable(this.fromY, this.toY, moveKoma.color, moveKoma.kind);
                if (isPromotable) {
                    if (forcePromote) {
                        // 強制成りの場合はNARIステートに遷移せずに直ちに駒を成る
                        this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY, true);
                        this.jkfEditor.currentNum++;
                        this.editStateMachine['inputFrom']();
                    } else {
                        // 成ることができる場合は指し手を追加せずinputNariに遷移
                        this.editStateMachine['inputNari']();
                    }
                } else {
                    this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY);
                    if (this.isOpenFork) {
                        this.jkfEditor.switchFork(this.jkfEditor.nextMoves.length - 1);
                        this.isOpenFork = false;
                    }
                    this.jkfEditor.currentNum++;
                    this.editStateMachine['inputFrom']();
                }
            } else {
                // 持ち駒から配置する指し手の場合
                this.jkfEditor.addHandMove(this.fromKind, this.toX, this.toY);
                if (this.isOpenFork) {
                    this.jkfEditor.switchFork(this.jkfEditor.nextMoves.length - 1);
                    this.isOpenFork = false;
                }
                this.jkfEditor.currentNum++;
                this.editStateMachine['inputFrom']();
            }
        } else {
            console.log('INPUTTO状態以外ではTO座標の入力はできません。');
        }
    };
    AppData.prototype.edit_inputNari = function (promote) {
        if (this.editState === const_1.EDITSTATE.INPUTNARI) {
            if (promote) {
                this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY, true);
            } else {
                this.jkfEditor.addBoardMove(this.fromX, this.fromY, this.toX, this.toY);
            }
            this.jkfEditor.currentNum++;
            this.editStateMachine['inputFrom']();
        }
    };
    AppData.prototype.edit_inputReset = function (isFork) {
        if (isFork === void 0) {
            isFork = false;
        }
        if (isFork || this.jkfEditor.currentNum === this.jkfEditor.moves.length - 1) {
            this.editStateMachine['inputFrom']();
        } else {
            this.editStateMachine['inputReset']();
        }
    };
    AppData.prototype.create_inputKind = function (kind) {
        this._setKomaKind = kind;
        this.createStateMachine['inputPos']();
    };
    AppData.prototype.create_inputPos = function (toX, toY) {
        // 盤に駒を配置
        this.setCreateBoard(toX, toY, this.setKomaKind);
        // 配置駒のストックが無くなった場合はINPUTKINDに遷移する
        if (!this.unsetPieces[this.setKomaKind]) {
            this.create_inputReset();
        }
    };
    AppData.prototype.create_komaEdit = function (posX, posY) {
        this._editX = posX;
        this._editY = posY;
        this.createStateMachine['komaEdit']();
        this._setKomaKind = null;
    };
    AppData.prototype.create_inputReset = function () {
        this._setKomaKind = null;
        this._editX = null;
        this._editY = null;
        this.createStateMachine['inputKind']();
    };
    AppData.prototype.addForkMove = function () {
        if (this.editState === const_1.EDITSTATE.NOINPUT) {
            this.edit_inputReset(true);
        }
    };
    AppData.prototype.go = function (kifuNum) {
        this.jkfEditor.go(kifuNum);
        if (this.state === const_1.STATE.EDITMOVE) {
            this.edit_inputReset();
        }
    };
    AppData.prototype.deleteMove = function (deleteNum) {
        this.jkfEditor.deleteMove(deleteNum);
        this.go(deleteNum - 1);
    };
    Object.defineProperty(AppData.prototype, "state", {
        get: function get() {
            if (typeof this.stateMachine.state === 'string') {
                return this.stateMachine.state;
            } else {
                return 'ERROR';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "editState", {
        get: function get() {
            if (this.state === const_1.STATE.EDITMOVE && typeof this.editStateMachine.state === 'string') {
                return this.editStateMachine.state;
            } else {
                return 'ERROR';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "createState", {
        get: function get() {
            if (this.state === const_1.STATE.EDITBOARD && typeof this.createStateMachine.state === 'string') {
                return this.createStateMachine.state;
            } else {
                return 'ERROR';
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "title", {
        get: function get() {
            return this._headerInfo['title'] ? this._headerInfo['title'] : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "detail", {
        get: function get() {
            return this._headerInfo['detail'] ? this._headerInfo['detail'] : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "proponent_name", {
        get: function get() {
            return this._headerInfo['proponent_name'] ? this._headerInfo['proponent_name'] : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "opponent_name", {
        get: function get() {
            return this._headerInfo['opponent_name'] ? this._headerInfo['opponent_name'] : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "place", {
        get: function get() {
            return this._headerInfo['place'] ? this._headerInfo['place'] : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "kifuType", {
        get: function get() {
            return this._kifuType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "isReverse", {
        get: function get() {
            return this._isReverse;
        },
        set: function set(isReverse) {
            this._isReverse = isReverse;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "maskArray", {
        get: function get() {
            return this.isReverse ? this._reverseMaskArray : this._maskArray;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "toX", {
        get: function get() {
            return this._toX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "toY", {
        get: function get() {
            return this._toY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "isOpenFork", {
        get: function get() {
            return this._isOpenFork;
        },
        // ウインドウ表示状態の切り替え用setter
        set: function set(isOpen) {
            this._isOpenFork = isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "isOpenInfo", {
        get: function get() {
            return this._isOpenInfo;
        },
        set: function set(isOpen) {
            this._isOpenInfo = isOpen;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "unsetPieces", {
        get: function get() {
            return this._unsetPieces;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "setKomaKind", {
        get: function get() {
            return this._setKomaKind;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "editX", {
        get: function get() {
            return this._editX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "editY", {
        get: function get() {
            return this._editY;
        },
        enumerable: true,
        configurable: true
    });
    // 棋譜の操作
    AppData.prototype.load = function (jkf) {
        !jkf.hasOwnProperty('header') ? jkf['header'] = this._headerInfo : this._headerInfo = jkf['header'];
        if (!jkf.hasOwnProperty('moves')) jkf['moves'] = [];
        this.jkfEditor.load(jkf);
    };
    AppData.prototype["export"] = function () {
        var exportJkf = this.jkfEditor["export"]();
        var jsonURI = 'data:application/octet-stream,' + encodeURIComponent(JSON.stringify(exportJkf));
        this.downloadURI(jsonURI, 'jkf.json');
    };
    AppData.prototype.switchFork = function (forkIndex) {
        this.jkfEditor.switchFork(forkIndex);
        this.isOpenFork = false;
    };
    AppData.prototype.deleteFork = function (forkIndex) {
        this.jkfEditor.deleteFork(forkIndex);
    };
    // 棋譜の情報
    AppData.prototype.haveFork = function (num) {
        return this.jkfEditor.haveFork(num);
    };
    Object.defineProperty(AppData.prototype, "board", {
        get: function get() {
            return this.state === const_1.STATE.EDITBOARD || this.state === const_1.STATE.EDITINFO && this.initBoardPreset === 'OTHER' ? this._createBoard : this.isReverse ? this.jkfEditor.reverseBoard : this.jkfEditor.board;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "currentNum", {
        get: function get() {
            return this.jkfEditor.currentNum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "hands", {
        get: function get() {
            return this.state === const_1.STATE.EDITBOARD ? this._createHands : this.jkfEditor.hands;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "color", {
        get: function get() {
            return this.jkfEditor.color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "moves", {
        get: function get() {
            return this.jkfEditor.moves;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "forks", {
        get: function get() {
            return this.jkfEditor.nextMoves;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppData.prototype, "forkIndex", {
        get: function get() {
            return this.jkfEditor.nextSelect;
        },
        enumerable: true,
        configurable: true
    });
    // 棋譜情報変更用のsetter
    AppData.prototype.setHeader = function (key, value) {
        if (this.state === const_1.STATE.EDITMOVE) {
            this._headerInfo[key] = value;
        }
    };
    // 盤面マスク用の配列を生成する
    AppData.prototype.setMask = function (maskArray) {
        this._maskArray = maskArray;
        this._reverseMaskArray = util_1["default"].reverseBoard(maskArray);
    };
    // 指定したファイルパスをダウンロードする
    AppData.prototype.downloadURI = function (uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // 新規作成用の盤面情報からmaskArrayを作成する
    AppData.prototype.createMask = function (boardArray) {
        return boardArray.map(function (boardRow) {
            return boardRow.map(function (boardObj) {
                return boardObj['kind'] ? 1 : 0;
            });
        });
    };
    // 新規盤面に駒を配置する
    AppData.prototype.setCreateBoard = function (posX, posY, kind) {
        if (this.unsetPieces[kind]) {
            var ax = 9 - posX;
            var ay = posY - 1;
            if (!this._createBoard[ay][ax]['kind']) {
                this.unsetPieces[kind]--;
                if (!this.unsetPieces[kind]) {
                    delete this.unsetPieces[kind];
                }
                this._createBoard[ay][ax] = { kind: kind, color: const_1.PLAYER.SENTE };
            }
        }
        this.setMask(this.createMask(this._createBoard));
    };
    // 新規盤面上の駒を削除する
    AppData.prototype.unsetCreateBoard = function (posX, posY) {
        var ax = 9 - posX;
        var ay = posY - 1;
        if (this._createBoard[ay][ax]['kind']) {
            var kind = util_1["default"].getDemote(this._createBoard[ay][ax]['kind']);
            this.unsetPieces[kind] = this.unsetPieces[kind] ? this.unsetPieces[kind] + 1 : 1;
            this._createBoard[ay][ax] = {};
        }
        this.setMask(this.createMask(this._createBoard));
    };
    // 新規盤面上の駒の先後を変更する
    AppData.prototype.switchColorCreateBoard = function (posX, posY) {
        var ax = 9 - posX;
        var ay = posY - 1;
        if (this._createBoard[ay][ax]['kind']) {
            this._createBoard[ay][ax]['color'] = this._createBoard[ay][ax]['color'] === const_1.PLAYER.SENTE ? const_1.PLAYER.GOTE : const_1.PLAYER.SENTE;
        }
    };
    // 新規盤面上の駒の成・不成を変更する
    AppData.prototype.switchNariCreateBoard = function (posX, posY) {
        var ax = 9 - posX;
        var ay = posY - 1;
        if (this._createBoard[ay][ax]['kind']) {
            this._createBoard[ay][ax]['kind'] = util_1["default"].canPromote(this._createBoard[ay][ax]['kind']) ? util_1["default"].getPromote(this._createBoard[ay][ax]['kind']) : util_1["default"].getDemote(this._createBoard[ay][ax]['kind']);
        }
    };
    // 新規盤面の初期持ち駒を追加する
    AppData.prototype.addHandCreateBoard = function (player, kind) {
        if (this.unsetPieces[kind]) {
            this._createHands[player][kind] = this._createHands[player][kind] ? this._createHands[player][kind] + 1 : 1;
            this.unsetPieces[kind]--;
            if (!this.unsetPieces[kind]) {
                delete this.unsetPieces[kind];
            }
        }
    };
    // 新規盤面の初期持ち駒を削除する
    AppData.prototype.removeHandCreateBoard = function (player, kind) {
        if (this._createHands[player][kind]) {
            this._createHands[player][kind]--;
            if (!this._createHands[player][kind]) {
                delete this._createHands[player][kind];
            }
            this.unsetPieces[kind] = this.unsetPieces[kind] ? this.unsetPieces[kind] + 1 : 1;
        }
    };
    return AppData;
}();
exports["default"] = AppData;
},{"jkfeditor":61,"@taoqf/javascript-state-machine":62,"./const":51,"./util":59}],58:[function(require,module,exports) {
/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg) && arg.length) {
				var inner = classNames.apply(null, arg);
				if (inner) {
					classes.push(inner);
				}
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],52:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var SingleComponentBasic = /** @class */function () {
    function SingleComponentBasic(appdata) {
        this.appData = appdata;
    }
    SingleComponentBasic.getInstance = function (c, appData) {
        if (this._instance == null) {
            this._instance = new c(appData);
        } else {
            this._instance.appdata = appData;
        }
        return this._instance;
    };
    SingleComponentBasic.prototype.view = function (vnode) {
        return [];
    };
    return SingleComponentBasic;
}();
exports["default"] = SingleComponentBasic;
},{}],60:[function(require,module,exports) {
"use strict";
// ひとつの駒のコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var util_1 = __importDefault(require("../util"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var const_1 = require("../const");
var Koma = /** @class */function (_super) {
    __extends(Koma, _super);
    function Koma() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hoverX = -1;
        _this.hoverY = -1;
        return _this;
    }
    Koma.prototype.view = function (vnode) {
        var _this = this;
        // 駒の種類と持ち主
        var kind = util_1["default"].getAttr(vnode, 'kind');
        var color = util_1["default"].getAttr(vnode, 'color') ? util_1["default"].getAttr(vnode, 'color') : 0;
        // 駒の枚数
        var komaNum = util_1["default"].getAttr(vnode, 'komaNum') ? util_1["default"].getAttr(vnode, 'komaNum') : 1;
        // 駒の表示モード
        var dispType = util_1["default"].getAttr(vnode, 'dispType') ? util_1["default"].getAttr(vnode, 'dispType') : const_1.KOMATYPE.NORMAL;
        // 駒の座標
        var posX = util_1["default"].getAttr(vnode, 'posX');
        var posY = util_1["default"].getAttr(vnode, 'posY');
        // そのエリアに移動時に強制成の必要があるかどうか
        var forcePromote = util_1["default"].getAttr(vnode, 'forcePromote');
        // 対象の駒が盤に配置しようとしている駒かどうか
        var setTarget = util_1["default"].getAttr(vnode, 'setTarget');
        // 未配置駒かどうか
        var isUnset = util_1["default"].getAttr(vnode, 'isUnset');
        // その場所に配置可能かどうか
        var isReady = false;
        // 編集モードに移行可能かどうか
        var isEditable = false;
        // ホバー時に何らかの処理を行うかどうか
        var isHoverable = false;
        var komaProp = {};
        var colorClass = null;
        var clickAction = null;
        var mouseoverAction = null;
        var mouseoutAction = null;
        if (dispType === const_1.KOMATYPE.FROM) {
            colorClass = 'is-blue';
            clickAction = function clickAction() {
                _this.appData.edit_inputFrom(posX, posY, kind);
            };
        } else if (dispType === const_1.KOMATYPE.TO) {
            colorClass = 'is-red';
            clickAction = function clickAction() {
                _this.appData.edit_inputTo(posX, posY, forcePromote);
            };
        } else if (dispType === const_1.KOMATYPE.NORMAL) {
            if (setTarget) {
                colorClass = 'is-green';
            }
            if (this.appData.state === const_1.STATE.EDITMOVE) {
                clickAction = function clickAction() {
                    _this.appData.edit_inputReset();
                };
            } else if (this.appData.state === const_1.STATE.EDITBOARD) {
                // unset、持ち駒、盤上の駒で処理が異なる
                if (isUnset) {
                    // unsetの場合
                    clickAction = function clickAction() {
                        if (setTarget) {
                            _this.appData.create_inputReset();
                        } else {
                            _this.appData.create_inputKind(kind);
                        }
                    };
                } else {
                    if (posX === -1 && posY === -1) {
                        // 持ち駒の場合
                        if (this.appData.createState === const_1.CREATESTATE.INPUTKIND) {
                            colorClass = 'is-blue';
                            clickAction = function clickAction() {
                                _this.appData.removeHandCreateBoard(color, kind);
                                if (_this.appData.hands[kind]) {
                                    _this.appData.create_inputReset();
                                }
                            };
                        }
                    } else {
                        // 盤上の駒の場合
                        if (this.appData.createState === const_1.CREATESTATE.INPUTKIND) {
                            isHoverable = true;
                            if (posX === this.hoverX && posY === this.hoverY && kind) {
                                colorClass = 'is-blue';
                                isEditable = true;
                            }
                        }
                        clickAction = function clickAction() {
                            if (_this.appData.createState === const_1.CREATESTATE.INPUTKIND) {
                                _this.appData.create_komaEdit(posX, posY);
                            } else {
                                _this.setHover(posX, posY);
                                _this.appData.create_inputReset();
                            }
                        };
                    }
                }
            }
        } else if (dispType === const_1.KOMATYPE.KIND) {
            colorClass = 'is-blue';
            clickAction = function clickAction() {
                _this.appData.create_inputKind(kind);
            };
        } else if (dispType === const_1.KOMATYPE.POS) {
            isHoverable = true;
            clickAction = function clickAction() {
                _this.appData.create_inputPos(posX, posY);
            };
            if (posX === this.hoverX && posY === this.hoverY && !kind) {
                kind = this.appData.setKomaKind;
                isReady = true;
            }
        } else if (dispType === const_1.KOMATYPE.EDIT) {
            clickAction = function clickAction() {};
        }
        if (isHoverable) {
            mouseoverAction = function mouseoverAction() {
                _this.setHover(posX, posY);
            };
            mouseoutAction = function mouseoutAction() {
                _this.setHover(-1, -1);
            };
        } else {
            this.setHover(-1, -1);
        }
        komaProp['class'] = classNames_1["default"](colorClass);
        if (clickAction) komaProp['onclick'] = clickAction;
        if (mouseoverAction) komaProp['onmouseenter'] = mouseoverAction;
        if (mouseoutAction) komaProp['onmouseleave'] = mouseoutAction;
        return [mithril_1["default"]('.c-koma_piece_base', komaProp, [
        // 駒状態の編集
        dispType === const_1.KOMATYPE.EDIT ? mithril_1["default"]('.c-koma_menu_container', [mithril_1["default"]('.c-koma_half_button.is-change', {
            onclick: function onclick(e) {
                _this.appData.switchColorCreateBoard(posX, posY);
                _this.appData.create_inputReset();
                e.stopPropagation();
            }
        }, color !== const_1.PLAYER.SENTE ? '先手' : '後手'), mithril_1["default"]('.c-koma_half_button.is-nari', {
            onclick: function onclick(e) {
                _this.appData.switchNariCreateBoard(posX, posY);
                _this.appData.create_inputReset();
                e.stopPropagation();
            }
        }, util_1["default"].isPromoted(kind) ? '不成' : '成り')]) : null,
        // 駒の成・不成
        dispType === const_1.KOMATYPE.PROMOTE ? mithril_1["default"]('.c-koma_menu_container', [mithril_1["default"]('.c-koma_half_button.is-nari', {
            onclick: function onclick() {
                _this.appData.edit_inputNari(true);
            }
        }, '成'), mithril_1["default"]('.c-koma_half_button.is-funari', {
            onclick: function onclick() {
                _this.appData.edit_inputNari(false);
            }
        }, '不成')]) : null, isEditable ? mithril_1["default"]('.c-koma_menu_container', [mithril_1["default"]('.delete.is-small', {
            onclick: function onclick(e) {
                _this.appData.unsetCreateBoard(posX, posY);
                e.stopPropagation();
            }
        })]) : null, komaNum > 1 ? mithril_1["default"]('.c-koma_piece_num', komaNum) : null, mithril_1["default"]('.c-koma_piece', { "class": classNames_1["default"](kind ? util_1["default"].komaClassName(kind, color, this.appData.isReverse) : null, isReady ? 'is-ready' : false) })])];
    };
    Koma.prototype.setHover = function (posX, posY) {
        this.hoverX = posX;
        this.hoverY = posY;
    };
    return Koma;
}(singleComponentBasic_1["default"]);
exports["default"] = Koma;
},{"mithril":5,"classNames":58,"../util":59,"../singleComponentBasic":52,"../const":51}],11:[function(require,module,exports) {
"use strict";
// 将棋盤のコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var koma_1 = __importDefault(require("./koma"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var const_1 = require("../const");
var util_1 = __importDefault(require("../util"));
var ShogiBan = /** @class */function (_super) {
    __extends(ShogiBan, _super);
    function ShogiBan() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShogiBan.prototype.oninit = function () {
        this.koma = koma_1["default"].getInstance(koma_1["default"], this.appData);
        this.handArray = [];
        this.handArray[const_1.PLAYER.SENTE] = [[]];
    };
    ShogiBan.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('.c-shogiBan_koma', [
        // 盤の描画
        mithril_1["default"]('.c-shogiBan', this.appData.board.map(function (boardRow, ay) {
            return mithril_1["default"]('.c-koma_row', boardRow.map(function (piece, ax) {
                var komaInfo = _this.getBoardKomaProp(piece['kind'], piece['color'], ax, ay);
                return mithril_1["default"](_this.koma, komaInfo);
            }));
        })),
        // 持ち駒の描画(盤面編集時は編集用メニュー)
        mithril_1["default"]('.c-shogiBan_hand_place', [mithril_1["default"]('.c-shogiBan_hand.c-shogiBan_oppo_hand', [this.appData.state === const_1.STATE.EDITBOARD ? [mithril_1["default"]('.c-shogiBan_hand_pieces.is-oppoHands', {
            "class": classNames_1["default"](this.goteHandHover ? 'is-adding' : null),
            onclick: function onclick() {
                if (_this.appData.createState === const_1.CREATESTATE.INPUTPOS) {
                    _this.appData.addHandCreateBoard(const_1.PLAYER.GOTE, _this.appData.setKomaKind);
                    if (!_this.appData.unsetPieces[_this.appData.setKomaKind]) {
                        _this.appData.create_inputReset();
                    }
                }
            }
        }, [mithril_1["default"]('.c-shogiBan_hand_pieces_inner', [this.getHand(this.appData.hands[const_1.PLAYER.GOTE]).map(function (handRow) {
            return mithril_1["default"]('div.c-koma_row', [Object.keys(handRow).map(function (kind) {
                var komaInfo = _this.getHandKomaProp(kind, const_1.PLAYER.GOTE, handRow[kind]);
                return mithril_1["default"](_this.koma, komaInfo);
            })]);
        })]), mithril_1["default"]('.c-shogiBan_hand_owner', {
            onmouseenter: function onmouseenter() {
                // 持ち駒に駒を加えるときのホバー処理
                if (_this.appData.setKomaKind) {
                    _this.goteHandHover = true;
                }
            },
            onmouseleave: function onmouseleave() {
                _this.goteHandHover = false;
            }
        }, this.goteHandHover ? '初期持ち駒追加' : '後手持ち駒')]), mithril_1["default"]('.c-shogiBan_hand_pieces.is-propHands', {
            "class": classNames_1["default"](this.senteHandHover ? 'is-adding' : null),
            onclick: function onclick() {
                if (_this.appData.createState === const_1.CREATESTATE.INPUTPOS) {
                    _this.appData.addHandCreateBoard(const_1.PLAYER.SENTE, _this.appData.setKomaKind);
                    if (!_this.appData.unsetPieces[_this.appData.setKomaKind]) {
                        _this.appData.create_inputReset();
                    }
                }
            }
        }, [mithril_1["default"]('.c-shogiBan_hand_pieces_inner', [this.getHand(this.appData.hands[const_1.PLAYER.SENTE]).map(function (handRow) {
            return mithril_1["default"]('div.c-koma_row', [Object.keys(handRow).map(function (kind) {
                var komaInfo = _this.getHandKomaProp(kind, const_1.PLAYER.SENTE, handRow[kind]);
                return mithril_1["default"](_this.koma, komaInfo);
            })]);
        })]), mithril_1["default"]('.c-shogiBan_hand_owner', {
            onmouseenter: function onmouseenter() {
                // 持ち駒に駒を加えるときのホバー処理
                if (_this.appData.setKomaKind) {
                    _this.senteHandHover = true;
                }
            },
            onmouseleave: function onmouseleave() {
                _this.senteHandHover = false;
            }
        }, this.senteHandHover ? '初期持ち駒追加' : '先手持ち駒')])] : mithril_1["default"]('.c-shogiBan_hand_pieces', [this.getHand(this.appData.hands[const_1.PLAYER.GOTE]).map(function (handRow) {
            return mithril_1["default"]('div.c-koma_row', [Object.keys(handRow).map(function (kind) {
                var komaInfo = _this.getHandKomaProp(kind, const_1.PLAYER.GOTE, handRow[kind]);
                return mithril_1["default"](_this.koma, komaInfo);
            })]);
        })]), mithril_1["default"]('.c-shogiBan_hand_base')]), mithril_1["default"]('.c-shogiBan_hand', { "class": classNames_1["default"]('c-shogiBan_prop_hand') }, [this.appData.state === const_1.STATE.EDITBOARD ? [mithril_1["default"]('.c-shogiBan_hand_pieces', [this.getHand(this.appData.unsetPieces).map(function (handRow) {
            return mithril_1["default"]('div.c-koma_row', [Object.keys(handRow).map(function (kind) {
                var komaInfo = _this.getUnsetKomaProp(kind, const_1.PLAYER.SENTE, handRow[kind]);
                return mithril_1["default"](_this.koma, komaInfo);
            })]);
        })]), mithril_1["default"]('.c-shogiBan_hand_pieces.is-button', mithril_1["default"]('.c-shogiBan_createButton', mithril_1["default"]('.button.is-primary', {
            onclick: function onclick() {
                _this.appData.switch_EDITINFO(const_1.BAN.CUSTOM);
            }
        }, '盤面編集完了')))] : mithril_1["default"]('.c-shogiBan_hand_pieces', [this.getHand(this.appData.hands[const_1.PLAYER.SENTE]).map(function (handRow) {
            return mithril_1["default"]('.c-koma_row', [Object.keys(handRow).map(function (kind) {
                var komaInfo = _this.getHandKomaProp(kind, const_1.PLAYER.SENTE, handRow[kind]);
                return mithril_1["default"](_this.koma, komaInfo);
            })]);
        })]), mithril_1["default"]('.c-shogiBan_hand_base')])])]), mithril_1["default"]('.c-shogiBan_grid', { "class": classNames_1["default"](this.appData.isReverse ? 'is-reverse' : null) })];
    };
    ShogiBan.prototype.getHand = function (hands) {
        var handArray = [];
        var count = 0;
        var tmpObj = null;
        Object.keys(hands).forEach(function (key) {
            if (count === 0) {
                var partObj = {};
                tmpObj = partObj;
            }
            tmpObj[key] = hands[key];
            count++;
            if (count === 4) {
                handArray.push(tmpObj);
                tmpObj = null;
                count = 0;
            }
        });
        if (tmpObj && Object.keys(tmpObj).length) handArray.push(tmpObj);
        return handArray;
    };
    // 盤に配置する駒の属性を設定する
    ShogiBan.prototype.getBoardKomaProp = function (kind, color, ax, ay) {
        var pos = util_1["default"].getKifuPos(ax, ay, this.appData.isReverse);
        var komaInfo = { kind: kind, color: color, komaNum: 1, dispType: const_1.KOMATYPE.NORMAL, posX: pos.x, posY: pos.y };
        if (this.appData.state === const_1.STATE.EDITMOVE) {
            if (this.appData.maskArray[ay][ax]) {
                // 各編集ステートで盤面マスクの対象となっているとき
                if (this.appData.editState === const_1.EDITSTATE.INPUTFROM) {
                    komaInfo.dispType = const_1.KOMATYPE.FROM;
                } else if (this.appData.editState === const_1.EDITSTATE.INPUTTO) {
                    komaInfo.dispType = const_1.KOMATYPE.TO;
                    if (this.appData.maskArray[ay][ax] === 2) {
                        komaInfo['forcePromote'] = true;
                    }
                } else if (this.appData.editState === const_1.EDITSTATE.INPUTNARI && this.appData.toX === pos.x && this.appData.toY === pos.y) {
                    komaInfo.dispType = const_1.KOMATYPE.PROMOTE;
                }
            }
        } else if (this.appData.state === const_1.STATE.EDITBOARD) {
            if (this.appData.createState === const_1.CREATESTATE.KOMAEDIT) {
                if (this.appData.editX === pos.x && this.appData.editY === pos.y) {
                    komaInfo.dispType = const_1.KOMATYPE.EDIT;
                }
            } else if (!this.appData.maskArray[ay][ax]) {
                komaInfo.dispType = const_1.KOMATYPE.POS;
            }
        }
        return komaInfo;
    };
    // 持ち駒として描画する駒の属性を設定する
    ShogiBan.prototype.getHandKomaProp = function (kind, color, komaNum) {
        if (komaNum === void 0) {
            komaNum = 1;
        }
        // 持ち駒の座標情報はx: -1, y: -1 とする
        var komaInfo = { kind: kind, color: color, komaNum: komaNum, dispType: const_1.KOMATYPE.NORMAL, posX: -1, posY: -1 };
        if (this.appData.state === const_1.STATE.EDITMOVE) {
            if (this.appData.editState === const_1.EDITSTATE.INPUTFROM && color === util_1["default"].oppoPlayer(this.appData.color)) {
                komaInfo.dispType = const_1.KOMATYPE.FROM;
            }
        } else if (this.appData.state === const_1.STATE.EDITBOARD) {}
        return komaInfo;
    };
    // 未配置駒として描画する駒の属性を設定する
    ShogiBan.prototype.getUnsetKomaProp = function (kind, color, komaNum) {
        if (komaNum === void 0) {
            komaNum = 1;
        }
        // 持ち駒の座標情報はx: -1, y: -1 とする
        var komaInfo = { kind: kind, color: color, komaNum: komaNum, dispType: const_1.KOMATYPE.NORMAL, posX: -1, posY: -1 };
        komaInfo['isUnset'] = true;
        if (this.appData.state === const_1.STATE.EDITBOARD) {
            if (this.appData.createState === const_1.CREATESTATE.INPUTKIND) {
                komaInfo.dispType = const_1.KOMATYPE.KIND;
            } else if (this.appData.createState === const_1.CREATESTATE.INPUTPOS) {
                if (kind === this.appData.setKomaKind) {
                    komaInfo['setTarget'] = true;
                }
            }
        }
        return komaInfo;
    };
    return ShogiBan;
}(singleComponentBasic_1["default"]);
exports["default"] = ShogiBan;
},{"mithril":5,"classNames":58,"./koma":60,"../singleComponentBasic":52,"../const":51,"../util":59}],12:[function(require,module,exports) {
"use strict";
// 指し手情報リストのコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var const_1 = require("../const");
var MoveList = /** @class */function (_super) {
    __extends(MoveList, _super);
    function MoveList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoveList.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('.c-kifu_container', [mithril_1["default"]('.c-kifu_title', this.appData.title), mithril_1["default"]('.c-kifu_listContainer', [mithril_1["default"]('.c-kifu_list', {
            onupdate: function onupdate(vnode) {
                var targetHeight = _this.appData.currentNum * 24;
                // スクロール位置の調整
                vnode.dom.scrollTop = targetHeight - 480;
            }
        }, [this.appData.moves.map(function (move, num) {
            var isActive = false;
            if (num === _this.appData.currentNum) {
                isActive = true;
            }
            var dispComment = false;
            if (_this.appData.state === const_1.STATE.VIEW && move.comments) {
                dispComment = true;
            }
            var dispBranch = false;
            if (_this.appData.kifuType === const_1.KIFUTYPE.JOSEKI) {
                // 最後の指し手では分岐指し手アイコンを表示しない
                if (num !== _this.appData.moves.length - 1 && (isActive || _this.appData.haveFork(num))) {
                    dispBranch = true;
                }
            } else {
                if (_this.appData.haveFork(num)) {
                    dispBranch = true;
                }
            }
            var dispDelete = false;
            if (_this.appData.state === const_1.STATE.EDITMOVE && num === _this.appData.currentNum && num !== 0) {
                dispDelete = true;
            }
            return mithril_1["default"]('.c-kifu_row', {
                "class": classNames_1["default"](isActive ? 'is-active' : null),
                onclick: function onclick() {
                    if (!isActive) {
                        _this.appData.go(num);
                    }
                }
            }, [mithril_1["default"]('.c-kifu_move_info', [mithril_1["default"]('.c-kifu_number', num + ':'),
            // 6文字以上なら小さく表示
            mithril_1["default"]('.c-kifu_move', { "class": classNames_1["default"](move.name.length >= 6 ? 'is-small' : null) }, move.name), mithril_1["default"]('.c-kifu_notation', [dispComment ? mithril_1["default"]('span', { "class": classNames_1["default"]('c-kifu_notation_comment', 'icon', 'is-small') }, [mithril_1["default"]('i.fa.fa-commenting-o')]) : null, dispBranch ? mithril_1["default"]('span.c-kifu_notation_branch.icon.is-small', {
                onclick: function onclick() {
                    _this.appData.isOpenFork = true;
                }
            }, [mithril_1["default"]('i.far.fa-clone')]) : null, dispDelete ? mithril_1["default"]('span.c-kifu_notation_close.icon.is-small', {
                onclick: function onclick() {
                    _this.appData.deleteMove(num);
                }
            }, [mithril_1["default"]('i.fa.fa-times.fa-lg')]) : null])])]);
        })]),
        // 分岐候補を表示するウインドウ
        mithril_1["default"]('.c-kifu_fork', { "class": classNames_1["default"](this.appData.isOpenFork ? 'is-active' : null) }, [mithril_1["default"]('.c-kifu_select', [mithril_1["default"]('.c-kifu_move_info', [mithril_1["default"]('.c-kifu_forkTitle', '次の指し手候補'), mithril_1["default"]('.c-kifu_notation', [mithril_1["default"]('span', { onclick: function onclick() {
                _this.appData.isOpenFork = false;
            } }, mithril_1["default"]('i.fa.fa-times.fa-lg'))])])]), this.appData.forks.map(function (forkMove, forkNum) {
            // 指し手編集モードで、指し手候補を複数持つ場合に、現在選択中の指し手候補以外が削除可能になる
            var isDeletable = _this.appData.state === const_1.STATE.EDITMOVE && _this.appData.forks.length > 1 && forkNum !== _this.appData.forkIndex ? true : false;
            return mithril_1["default"]('.c-kifu_row.c-kifu_forkRow', {
                "class": _this.appData.forkIndex === forkNum ? 'is-active' : null,
                onclick: function onclick() {
                    _this.appData.switchFork(forkNum);
                }
            }, mithril_1["default"]('.c-kifu_move_info', [mithril_1["default"]('div', { "class": classNames_1["default"]('c-kifu_number') }, forkNum + ':'), mithril_1["default"]('div', { "class": classNames_1["default"]('c-kifu_move') }, forkMove.name), isDeletable ? mithril_1["default"]('.c-kifu_notation', [mithril_1["default"]('span.c-kifu_notation_close.icon.is-small', {
                onclick: function onclick(e) {
                    _this.appData.deleteFork(forkNum);
                    e.stopPropagation();
                }
            }, mithril_1["default"]('i.fa.fa-times.fa-lg'))]) : null]));
        }), mithril_1["default"]('.c-kifu_row.c-kifu_addRow', {
            onclick: function onclick() {
                _this.appData.addForkMove();
            }
        }, mithril_1["default"]('.c-kifu_move_info', [this.appData.editState === const_1.EDITSTATE.INPUTFROM ? [mithril_1["default"]('div', { "class": classNames_1["default"]('c-kifu_number') }, mithril_1["default"]('span.icon.is-small', mithril_1["default"]('i.fa.fa-exclamation-circle'))), mithril_1["default"]('div.c-kifu_move.c-kifu_move_input', '分岐を入力して下さい')] : [mithril_1["default"]('div', { "class": classNames_1["default"]('c-kifu_number') }, mithril_1["default"]('span.icon.is-small', mithril_1["default"]('i.fa.fa-plus'))), mithril_1["default"]('div.c-kifu_move', '分岐を追加')]]))]), mithril_1["default"]('.c-kifu_blackOut', { "class": classNames_1["default"](this.appData.isOpenFork ? 'is-active' : null) })])])];
    };
    return MoveList;
}(singleComponentBasic_1["default"]);
exports["default"] = MoveList;
},{"mithril":5,"classNames":58,"../singleComponentBasic":52,"../const":51}],57:[function(require,module,exports) {
"use strict";
// ひとつのツールボタンのコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var util_1 = __importDefault(require("../util"));
var ToolButton = /** @class */function (_super) {
    __extends(ToolButton, _super);
    function ToolButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolButton.prototype.view = function (vnode) {
        var title = util_1["default"].getAttr(vnode, 'title') ? util_1["default"].getAttr(vnode, 'title') : 'ボタン名';
        var iconClass = util_1["default"].getAttr(vnode, 'iconClass');
        var isActive = util_1["default"].getAttr(vnode, 'isActive');
        var action = util_1["default"].getAttr(vnode, 'action');
        var isSmall = util_1["default"].getAttr(vnode, 'isSmall');
        var color = util_1["default"].getAttr(vnode, 'color');
        return [mithril_1["default"]('button.button.is-tooltip-info', {
            disabled: !isActive,
            onclick: action,
            'data-tooltip': title,
            "class": classNames_1["default"](color, isActive ? 'tooltip' : null)
        }, [mithril_1["default"]('span.icon', mithril_1["default"]('i.fa', { "class": iconClass }))])];
    };
    return ToolButton;
}(singleComponentBasic_1["default"]);
exports["default"] = ToolButton;
},{"mithril":5,"classNames":58,"../singleComponentBasic":52,"../util":59}],13:[function(require,module,exports) {
"use strict";
// 編集・閲覧用のボタン群のコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var toolButton_1 = __importDefault(require("./toolButton"));
var const_1 = require("../const");
var ToolBar = /** @class */function (_super) {
    __extends(ToolBar, _super);
    function ToolBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolBar.prototype.oninit = function () {
        this.toolButton = toolButton_1["default"].getInstance(toolButton_1["default"], this.appData);
    };
    ToolBar.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('.c-tool_comment', '初期盤面新規作成'), mithril_1["default"]('.c-tool_button', [
        // 一段目のツールボタンはどのステートでも表示する
        mithril_1["default"]('.c-tool_button_container', [mithril_1["default"](this.toolButton, {
            title: '一番最初へ',
            iconClass: classNames_1["default"]('fa-fast-backward'),
            action: function action() {
                _this.appData.go(0);
            },
            isActive: this.appData.currentNum ? true : false
        }), mithril_1["default"](this.toolButton, {
            title: '一つ戻る',
            iconClass: classNames_1["default"]('fa-chevron-left'),
            action: function action() {
                _this.appData.go(_this.appData.currentNum - 1);
            },
            isActive: this.appData.currentNum ? true : false
        }), mithril_1["default"](this.toolButton, {
            title: '一つ進む',
            iconClass: classNames_1["default"]('fa-chevron-right'),
            action: function action() {
                _this.appData.go(_this.appData.currentNum + 1);
            },
            isActive: this.appData.currentNum < this.appData.moves.length - 1 ? true : false
        }), mithril_1["default"](this.toolButton, {
            title: '一番最後へ',
            iconClass: classNames_1["default"]('fa-fast-forward'),
            action: function action() {
                _this.appData.go(_this.appData.moves.length - 1);
            },
            isActive: this.appData.currentNum < this.appData.moves.length - 1 ? true : false
        })]), mithril_1["default"]('.c-tool_button_container', [mithril_1["default"](this.toolButton, {
            title: '先後交代',
            iconClass: classNames_1["default"]('fa-exchange-alt', 'fa-rotate-90'),
            action: function action() {
                _this.appData.isReverse = !_this.appData.isReverse;
            },
            isActive: this.appData.state !== const_1.STATE.EDITBOARD ? true : false,
            color: this.appData.isReverse ? 'is-danger' : null
        }), mithril_1["default"](this.toolButton, {
            title: '棋譜情報表示',
            iconClass: classNames_1["default"]('fa-info-circle'),
            action: function action() {
                _this.appData.isOpenInfo = !_this.appData.isOpenInfo;
            },
            isActive: this.appData.state === const_1.STATE.EDITMOVE || this.appData.state === const_1.STATE.VIEW ? true : false,
            color: this.appData.isOpenInfo ? 'is-danger' : null
        }), mithril_1["default"](this.toolButton, {
            title: 'jkfエクスポート',
            iconClass: classNames_1["default"]('fa-file-export'),
            action: function action() {
                _this.appData["export"]();
            },
            isActive: this.appData.state === const_1.STATE.EDITMOVE || this.appData.state === const_1.STATE.VIEW ? true : false
        })])])];
    };
    return ToolBar;
}(singleComponentBasic_1["default"]);
exports["default"] = ToolBar;
},{"mithril":5,"classNames":58,"../singleComponentBasic":52,"./toolButton":57,"../const":51}],53:[function(require,module,exports) {
"use strict";
// 編集用メニューのコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var singleComponentBasic_1 = __importDefault(require("../../singleComponentBasic"));
var TopMenu = /** @class */function (_super) {
    __extends(TopMenu, _super);
    function TopMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopMenu.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('label.label.is-main.c-shogiBan_menu_label', 'JKFEdit Menu'), mithril_1["default"]('.field.c-shogiBan_menu_button', [mithril_1["default"]('.control.button.is-primary', {
            onclick: function onclick() {
                _this.appData.switch_NEWKIFU();
            }
        }, '棋譜の新規作成')]), mithril_1["default"]('.field.c-shogiBan_menu_button', [mithril_1["default"]('.control.button.is-primary', {
            onclick: function onclick() {
                _this.appData.switch_LOADKIFU();
            }
        }, '棋譜の読み込み')])];
    };
    return TopMenu;
}(singleComponentBasic_1["default"]);
exports["default"] = TopMenu;
},{"mithril":5,"../../singleComponentBasic":52}],54:[function(require,module,exports) {
"use strict";
// 新規棋譜メニューのコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var const_1 = require("../../const");
var util_1 = __importDefault(require("../../util"));
var singleComponentBasic_1 = __importDefault(require("../../singleComponentBasic"));
var NewKifuMenu = /** @class */function (_super) {
    __extends(NewKifuMenu, _super);
    function NewKifuMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewKifuMenu.prototype.oninit = function () {
        this.kifuTitle = '';
        this.boardType = 0;
        this.komaochiType = 0;
        this.kifuType = 0;
    };
    NewKifuMenu.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('label.label.c-shogiBan_menu_label.is-main', '新規作成'), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label', 'タイトル(必須)'), mithril_1["default"]('.field', mithril_1["default"]('.control', [mithril_1["default"]('input.input.is-primary', {
            maxlength: 32,
            type: 'text',
            value: this.kifuTitle,
            placeholder: '棋譜タイトルを入力',
            oninput: mithril_1["default"].withAttr('value', function (title) {
                _this.kifuTitle = title;
            })
        })])), mithril_1["default"]('label.label.c-shogiBan_menu_label', '初期盤面'), mithril_1["default"]('.control', [mithril_1["default"]('.select', [mithril_1["default"]('select', {
            selected: this.boardType,
            onchange: mithril_1["default"].withAttr('selectedIndex', function (value) {
                _this.boardType = value;
                switch (_this.boardType) {
                    case const_1.BAN.HIRATE:
                        _this.appData.load({ header: {}, initial: { preset: 'HIRATE' }, moves: [{}] });
                        break;
                    case const_1.BAN.KOMAOCHI:
                        _this.appData.load({ header: {}, initial: { preset: 'KY' }, moves: [{}] });
                        break;
                    case const_1.BAN.CUSTOM:
                        _this.appData.load({ header: {}, initial: { preset: 'HIRATE' }, moves: [{}] });
                        break;
                }
            })
        }, [mithril_1["default"]('option', '平手'), mithril_1["default"]('option', '駒落ち'), mithril_1["default"]('option', 'カスタム')])])])]),
        // 駒落ちを選択した場合のみ表示
        this.boardType === const_1.BAN.KOMAOCHI ? [mithril_1["default"]('.c-shogiBan_menu_komaochi.field', [mithril_1["default"]('label.label.c-shogiBan_menu_label', '駒落ち詳細')]), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('.control', [mithril_1["default"]('.select', [mithril_1["default"]('select', {
            selected: this.komaochiType,
            onchange: mithril_1["default"].withAttr('selectedIndex', function (value) {
                _this.komaochiType = value;
                _this.appData.load({ header: {}, initial: { preset: util_1["default"].komaochiName(_this.komaochiType) }, moves: [{}] });
            })
        }, [mithril_1["default"]('option', '香落ち'), mithril_1["default"]('option', '角落ち'), mithril_1["default"]('option', '飛車落ち'), mithril_1["default"]('option', '飛香落ち'), mithril_1["default"]('option', '二枚落ち'), mithril_1["default"]('option', '四枚落ち'), mithril_1["default"]('option', '六枚落ち'), mithril_1["default"]('option', '八枚落ち')])])])])] : null, mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label', '入力形式'), mithril_1["default"]('.control', [mithril_1["default"]('.select', [mithril_1["default"]('select', {
            selected: this.kifuType,
            onchange: mithril_1["default"].withAttr('selectedIndex', function (value) {
                _this.kifuType = value;
            })
        }, [mithril_1["default"]('option', '棋譜'), mithril_1["default"]('option', '定跡')])])])]), mithril_1["default"]('.field.c-shogiBan_menu_button', [mithril_1["default"]('.control', [this.boardType === const_1.BAN.CUSTOM ? mithril_1["default"]('button.button.is-danger', {
            disabled: this.kifuTitle ? false : true,
            onclick: function onclick() {
                _this.appData.switch_EDITBOARD(_this.kifuTitle, _this.kifuType);
            }
        }, '盤面入力へ') : mithril_1["default"]('button.button.is-primary', {
            disabled: this.kifuTitle ? false : true,
            onclick: function onclick() {
                _this.appData.switch_EDITINFO(_this.boardType, _this.kifuTitle, _this.komaochiType, _this.kifuType);
            }
        }, '棋譜情報入力へ')])])];
    };
    return NewKifuMenu;
}(singleComponentBasic_1["default"]);
exports["default"] = NewKifuMenu;
},{"mithril":5,"../../const":51,"../../util":59,"../../singleComponentBasic":52}],55:[function(require,module,exports) {
"use strict";
// 編集用メニューのコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var singleComponentBasic_1 = __importDefault(require("../../singleComponentBasic"));
var KifuInfoMenu = /** @class */function (_super) {
    __extends(KifuInfoMenu, _super);
    function KifuInfoMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KifuInfoMenu.prototype.oninit = function () {
        this.dispPlayerName = false;
        this.proponentName = '';
        this.opponentName = '';
        this.place = '';
        this.detail = '';
        this.dispPlaceName = false;
    };
    KifuInfoMenu.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('label.label.is-main.c-shogiBan_menu_label', '棋譜情報入力'), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', {
            onclick: function onclick() {
                _this.dispPlayerName = !_this.dispPlayerName;
            }
        }, mithril_1["default"]('span.icon.is-small', [mithril_1["default"]('i.fa.fa-chevron-right', { "class": classNames_1["default"](this.dispPlayerName ? 'is-open' : null) })]), '対局者名'), this.dispPlayerName ? [mithril_1["default"]('.field', mithril_1["default"]('.control', [mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.proponentName,
            placeholder: '先手',
            oninput: mithril_1["default"].withAttr('value', function (value) {
                _this.proponentName = value;
            })
        })])), mithril_1["default"]('.field', mithril_1["default"]('.control', [mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.opponentName,
            placeholder: '後手',
            oninput: mithril_1["default"].withAttr('value', function (value) {
                _this.opponentName = value;
            })
        })]))] : null, mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', {
            onclick: function onclick() {
                _this.dispPlaceName = !_this.dispPlaceName;
            }
        }, mithril_1["default"]('span.icon.is-small', [mithril_1["default"]('i.fa.fa-chevron-right', { "class": classNames_1["default"](this.dispPlaceName ? 'is-open' : null) })]), '棋戦名'), this.dispPlaceName ? [mithril_1["default"]('.field', mithril_1["default"]('.control', [mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.place,
            placeholder: '棋戦名',
            oninput: mithril_1["default"].withAttr('value', function (value) {
                _this.place = value;
            })
        })]))] : null]), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', '棋譜詳細(必須)'), mithril_1["default"]('.field', mithril_1["default"]('.control', [mithril_1["default"]('textarea.textarea.is-primary', {
            value: this.detail,
            placeholder: '棋譜詳細を入力\n(最大140文字)',
            maxlength: 140,
            oninput: mithril_1["default"].withAttr('value', function (value) {
                _this.detail = value;
            })
        })]))]), mithril_1["default"]('.field.c-shogiBan_menu_button', [mithril_1["default"]('.control', [mithril_1["default"]('button.button.is-primary', {
            disabled: this.detail ? false : true,
            onclick: function onclick() {
                // 指し手入力ステートへ
                _this.appData.switch_EDITMOVE(_this.detail, _this.proponentName, _this.opponentName, _this.place);
            }
        }, '棋譜編集開始')])])])];
    };
    return KifuInfoMenu;
}(singleComponentBasic_1["default"]);
exports["default"] = KifuInfoMenu;
},{"mithril":5,"classNames":58,"../../singleComponentBasic":52}],56:[function(require,module,exports) {
"use strict";
// 棋譜読み込み用メニューのコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var singleComponentBasic_1 = __importDefault(require("../../singleComponentBasic"));
var LoadKifuMenu = /** @class */function (_super) {
    __extends(LoadKifuMenu, _super);
    function LoadKifuMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadKifuMenu.prototype.view = function (vnode) {
        var _this = this;
        return [mithril_1["default"]('label.label.is-main.c-shogiBan_menu_label', '棋譜の読み込み'), mithril_1["default"]('.field.c-shogiBan_menu_button', {
            ondragover: function ondragover(e) {
                e.stopPropagation();
                e.preventDefault();
            },
            ondrop: function ondrop(e) {
                e.stopPropagation();
                var file = e.dataTransfer.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var jkf = JSON.parse(e.target.result);
                        _this.appData.switch_EDITMOVEfromLOADKIFU(jkf);
                        mithril_1["default"].redraw();
                    };
                    reader.readAsText(file);
                }
                e.preventDefault();
            }
        }, [mithril_1["default"](".file.is-boxed.is-danger", mithril_1["default"]("label.file-label", [mithril_1["default"]("input.file-input[name='resume'][type='file']", {
            onchange: mithril_1["default"].withAttr('files', function (files) {
                var file = files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var jkf = JSON.parse(e.target.result);
                        _this.appData.switch_EDITMOVEfromLOADKIFU(jkf);
                        mithril_1["default"].redraw();
                    };
                    reader.readAsText(file);
                }
            })
        }), mithril_1["default"]("span.file-cta", [mithril_1["default"]("span.file-icon", mithril_1["default"]("i.fas.fa-upload")), mithril_1["default"]("span.file-label", "jkfファイルを選択…")])]))])];
    };
    return LoadKifuMenu;
}(singleComponentBasic_1["default"]);
exports["default"] = LoadKifuMenu;
},{"mithril":5,"../../singleComponentBasic":52}],14:[function(require,module,exports) {
"use strict";
// 編集用メニューのルートコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var topMenu_1 = __importDefault(require("./menu/topMenu"));
var const_1 = require("../const");
var newKifuMenu_1 = __importDefault(require("./menu/newKifuMenu"));
var kifuInfoMenu_1 = __importDefault(require("./menu/kifuInfoMenu"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var loadKifuMenu_1 = __importDefault(require("./menu/loadKifuMenu"));
var EditorMenu = /** @class */function (_super) {
    __extends(EditorMenu, _super);
    function EditorMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EditorMenu.prototype.oninit = function () {
        this.topMenu = topMenu_1["default"].getInstance(topMenu_1["default"], this.appData);
        this.newKifuMenu = newKifuMenu_1["default"].getInstance(newKifuMenu_1["default"], this.appData);
        this.kifuInfoMenu = kifuInfoMenu_1["default"].getInstance(kifuInfoMenu_1["default"], this.appData);
        this.loadKifuMenu = loadKifuMenu_1["default"].getInstance(loadKifuMenu_1["default"], this.appData);
    };
    EditorMenu.prototype.view = function () {
        return [this.appData.state === const_1.STATE.TOP || this.appData.state === const_1.STATE.NEWKIFU || this.appData.state === const_1.STATE.EDITINFO || this.appData.state === const_1.STATE.LOADKIFU ? mithril_1["default"]('.c-shogiBan_menu_place', [mithril_1["default"]('.c-shogiBan_menu_base', [this.appData.state === const_1.STATE.TOP ? mithril_1["default"](this.topMenu) : null, this.appData.state === const_1.STATE.NEWKIFU ? mithril_1["default"](this.newKifuMenu) : null, this.appData.state === const_1.STATE.EDITINFO ? mithril_1["default"](this.kifuInfoMenu) : null, this.appData.state === const_1.STATE.LOADKIFU ? mithril_1["default"](this.loadKifuMenu) : null])]) : null];
    };
    return EditorMenu;
}(singleComponentBasic_1["default"]);
exports["default"] = EditorMenu;
},{"mithril":5,"./menu/topMenu":53,"../const":51,"./menu/newKifuMenu":54,"./menu/kifuInfoMenu":55,"../singleComponentBasic":52,"./menu/loadKifuMenu":56}],15:[function(require,module,exports) {
"use strict";
// 棋譜に紐づく対局者、棋戦情報等の表示のコンポーネント

var __extends = this && this.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (b.hasOwnProperty(p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var classNames_1 = __importDefault(require("classNames"));
var singleComponentBasic_1 = __importDefault(require("../singleComponentBasic"));
var const_1 = require("../const");
var KifuInfo = /** @class */function (_super) {
    __extends(KifuInfo, _super);
    function KifuInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KifuInfo.prototype.view = function () {
        var _this = this;
        return [mithril_1["default"]('.c-kifuPlayer_info', { "class": classNames_1["default"](this.appData.isOpenInfo ? 'is-active' : null) }, [mithril_1["default"]('.columns', [mithril_1["default"]('.c-kifuPlayer_info_title', mithril_1["default"]('label.label.c-shogiBan_menu_label.is-main', '棋譜情報')), mithril_1["default"]('.c-kifuPlayer_info_close', mithril_1["default"]('span.icon.fa-lg', {
            onclick: function onclick() {
                _this.appData.isOpenInfo = false;
            }
        }, mithril_1["default"]('i.fa.fa-times')))]), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label', 'タイトル'), mithril_1["default"]('.field', mithril_1["default"]('.control', mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.appData.title,
            readonly: this.appData.state === const_1.STATE.EDITMOVE ? false : true,
            placeholder: '棋譜タイトルを入力',
            oninput: mithril_1["default"].withAttr('value', function (title) {
                _this.appData.setHeader('title', title);
            })
        })))]), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('.columns', [mithril_1["default"]('.column', [mithril_1["default"]('label.label.c-shogiBan_menu_label', '先手対局者'), mithril_1["default"]('.field', mithril_1["default"]('.control', mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.appData.proponent_name,
            readonly: this.appData.state === const_1.STATE.VIEW ? true : false,
            placeholder: '先手対局者情報なし',
            oninput: mithril_1["default"].withAttr('value', function (proponent_name) {
                _this.appData.setHeader('proponent_name', proponent_name);
            })
        })))]), mithril_1["default"]('.column', [mithril_1["default"]('label.label.c-shogiBan_menu_label', '後手対局者'), mithril_1["default"]('.field', mithril_1["default"]('.control', mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.appData.opponent_name,
            readonly: this.appData.state === const_1.STATE.VIEW ? true : false,
            placeholder: '後手対局者情報なし',
            oninput: mithril_1["default"].withAttr('value', function (opponent_name) {
                _this.appData.setHeader('opponent_name', opponent_name);
            })
        })))])])]), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label', '棋戦名'), mithril_1["default"]('.field', mithril_1["default"]('.control', mithril_1["default"]('input.input.is-primary', {
            type: 'text',
            value: this.appData.place,
            readonly: this.appData.state === const_1.STATE.VIEW ? true : false,
            placeholder: '棋戦情報なし',
            oninput: mithril_1["default"].withAttr('value', function (place) {
                _this.appData.setHeader('place', place);
            })
        })))]), mithril_1["default"]('.field.c-shogiBan_menu_option', [mithril_1["default"]('label.label.c-shogiBan_menu_label.c-shogiBan_menu_expandOpton', '棋譜詳細'), mithril_1["default"]('.field', mithril_1["default"]('.control', mithril_1["default"]('textarea.textarea.is-primary', {
            value: this.appData.detail,
            readonly: this.appData.state === const_1.STATE.VIEW ? true : false,
            placeholder: '棋譜詳細なし',
            maxlength: 140,
            oninput: mithril_1["default"].withAttr('value', function (detail) {
                _this.appData.setHeader('detail', detail);
            })
        })))])])];
    };
    return KifuInfo;
}(singleComponentBasic_1["default"]);
exports["default"] = KifuInfo;
},{"mithril":5,"classNames":58,"../singleComponentBasic":52,"../const":51}],4:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
var appdata_1 = __importDefault(require("../appdata"));
var shogiBan_1 = __importDefault(require("./shogiBan"));
var moveList_1 = __importDefault(require("./moveList"));
var toolBar_1 = __importDefault(require("./toolBar"));
var editorMenu_1 = __importDefault(require("./editorMenu"));
var kifuInfo_1 = __importDefault(require("./kifuInfo"));
var JKFEdit = /** @class */function () {
    function JKFEdit() {}
    JKFEdit.prototype.oninit = function () {
        this.appData = new appdata_1["default"]();
        this.shogiBan = shogiBan_1["default"].getInstance(shogiBan_1["default"], this.appData);
        this.moveList = moveList_1["default"].getInstance(moveList_1["default"], this.appData);
        this.toolBar = toolBar_1["default"].getInstance(toolBar_1["default"], this.appData);
        this.editorMenu = editorMenu_1["default"].getInstance(editorMenu_1["default"], this.appData);
        this.kifuInfo = kifuInfo_1["default"].getInstance(kifuInfo_1["default"], this.appData);
    };
    JKFEdit.prototype.view = function () {
        return [mithril_1["default"]('.c-kifuPlayer', [mithril_1["default"]('.c-kifuPlayer_inner', [mithril_1["default"]('.c-kifuPlayer_main', [mithril_1["default"]('.c-shogiBan', [mithril_1["default"](this.shogiBan), mithril_1["default"](this.editorMenu), mithril_1["default"]('.c-shogiBan_bg', [mithril_1["default"]('.c-shogiBan_base')])]), mithril_1["default"]('.c-kifuPlayer_inner2', [mithril_1["default"](this.toolBar)])]), mithril_1["default"](this.kifuInfo)]), mithril_1["default"](this.moveList)])];
    };
    return JKFEdit;
}();
exports["default"] = JKFEdit;
},{"mithril":5,"../appdata":10,"./shogiBan":11,"./moveList":12,"./toolBar":13,"./editorMenu":14,"./kifuInfo":15}],2:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var mithril_1 = __importDefault(require("mithril"));
require("bulma");
require("bulma-switch");
require("bulma-tooltip");
require("../scss/main.scss");
var JKFEdit_1 = __importDefault(require("./components/JKFEdit"));
var jkfedit = new JKFEdit_1["default"]();
document.addEventListener('DOMContentLoaded', function () {
    mithril_1["default"].route(document.body, "/", {
        "/": jkfedit
    });
});
//TODO: forcePromoteをappdataで管理させる？
//TODO: 非活性のボタンが押せてしまう件の改修
//TODO: 最後の指し手のハイライト
//TODO: 駒コンポーネントをモード別に実装するかアーキテクチャを検討
},{"mithril":5,"bulma":6,"bulma-switch":7,"bulma-tooltip":8,"../scss/main.scss":3,"./components/JKFEdit":4}],63:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
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

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '63809' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
        parents.push(+k);
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

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[63,2])
//# sourceMappingURL=/app.930bd14b.map