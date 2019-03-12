import React, { Component } from 'react';
import ScrollLoader from './ScrollLoader';
import PullLoader from './PullLoader';
import PropTypes from 'prop-types';


export default class PullAndScrollLoader extends Component {

  static propTypes = {
    hasMore: PropTypes.bool,
    loader: PropTypes.element,
    ender: PropTypes.element,
    triggerHeight: PropTypes.number,
    loadMore: PropTypes.func,
    refresh: PropTypes.func,
  };

  render() {
    const { refresh, children, ...params } = this.props;
    return (
      <PullLoader refresh={refresh}>
        <ScrollLoader {...params}>
          {children}
        </ScrollLoader>
      </PullLoader>
    );
  }
}