function addEvent(el, event, fn, options) {
  if (!el || !event || !fn) {
    console.warn("You've got unfilled param(s) in addEvent()");
    return;
  }
  el.addEventListener(event, fn, options);
};
window.addEvent = addEvent;


function copyToClipboard(target) {
  if (!target || typeof target.innerText !== 'string') {
    console.warn("cTC() expects an element with innerText, got:", target);
    return;
  }
  navigator.clipboard.writeText(target.innerText);
};
window.cTC = copyToClipboard;


function createElement(tagName, className) {
  if (typeof tagName !== 'string') {
    console.warn("cE() expects a string tagName, got:", tagName);
    return null;
  }
  const el = document.createElement(tagName);
  if (className) {
    className.split(' ').forEach(c => el.classList.add(c));
  }
  return el;
}
window.cE = createElement;


function createState(initial) {
  let value = initial;
  const subs = [];
  
  return {
    get: () => value,
    set: (newVal, callback) => {
      value = newVal;
      if (callback) callback(value);
      subs.forEach(fn => fn(value));
    },
    sub: (fn) => {
      if (typeof fn !== 'function') {
        console.warn("createState().sub() expects a function, got:", fn);
        return;
      }
      subs.push(fn);
    }
  }
};
window.createState = createState;


function customAlert(message = '', options = {}) {
  const { type = 'notify', appearIn = document.body, onConfirm, onCancel } = options;
  const timer = type === 'action' ? null : (options.countdown ?? 3) * 1000;
  
  return new Promise((resolve) => {
    const alertBox = createElement('div', 'alert');
    alertBox.textContent = message;
    
    if (type === 'action') {
      const confirmBtn = createElement('button');
      confirmBtn.textContent = 'OK';
      confirmBtn.onclick = () => {
        onConfirm?.();
        alertBox.remove();
        resolve(true);
      };
      
      const cancelBtn = createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.onclick = () => {
        onCancel?.();
        alertBox.remove();
        resolve(false);
      };
      
      alertBox.append(cancelBtn, confirmBtn);
    }
    
    appearIn.prepend(alertBox);
    
    if (timer !== null) {
      setTimeout(() => {
        alertBox?.remove();
        resolve(undefined);
      }, timer);
    }
  });
}
window.nativeAlert = window.alert;
window.alert = customAlert;


function debounce(fn, delay) {
  if (typeof fn !== 'function') {
    console.warn("debounce() expects a function, got:", fn);
    return () => {};
  }
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay * 1000);
  }
}
window.debounce = debounce;


function onHold(element, callback, holdDuration = 1000) {
  let timer = null;
  let isHolding = false;
  let currentEvent = null;
  
  const updatePosition = (e) => {
    currentEvent = e;
  };
  
  const start = (e) => {
    isHolding = false;
    currentEvent = e;
    
    addEvent(element, 'mousemove', updatePosition);
    addEvent(element, 'touchmove', updatePosition, { passive: true });
    
    timer = setTimeout(() => {
      isHolding = true;
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
      callback(currentEvent); // now reflects latest position, not the stale start position
    }, holdDuration);
  };
  
  const cancel = () => {
    clearTimeout(timer);
    element.removeEventListener('mousemove', updatePosition);
    element.removeEventListener('touchmove', updatePosition);
  };
  
  addEvent(element, 'mousedown', start);
  addEvent(element, 'touchstart', start, { passive: true });
  
  addEvent(element, 'mouseup', cancel);
  addEvent(element, 'mouseleave', cancel);
  addEvent(element, 'touchend', cancel);
  addEvent(element, 'touchcancel', cancel);
  
  return () => isHolding;
}
window.onHold = onHold;


function renderIf(condition, html) {
  return condition ? html : '';
};
window.renderIf = renderIf;


function renderList(array = [], fn) {
  if (!Array.isArray(array)) {
    console.warn("renderList() expects an array, got:", array);
    return '';
  }
  if (typeof fn !== 'function') {
    console.warn("renderList() expects a mapping function, got:", fn);
    return '';
  }
  return array.map(fn).join('');
};
window.renderList = renderList;


function targetElement(selector, context = document) {
  const el = context.querySelector(selector);
  if (!el) console.warn(`No element found for selector: ${selector}`);
  return el;
};
window.tE = targetElement;


function targetElements(selector, context = document) {
  const el = context.querySelectorAll(selector);
  if (!el) console.warn(`No elements found for selector: ${selector}`);
  return el;
};
window.tEs = targetElements;


function setHTML(el, html) {
  if (!el) {
    console.warn("sH() called on a null/undefined element");
    return;
  }
  return el.innerHTML = html;
};
window.sH = setHTML;