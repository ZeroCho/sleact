import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/styles';
import React, { useCallback } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const ChatList = ({ scrollbarRef, isReachingEnd, isEmpty, chatSections, setSize }) => {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd && !isEmpty) {
        setSize((size) => size + 1).then(() => {
          scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
        });
      }
    },
    [setSize, scrollbarRef, isReachingEnd, isEmpty],
  );

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
