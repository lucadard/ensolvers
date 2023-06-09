import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name) throw new Error('Invalid name');
    return this.prisma.category.upsert({
      where: {
        name: createCategoryDto.name,
      },
      update: {
        name: createCategoryDto.name,
      },
      create: {
        name: createCategoryDto.name,
      },
    });
  }

  findAll() {
    return this.prisma.category.findMany({});
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: { name: updateCategoryDto.name },
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
