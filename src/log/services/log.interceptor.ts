import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      tap(
        () => {
          console.log(
            `\x1b[32m[Nest] ${
              process.pid
            }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
            `\x1b[32m    LOG\x1b[0m`,
            `\x1b[33m[RouteCalled]\x1b[0m`,
            `\x1b[32mCalled {${context.getArgs()[0].url}`,
            `${context.getArgs()[0].method}},`,
            `Client: {${context.getArgs()[0].headers['user-agent']},`,
            `${context.getArgs()[0].ip}}`,
            `\x1b[33m${Date.now() - now}ms\x1b[0m`,
          );
        },
        (e: any) => {
          console.log(
            `\x1b[31m[Nest] ${
              process.pid
            }  -\x1b[0m ${new Date().toLocaleDateString()}, ${new Date().toLocaleTimeString()}`,
            `\x1b[31m  ERROR\x1b[0m`,
            `\x1b[33m[ExceptionHandler]\x1b[0m`,
            `\x1b[31mCalled {${context.getArgs()[0].url},`,
            `${context.getArgs()[0].method}},`,
            `Error: {${e.response ? e.response.statusCode : e} ${
              e.response ? e.response.message : ''
            }},`,
            `Client: {${context.getArgs()[0].headers['user-agent']},`,
            `${context.getArgs()[0].ip}}`,
            `\x1b[33m${Date.now() - now}ms\x1b[0m`,
          );
        },
      ),
    );
  }
}
