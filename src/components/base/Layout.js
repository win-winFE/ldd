import React, {Component} from 'react';
import styled from 'styled-px2rem';

const Parrent = styled.div`
  .footer-component{
    background-color: #ffffff;
    position: fixed;
    z-index: 2;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #cccccc;
    &>div{
      max-width: 750px;
      margin: auto;
    }
  }
`;

export default class LayoutComponent extends Component {
  constructor() {
    super();
    this.state = {
      footerHeight: 0,
      contentHeight: 0
    };
  }

  componentDidMount() {
    this.setFooterHeight();
    this.setContentHeight();
  }

  setContentHeight() {
    const {contentDom} = this;
    const {innerHeight} = window;
    const contentHeight = contentDom.clientHeight;
    if (contentHeight >= innerHeight) {
      return null;
    }
    this.setState({contentHeight: innerHeight});
  }

  setFooterHeight() {
    const {footerDom} = this;
    if (!footerDom) {
      return null;
    }
    const footerHeight = footerDom.clientHeight + 1;
    this.setState({footerHeight});
  }

  render() {
    const {children, footer, ...params} = this.props;
    const {footerHeight, contentHeight} = this.state;

    return (
      <Parrent {...params}>
        <div ref={dom => this.contentDom = dom} className="content-component flex-block-flex1" style={{
          marginBottom: footerHeight,
          minHeight: contentHeight - footerHeight
        }}>{children}</div>
        {!!footer && <div ref={dom => this.footerDom = dom} className="safe-bottom-iphone-x footer-component">{footer}</div>}
      </Parrent>
    );
  }
}
