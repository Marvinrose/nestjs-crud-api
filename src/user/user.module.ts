import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity'; // Import your User entity here

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Register the User entity
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Optionally export UserService if used in other modules
})
export class UserModule {}
