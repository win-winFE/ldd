import React, {Component} from 'react';
import styled from 'styled-px2rem';
import {Link} from 'dva/router';

const TabBarStyle = styled.div`
  
  .tabbar-item{
    flex: 1;
    font-size: 24px;
    color: #555555;
    padding: 15px;
    font-weight: 600;
  }
  .tabbar-item-active{
    color: #6C7AE8;
  }
  .tabbar-item-img{
    width: 50px;
  }
`;



/**
 * tabbar 组件，
 * @param { index } number 第几个显示为激活状态，从0开始
 * 示例 <TabBar index={0}>
 * */
export default class TabBar extends Component {
  render() {
    const {index} = this.props;
    const arr = [
      {
        text: 'TabBar1',
        icon: require('../assets/images/tabbar/banka.png'),
        iconAct: require('../assets/images/tabbar/banka-active.png'),
        to: '/'
      },
      {
        text: 'TabBar2',
        icon: require('../assets/images/tabbar/proxy.png'),
        iconAct: require('../assets/images/tabbar/proxy-active.png'),
        to: '/tabbar2',
      },
      {
        text: 'TabBar3',
        icon: require('../assets/images/tabbar/wo.png'),
        iconAct: require('../assets/images/tabbar/wo-active.png'),
        to: '/tabbar3',
      },
    ];
    return (
      <TabBarStyle className="flex-row">
        {
          arr.map((val, ind) => (
            <Link replace to={val.to} key={ind} className={`flex-col tabbar-item ${index === ind ? 'tabbar-item-active' : ''}`}>
              <img className='tabbar-item-img' src={index === ind ? val.iconAct : val.icon} alt=""/>
              <span>{val.text}</span>
            </Link>
          ))
        }
      </TabBarStyle>
    );
  }
}
