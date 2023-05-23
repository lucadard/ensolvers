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
      },
    });
  }

  findAll() {
    return this.prisma.note.findMany({});
  }

  findOne(id: number) {
    return this.prisma.note.findUnique({ where: { id } });
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.prisma.note.update({
      where: { id },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
        archieved: updateNoteDto.archieved,
      },
    });
  }

  remove(id: number) {
    return this.prisma.note.delete({ where: { id } });
  }
}
