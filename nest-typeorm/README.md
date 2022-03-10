각 섹션별로 ch0, ch1, ... 폴더에 결과물이 있습니다.  다만 여러분들은 처음 만든 a-nest라는 폴더 안에서 계속 진행하시면 됩니다.
3월 13일까지 강의교안, 소스코드 폴더 전부 업로드하겠습니다.

**Node.js 교과서** 책이나 강좌를 듣고 오시는 게 Express 코드 이해에 좋습니다.

# 섹션0 (ch0 폴더)
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
# 강좌 참조
```

```shell
npm run start:dev
```

## 컨트롤러와 서비스
- @Controller와 @Get(또는 @Post @Put @Delete 등) 의 주소가 합쳐짐
- Controller 만든 것은 Module의 controllers 배열에 추가해야함
- Service는 req와 res에 대해 몰라야함. 만들고자 하는 서비스에 대한 로직만 있어야 함.
- Controller도 웬만하면 req, res에 대해 모르면 좋음. 나중에 테스트 시 가짜 req, res를 컨트롤러에 넣을 수 있음

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

# 섹션1 (ch1 폴더)

a-nest 폴더 안에서 명령어 입력(모듈 만드는 명령)
- src/app.module.ts와 연결되었는지 확인할 것
```shell
nest g mo users
nest g mo workspaces
nest g mo channels
nest g mo dms
```
서비스(s), 컨트롤러(co) 만드는 명령
- src/users/users.module.ts와 연결되었는지 확인할 것
```shell
nest g s users
nest g co users
```
src/users/users.controller.ts, src/users/users.service.ts
```
# 강좌 참조
```
- @Req(요청), @Res(응답) 객체 접근 가능, but 안 쓰는게 좋음
- @Body(): req.body와 동일
- 요청에 관한 데이터는 dto로 만들어둠

src/users/dto/join.request.dto.ts
```
# 강좌 참조
```
- @Param(): req.params와 동일 (url에서 :가 붙은 변수)
- @Query(): req.query와 동일 (?a=b 같은 쿼리스트링)
```shell
nest g s dms && nest g co dms
nest g s channels && nest g co channels
nest g s workspaces && nest g co workspaces
```

## swagger

src/main.ts
```typescript
  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
```

```shell
npm i @nestjs/swagger
```

src/users/dto/join.request.dto, src/users/users.controller.ts, src/dms/dms.controller.ts
```
# 강좌 참조
```
- @ApiOperation({ summary: '라우터 설명' })
- @ApiProperty(): 속성에 대한 설명, 예시, 기본값, 필수 여부 등
- @ApiQuery(): 쿼리스트링에 대한 설명, 예시, 기본값, 필수 여부 등
- @ApiParam(): 주소 변수에 대한 설명, 예시, 기본값, 필수 여부 등
- @ApiTags(): Swagger문서 카테고리 이름
- @ApiResponse(): 응답값에 대한 타이핑, code별로 여러 개 붙일 수 있음

src/common/dto/user.dto.ts
```
# 강좌 참조
```
- 다른 dto를 extends 할 수 있음
- 다른 dto에서 일부만 빼올 수 있음(섹션 3에 나옴)

## 커스텀 데코레이터 만들기
src/common/user.decorator.ts
```
# 강좌 참조
```
- 앞으로 @User() 데코레이터 사용 가능(req.user 대체)
- 비슷하게 @Token() 같은 것도 만들 수 있음
- 혹시나 기반 프레임워크가 달라지더라도 req.user를 모두 찾아 바꾸는 게 아니라 데코레이터만 바꿔도 돼서 편리함
- ctx.switchToHttp()가 있는데 혹시나 서비스가 웹소켓 기반으로 바뀌면 ctx.switchToWs()로 쉽게 바꿀 수 있음

## 인터셉터
src/common/interceptors/undefinedtoNull.interceptor.ts
```
# 강좌 참조
```
- 요청이나 응답에 대한 공통적인 작업을 인터셉터에서 처리
- 에러는 expectionFilter에서 처리할 것
- 적용은 @UseInterceptor(인터셉터)

# 섹션2 (ch2 폴더)

**집중**

강좌에 나오는 typeorm-model-generator를 쓰시지 마시고
nest-typeorm 폴더의 src/entities를 그냥 복사해서 src 폴더에 붙여넣으세요.

- ORM은 실제 DB 테이블을 자바스크립트 객체와 연결해주는 역할
- @Entity: 해당 클래스가 Entity 역할을 함을 나타냄(Entity는 엄밀히는 테이블과 다르지만 여기서는 테이블과 1대1 대응이라고 생각해도 됨)
- @Index: 테이블에 적용된 index 목록들(성능 향상 목적)
- @PrimaryGeneratedColumn: 프라이머리키
- @Column: 컬럼의 타입과 설정(대문자 컬럼명을 자바스크립트 속성으로 매핑)

## 관계
- 테이블간에는 관계가 있음(워크스페이스에 소속된 채널, 워크스페이스에 소속된 사람)
- 말로 표현해보면 어떤 관계인지 알 수 있음
- @ManyToMany: 워크스페이스 하나에 여러 사람 소속 가능. 한 사람이 여러 워크스페이스에 소속 가능. 따라서 다대다
- 다대다는 1대다 테이블 두개로 나눌 수 있음. 대신 중간 테이블이 생김(Workspace와 User는 다대다이지만 Workspace-WorkspaceMember, WorkspaceMember-User로 분해 가능)
- @OneToMany: 일대다. 워크스페이스 하나에 여러 멤버가 소속 가능. 따라서 워크스페이스와 멤버는 일대다(사람과 워크스페이스멤버를 구분할 것)
- @ManyToOne: 다대일(일대다의 반대). 워크스페이스멤버와 워크스페이스는 다대일
- @OneToOne: 1대1 관계(강좌에는 없지만 사람과 개인정보의 관계 등)
