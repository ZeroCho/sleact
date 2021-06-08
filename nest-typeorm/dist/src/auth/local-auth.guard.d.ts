import { ExecutionContext } from '@nestjs/common';
declare const LocalAuthGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class LocalAuthGuard extends LocalAuthGuard_base {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
