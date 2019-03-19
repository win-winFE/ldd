import React, {Component} from 'react';
import {connect} from 'dva';
import {LayoutComponent, TabBar, PullLoader} from '../../components/index';
import './index.less';


@connect(() => ({}), {})
export default class IndexPage extends Component {
  render() {
    return (
      <LayoutComponent footer={<TabBar index={0}/>}>
        <div className="page page-index">
          <h3>--------------------------------------------------------------------</h3>
          <h3>--------------------------------------------------------------------</h3>
          <h3>--------------------------------------------------------------------</h3>
          <h3>--------------------------------------------------------------------</h3>
          <PullLoader>
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

            <div>
              <div className="my-loading icon icon-easy-loading"></div>
            </div>

            <div>
              <div className="my-loading icon icon-zoom-loading"></div>
            </div>

          </PullLoader>
        </div>
      </LayoutComponent>
    );
  }
}

