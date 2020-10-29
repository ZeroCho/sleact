import styled from '@emotion/styled';

export const ChatWrapper = styled.div`
  display: flex;
  padding: 8px 20px;

  &:hover {
    background: #eee;
  }

  & > div:first-of-type {
    display: flex;
    width: 36px;
    margin-right: 8px;

    & img {
      width: 36px;
      height: 36px;
    }
  }

  & > div:last-of-type {
    display: flex;
    flex: 1;
  }

  & a {
    text-decoration: none;
    color: deepskyblue;
  }
`;
