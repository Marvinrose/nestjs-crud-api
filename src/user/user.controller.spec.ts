import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('UserController', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    userService = module.get<UserService>(UserService);
  });

  afterEach(async () => {
    await app.close();
  });

  it('/users (POST) - success', async () => {
    const createUserDto: CreateUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const user: User = {
      id: '1',
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(userService, 'create').mockResolvedValue(user);

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toEqual(user);
  });

  it('/users (GET) - success', async () => {
    const users: User[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User,
    ];

    jest.spyOn(userService, 'findAll').mockResolvedValue(users);

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toEqual(users);
  });

  it('/users/:id (GET) - success', async () => {
    const user: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(userService, 'findOne').mockResolvedValue(user);

    const response = await request(app.getHttpServer())
      .get('/users/1')
      .expect(200);

    expect(response.body).toEqual(user);
  });

  it('/users/:id (GET) - not found', async () => {
    jest
      .spyOn(userService, 'findOne')
      .mockRejectedValue(new NotFoundException());

    await request(app.getHttpServer()).get('/users/999').expect(404);
  });

  it('/users/:id (PUT) - success', async () => {
    const updateUserDto: UpdateUserDto = {
      firstName: 'Updated',
      lastName: 'User',
    };

    const updatedUser: User = {
      id: '1',
      firstName: 'Updated',
      lastName: 'User',
      email: 'john@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

    const response = await request(app.getHttpServer())
      .put('/users/1')
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toEqual(updatedUser);
  });

  it('/users/:id (DELETE) - success', async () => {
    const user: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(userService, 'remove').mockResolvedValue(user); // Ensure the return type matches

    const response = await request(app.getHttpServer())
      .delete('/users/1')
      .expect(200);

    expect(response.body).toEqual(user); // Ensure the test expects the correct response
  });
});
