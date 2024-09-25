import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(product: Partial<Product>) {
    return this.productRepository.save(product);
  }

  findAll() {
    return this.productRepository.find({ relations: ['user'] });
  }

  findOne(id: string) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  update(id: string, product: Partial<Product>) {
    return this.productRepository.update(id, product);
  }

  remove(id: string) {
    return this.productRepository.delete(id);
  }
}
