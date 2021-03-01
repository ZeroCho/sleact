import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox, EachMention } from '@components/ChatBox/styles';
import autosize from 'autosize';
import gravatar from 'gravatar';
import React, { useCallback, useEffect, useRef } from 'react';
import { Mention, SuggestionDataItem } from 'react-mentions';

const ChatBox = ({ onSubmitForm, chat, onChangeChat, placeholder, data }) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, [textareaRef.current]);

  const onKeydownChat = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitForm(e);
        }
      }
    },
    [chat],
  );

  const renderUserSuggestion = useCallback(
    (member, search, highlightedDisplay, index, focus) => {
      if (!data) {
        return null;
      }
      return (
        <EachMention focus={focus}>
          <img src={gravatar.url(data[index].email, { s: '20px', d: 'retro' })} alt={data[index].nickname} />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [data],
  );

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onChange={onChangeChat}
          onKeyPress={onKeydownChat}
          placeholder={placeholder}
          inputRef={textareaRef}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={data?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderUserSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat?.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
};

export default ChatBox;
