import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// 페이지들 코드 스플리팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const WorkSpace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={WorkSpace} />
      {/* :workspace -> route 파라미터, 자유롭게 값을 바꿀 수 있습니다. */}
      {/* 파라미터가 아니라 /workspace/sleact 이렇게 지정해준 주소면 파라미터를 사용한 주소보다 위에 위치해야 한다. */}
    </Switch>
  );
};

export default App;
