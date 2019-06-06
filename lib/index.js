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

const apply = (dom) => {
    if (!isElement(dom)) {
        return dom;
    }
    if (dom._tnQueryElement) {
        return dom;
    }
    // dom itself
    dom.attr = (attr) => {
        if (isString(attr)) {
            return dom.getAttribute(attr);
        }
        Object.entries(attr).forEach(kv => {
            dom.setAttribute(kv[0], kv[1]);
        });
        return dom;
    };
    dom.attrid = (id) => {
        dom.id = id;
        return dom;
    };
    dom.cls = (...classes) => {
        classes.forEach(c => dom.classList.add(c));
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
    };
    // search
    dom.find = (query) => {
        const child = dom.querySelector(query);
        return apply(child);
    };
    dom.findAll = (query) => {
        const children = dom.querySelectorAll(query);
        return Array.from(children).map(c => apply(c));
    };
    dom.parent = () => {
        return $(dom.parentNode);
    };
    dom.first = () => {
        return $(dom.firstChild);
    };
    dom.last = () => {
        return $(dom.lastChild);
    };
    dom.prev = () => {
        return $(dom.previousSibling);
    };
    dom.next = () => {
        return $(dom.nextSibling);
    };
    // edit structure
    dom.append = (...children) => {
        children.forEach(child => {
            if (Array.isArray(child)) {
                child.forEach(c => {
                    dom.append(c);
                });
            } else {
                dom.appendChild(child)
            }
        });
        return dom;
    };
    dom.before = (target) => {
        dom.parent().insertBefore(target, dom);
        return $(target);
    };
    dom.after = (target) => {
        dom.parent().insertBefore(target, dom.next());
        return $(target);
    };
    // event
    dom.on = (event, func) => {
        dom.addEventListener(event, func);
        return dom;
    }
    dom._tnQueryElement = true;
    return dom;
};

export const $ = (query) => {
    if (isTagString(query)) {
        const tagName = query.substr(1, query.length - 2);
        const dom = document.createElement(tagName);
        return apply(dom);
    }
    if (isString(query)) {
        const dom = document.querySelector(query);
        if (!dom) {
            throw `Not found "${query}"`;
        }
        return apply(dom);
    }
    if (isElement(query)) {
        return apply(query);
    }
};
