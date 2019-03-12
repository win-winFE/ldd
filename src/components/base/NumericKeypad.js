import React, {Component} from 'react';
import {render} from 'react-dom';
import styled from 'styled-px2rem';

const KeypadStyle = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  border-top: 1px solid #EFEFEF;
  font-size: 28px;
  color: #666666;
  transition: all ease-in-out .3s;
  &.keypad-hide{
    //transition: transform ease-in-out .3s, display 10ms .4s;
    //display: none;
    transform: translateY(100%);
    opacity: 0;
    pointer-events: none;
  }
  &.keypad-show{
    //transition: transform ease-in-out .3s .1s, display 10ms;
    //display: block;
    transform: none;
    opacity: 1;
    pointer-events: auto;
  }
  
  .keypad-header{
    background-color: #ffffff;
    padding: 15px 30px;
  }
  .keypad-header-safe{
    width: 32px;
    margin-right: 18px;
  }
  .keypad-header-close{
    width: 50px;
  }
  .keypad-content{
    background-color: rgba(223,226,233,0.90);
    overflow: hidden;
  }
  .keypad-content-line{
    margin-bottom: 12px;
    &:first-of-type{
      margin-top: 12px;
    }
  }
  .keypad-content-key-item{
    font-family: "PingFang SC", "Heiti SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
    flex: 1;
    text-align: center;
    border-radius: 10px;
    padding: 20px;
    width: 0;
    margin-right: 12px;
    font-size: 50px;
    font-weight: 600;
    color: #000000;
    line-height: 1;
    
    &:first-child{
      margin-left: 12px;
    }
  }
  .keypad-content-key-num{
    
    background-color: #ffffff;
    box-shadow: 0 1px 0 0 #848688;
    &:active{
      background-color: #AFB0BE;
    }
  }
  .keypad-key-backspace{
    width: 52px;
  }
`;

class NumericKeypad extends Component {
  constructor() {
    super();
    this.state = {
      show: 0,
      content: '',
      extra: ''
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', this.hide, false);
    window.addEventListener('keypress', this.keyPressEvent, true);
    window.addEventListener('click', this.clickEvent, true);
  }


  keyPressEvent = e => {
    const {show} = this.state;
    if (!show) return null;
    const {keyCode} = e;

    // 数字键
    if (47 < keyCode && keyCode < 58) {
      const value = keyCode - 48;
      this.addNum(value);
      return null;
    }

    // 删除键
    if (keyCode === 8) {
      this.removeNum();
      return null;
    }


  };

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hide, false);
    window.removeEventListener('keypress', this.keyPressEvent, true);
    window.removeEventListener('click', this.clickEvent, true);
  }

  /**
   * @param change function 触发改变的函数，函数的参数为新的值
   * @param content string 初始值，默认为空字符串
   * @param [blur] function 失去焦点触发的函数，
   * @param [] function 获得焦点时触发的函数，
   * */
  show = ({change, content = '', blur, focus, maxLength, extra = ''}) => {
    if (this.state.show) {
      this.hide();
    }

    this.change = change;
    this.maxLength = maxLength;
    this.blur = blur;
    if (typeof focus === 'function') {
      focus();
    }

    this.setState({show: true, content, extra});

    this.addPadding();
  };

  hide = _ => {
    if (!this.state.show) return;
    this.setState({show: false});
    this.removePadding();
    if (typeof this.blur === 'function') {
      this.blur();
    }
  };

  addPadding() {
    // document.body.style.paddingBottom = '250px';
  }

  removePadding() {
    // document.body.style.paddingBottom = '0';
  }

  clearValue() {
    const content = '';
    this.setState({content});
    this.change(content);
  };

  addNum(num) {
    let {content} = this.state;

    content = content + num;

    const typeMaxLength = typeof this.maxLength;
    if (typeMaxLength === 'number' || typeMaxLength === 'string') {
      content = content.slice(0, this.maxLength);
    }

    this.change(content);
    this.setState({content});
  }

  removeNum() {
    let {content} = this.state;
    content = content.slice(0, content.length - 1);

    this.change(content);
    this.setState({content});
  }

  clickEvent = e => {
    if (!this.state.show) return null;
    if (e.target.getAttribute('numerickeypad')) return null;
    this.hide();
  };

  render() {
    const {show, extra} = this.state;
    const keys = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [extra, 0, 'backspace']
    ];

    return <KeypadStyle className={`${show ? 'keypad-show' : 'keypad-hide'}`} numerickeypad="1">
      <div className="keypad-header flex-justify" numerickeypad='1'>
        <div className="flex-row" numerickeypad='1'>
          <img numerickeypad="1" src={require('../../assets/images/keypad/pad.png')} className="keypad-header-safe" alt="安全键盘"/>
          <span numerickeypad="1">小勤办卡安全键盘</span>
        </div>
        <img numerickeypad='1' src={require('../../assets/images/keypad/close-pad.png')} className="keypad-header-close" alt="收起键盘" onClick={this.hide}/>
      </div>
      <div numerickeypad='1' className="keypad-content">
        <div numerickeypad='1' className="safe-bottom-iphone-x">
          {
            keys.map((lineArr, lineIndex) => (<div numerickeypad='1' key={lineIndex} className="keypad-content-line flex-justify">
              {
                lineArr.map((value, index) => {
                  if (typeof value === 'number') {
                    return <span numerickeypad='1' className="keypad-content-key-item keypad-content-key-num"
                                 key={`${lineIndex}-${index}`}
                                 onClick={this.addNum.bind(this, value)}>{value}</span>;
                  } else {
                    // 特殊键值
                    if (value === 'backspace') {
                      return <span numerickeypad='1' className="keypad-content-key-item keypad-content-key-backspace"
                                   onClick={this.removeNum.bind(this)}
                                   key={`${lineIndex}-${index}`}>
                        <img numerickeypad='1' className="keypad-key-backspace"
                             src={require('../../assets/images/keypad/backspace.png')} alt="backspace"/></span>;
                    }
                    if (!value) {
                      return <span numerickeypad='1' className="keypad-content-key-item" key={`${lineIndex}-${index}`}/>;
                    }
                    return <span numerickeypad='1' className="keypad-content-key-item"
                                 onClick={this.addNum.bind(this, value)}
                                 key={`${lineIndex}-${index}`}>{value}</span>;
                  }
                })
              }
            </div>))
          }
        </div>
      </div>
    </KeypadStyle>;
  }
}

let dom = document.getElementById('NumericKeypad');
if (!dom) {
  dom = document.createElement('div');
  dom.setAttribute('id', 'NumericKeypad');
  document.body.appendChild(dom);
}

const renderDom = render(<NumericKeypad/>, dom);
export default renderDom;
