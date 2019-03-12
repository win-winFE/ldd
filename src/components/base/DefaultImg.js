import React, {Component} from 'react';


export default class DefaultImg extends Component {
  constructor() {
    super();
    this.state = {
      status: 0,  // 0:代表正在请求图片， 1：请求成功， -1：请求失败
      isMounted: true, // 判断是否卸载
    };
  }

  componentWillUnmount() {
    this.setState({isMounted: false});
  }

  componentDidMount() {
    const {src} = this.props;
    this.loadSrc(src);
  }

  loadSrc(src) {
    let img = new Image();
    this.setState({status: 0});
    img.onload = _ => {
      if (this.state.isMounted) {
        this.setState({status: 1});
      }
    };
    img.onerror = _ => {
      if (this.state.isMounted) {
        this.setState({status: -1});
      }
    };
    img.src = src;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src) {
      this.loadSrc(nextProps.src);
    }
  }

  static defaultProps = {
    src: '',
    loadingImg: require('../../assets/images/default/default.png'),
    errorImg: require('../../assets/images/default/default.png')
  };

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

    return <img src={showImg} alt="" {...params}/>;
  }
}