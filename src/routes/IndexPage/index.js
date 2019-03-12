import React, {Component} from 'react';
import {connect} from 'dva';
import {LayoutComponent, TabBar} from '../../components/index';
import './index.less';

export default class IndexPage extends Component {
  render() {
    return (
      <LayoutComponent footer={<TabBar index={0}/>}>
        <div className="page page-index">
          <h3>--------------------------------------------------------------------</h3>
          <div>
            <span className="icon test-icons icon-close"></span>
            <span className="icon test-icons icon-close-o"></span>
            <span className="icon test-icons icon-close-i"></span>
          </div>
          <div>
            <span className="icon test-icons icon-check"></span>
            <span className="icon test-icons icon-check-o"></span>
            <span className="icon test-icons icon-check-i"></span>
          </div>
        </div>
      </LayoutComponent>
    );
  }
}

