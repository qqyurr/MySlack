import Workspace from '@layouts/Workspace';
import React from 'react';

const DirectMessage = () => {
  return (
    <Workspace>
      <div>DM!</div>
    </Workspace>
  );
};
// Channel의 index.tsx에서 Workspace 태그안에 있는 div 태그가 Workspace의 children이 된다.
// 다른 컴포넌트 안에 넣은 JSX은 children이 된다.
export default DirectMessage;
