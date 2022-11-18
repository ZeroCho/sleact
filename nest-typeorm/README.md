강의 교안 기여(Pull Request) 환영합니다!
각 섹션별로 ch0, ch1, ... 폴더에 결과물이 있습니다.  다만 여러분들은 처음 만든 a-nest라는 폴더 안에서 계속 진행하시면 됩니다.

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
npm i -D webpack-node-externals run-script-webpack-plugin webpack
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

tsconfig.json에 다음 한 줄 넣어두기
```json
"esModuleInterop": true,
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
npm i @nestjs/swagger swagger-ui-express
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

강좌에 나오는 typeorm-model-generator를 쓰시지 마시고 nest-typeorm 폴더의 src/entities를 그냥 복사해서 src 폴더에 붙여넣으세요.

- ORM은 실제 DB 테이블을 자바스크립트 객체와 연결해주는 역할
- @Entity: 해당 클래스가 Entity 역할을 함을 나타냄(Entity는 엄밀히는 테이블과 다르지만 여기서는 테이블과 1대1 대응이라고 생각해도 됨)
- @Index: 테이블에 적용된 index 목록들(성능 향상 목적)
- @PrimaryGeneratedColumn: 프라이머리키
- @Column: 컬럼의 타입과 설정(대문자 컬럼명을 자바스크립트 속성으로 매핑)
- @CreateDateColumn: createdAt은 이걸로 바꿀 것(생성 시 시간 자동 부여)
- @UpdateDateColumn: updatedAt은 이걸로 바꿀 것(수정 시 시간 자동 부여)
- @DeleteDateColumn: deletedAt은 이걸로 바꿀 것(수정 시 시간 자동 부여)
  - softDelete용(나중에 복원을 위해)
- Entity 컬럼에도 @Api... 스웨거 데코레이터를 붙일 수 있음

## 관계
- 테이블간에는 관계가 있음(워크스페이스에 소속된 채널, 워크스페이스에 소속된 사람)
- 말로 표현해보면 어떤 관계인지 알 수 있음
- @ManyToMany: 워크스페이스 하나에 여러 사람 소속 가능. 한 사람이 여러 워크스페이스에 소속 가능. 따라서 다대다
  - 다대다는 1대다 테이블 두개로 나눌 수 있음. 대신 중간 테이블이 생김(Workspace와 User는 다대다이지만 Workspace-WorkspaceMember, WorkspaceMember-User로 분해 가능)
- @JoinTable: ManyToMany에서 하나의 엔티티에 중간 테이블 정보를 넣어줌
  - name: 중간 테이블 이름
  - joinColumn: 내 엔티티 정보
    - name: 중간 테이블에서 쓰일 내 엔티티 컬럼 이름
    - referencedColumnName: 내 엔티티 컬럼 이름
  - inverseJoinColumn: 상대 엔티티 정보
    - name: 중간 테이블에서 쓰일 상대 엔티티 컬럼 이름
    - referencedColumnName: 상대 엔티티 컬럼 이름
- @OneToMany: 일대다. 워크스페이스 하나에 여러 멤버가 소속 가능. 따라서 워크스페이스와 멤버는 일대다(사람과 워크스페이스멤버를 구분할 것)
  - 첫 번째 인자: () => 내 엔티티
  - 두 번째 인자: 상대 엔티티의 내 속성
  - 세 번째 인자: SQL 옵션(onDelete, onUpdate 등)
    - cascade: join된 테이블의 데이터까지 동시에 수정해야 할 때 해당 작업도 넣어야 함
- @ManyToOne: 다대일(일대다의 반대). 워크스페이스멤버와 워크스페이스는 다대일
- @OneToOne: 1대1 관계(강좌에는 없지만 사람과 개인정보의 관계 등)
- @JoinColumn: FK(외래키)가 있는 컬럼에 붙여줌
  - name: 현재 DB 컬럼 이름 (ex: WorkspaceId(채널 테이블))
  - referencedColumnName: 참조하는 테이블의 컬럼 이름 (ex: id(워크스페이스테이블))

[ERD 링크](https://www.erdcloud.com/d/dt8MGf45NJYMajCoe)
- ddl을 추출해서 erdcloud에 넣으면 erd가 그려짐

## MySQL과 연결하기

```shell
npm i @nestjs/typeorm typeorm mysql2
```
- mysql이 아니면 mysql2 대신 각 db에 맞는 드라이버를 받아야함

src/app.module.ts에 TypeOrmModule.forRoot 작업
```
# 강좌 참조
```
- type: db 종류
- host: db 주소
- port: db포트(mysql은 보통 3306)
- username: db 사용자이름
- password: db 사용자 비번
- database: db 데이터베이스 이름
- entities: 만든 엔티티들 여기에 넣기
- autoLoadEntities: true면 TypeOrmModule.forFeature에 넣은 엔티티들은 자동 연결됨
- synchronize: true면 entity에 따라 실제 db 테이블 재생성(기존 테이블 다 날라가니 주의)
- logging: true면 typeorm이 만들어주는 쿼리가 콘솔에 표시(개발 시에는 켜두는 게 매우 유용)
- keepConnectionAlive: true여야 핫 리로딩시에도 db 연결이 끊어지지 않음
- charset: db의 언어 설정(utf8mb4로 할것)

dataSource.ts를 따로 만들어서 package.json과 같은 위치에 두기
- 그래야 나중에 seed나 migration 작업할 때 재사용 가능

## SCHEMA, 테이블 생성

mysql 프롬프트로 접속 후 sleact SCHEMA 생성
```shell
mysql -uroot -p디비비밀번호
```
- mysql 명령어가 안 되면 mysql이 설치된 폴더로 이동해서 다시 실행
```
cd "c:\Program Files\MySQL\MySQL Server 8.0\bin"
mysql -uroot -p디비비밀번호
```
mysql prompt에서 다음 쿼리 수행
```
CREATE SCHEMA `sleact` DEFAULT CHARACTER SET utf8mb4;
exit;
```
- SCHEMA 생성 후 **synchronize: true**인 상태에서 서버 실행하면 테이블이 전부 생성됨
- 테이블 생성 후 synchronize: false로 돌려놓기

## 비동기 typeorm 연결 설정
TypeOrmModule.forRootAsync
- inject: [ConfigService]로 주입 가능
- useFactory의 매개변수로 configService 사용 가능
- process.env를 configService.get으로 대체

## Raw Query 날리기
```typescript
import { getManager } from 'typeorm';

