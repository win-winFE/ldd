import React, {Component} from 'react';
import styled from 'styled-px2rem';

const EmptyListStyle = styled.div`
  padding: 100px 0;
  
  .empty-list-img{
    width: 280px;
  }
  .empty-list-text{
    margin-top: 40px;
    font-size: 32px;
    color: #555555;
    margin-bottom: 150px;
  }
`;

export default class EmptyList extends Component {

  static defaultProps = {
    text: '暂无数据'
  };

  render() {
    const {text} = this.props;

    return (
      <EmptyListStyle className="flex-block-flex1 flex-col-center">
        <img className="empty-list-img" src={require('../assets/images/default/empty.png')} alt=""/>
        <span className="empty-list-text">{text}</span>
      </EmptyListStyle>
    );
  }
}