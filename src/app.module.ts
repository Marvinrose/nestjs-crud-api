import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'nestjs_crud',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Do not use this in production
    }),
    UserModule,
    ProductModule,
    ThrottlerModule.forRoot({
      ttl: 60 as any, // Time to live (in seconds)
      limit: 10 as any, // Limit to 10 requests per minute
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
