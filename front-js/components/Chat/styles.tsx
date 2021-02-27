import styled from '@emotion/styled';

export const ChatWrapper = styled.div`
  display: flex;
  padding: 8px 20px;

  &:hover {
    background: #eee;
  }

  & .chat-img {
    display: flex;
    width: 36px;
    margin-right: 8px;

    & img {
      width: 36px;
      height: 36px;
    }
  }

  & .chat-text {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    & p {
      flex: 0 0 100%;
      margin: 0;
    }
  }

  & .chat-user {
    display: flex;
    flex: 0 0 100%;
    align-items: center;

    & > b {
      margin-right: 5px;
    }

    & > span {
      font-size: 12px;
    }
  }

  & a {
    text-decoration: none;
    color: deepskyblue;
  }
`;
