import React, {Component} from 'react';


export default class DefaultImg extends Component {
  // 默认的props， 允许设置加载失败的img与加载中的img
  static defaultProps = {
    src: '',
    loadingImg: require('../../assets/images/default/default.png'),
    errorImg: require('../../assets/images/default/default.png')
  };

  state = {
    status: 0,  // 0:代表正在请求图片， 1：请求成功， -1：请求失败
    isMounted: true, // 判断组件是否卸载，为了解决组件卸载后setState会报错的问题
    srcIndex: 0, // 为了防止在第一张图片未加载完成时， 直接修改src，切换到另一张图片加载，这时第一张图片加载完成后，不允许更新state
  };

  componentWillUnmount() {
    this.setState({isMounted: false});
  }

  componentDidMount() {
    const {src} = this.props;
    this.loadSrc(src);
  }

  /**
   * 加载src的图片，加载完成后更新state
   * */
  loadSrc(src) {
    let img = new Image();
    let {srcIndex} = this.state;
    srcIndex++;
    this.setState({status: 0, srcIndex});
    img.onload = _ => {
      // 组件已经卸载了，直接跳过
      if (!this.state.isMounted) return null;

      // 这不是最新的src ， 略过
      if (srcIndex !== this.state.srcIndex) return null;

      this.setState({status: 1});
    };
    img.onerror = _ => {
      // 组件已经卸载了，直接跳过
      if (!this.state.isMounted) return null;

      // 这不是最新的src ， 略过
      if (srcIndex !== this.state.srcIndex) return null;

      this.setState({status: -1});
    };
    img.src = src;
  }

  /**
   * 动态更改图片的src属性， 需要重新加载src
   * */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.loadSrc(nextProps.src);
    }
  }


  render() {
    const {status} = this.state;
    const {src, loadingImg, errorImg, ...params} = this.props;
    let showImg = loadingImg;
    switch (status) {
      case 0:
        showImg = loadingImg;
        break;
      case 1:
        showImg = src;
        break;
      case -1:
        showImg = errorImg;
        break;
      default:
        console.error('DefaultImg组件走到不正常路径中， status = ' + status);
    }

    return <img src={showImg} alt="默认的alt" {...params}/>;
  }
}