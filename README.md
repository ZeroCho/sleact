# 라이브강좌 핵심 내용 정리해서 10.27에 여기(README.md)에 올려두겠습니다~ 다시보기하면서 같이 읽고 복습하시면 됩니다!

# 백그라운드 세팅
0. node 14버전(12나 15도 괜찮음)과 MySQL을 미리 설치하기
1. cd back
2. npm i
3. .env 작성하기(COOKIET_SECRET과 MYSQL_PASSWORD 비밀번호 설정)
4. config/config.json 설정(MYSQL 접속 설정)
5. npx sequelize db:create(스키마 생성)
6. npm run dev했다가 ctrl + c로 끄기(테이블 생성)
7. npx sequelize db:seed:all(기초 데이터 넣기)
8. npm run dev
9. localhost:3095에서 서버 돌아가는 중
10. 백엔드 개발자가 API.md와 typings/db.ts를 남겨둔 상황

# 강좌 순서
## 1일차
1. package.json
  - npm init으로 생성
  - npm i react react-dom typescript
  - npm i @types/react @types/react-dom
  - 설치 후 package-lock.json과 node_modules 폴더가 생성됨
2. .eslintrc
  - eslint 설정 파일
  - 코드 점검 도구, 직접 설정하면 팀원간 의견 충돌이 있으니 prettier에 위임
  - npm i -D eslint
3. .prettierrc
  - prettier 설정 파일
  - 저장하면 알아서 코드를 수정해줌(에디터 설정 필요)
  - npm i -D prettier eslint-plugin-prettier eslint-config-prettier
4. tsconfig.json
  - 타입스크립트 설정
  - 언어 문법과 자바스크립트 결과물이 어떻게 나와야하는지 설정하는 파일
  - lib은 ES2020, DOM(브라우저), module은 esnext처럼 최신 설정이지만 target은 es5로 IE 브라우저에서도 돌아갈 수 있게 변환
  - strict: true를 켜놓아야 타입 체킹을 해줘서 의미가 있음.
5. webpack.config.ts
  - 웹팩 설정
  - ts, css, json, 최신 문법 js 파일들을 하나로 합쳐줌.
  - npm i -D webpack @types/webpack @types/node
  - entry에서 파일을 선택하면 module에 정해진 rules대로 js로 변환하여 하나의 파일로 합쳐줌(output). plugins는 합치는 중 부가적인 효과를 줌
  - ts는 babel-loader로, css는 style-loader와 css-loader를 통해 js로 변환
  - babel에서는 @babel/preset-env(최신문법 변환) @babel/preset-react(리액트 jsx 변환), @babel/preset-typescript(타입스크립트 변환)
  - npm i -D css-loader style-loader @babel/core babel-loader @babel/preset-env @babel/preset-react @babel/preset-typescript
  - publicPath가 /dist/고 [name].js에서 [name]이 entry에 적힌대로 app으로 바뀌어 /dist/app.js가 결과물이 됨.
6. index.html 작성
  - /dist/app.js로 웹팩이 만들어낸 js파일 불러옴
  - 아이콘, 폰트, 파비콘같은 것은 슬랙에서 그대로 사용
  - #app 태그에 리액트가 렌더링됨.
7. client.tsx에 간단한 tsx 작성
8. tsconfig-for-webpack-config.json
  - 개발용 서버인 devServer 옵션 추가(port는 3090, publicPath는 /dist/로
  - webpack serve할 때 webpack.config.ts를 인식 못하는 문제
  - npm i -D ts-node webpack-dev-server @types/webpack-dev-server webpack-cli
  - npm i cross-env
  - package.json의 scripts의 dev를 cross-env TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack serve --env development
  - npm run dev하면 localhost:3090에서 서버 실행됨.
9. hot reloading 설정
  - npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh
  - webpack의 babel-loader 안에 설정(env) 및 plugin으로 추가
10. 폴더 구조 세팅
  - 페이지들은 pages
  - 페이지간 공통되는 틀은 layouts
  - 개별 컴포넌트는 components
  - 각 컴포넌트는 컴포넌트 폴더 아래 index.tsx(JSX)와 styles.tsx(스타일링)
11. ts와 webpack에서 alias 지정
  - npm i -D tsconfig-paths
  - tsconfig에서 baseUrl와 paths 설정
  - webpack에서는 resolve안에 alias 설정
  - ../layouts/App같은 것을 @layouts/App으로 접근 가능
12. emotion 세팅
  - styled components와 비슷하지만 설정이 간단함.
  - npm i @emotion/core @emotion/styled
  - npm i -D babel-plugin-emotion (웹팩에 babel 설정 추가)
  - 스타일드 컴포넌트로 만들 때 변수를 많이 만드는 셈이므로 & 같은 선택자 적극 활용해야 변수 이름짓기를 최소화할 수 있음.
13. @layouts/App 작성
  - 리액트 라우터 적용하기
  - npm i react-router react-router-dom @types/react-router @types/react-router-dom
  - client.tsx에서 App을 BrowserRouter로 감싸기
  - @layouts/App에 Switch, Redirect, Route 넣기
14. @pages/SignUp 작성

## 2일차
15. @loadable/component
16. force-ts-checker-webpack-plugin
17. 회원가입 axios로 진행(devServer proxy 설정 필요)
18. useInput 커스텀 훅 만들기
19. @pages/LogIn 작성
20. @layouts/Workspace 작성
21. swr 설명
22. WorkspaceModal 작성
23. @components/DMList 작성
24. @pages/DirectMessage 작성
25. ChatBox 먼저 작성
26. ChatList 작성
27. DM 보내보기
28. @components/ChannelList 작성
29. @pages/ChannelMessage 작성
30. Channel Chat 보내보기
