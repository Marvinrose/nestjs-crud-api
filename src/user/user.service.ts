import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(user: Partial<User>) {
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: ['products'] });
  }

  findOne(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }

  update(id: string, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  remove(id: string) {
    return this.userRepository.delete(id);
  }
}
