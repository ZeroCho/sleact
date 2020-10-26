# 백그라운드 세팅
멀티캠퍼스 강좌에서는 out of scope
1. cd back
2. npm i
3. .env 작성하기(MYSQL 비밀번호 설정)
4. config/config.json 설정
5. npx sequelize db:create(스키마 생성)
6. npm run dev했다가 끄기(테이블 생성)
7. npx sequelize db:seed:all
8. npm run dev

# 프로젝트 구조 잡기

1. package.json: npm init으로 생성
2. .prettierrc: 프리티어
3. .eslintrc: ESLint와 프리티어 연동
4. tsconfig.json: 타입스크립트 설정
5. webpack.config.ts: 웹팩 설정
6. tsconfig-for-webpack-config.json 설정
7. 라우터와 폴터 구조 세팅(index.html, index + styles)
8. tsconfig-paths로 ts와 webpack에서 alias 지정
9. emotion 세팅(babel plugin도)
10. client.tsx 작성
11. @layouts/App 작성(라우트, 리액트 로더블)
12. @pages/SignUp 작성
13. @pages/LogIn 작성
14. @layouts/Workspace 작성
15. react-router와 swr 설명
16. WorkspaceModal 작성
17. @components/DMList 작성
18. @pages/DirectMessage 작성
19. ChatBox 먼저 작성
20. ChatList 작성
21. DM 보내보기
