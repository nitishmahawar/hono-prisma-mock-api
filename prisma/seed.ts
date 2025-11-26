import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { faker } from "@faker-js/faker";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clear existing data
  console.log("🧹 Cleaning existing data...");
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.album.deleteMany();
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Existing data cleared");

  // Create users
  console.log("👥 Creating users...");
  const users: Awaited<ReturnType<typeof prisma.user.create>>[] = [];
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName });

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        username: username,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        website: faker.internet.url(),
        // Address
        street: faker.location.streetAddress(),
        suite: faker.location.secondaryAddress(),
        city: faker.location.city(),
        zipcode: faker.location.zipCode(),
        lat: faker.location.latitude().toString(),
        lng: faker.location.longitude().toString(),
        // Company
        companyName: faker.company.name(),
        companyCatchPhrase: faker.company.catchPhrase(),
        companyBs: faker.company.buzzPhrase(),
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // Create posts for each user
  console.log("📝 Creating posts...");
  let totalPosts = 0;
  for (const user of users) {
    const postCount = faker.number.int({ min: 3, max: 5 });
    for (let i = 0; i < postCount; i++) {
      await prisma.post.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          body: faker.lorem.paragraphs({ min: 2, max: 4 }),
          userId: user.id,
        },
      });
      totalPosts++;
    }
  }
  console.log(`✅ Created ${totalPosts} posts`);

  // Create comments for posts
  console.log("💬 Creating comments...");
  const posts = await prisma.post.findMany();
  let totalComments = 0;
  for (const post of posts) {
    const commentCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < commentCount; i++) {
      // Randomly assign a user or leave it null
      const randomUser = faker.helpers.maybe(
        () => faker.helpers.arrayElement(users),
        { probability: 0.7 }
      );

      await prisma.comment.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          body: faker.lorem.paragraph({ min: 2, max: 5 }),
          postId: post.id,
          userId: randomUser?.id,
        },
      });
      totalComments++;
    }
  }
  console.log(`✅ Created ${totalComments} comments`);

  // Create albums for each user
  console.log("📚 Creating albums...");
  let totalAlbums = 0;
  for (const user of users) {
    const albumCount = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < albumCount; i++) {
      await prisma.album.create({
        data: {
          title: faker.lorem.words({ min: 2, max: 5 }),
          userId: user.id,
        },
      });
      totalAlbums++;
    }
  }
  console.log(`✅ Created ${totalAlbums} albums`);

  // Create photos for albums
  console.log("📸 Creating photos...");
  const albums = await prisma.album.findMany();
  let totalPhotos = 0;
  for (const album of albums) {
    const photoCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < photoCount; i++) {
      const width = 600;
      const height = 600;
      const thumbnailWidth = 150;
      const thumbnailHeight = 150;

      await prisma.photo.create({
        data: {
          title: faker.lorem.words({ min: 2, max: 4 }),
          url: `https://picsum.photos/seed/${faker.string.alphanumeric(
            10
          )}/${width}/${height}`,
          thumbnailUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(
            10
          )}/${thumbnailWidth}/${thumbnailHeight}`,
          albumId: album.id,
        },
      });
      totalPhotos++;
    }
  }
  console.log(`✅ Created ${totalPhotos} photos`);

  // Create todos for each user
  console.log("✅ Creating todos...");
  let totalTodos = 0;
  for (const user of users) {
    const todoCount = faker.number.int({ min: 5, max: 10 });
    for (let i = 0; i < todoCount; i++) {
      await prisma.todo.create({
        data: {
          title: faker.lorem.sentence({ min: 3, max: 8 }),
          completed: faker.datatype.boolean({ probability: 0.4 }), // 40% completed
          userId: user.id,
        },
      });
      totalTodos++;
    }
  }
  console.log(`✅ Created ${totalTodos} todos`);

  console.log("\n🎉 Database seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Posts: ${totalPosts}`);
  console.log(`   Comments: ${totalComments}`);
  console.log(`   Albums: ${totalAlbums}`);
  console.log(`   Photos: ${totalPhotos}`);
  console.log(`   Todos: ${totalTodos}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
