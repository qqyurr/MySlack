import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import { IChat, IDM } from '@typings/db';
import React, { useCallback, VFC, RefObject, useRef } from 'react';
import Chat from '@components/Chat';
import { Scrollbars } from 'react-custom-scrollbars';
// 바퀴를 재발명하지마 == 라이브러리 갖다써

interface Props {
  chatSections: { [key: string]: IDM[] };
  // 물음표 -> undefined과 null을 걸러줍니다
}

const ChatList: VFC<Props> = ({ chatSections }) => {
  const scrollbarRef = useRef(null); //
  const onScroll = useCallback(({ chatData }) => {}, []);
  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat} />
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
