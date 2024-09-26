import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from '../user/user.entity'; // Assuming User entity is in another module

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a product', async () => {
    const createProductDto: CreateProductDto = {
      name: 'Product 1',
      description: 'Description',
      price: 100,
      userId: '1',
    };

    const user = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    } as User;

    const product = {
      ...createProductDto,
      id: '1',
      user: user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    jest.spyOn(repo, 'create').mockReturnValue(product);
    jest.spyOn(repo, 'save').mockResolvedValue(product);

    expect(await service.create(createProductDto)).toEqual(product);
  });

  it('should find all products', async () => {
    const user = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    } as User;

    const products: Product[] = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description',
        price: 100,
        userId: '1',
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product,
      {
        id: '2',
        name: 'Product 2',
        description: 'Description',
        price: 200,
        userId: '2',
        user,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product,
    ];

    jest.spyOn(repo, 'find').mockResolvedValue(products);

    expect(await service.findAll()).toEqual(products);
  });

  it('should find one product by id', async () => {
    const user = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    } as User;

    const product: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description',
      price: 100,
      userId: '1',
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    jest.spyOn(repo, 'findOne').mockResolvedValue(product);

    expect(await service.findOne('1')).toEqual(product);
  });

  it('should update a product', async () => {
    const updateProductDto: UpdateProductDto = {
      name: 'Updated Product',
      description: 'Updated Description',
      price: 150,
    };

    const user = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    } as User;

    const product: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description',
      price: 100,
      userId: '1',
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    const updatedProduct = {
      ...product,
      ...updateProductDto,
    } as Product;

    jest.spyOn(repo, 'preload').mockResolvedValue(updatedProduct);
    jest.spyOn(repo, 'save').mockResolvedValue(updatedProduct);

    expect(await service.update('1', updateProductDto)).toEqual(updatedProduct);
  });

  it('should remove a product', async () => {
    const user = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    } as User;

    const product: Product = {
      id: '1',
      name: 'Product 1',
      description: 'Description',
      price: 100,
      userId: '1',
      user,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Product;

    jest.spyOn(repo, 'findOne').mockResolvedValue(product);
    jest.spyOn(repo, 'remove').mockResolvedValue(product);

    expect(await service.remove('1')).toEqual(product);
  });
});
