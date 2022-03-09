import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthMiddleware } from './auth.middleware';
import { PrismaService } from '../shared/services/prisma.service';
import StripeService from '../stripe/stripe.service';

@Module({
  providers: [
    UserService,
    PrismaService,
    StripeService
  ],
  controllers: [
    UserController
  ],
  exports: [UserService]
})

export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'user', method: RequestMethod.GET},
        {path: 'user', method: RequestMethod.PUT},
        {path: 'user/add-payment', method: RequestMethod.PUT}
      );
  }
}
