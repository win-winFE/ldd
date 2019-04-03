import React from 'react';
import {Router, Route, Switch} from 'dva/router';
import routerConfig from './routerConfig';

function RouterConfig({history}) {
  return (
    <Router history={history}>
      <Switch>
        {
          routerConfig.map((value, index, array) => (
            <Route path={value.path} exact={value.exact} component={value.component} key={index}/>
          ))
        }
      </Switch>
    </Router>
  );
}

export default RouterConfig;
