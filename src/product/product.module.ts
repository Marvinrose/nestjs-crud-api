import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity'; // Import your Product entity here

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Register the Product entity
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService], // Optionally export ProductService if needed
})
export class ProductModule {}
