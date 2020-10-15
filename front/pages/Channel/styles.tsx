import styled from '@emotion/styled';

export const Header = styled.header`
  height: 64px;
  display: flex;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 1px 0 var(--saf-0);
  padding: 20px 16px 20px 20px;
  font-weight: bold;
  align-items: center;
`;

export const ChatArea = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: calc(100% - 325px);
  padding: 20px;
  padding-top: 0;
`;

export const Form = styled.form`
  color: rgb(29, 28, 29);
  font-size: 15px;
  border-radius: 4px;
  border: 1px solid rgb(29, 28, 29);

  & > textarea {
    width: 100%;
    height: 44px;
    padding: 9px 10px;
    border: none;
    outline: none;
    font-family: Slack-Lato, appleLogo, sans-serif;
    font-size: 15px;
    resize: none;
    border-radius: 4px;
  }
`;

export const Toolbox = styled.div`
  position: relative;
  background: rgb(248, 248, 248);
  height: 41px;
  display: flex;
  border-top: 1px solid rgb(221, 221, 221);
  align-items: center;
  border-radius: 4px;
`;

export const SendButton = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
`;

export const StickyHeader = styled.div`
  display: flex;
  justify-content: center;
  flex: 1;
  width: 100%;
  position: sticky;
  top: 14px;

  & button {
    font-weight: bold;
    font-size: 13px;
    height: 28px;
    line-height: 27px;
    padding: 0 16px;
    padding-right: 8px;
    z-index: 2;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
    border-radius: 24px;
    position: relative;
    top: -14px;
    background: white;
    border: none;
    outline: none;
  }
`;

export const ChatZone = styled.div`
  height: calc(100% - 64px);
`;

export const Section = styled.section`
  margin-top: 20px;
  border-top: 1px solid #eee;
`;
