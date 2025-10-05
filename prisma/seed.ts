import { prisma } from "../lib/prisma";

async function main() {
  const posts = [
    {
      title: "Welcome to Orchids Final",
      description: "This starter ships with Docker Compose, Prisma, and Vite out of the box.",
    },
    {
      title: "API + Frontend",
      description: "Hit /api/posts to see JSON, or open the React app at http://localhost.",
    },
  ];

  await prisma.post.deleteMany();

  await Promise.all(posts.map((post) => prisma.post.create({ data: post })));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