const entitiyManager = getManager();
const someQuery = entitiyManager.query(`
  SELECT * FROM TABLE WHERE id = $1
`, [id]);
```

## seeding

typeorm-seeding 설치
```shell
npm i typeorm-seeding
npm i -D ts-node
```

package.json에 다음 줄 추가(json이므로 콤마 조심)
```
    "typeorm": "ts-node --require tsconfig-paths/register ./node_modules/typeorm/cli.js",
    "seed:config": "ts-node ./node_modules/typeorm-seeding/dist/cli.js config",
    "seed:run": "ts-node ./node_modules/typeorm-seeding/dist/cli.js seed",
    "schema:drop": "ts-node ./node_modules/typeorm/cli.js schema:drop",
    "schema:sync": "ts-node ./node_modules/typeorm/cli.js schema:sync",
    "db:migrate": "npm run typeorm migration:run",
    "db:migrate:revert": "npm run typeorm migration:revert",
    "db:create-migration": "npm run typeorm migration:create -- -n",
    "db:generate-migration": "npm run typeorm migration:generate -- -n"
```

src/database/seeds/create-initial-data.ts 작성
```
# 강좌 참조
```
시드 수행
```
npm run seed:run
```
실제 테이블에 데이터 생겼는지 항상 확인!

## migration

ormconfig.ts에 다음 줄 추가
```
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
```
직접 마이그레이션 작성하기
```
npm run db:create-migration 마이그레이션이름
```
자동으로 마이그레이션 생성하기
```
npm run db:generate-migration categoryToType
```
- 너무 typeorm을 믿지 말 것(특히 DROP 조심)

마이그레이션 수행
```
npm run db:migrate
```

## 회원가입 만들기

1. 터미널을 하나 더 씌워서 프론트 폴더 front로 이동
2. npm i로 설치
3. npm run dev로 실행
4. localhost:3090으로 접속해서 회원가입 요청 보내면 됨

src/users/dto/join.request.dto.ts 수정
```
# 강좌 참조
```
- PickType으로 다른 dto에서 특정 속성만 추출 가능

src/users/users.controller.ts, src/users/users.service.ts 수정
```
# 강좌 참조
```
- @InjectRepository(엔티티)로 typeorm 레포지토리 의존성 주입
- TypeOrmModule.forFeature([엔티티])로 주입 필요(UsersModule와 AppModule 둘 다)

비밀번호 암호화, 비교를 위해 bcrypt 설치
```shell
npm i bcrypt
```

포스트맨이든 localhost:3090 프론트앱이든으로 요청 보내보기

## ExceptionFilter
src/http-exception.filter.ts 작성
```
# 강좌 참조
```
- src/main.ts에서 app.useGlobalFilters(new HttpExceptionFilter());로 등록
- service 앞에 await 붙여야 controller로 에러가 전파됨
- LifeCycle 기억하기

## dto 밸리데이션
```shell
npm i class-validator class-transformer
```
- src/main.ts에 app.useGlobalPipes(new ValidationPipe()); 등록
  - class-transformer도 설치 필요

src/users/dto/join.request.dto.ts에 밸리데이션 추가
```typescript
```

src/http-exception.filter.ts에서 에러 메시지 커스터마이징 가능
```
# 강좌 참조
```

# 섹션3 (ch3)

## 로그인
- @UseGuards: 컨트롤러에 접근할 수 있는지 권한 체크

src/auth/local-auth.guard.ts 작성
```typescript
# 강좌 참조
```
필요 패키지 설치
```shell
npm i @nestjs/passport passport passport-local
npm i -D @types/passport-local
```
src/auth/local.strategy.ts, src/auth/local.serializer.ts, src/auth/auth.service.ts
```shell
# 강좌 참조
```
### 로그인 과정

- local-auth.guard 실행 시 local.strategy가 실행됨.
- local.strategy에서는 auth.service의 validateUser 호출
- auth.service의 validateUser(사용자가 존재하는지, 로그인 비밀번호가 일치하는 지)
  - Users 엔티티에서 password 컬럼 옵션이 select: false라서 기본적으로 password 안 가져옴
  - findOne의 select 옵션에 id, password 빼먹지 말기
- local.strategy에서 만약 validateUser가 실패하면 UnauthorizedException(401)
- local.strategy에서 최종적으로 done(에러, 로그인성공시사용자객체);
- done에서 에러가 없고 로그인성공시사용자객체가 제공되면 local.serializer의 serializeUser가 호출됨
- serializeUser에서의 done(에러, 세션에저장할값); 보통 세션에 저장할 값으로 사용자 아이디를 넣음
  - 세션에 유저 객체를 통째로 저장하면 메모리가 너무 무거워지기 때문
- 여기까지 되면 로그인 성공한 것
- deserializeUser는 로그인 성공 후 컨트롤러에 접근하기 전에 매번 호출됨 
  - 세션에저장한값으로부터 사용자 객체를 찾아서 req.user를 만듦(@User() 사용 가능해짐)
  - done(에러, req.user가될값);

src/auth/auth.module.ts
```typescript
# 강좌 참조
```
- AuthService, LocalStrategy, LocalSerializer를 모두 묶어줌
- PassportModule.register로 passport모듈 등록
  - 세션 사용시 옵션으로 session: true
  - 토큰 기반으로 하면 session: false 하면 됨

```shell
npm i cookie-parser express-session
```
- 세션 기반 로그인을 할 때 쿠키파서와 익스프레스세션이 추가적으로 필요함

src/main.ts
```typescript
  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
