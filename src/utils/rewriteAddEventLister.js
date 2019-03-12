try {
  const super_add_event_listener = EventTarget.prototype.addEventListener;
// 赋值默认事件原型链的 addEventListener
  EventTarget.prototype.addEventListener = function(type, listener, options = {}) {
    const super_this = this;

    if (type.indexOf('touchmove') === -1) {
      super_add_event_listener.call(super_this, type, listener, options);
    } else {
      super_add_event_listener.call(super_this, type, listener, {
        ...options,
        get passive() {
          return false;
        }
      });
    }
  };

// 赋值默认事件原型链的 removeEventListener
  const super_remove_event_listener = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const super_this = this;

    if (type.indexOf('touchmove') === -1) {
      super_remove_event_listener.call(super_this, type, listener, options);
    } else {
      super_remove_event_listener.call(super_this, type, listener, {
        ...options,
        get passive() {
          return false;
        }
      });
    }

  };
} catch (e) {
  console.error('不支持EventTarget， ', e);
}

