import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}
  create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
        archieved: createNoteDto.archieved,
        categories: {
          create: createNoteDto.categories?.map((category) => ({
            category: {
              connectOrCreate: {
                where: { name: category.name },
                create: { name: category.name },
              },
            },
          })),
        },
      },
      include: { categories: { select: { category: true } } },
    });
  }

  findAll() {
    return this.prisma.note.findMany({
      include: { categories: { select: { category: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.note.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  update(id: string, updateNoteDto: UpdateNoteDto) {
    return this.prisma.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        archieved: updateNoteDto.archieved,
      },
      include: { categories: { select: { category: true } } },
    });
  }

  addCategory(id: string, categoryId: number) {
    return this.prisma.note.update({
      where: { id },
      data: {
        categories: {
          upsert: {
            where: { noteId_categoryId: { categoryId, noteId: id } },
            create: { categoryId: categoryId },
            update: {},
          },
        },
      },
      include: { categories: { select: { category: true } } },
    });
  }

  removeCategory(id: string, categoryId: number) {
    return this.prisma.note.update({
      where: { id },
      data: {
        categories: {
          delete: { noteId_categoryId: { categoryId, noteId: id } },
        },
      },
      include: { categories: { select: { category: true } } },
    });
  }

  remove(id: string) {
    return this.prisma.note.delete({ where: { id } });
  }
}
