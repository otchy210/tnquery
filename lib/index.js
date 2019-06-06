const isString = (obj) => {
    return typeof obj === 'string';
}
const tagStringRegex = /^<[a-z-_]+>$/;
const isTagString = (obj) => {
    if (!isString(obj)) {
        return false;
    }
    return tagStringRegex.test(obj);
}
const isElement = (obj) => {
    return obj instanceof HTMLElement;
};

const wrap = (dom) => {
    if (dom._tnQueryElement) {
        return dom;
    }
    dom.attr = (attr = {}) => {
        Object.entries(attr).forEach(kv => {
            dom.setAttribute(kv[0], kv[1]);
        });
        return dom;
    };
    dom.cls = (...classes) => {
        classes.forEach(c => dom.classList.add(c));
        return dom;
    };
    dom.append = (...children) => {
        children.forEach(c => dom.appendChild(c));
        return dom;
    };
    dom.text = (text) => {
        dom.innerText = text;
        return dom;
    };
    dom.html = (html) => {
        dom.innerHTML = html;
        return dom;
    };
    dom.data = (key, val) => {
        if (val === undefined) {
            return dom.dataset[key];
        }
        dom.dataset[key] = val;
        return dom;
    }
    dom._tnQueryElement = true;
    return dom;
};

export default (query) => {
    if (isTagString(query)) {
        const tagName = query.substr(1, query.length - 1);
        const dom = document.createElement(tagName);
        return wrap(dom);
    }
    if (isString(query)) {
        const dom = document.querySelector(query);
        if (!dom) {
            throw `Not found "${query}"`;
        }
        return wrap(dom);
    }
    if (isElement(query)) {
        return wrap(query);
    }
};
