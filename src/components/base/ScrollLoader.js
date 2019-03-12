import React, {Component} from 'react';
import styled from 'styled-px2rem';
import {debounce} from '../../utils/utils';
import PropTypes from 'prop-types';


const ScrollStyle = styled.div`
  .scroll-loading{
    text-align: center;
    font-size: 24px;
    padding: 20px 0;
    color: #999999;
  }
`;

let enforceStop = false;


/**
 * 触底加载更多组件
 * @param loadMore function 页面触底的回调函数
 * @param hasMore boolean 触底了是否触发loadMore事件
 * @param loader HTMLDivElement 触底了是否触发loadMore事件
 * */
export default class ScrollLoader extends Component {
  constructor() {
    super();
    this.state = {
      enforceStop: false,
      wrapper: null,
      isLoading: false
    };
  }
  static propTypes = {
    hasMore: PropTypes.bool,
    loader: PropTypes.element,
    ender: PropTypes.element,
    triggerHeight: PropTypes.number,
    loadMore: PropTypes.func,
  };

  static defaultProps = {
    hasMore: false,
    loader: <div className='scroll-loading'>Loading...</div>,
    ender: null,
    triggerHeight: 0,// 底部距离视窗多远距离触发loader
    loadMore: _ => {
      console.error('ScrollLoader没有传递loadMore参数');
    } // 加载更多的回调
  };

  // 用js强制阻止加载更多， 当弹起输入框时需要此属性，因为iOS 10.x的版本中弹起输入框时滚动条会滚动至最底部
  static setEnforceStop() {
    enforceStop = true;
  }

  static cancleEnforceStop() {
    enforceStop = false;
  }

  scrollEvent = debounce(_ => {
    if (enforceStop) {
      return null;
    }
    if (!this.props.hasMore) {
      return null;
    }
    if (this.state.isLoading) {
      return;
    }
    if (this.checkIsHidden()) return;
    this.checkScrollToView.call(this);
  }, 100);


  checkIsHidden() {
    return this.myWrapper.offsetHeight === 0 && this.myWrapper.offsetWidth === 0;
  }

  // 检测是否到底了
  checkScrollToView() {
    const wrapper = this.myWrapper;
    if (!wrapper) {
      console.warn('wrapper == false', wrapper);
      return;
    }
    const {triggerHeight} = this.props;
    const {bottom} = wrapper.getBoundingClientRect();
    const parrentBottom = wrapper.parentNode.getBoundingClientRect().bottom; // 父元素的底边高度
    const screenHeight = window.innerHeight; // 可视窗口底边高度
    const maxScreen = Math.min(parrentBottom, screenHeight);

    if (bottom - maxScreen <= triggerHeight) {
      this.triggerLoadMore.call(this);
    }
  }

  // 触发loadMore的回调
  async triggerLoadMore() {
    await this.setState({isLoading: true});
    await this.props.loadMore();
    this.setState({isLoading: false});
  }

  // 注册滚动条事件
  componentDidMount() {
    document.addEventListener('scroll', this.scrollEvent, false);
  }

  // 注销滚动条事件
  componentWillUnmount() {
    document.removeEventListener('scroll', this.scrollEvent, false);
  }

  render() {
    const {children, hasMore, loader, ender, className = '', loadMore, triggerHeight, ...params} = this.props;
    return (
      <ScrollStyle ref={dom => this.myWrapper = dom} className={`flex-block-flex1 ${className}`} {...params}>
        {children}
        {hasMore ? loader : ender}
      </ScrollStyle>
    );
  }
}
