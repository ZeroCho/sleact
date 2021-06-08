import { Injectable, NestMiddleware } from '@nestjs/common';
import path from 'path';

@Injectable()
export class FrontendMiddleware implements NestMiddleware {
  use(req, res, next) {
    const { url } = req;
    if (url.includes('/api')) {
      next();
    } else {
      res.sendFile(
        path.join(__dirname, '..', '..', '..', 'public', 'index.html'),
      );
    }
  }
}
