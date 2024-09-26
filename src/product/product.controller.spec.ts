import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
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

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should create a new product successfully', async () => {
      const userId = 'user-id-1';

      const createProductDto: CreateProductDto = {
        name: 'Sample Product',
        description: 'This is a sample product',
        price: 99.99,
        userId: userId,
      };

      const product: Product = {
        id: 'product-id-1',
        ...createProductDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: null,
      } as Product;

      jest.spyOn(productService, 'create').mockResolvedValue(product);

      const result = await productController.create(createProductDto);
      expect(result).toEqual(product);
      expect(productService.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [
        {
          id: 'product-id-1',
          name: 'Sample Product 1',
          description: 'Description 1',
          price: 99.99,
          userId: 'user-id-1',
          user: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Product,
        {
          id: 'product-id-2',
          name: 'Sample Product 2',
          description: 'Description 2',
          price: 49.99,
          userId: 'user-id-2',
          user: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Product,
      ];

      jest.spyOn(productService, 'findAll').mockResolvedValue(products);

      const result = await productController.findAll();
      expect(result).toEqual(products);
      expect(productService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const productId = 'product-id-1';
      const product: Product = {
        id: productId,
        name: 'Sample Product',
        description: 'This is a sample product',
        price: 99.99,
        userId: 'user-id-1',
        user: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product;

      jest.spyOn(productService, 'findOne').mockResolvedValue(product);

      const result = await productController.findOne(productId);
      expect(result).toEqual(product);
      expect(productService.findOne).toHaveBeenCalledWith(productId);
    });

    it('should throw a NotFoundException if product not found', async () => {
      const productId = 'invalid-id';
      jest.spyOn(productService, 'findOne').mockResolvedValue(null);

      await expect(productController.findOne(productId)).rejects.toThrow(
        NotFoundException,
      );
      expect(productService.findOne).toHaveBeenCalledWith(productId);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const productId = 'product-id-1';
      const updateProduct: Partial<Product> = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 89.99,
      };

      const updatedProduct: Product = {
        id: productId,
        name: 'Updated Product',
        description: 'Updated description',
        price: 89.99,
        userId: 'user-id-1',
        user: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product;

      jest.spyOn(productService, 'update').mockResolvedValue(updatedProduct);

      const result = await productController.update(productId, updateProduct);
      expect(result).toEqual(updatedProduct);
      expect(productService.update).toHaveBeenCalledWith(
        productId,
        updateProduct,
      );
    });

    it('should throw a NotFoundException if product not found', async () => {
      const productId = 'invalid-id';
      const updateProduct: Partial<Product> = {
        name: 'Updated Product',
      };

      jest.spyOn(productService, 'update').mockResolvedValue(null);

      await expect(
        productController.update(productId, updateProduct),
      ).rejects.toThrow(NotFoundException);
      expect(productService.update).toHaveBeenCalledWith(
        productId,
        updateProduct,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const productId = 'product-id-1';
      jest.spyOn(productService, 'remove').mockResolvedValue(undefined);

      await productController.remove(productId);
      expect(productService.remove).toHaveBeenCalledWith(productId);
    });

    it('should throw a NotFoundException if product not found', async () => {
      const productId = 'invalid-id';
      jest
        .spyOn(productService, 'remove')
        .mockRejectedValue(
          new NotFoundException(`Product with ID "${productId}" not found`),
        );

      await expect(productController.remove(productId)).rejects.toThrow(
        NotFoundException,
      );
      expect(productService.remove).toHaveBeenCalledWith(productId);
    });
  });
});
