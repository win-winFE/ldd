import React, {Component} from 'react';
import styled from 'styled-px2rem';


const LoaderTrackStyled = styled.div`
  overflow: visible;
  &.no-touching{
    transition: all 0.3s linear;
  }
`;
const LoaderStyled = styled.div`
  overflow: visible;
  position: relative;
  .loader-dom {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 20px 70px 10px;
    color: #333333;
    line-height: 1.6;
    font-size: 28px;
  }
  .loader-img {
    margin-top: 10px;
    img {
      width: 64px;
    }
  }
`;

export default class PullLoader extends Component {
  constructor() {
    super();
    this.state = {
      Y: 0,
      state: 'nothing',// 状态：nothing, pulling, pending, refreshing, releasing,
      touching: false,
      startX: 0,
      startY: 0,

      touchStartPoint: [0, 0],
      top0: 0,
      triggerHeight: 60,
      pullLoaderStatus: 0,  // 0: 待确定， -1:不是下拉 ， 1:是下拉
    };

    this.touchEndEvent = this.touchEndEvent.bind(this);
    this.touchStartEvent = this.touchStartEvent.bind(this);
    this.touchMoveEvent = this.touchMoveEvent.bind(this);
    this.checkToTop = this.checkToTop.bind(this);
    this.getTriggerHeight = this.getTriggerHeight.bind(this);
    this.checkTriggerEvent = this.checkTriggerEvent.bind(this);
    this.triggerEvent = this.triggerEvent.bind(this);
  }

  static defaultProps = {
    refresh: _ => {
      console.log('refresh');
      setTimeout(_ => {
        window.location.reload();
      }, 1000);
    }
  };

  getTriggerHeight() {
    const triggerHeight = this.loaderDom.clientHeight;
    this.setState({triggerHeight});
  }

  checkToTop(screenX, screenY) {
    const pullDom = this.pullDom;
    const top = pullDom.getBoundingClientRect().top;
    const maxTop = Math.max(this.state.top0, pullDom.parentElement.getBoundingClientRect().top);
    if (top < maxTop) {
      return false;
    } else {
      if (this.state.startY === 0) {
        this.setState({
          startX: screenX,
          startY: screenY
        });
      }
      return true;
    }
  }

  checkState(Y) {
    let {state, triggerHeight} = this.state;
    if (state === 'refreshing') {
      return null;
    }

    if (Y > 0 && Y < triggerHeight) {
      this.setState({state: 'pulling'});
    } else if (Y >= triggerHeight) {
      this.setState({state: 'releasing'});
    }
  }

  async triggerEvent() {
    const {refresh} = this.props;
    if (typeof refresh === 'function') {
      await refresh();
      setTimeout(_ => {
        this.setState({state: 'nothing'});
      }, 2000);
    }
  }

  checkTriggerEvent() {
    const {state, Y, triggerHeight} = this.state;
    if (state === 'refreshing') {
      return false;
    }
    if (Y >= triggerHeight) {
      this.setState({state: 'refreshing'});
      this.triggerEvent();
      return true;
    } else {
      this.setState({state: 'nothing'});
      return false;
    }
  }

  checkPullStatus(x, y) {
    const [x0, y0] = this.state.touchStartPoint;
    const offsetX = Math.abs(x - x0),
      offsetY = Math.abs(y - y0);
    if (offsetY >= offsetX) {
      this.setState({pullLoaderStatus: 1});
      return true;
    } else {
      this.setState({pullLoaderStatus: -1});
      return false;
    }
  }

  touchMoveEvent(event) {
    const {screenY, screenX} = event.touches[0];

    switch (this.state.pullLoaderStatus) {
      case 0:
        // 检测pullStatus
        if (!this.checkPullStatus(screenX, screenY)) {
          // 不是下拉事件
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        break;
      case -1:
        // 不是下拉事件
        event.preventDefault();
        // event.stopPropagation();
        return;
      case 1:
        break;
      default:

    }

    if (this.checkToTop(screenX, screenY)) {
      const offset = screenY - this.state.startY;

      if (offset > 0) {
        event.preventDefault();
        event.stopPropagation();
        const Y = getY(offset);
        this.setState({Y});
        this.checkState(Y);
      }
    }
  }

  touchEndEvent(event) {
    this.setState({touching: false, startY: 0, Y: 0, pullLoaderStatus: 0});
    this.checkTriggerEvent();
  }

  touchStartEvent(event) {
    this.getTriggerHeight();
    this.setState({touching: true});
    const {screenX, screenY} = event.touches[0];
    this.checkToTop(screenX, screenY);
    this.setState({
      touchStartPoint: [screenX, screenY]
    });
  }

  render() {
    const {children} = this.props;
    const {Y, touching, state, triggerHeight} = this.state;

    return (
      <div className='flex-block-flex1'>
        <LoaderTrackStyled
          ref={dom => this.pullDom = dom}
          className={touching ? 'flex-block-flex1' : 'no-touching flex-block-flex1'}
          onTouchEnd={this.touchEndEvent}
          onTouchStart={this.touchStartEvent}
          onTouchMove={this.touchMoveEvent}
          style={{
            WebkitTransform: `translateY(${state === 'refreshing' ? triggerHeight : Y}px)`,
            transform: `translateY(${state === 'refreshing' ? triggerHeight : Y}px)`,
            // marginTop: state === 'refreshing' ? triggerHeight : Y,
          }}>

          <LoaderStyled>
            <div ref={dom => this.loaderDom = dom} className="loader-dom flex-col">
              <div className="loader-img"><img src={require('../../assets/images/loading/loading.gif')} alt=""/></div>
              <div className="loader-state-text">{getStateText(state)}</div>
            </div>
          </LoaderStyled>

          {children}
        </LoaderTrackStyled>
      </div>
    );
  }
}


function getY(y) {
  const base = 200;
  let res = 0;
  if (y - base > 0) {
    res = 0.6 * base + 0.3 * (y - base);
  } else {
    res = 0.6 * y;
  }
  return res;
}

function getStateText(state) {
  let text = '下拉刷新';
  switch (state) {
    case 'pulling':
      text = '下拉刷新';
      break;
    case 'releasing':
      text = '释放刷新';
      break;
    case 'refreshing':
      text = '正在刷新';
      break;
    default:
      text = '下拉刷新';
  }
  return text;
}
