import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const user = { ...createUserDto, id: '1' } as User;

    jest.spyOn(repo, 'create').mockReturnValue(user);
    jest.spyOn(repo, 'save').mockResolvedValue(user);

    expect(await service.create(createUserDto)).toEqual(user);
  });

  it('should find all users', async () => {
    const users: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      } as User,
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
      } as User,
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it('should find a user by ID', async () => {
    const user: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    } as User;

    jest.spyOn(repo, 'findOne').mockResolvedValue(user);

    expect(await service.findOne('1')).toEqual(user);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };
    const user = { id: '1', ...updateUserDto, password: 'password123' } as User;

    const updateResult: UpdateResult = {
      raw: [],
      generatedMaps: [],
      affected: 1,
    };

    jest.spyOn(repo, 'update').mockResolvedValue(updateResult);
    jest.spyOn(repo, 'findOne').mockResolvedValue(user);

    expect(await service.update('1', updateUserDto)).toEqual(user);
  });

  it('should delete a user', async () => {
    jest.spyOn(repo, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.remove('1')).toBeUndefined();
  });
});
