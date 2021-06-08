import { NestMiddleware } from '@nestjs/common';
export declare class FrontendMiddleware implements NestMiddleware {
    use(req: any, res: any, next: any): void;
}
