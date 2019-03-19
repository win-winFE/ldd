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

  .virtual-cursor{
    width: 4px;
    height: 1.2em;
    background-color: currentColor;

    
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

  /** 根节点 */
  root = document.getElementById('root');

  /**
   * @param format string x将被代替为真实字符， 其他符号保留，
   * @param value string 输入的文字
   * @param placeholder string placeholder
   * @param [autoFocus] boolean 是否自动聚焦，默认false
   * @param onChange function onchange的回调函数
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

  /**
   * 判断组件是否autoFocus
   * */
  componentDidMount() {
    const {autoFocus} = this.props;
    if (autoFocus) {
      this.showNumericKeypad();
    }
  }

  /**
   * 显示虚拟键盘
   * 设置extra， focusEvent， blurEvent，addEvent，removeEvent
   * */
  showNumericKeypad = _ => {
    const {onFocus, onBlur, extra = ''} = this.props;
    const that = this;
    NumericKeypad.show({
      addEvent: this.addEvent,
      removeEvent: this.removeEvent,
      extra,
      focusEvent: function(...params) {
        that.myFocusEvent(...params);
        if (typeof onFocus === 'function') {
          onFocus(...params);
        }
      },
      blurEvent: function(...params) {
        that.myBlurEvent(...params);
        if (typeof onBlur === 'function') {
          onBlur.call(this, ...params);
        }
      },
    });
  };

  /**
   * 数字键盘添加文字时的回调
   * */
  addEvent = char => {
    let {value, maxLength, onChange} = this.props;
    value += char;
    if (maxLength) value = value.slice(0, maxLength);
    onChange(value);
  };

  /**
   * 数字键盘删除文字时的回调
   * */
  removeEvent = _ => {
    let {value, maxLength, onChange} = this.props;
    value = value.slice(0, -1);
    if (maxLength) value = value.slice(0, maxLength);
    onChange(value);
  };

  /**
   * 当假键盘弹起时，有可能会隐藏当前输入框，于是直接把根节点直接向上偏移
   * */
  setRootOffset(num = 300) {
    setTimeout(_ => {
      this.root.style.transform = `translateY(${-num}px)`;
    }, 50);
  }

  /**
   * 假键盘收起， 取消根节点的偏移
   * */
  removeRootOffset() {
    setTimeout(_ => {
      this.root.style.transform = '';
    }, 50);
  }

  /**
   * 获取焦点的回调，判断假键盘是否有可能挡住我当前的输入框
   * */
  myFocusEvent = _ => {
    this.setState({isFocus: true});

    // 输入框的底
    let {bottom} = this.inputDom.getBoundingClientRect();

    // 虚拟键盘的实际占用高度
    const keypadHeight = document.getElementById('numericKeypadDom').offsetHeight + 80;

    const triggerBottom = window.innerHeight - keypadHeight;

    const tfNow = this.root.style.transform;
    if (tfNow) {
      const tfNowNum = parseInt(tfNow.replace(/[^0-9\.]/g, ''));
      // debugger;
      console.log(tfNowNum);
      bottom += tfNowNum;
    }

    if (bottom > triggerBottom) {
      this.setRootOffset(bottom - triggerBottom);
    }

  };

  /**
   * 失去焦点，隐藏假键盘
   * */
  myBlurEvent = _ => {
    this.setState({isFocus: false});
    this.removeRootOffset();
  };

  /**
   * 清除输入内容
   * */
  clearValue = _ => {
    const {onChange} = this.props;
    onChange('');
  };

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
          <span numerickeypad='1' className="btn-clear icon-cross" onTouchStart={this.clearValue}/>
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
