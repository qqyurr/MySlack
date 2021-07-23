import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IChat, IDM } from '@typings/db';
import React, { useCallback, VFC, RefObject } from 'react';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  chatData?: IDM[];
}
// 물음표 -> undefined과 null을 걸러줍니다

const ChatList: VFC<Props> = ({ chatData }) => {
  return (
    <ChatZone>
      <div>
        {chatData?.map((chat) => {
          return <Chat key={chat.id} data={chat} />;
        })}
      </div>
    </ChatZone>
  );
};

export default ChatList;
