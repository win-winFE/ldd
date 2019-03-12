import React, {Component} from 'react';
import styled from 'styled-px2rem';
import NumericKeypad from './NumericKeypad';

const InputStyle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: visible;
  height: 100%;
  font-size: 32px;
  //background-color: rgba(0,250,250,.2);
  .virtual-cursor{
    width: 4px;
    height: 1.2em;
    background-color: currentColor;
    // background-color: #5189FF;
    
    animation: shink ease-in-out infinite 1s;
    
    @keyframes shink {
      from{
        opacity: 1;
      }
      to{
        opacity: 0;
      }
    }
  }
  .number-input-value{
    flex: 1;
    white-space: nowrap;
    height: 100%;
    min-height: 1.6em;
    position: relative;
    outline: none;
  }
  .btn-clear {
      width: 32px;
      height: 32px;
  }
  .input-placeholder{
    position: absolute;
    top: 0; bottom: 0;
    left: 0; right: 0;
    color: #999999;
    font-size: 1em;
    transition: all ease-in-out .1s;
  }
  .input-placeholder-top{
    font-size: 0.75em;
    transform: translateY(-100%);
    &.input-placeholder-no-small {
      display: none;
    }
  }
  
`;

export default class NumberInput extends Component {
  constructor() {
    super();
    this.state = {
      isFocus: false
    };
  }

  /**
   * @param format string x将代替为真实数字， 其他符号保留
   * */
  static defaultProps = {
    value: '',
    placeholder: '',
    autoFocus: false,
    format: '',  // string x将代替为真实数字，其他符号保留

    onChange: _ => {
      console.log(`默认的oonchange函数， 参数为修改后的值${_}`);
    }
  };

  componentDidMount() {
    const {autoFocus} = this.props;
    if (autoFocus) {
      this.showNumericKeypad();
      // this.dom.focus();
    }
  }

  showNumericKeypad = _ => {
    const {value, maxLength, onChange, onFocus, onBlur, extra = ''} = this.props;
    const that = this;

    NumericKeypad.show({
      change: onChange,
      extra,
      maxLength,
      content: value,
      focus: function(...params) {
        that.myFocusEvent(...params);
        if (typeof onFocus === 'function') {
          onFocus.call(this, ...params);
        }
      },
      blur: function(...params) {
        that.myBlurEvent(...params);
        if (typeof onBlur === 'function') {
          onBlur.call(this, ...params);
        }
      },
    });
  };


  addRootClass() {
    const root = document.getElementById('root');
    if (root) {
      // root.classList.add('scroll-top-250');
    }
  }

  removeRootClass() {
    const root = document.getElementById('root');
    if (root) {
      // root.classList.remove('scroll-top-250');
    }
  }

  myFocusEvent = _ => {
    this.setState({isFocus: true});
    let {bottom} = this.inputDom.getBoundingClientRect();
    const triggerBottom = window.innerHeight - 250;

    // const rootClassList = document.getElementById('root').classList;
    // if (rootClassList.contains('scroll-top-250')) {
    //   bottom += 250;
    // }


    if (bottom > triggerBottom) {
      this.addRootClass();
    }
  };

  myBlurEvent = _ => {
    this.setState({isFocus: false});
    this.removeRootClass();
  };


  hideNumericKeypad() {
    NumericKeypad.hide();
  }

  static clearValue() {
    NumericKeypad.clearValue();
  }

  render() {
    const {isFocus} = this.state;
    let {
      value, format, placeholder, placeholderNoSmall, extra, autoFocus, onChange, onFocus, onBlur, maxLength, ...params
    } = this.props;
    value = value.toString();
    let showValue = formatValue(format, value);


    return (
      <InputStyle {...params} numerickeypad='1' ref={dom => this.inputDom = dom}>
        <div className="number-input-value flex-row" numerickeypad='1'
          // tabIndex={1}
          // ref={dom => this.dom = dom}
          // onBlur={this.hideNumericKeypad.bind(this)}
          // onFocus={this.showNumericKeypad.bind(this)}
             onClick={this.showNumericKeypad}
        >
          {
            !!placeholder &&
            <span numerickeypad='1'
                  className={`input-placeholder flex-row ${placeholderNoSmall ? 'input-placeholder-no-small' : ''} ${(isFocus || value.length) ? 'input-placeholder-top ' : ''}`}>
              <span numerickeypad='1' className="text-overflow-ellipsis">{placeholder}</span></span>
          }
          <span numerickeypad='1'>{showValue}</span>
          {isFocus && <span numerickeypad='1' className="virtual-cursor"/>}
        </div>
        {
          isFocus && value.length > 0 &&
          <span numerickeypad='1' className="btn-clear icon-cross" onClick={NumberInput.clearValue}/>
        }
      </InputStyle>
    );
  }
}

function formatValue(format, value) {
  let showValue = value;
  if (value && format && /x/.test(format)) {
    showValue = format;
    const XCountsInFormat = format.length - format.replace(/x/g, '').length;
    const valueLength = value.length;
    const loopCount = Math.min(XCountsInFormat, valueLength);
    let i = 0, j = 0;
    for(; i < loopCount; i++) {
      j = showValue.indexOf('x');
      showValue = showValue.replace('x', value.slice(i, i + 1));
    }
    if (valueLength > XCountsInFormat) {
      // 数值没显示完
      showValue += value.slice(i);
    } else if (valueLength < XCountsInFormat) {
      // 把多余的符号去掉
      showValue = showValue.slice(0, j + 1);
    }
  }
  return showValue;
}
