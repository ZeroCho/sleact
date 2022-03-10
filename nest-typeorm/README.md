각 섹션별로 ch0, ch1, ... 폴더에 결과물이 있습니다.  다만 여러분들은 처음 만든 a-nest라는 폴더 안에서 계속 진행하시면 됩니다.

**Node.js 교과서** 책이나 강좌를 듣고 오시는 게 Express 코드 이해에 좋습니다.

# 섹션0 (ch0)
1. 먼저 [node](https://nodejs.org) 16버전 이상 다운로드
2. [mysql community](https://dev.mysql.com/downloads) 다운로드
3. mysql 설치할 때 legacy authentication 클릭하기!!!

```shell
# 다음 명령어에 버전이 나와야 node가 성공적으로 설치된 것
npm -v
```
```shell
npm i -g @nestjs/cli
nest new aNest
```

```shell
cd a-nest
# 서버 실행
npm run start
```

- src/main.ts: nest앱을 http 포트와 연결하는 부분

## hot reloading
[문서](https://docs.nestjs.com/recipes/hot-reload)

```shell
npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
```

webpack-hmr.config.js 추가
```
# 강좌 참조
```

package.json
```
"start:dev": "nest build --webpack --webpackPath webpack-hmr.config.js --watch"
```

- nest@8 사용 시 핫 리로딩 버그 없음

src/main.ts
```

```

```shell
npm run start:dev
```

## 컨트롤러와 서비스
- @Controller와 @Get(또는 @Post @Put @Delete 등) 의 주소가 합쳐짐
- Controller 만든 것은 Module의 controllers 배열에 추가해야함
- Service는 req와 res에 대해 몰라야함. 만들고자 하는 서비스에 대한 로직만 있어야 함.
- 나중에 테스트 시 가짜 req, res를 컨트롤러에 넣을 수 있음

## dotenv
src/app.module.ts
```
import { ConfigModule } from '@nestjs/config';
...
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, ConfigService],
```
src/app.service.ts
```typescript
import {ConfigService} from "@nestjs/config";

export class AppService {
    constructor(private configService: ConfigService) {}
    getHello(): string {
        return this.configService.get('NAME'); // 제로초바보
    }
}
```
### 심화과정
- ConfigModule.forRoot에 isGlobal: true를 하면 전역 설정이 됨(추후 ConfigModule 넣을 필요 없음)
- load에 함수를 넣으면 return 값이 설정이 됨(비동기도 지원해서 보통 여기서 외부 env들을 가져와서 return함);

## morgan
src/middlewares/logger.middlewares.ts
```
# 강좌 참조
```
- use 부분은 요청 시에
- response.on('finish') 부분은 응답 후에 찍힘
- next 꼭 넣기

src/app.module.ts
```
import { MiddlewareConsumer, Module } from '@nestjs/common';
...
import { LoggerMiddleware } from './middlewares/logger.middleware';
...
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

```

## DI
- @Injectable과 provider 기억하기
- @Module의 provider에 들어있는 것이 constructor에 주입됨. 마법이 아님!
- 나중에 provider만 바꾸면 주입되는 것을 자유자재로 바꿀 수 있음(테스트 시 유용)
- providers의 원형 기억하기(provide와 useClass, useValue, useFactory 등)
- class는 클래스 이름 자체가 token이고, 클래스가 아닌 경우에는 @Inject(토큰)로 provide의 값과 일치해야 함

#섹션1 (ch1)

