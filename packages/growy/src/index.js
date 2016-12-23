import {
  Component,
  h,
  prop
} from 'skatejs';

const keyCodes = {
  del: 8,
  enter: 13,
  shift: 16
};
const px = (value) => `${value}px`;

class SKGrowy extends Component {
  static get props() {
    return {
      minHeight: {
        attribute: true,
        default: 50
      },
      resetOnEnter: {
        attribute: true,
        default: true,
        coerce(val) {
          return typeof val === 'boolean' ? val : (val === 'false' ? false : true);
        }
      },
      shiftPressed: {
        default: false
      }
    };
  }

  renderCallback() {
    return [
      h('textarea', {
        oninput: this.oninput(this.minHeight),
        onkeyup: this.onkeyup(this),
        onkeydown: this.onkeydown(this),
        style: this.getStyles()
      })
    ];
  }

  getStyles() {
    return {
      minHeight: px(this.minHeight),
      resize: 'none',
      outline: 'none',
      padding: 0
    }
  }

  oninput(minHeight) {
    return function() {
      //We need first to reset the height and later read the 'scrollHeight' 
      this.style.height = "";
      const height = Math.max(this.scrollHeight, minHeight);
      this.style.height = px(height);
    };
  }

  onkeyup(component) {
    return function(e) {
      const code = e.keyCode;
      const hasLength = !!this.value.trim().length;

      if (code === keyCodes.shift) {
        component.shiftPressed = false;
        return;
      }

      if (code !== keyCodes.enter || !hasLength || component.shiftPressed) return;

      component.triggerEvent('onenter');
      component.resetOnEnter && component.clear();
    }
  }

  clear() {
    const textarea = this.shadowRoot.querySelector('textarea');

    textarea.style.height = px(this.minHeight);
    textarea.value = '';
  }

  triggerEvent(eventName, options) {
    const event = new CustomEvent(eventName, {
      detail: options
    });

    this.dispatchEvent(event);
  }

  onkeydown(component) {
    return function(e) {
      const code = e.keyCode;

      if (code !== keyCodes.shift) return;

      component.shiftPressed = true;
    }
  }
}

customElements.define('sk-growy', SKGrowy);

export default SKGrowy;