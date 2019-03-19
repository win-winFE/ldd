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
    transform: translate3d(0, 100%, 0);
    opacity: 0;
    pointer-events: none;
  }
  &.keypad-show{
    //transition: transform ease-in-out .3s .1s, display 10ms;
    //display: block;
    transform: translate3d(0, 0, 0);
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
    font-family: 'Avenir-Heavy',"PingFang SC", "Heiti SC", "Helvetica Neue", Helvetica, Arial, sans-serif;
    flex: 1;
    user-select: none;
    text-align: center;
    border-radius: 10px;
    padding: 24px;
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
    touch-action: none;
    width: 52px;
  }
`;

class NumericKeypad extends Component {
  state = {
    show: false,
    extra: ''
  };


  /**
   * 注册全局事件
   * 切换路由：隐藏虚拟键盘
   * 点击：判断点击区域， 非虚拟键盘，非输入框区域都隐藏键盘
   * 实体键盘点击：触发对应的数字键，
   * */
  componentDidMount() {
    window.addEventListener('hashchange', this.hide, false);
    window.addEventListener('keypress', this.keyPressEvent, true);
    window.addEventListener('click', this.clickEvent, true);
  }

  /**
   * 注销全局事件
   * */
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.hide, false);
    window.removeEventListener('keypress', this.keyPressEvent, true);
    window.removeEventListener('click', this.clickEvent, true);
  }

  /**
   * 键盘点击事件， 并触发对应的回调
   * */
  keyPressEvent = e => {
    const {show} = this.state;
    if (!show) return null;
    const {keyCode, key} = e;

    // 数字键
    if (47 < keyCode && keyCode < 58) {
      const value = keyCode - 48;
      this.addChar(value);
      return null;
    }

    // 删除键
    if (keyCode === 8) {
      this.removeNum();
      return null;
    }


  };


  /**
   * 显示虚拟键盘，并设置回调事件，及额外按键， 并直接触发focusEvent的回调
   * @param addEvent function 点击数字键的回调
   * @param removeEvent function 点击删除键的回调
   * @param [blurEvent] function 失去焦点触发的回调，
   * @param [focusEvent] function 获得焦点时触发的回调，
   * @param [extra] string 额外的按钮，如小数点.，#， X， 等 ，
   * */
  show = ({addEvent, removeEvent, blurEvent, focusEvent, extra = ''}) => {
    if (this.state.show) {
      this.hide();
    }

    this.addEvent = addEvent;
    this.removeEvent = removeEvent;
    this.blurEvent = blurEvent;
    if (typeof focusEvent === 'function') {
      focusEvent();
    }

    this.setState({show: true, extra});
  };

  /**
   * 隐藏虚拟键盘，并触发blurEvent的回调
   * */
  hide = _ => {
    if (!this.state.show) return;
    this.setState({show: false});
    if (typeof this.blurEvent === 'function') {
      this.blurEvent();
    }
  };

  /**
   * 字符的点击事件， 触发addEvent
   * */
  addChar(char) {
    this.addEvent(char);
  }

  /**
   * 栅格键点击，触发对调removeEvent
   * */
  removeNum() {
    this.removeEvent();
  }

  /**
   * 监听全局的点击事件，点击除虚拟键盘以外的节点触发隐藏
   * */
  clickEvent = e => {
    if (!this.state.show) return null;
    if (e.target.getAttribute('numerickeypad')) return null;
    this.hide();
  };

  /**
   * 防止在用户在虚拟键盘上回滚动
   * */
  static stopTouchMove(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    const {show, extra} = this.state;
    const keys = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [extra, 0, 'backspace']
    ];

    return <KeypadStyle id='numericKeypadDom' className={`${show ? 'keypad-show' : 'keypad-hide'}`} numerickeypad="1" onTouchMove={NumericKeypad.stopTouchMove}>
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
                                 onTouchStart={this.addChar.bind(this, value)}>{value}</span>;
                  } else {
                    // 特殊键值
                    if (value === 'backspace') {
                      return <span numerickeypad='1'
                                   className="keypad-content-key-item keypad-content-key-backspace"
                                   onTouchStart={this.removeNum.bind(this)}
                                   key={`${lineIndex}-${index}`}>
                        <img numerickeypad='1' className="keypad-key-backspace"
                             src={require('../../assets/images/keypad/backspace.png')} alt="backspace"/></span>;
                    }
                    if (!value) {
                      return <span numerickeypad='1' className="keypad-content-key-item" key={`${lineIndex}-${index}`}/>;
                    }
                    return <span numerickeypad='1' className="keypad-content-key-item"
                                 onTouchStart={this.addChar.bind(this, value)}
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
