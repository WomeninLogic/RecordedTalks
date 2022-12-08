((global) => {

	const charMap = {"&": "&amp;", "<": "&lt;", ">": "&gt;"};

	const replaceTag = (tag) => charMap[tag] || tag;

	const escapeHTML = (str) => str.replace(/[&<>]/g, replaceTag);

	/* General helpers */

	const identity = (x) => x;

	const isArr = (x) => Array.isArray(x);

	const isObj = (x) => !isArr(x) && typeof x == "object";

	const isScalar = (v) => (typeof v === "string" || typeof v === "boolean" || typeof v === "number");

	const areAttrs = (attrs) => isObj(attrs);

	/* Zahar specific helpers */

	const isNode = (node) => isArr(node) && typeof node[0] == "string";

	const isNodeArr = (node) => isArr(node) && isNode(node[0]);

	const $ = x => document.querySelector(x);

	const $all = (x) => document.querySelectorAll(x);

	const node$ = (node,x) => node.querySelector(x);

	const node$all = (node,x) => node.querySelectorAll(x);

	const clearChildren = el => {

		while(el.hasChildNodes())
			el.removeChild(el.lastChild);

	};

	/* Functions for rendering nodes */

	const escapeStr = st => (typeof st === "string") ? `"${st}"` : st;

	const normalizeAttrs = (attrs) => {

		const { data = {} } = attrs;

		const dataAttrs = Object.entries(data).reduce((result, [dk, dv]) => Object.assign(result, {["data-" + dk]: dv}), {});

		delete attrs.data;

		Object.assign(dataAttrs, attrs);

		return dataAttrs;

	};

	const serializeAttrs = ({attrs, serializer, delimiter}) => {

		return Object.entries(attrs).map(([k,v]) => serializer(k, v)).join(delimiter);

	};

	const serializeStyle = (style) => serializeAttrs({attrs: style, serializer: (k, v) => k + ":" + v, delimiter: ";"});

	const attrsText = attrsMap => {

		const attrs = normalizeAttrs(attrsMap)

		const serializer = (k, join, v) => {

			if(v == null || v === false) return "";

			else if(k === "style") return `${k}='${serializeStyle(v)}'`;

			else if(isScalar(v)) return k + join + escapeStr(v);

			else throw Error("Unknown value inside attributes: " + JSON.stringify(attrsMap));

		}

		return serializeAttrs({attrs, serializer: (k, v) => serializer(k, "=", v), delimiter: " "});

	};

	const setAttrs = (el, attrs = {}) => Object.entries(normalizeAttrs(attrs)).map(([k,v]) => {

		// Don't set attributes when there’s no value present or is set to false
		// Setting value to false for some DOM elements requires absence of attribute
		if(v == null || v == false) return;

		// Set style
		if(k === "style") { el.setAttribute(k, serializeStyle(v)); }

		else if (isScalar(v)) { el.setAttribute(k,v); }

		else throw Error("Unknown value inside attributes: " + JSON.stringify(attrs));

	});

	const processTag = (tag) => {

		const attrs = {};

		let id = null;

		const idStart = tag.indexOf("#");

		if(idStart > 0) {

			let idEnd = tag.indexOf(".", idStart);

			if(idEnd < 0) idEnd = tag.length;

			id = tag.slice(idStart + 1, idEnd);

			tag = tag.slice(0, idStart) + tag.slice(idEnd);

		}

		let [parsed_tag, ...classes] = tag.split(".");

		Object.assign(attrs, id && {id}, (classes.length > 0) && {class: classes.join(" ")});

		return [parsed_tag, attrs];

	};

	const normalizeNode = (node) => {

		let [tag, ...contents] = node;

		let attrs = {};

		if(areAttrs(contents[0])) {

			attrs = contents[0];

			contents = contents.slice(1);

		}

		let [parsed_tag, parsed_attrs] = processTag(tag);

		Object.assign(attrs, parsed_attrs);

		return [parsed_tag, attrs, ...contents];

	};

	const textToDOM = node => document.createTextNode(node);

	const nodeToDOM = node => {

		let [tag, attrs, ...contents] = normalizeNode(node);

		if(typeof tag !== "string")
			throw Error("Please provide a valid node to render. You passed: " + node.toString());

		let el = document.createElement(tag);

		const { events = {} } = attrs;

		Object.entries(events).forEach(([k,v]) => el.addEventListener(k, v));

		if(contents == undefined || contents == null)
			console.warn("You passed in a node with no contents in it: [" + node.toString() + " * No content * ]");

		contents.map(c => el.appendChild(buildDOM(c)));

		delete attrs.events;

		setAttrs(el, attrs);

		return el;

	};

	const nodesToDOM = (nodes) => {

		let container = document.createDocumentFragment();

		let result = nodes.map(x => container.appendChild(x));

		return container;

	};

	const textToFrag = (text) => document.createRange().createContextualFragment(text);

	// A node or an array of nodes can be passed in to this function
	// Node: [ scalar | [tag, attrs, Node]] | [ Node ]
	// This is done so that when generating DOM with data
	// the API forgives on creating [[[[Node]]]] like structures and
	// renders the data however nested it is.
	// TODO: I have to evaluate how this decision plays out after
	// enough experience with the library
	const walkNode = ({scalarFn = identity, nodeFn = identity, nodesFn = identity, node}) => {

		if (node === undefined || node == null) {

			return scalarFn("");

		} else if (isScalar(node)) return scalarFn(node);

		else if (isNode(node)) return nodeFn(node);

		else if (isNodeArr(node)) return nodesFn(node.map(n => nodeFn(n)));

		else throw Error("Please provide a valid node for parsing. You passed in " + JSON.stringify(node));

	};

	const htmlText = (node) => {

		let [tag, attrs, ...contents] = normalizeNode(node);

		if(!tag) throw Error("Please provide a tag");

		attrs = attrsText(attrs);

		return `<${tag}${attrs}>${contents.map(serialize).join("")}</${tag}>`;

	};

	const buildDOM = (data) => walkNode({scalarFn: textToDOM, nodeFn: nodeToDOM, nodesFn: nodesToDOM, node: data});

	const serialize = (node) => walkNode({scalarFn: escapeHTML, nodeFn: htmlText, nodesFn: nodes => nodes.join(""), node});

	const append = (parentNode, domData) => {

		parentNode.appendChild(buildDOM(domData));

		return parentNode;

	};

	// Creates HTML DOM from the provided text, clears the parentNode and then appends it on the given parentNode
	const render = (parentNode, domData) => {

		if(typeof parentNode === "string") parentNode = $(parentNode);

		clearChildren(parentNode);

		//Append directly if it's a tree, otherwise it's an array and append each of them
		return append(parentNode, domData);

	};

	const doc = (head = "",body = "") => {

		if(!body) {

			body = head;

			head = "";

		}

		return "<!doctype html>" + serialize(["html", ["head", ...head], ["body", ...body]]);

	};

	const css = link => serialize(["link", {rel: "stylesheet", type: "text/css", href: link}]);

	const z = {$, $all, node$, node$all, clearChildren, setAttrs, nodeToDOM, textToFrag, serialize, append, render};

	const nodejsZ = { isNode, serialize, doc, css };

	global.z = z;

	if(typeof module !== "undefined" && module.exports) module.exports = nodejsZ;

})(this);