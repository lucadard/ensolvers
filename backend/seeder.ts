import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const post1 = await prisma.note.upsert({
    create: {
      title: 'Hacer los debere',
      content: 'hace la tarea',
    },
    update: {},
    where: { title: 'Hacer los debere' },
  });
  const post2 = await prisma.note.upsert({
    create: {
      title: 'Tomar awa',
    },
    update: {},
    where: { title: 'Tomar awa' },
  });
  console.log(post1, post2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