```
- src/main.ts에 익스프레스 미들웨어들 장착 필요
- src/app.module.ts에 AuthModule 장착
```typescript
import { AuthModule } from './auth/auth.module';
...
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, // 여기
    UsersModule,
```
**서버 실행해서 로그인 되는 것 확인하기**

### 커스텀 가드 만들기
src/auth/logged-in.guard.ts, src/auth/not-logged-in.guard.ts
```typescript
# 강좌 참조
```
- canActivate에서 true/false 여부에 따라 다음 컨트롤러 접근 권한 부여
- 컨트롤러: 회원가입(NotLoggedInGuard), 로그아웃(LoggedInGuard) 붙이기

## typeorm 쿼리
### findOne할 때 join해서 불러오기

- src/auth/local.serializer.ts에서 deserializeUser 보면 relations: ['Workspaces'] 가 있음
  - typeorm에서 조인하는 방법 중 하나임(Users 엔티티의 Workspaces @JoinTable대로 join됨)
  - 다른 방법으로 [join](https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#basic-options) 이 있음
    - 개인적으로는 queryBuilder 선호

### 회원가입 수정
src/users/users.service.ts
```typescript
...
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
...
@Injectable()
export class UsersService {
  constructor(
...
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
...
  const returned = await this.usersRepository.save({
    email,
    nickname,
    password: hashedPassword,
  });
  await this.workspaceMembersRepository.save({
    UserId: returned.id,
    WorkspaceId: 1,
  });
  await this.channelMembersRepository.save({
    UserId: returned.id,
    ChannelId: 1,
  });
  return true;
```
- const workspaceMember = new WorkspaceMembers() 해서 save(workspaceMember)하는 방법도 있음 
- const workspaceMember = this.workspaceMembersRepository.create(); 동일

src/users/users.module.ts, src/app.module.ts
```typescript
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, WorkspaceMembers, ChannelMembers]),
  ],
