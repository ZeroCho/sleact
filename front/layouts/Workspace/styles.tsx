import styled from '@emotion/styled';

export const RightMenu = styled.div`
  float: right;
`;

export const Header = styled.header`
  height: 38px;
  background: #350d36;
  color: #FFFFFF;
  box-shadow: 0 1px 0 0 rgba(255,255,255,0.1);
  padding: 5px;
  text-align: center;
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  position: absolute;
  top: 5px;
  right: 16px;
`;

export const ProfileModal = styled.div`
  position: fixed;
  right: 0;
  top: 38px;
  --saf-0: rgba(var(--sk_foreground_low,29,28,29),0.13);
  box-shadow: 0 0 0 1px var(--saf-0),0 4px 12px 0 rgba(0,0,0,.12);
  background-color: rgba(var(--sk_foreground_min_solid,248,248,248),1);
  border-radius: 6px;
  user-select: none;
  min-width: 360px;
  z-index: 1012;
  max-height: calc(100vh - 20px);
  padding: 0 0 10px;
  color: rgb(29, 28, 29);
  
  & > div {
    padding: 20px;
  }
  
  & img {
    display: flex;
  }
  
  & #profile-name {
    font-weight: bold;
    display: inline-flex
  }
  
  & #profile-active {
    font-size: 13px;
    display: inline-flex
  }
`;

export const LogOutButton = styled.button`
  border: none;
  width: 100%;
  border-top: 1px solid rgb(29, 28, 29);
  background: transparent;
  display: block;
  height: 28px;
  line-height: 28px;
  padding: 5px 20px 0;
`;

export const Workspaces = styled.div`
  width: 65px;
  display: inline-block;
  background: #3F0E40;
  height: calc(100% - 38px);
  border-top: 1px solid rgb(82, 38, 83);
  border-right: 1px solid rgb(82, 38, 83);
  vertical-align: top;
  text-align: center;
  padding: 15px 0 0;
`;

export const Channels = styled.nav`
  width: 260px;
  display: inline-block;
  background: #3F0E40;
  color: rgb(188,171,188);
  height: calc(100% - 38px);
  vertical-align: top;
  
  & a {
    padding-left: 36px;
    color: inherit;
    text-decoration: none;
    height: 28px;
    line-height: 28px;
    display: block;
  }
  
  & h2 {
    height: 36px;
    line-height: 36px;
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 15px;
  }
`;

export const WorkspaceName = styled.button`
  height: 64px;
  line-height: 64px;
  border: none;
  width: 100%;
  text-align: left;
  border-top: 1px solid rgb(82, 38, 83);
  border-bottom: 1px solid rgb(82, 38, 83);
  font-weight: 900;
  font-size: 24px;
  background: transparent;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0;
  padding-left: 16px;
  margin: 0;
  color: white;
`;

export const WorkspaceModal = styled.div`
  position: fixed;
  top: 95px;
  left: 80px;
  --saf-0: rgba(var(--sk_foreground_low,29,28,29),0.13);
  box-shadow: 0 0 0 1px var(--saf-0),0 4px 12px 0 rgba(0,0,0,.12);
  background-color: rgba(var(--sk_foreground_min_solid,248,248,248),1);
  border-radius: 6px;
  user-select: none;
  min-width: 360px;
  z-index: 1012;
  max-height: calc(100vh - 20px);
  padding: 10px 0 10px;
  color: rgb(29, 28, 29);
  
  & > button {
    width: 100%;
    border: none;
    background: transparent;
    border-top: 1px solid rgb(28, 29, 28);

    &:last-of-type {
      border-bottom:1px solid rgb(28, 29, 28);
    }
  }
`;

export const Chats = styled.div`
  display: inline-block;
  height: calc(100% - 160px);
  vertical-align: top;
  width: calc(100% - 325px);
`;

export const CreateModal = styled.div`
  position: fixed;
  text-align: center;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  
  & > div {
    margin-top: 200px;
    display: inline-block;
    width: 440px;
    background: white;
    --saf-0: rgba(var(--sk_foreground_low,29,28,29),0.13);
    box-shadow: 0 0 0 1px var(--saf-0),0 4px 12px 0 rgba(0,0,0,.12);
    background-color: rgba(var(--sk_foreground_min_solid,248,248,248),1);
    border-radius: 6px;
    user-select: none;
    max-width: 440px;
    padding: 40px;
    z-index: 1012;
    position: relative;
  }
`;

export const CloseModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
`;

export const AddButton = styled.button`
  color: white;
  font-size: 24px;
  display: inline-block;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
`;

export const WorkspaceButton = styled.button`
  display: inline-block;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  border: 3px solid #3F0E40;
  margin-bottom: 15px;
  font-size: 18px;
  font-weight: 700;
  color: black;
`;

export const CollapseButton  =styled.button<{ collapse: boolean }>`
  background: transparent;
  border: none;
  width: 26px;
  height: 26px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-left: 10px;
  
  ${({ collapse }) => collapse && `
    & i {
      transform: none;
    }
  `};
`;
