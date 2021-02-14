import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 38px);
  flex-flow: column;
`;

export const Header = styled.header`
  height: 64px;
  display: flex;
  width: 100%;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 1px 0 var(--saf-0);
  padding: 20px 16px 20px 20px;
  font-weight: bold;
  align-items: center;

  & img {
    margin-right: 5px;
  }
`;