```

**AppModule**에서도 TypeOrmModule.forFeature에 넣는 것 잊지 말기

## 트랜잭션
- 강좌에서는 createQueryRunner 방식을 사용함
- getConnection 대신 의존성 주입을 사용(connection: Connection)
- Repository도 QueryRunner와 연결된 것으로 바꿔야 함
  - queryRunner.manager.getRepository(Users)
```typescript
const queryRunner = this.connection.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();
try {
  // DB작업
  await queryRunner.commitTransaction();  
} catch (err) {
  // 실패 처리
  await queryRunner.rollbackTransaction();
} finally {
  await queryRunner.release();
}
```
- 데코레이터 방식을 쓰고 싶다면 [이 라이브러리](https://github.com/odavid/typeorm-transactional-cls-hooked) 사용하면 됨

## WorkspacesService
- 의존성 주입을 constructor 안에 넣을 때와 바깥에 꺼낼 때 구분하기

src/workspaces/workspaces.service.ts, src/workspaces/workspaces.controller.ts
```typescript
# 강좌 참조
```
- findOne, findByIds, find + { take: 1 } 등으로 하나만 찾을 수 있음
- 쿼리 조건은 where, join 테이블의 컬럼도 전부 where 안에서 조회 가능
- ParseIntPipe, ParseArrayPipe 등으로 @Param이나 @Query 타입 변경 가능(기본은 string)

src/workspaces/dto/create-workspace.dto
```typescript
# 강좌 참조
```

- createQueryBuilder
  - sql 문법을 최대한 비슷하게 사용할 수 있음
  - alias는 별명을 넣어주는 자리
  - select 통해서 원하는 필드만 가져올 수 있음
    - addSelect로 추가로 원하는 필드 지정할 수 있음
  - where에는 조건을 넣을 수 있음
    - where({ id: 값 }) 형식 또는 where('쿼리', { 쿼리파라미터 }) 형식 가능
    - 조건 여러 개일 때는 andWhere, orWhere 등이 있음
  - innerJoin, leftJoin 등으로 join 가능
    - innerJoinAndSelect, leftJoinAndSelect는 join하면서 동시에 해당 테이블 컬럼 select
    - join의 세 번째 인자로 조건, 네 번째 인자로 쿼리 파라미터(sql인젝션 방어용)
  - orderBy, addOrderBy로 정렬법 지정 가능
  - take(숫자)로 조회 시 지정한 개수만 가져올 수 있음(LIMIT)
  - skip(숫자)으로 조회 시 지정한 개수를 건너 뛰고 가져올 수 있음(OFFSET)
  - getCount, getMany, getOne, getManyAndCount, getOneOrFail 등으로 최종적으로 조회
  - getRawOne, getRawMany는 typeorm 가공 없이 db 결과물 그대로 가져옴

src/channels/channels.service.ts, src/channels/channels.controller.ts
```typescript
# 강좌 참조
```

# 섹션3, 섹션4 (nest-typeorm 폴더)
## WebSocket
```shell
npm i @nestjs/websockets @nestjs/platform-socket.io
nest g mo events
nest g ga events
```
- events.module.ts와 events.gateways.ts를 events 폴더 안으로 옮기기
- **AppModule**에서는 EventsModule과 EventsGateway를 지우세요!!!

## Socket.io
- namespace와 room으로 구성됨
  - namespace는 워크스페이스(ws-워크스페이스명, 예시:ws-sleact)
  - room은 채널, DM
- @WebSocketGateway({ namespace: '이름' 또는 정규표현식 })
- @WebSocketServer(): 서비스에서 의존성주입받아 사용할 소켓 서버 객체
- @SubscribeMessage(이벤트명): 웹소켓 이벤트리스너
  - @MessageBody(): 이벤트의 데이터가 의존성주입됨
- afterInit: 웹소켓 초기화가 끝났을 때
- handleConnection: 클라이언트와 연결이 맺어졌을 때
  - @ConnectedSocket(): socket을 의존성주입받을 수 있음
  - socket.emit으로 이벤트 전송 가능(이렇게 하면 모두에게 이벤트 전송)
  - socket.nsp: 네임스페이스 객체(socket.nsp.emit 하면 해당 네임스페이스 전체에게 이벤트 전송)
  - socket.nsp.name: 네임스페이스 이름
  - socket.id: 소켓의 고유 아이디(이걸 사용해서 1대1 메시지도 보낼 수 있음, socket.to(소켓아이디).emit)
- handleDisconnect: 클라이언트와 연결이 끊어졌을 때

src/events/onlineMap.ts
```shell
# 강좌 참조
```

- ChannelsModule, DMsModule 등에 이벤트모듈 넣기
  - EventsGateway 넣으면 안 됨!!!
  - eventsGateway: EventsGateway로 서비스에서 의존성주입 가능
  
## Multer
```shell
npm i -D @types/multer
```
- @UseInterceptors(FileInterceptor)
  - @UploadedFile로 file 객체 의존성 주입 가능(Express.Multer.File로 타이핑)
  - 파일이 여러 개면 FilesInterceptor, @UploadedFiles
  - FileInterceptor에 멀터 설정 가능

## Static
src/main.ts
```typescript
import path from 'path';
...
  const app = await NestFactory.create<NestExpressApplication>(AppModule); 
...
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
   prefix: '/uploads'
  });
```
- useStaticAssets(실제 업로드 폴더 경로, { prefix: '브라우저에서 쓸 경로' });

## Cors
src/main.ts
```typescript
app.enableCors({
  origin: true,
  credentials: true,
});
```

## 배포 준비하기
```shell
npm run build
NODE_ENV=production PORT=포트 npm run start:prod
```
- 다만 NODE_ENV, PORT 등은 윈도우에서 안 돌아감
- cross-env 설치하면 해결됨

```shell
npm i cross-env
cross-env NODE_ENV=production PORT=포트 npm run start:prod
```
- EC2 등에서 배포할 때 터미널을 끄면 서버도 같이 꺼짐
- pm2로 방지
```shell
npm i pm2
```
package.json 스크립트 수정
```json
"start:prod": "cross-env NODE_ENV=production PORT=80 pm2 start dist/main.js"
```
```shell
npm run start:prod
```
- 리눅스에서는 80번 포트쓸 때 sudo 붙여야 함(1024번 이하 포트는 sudo 필요)
