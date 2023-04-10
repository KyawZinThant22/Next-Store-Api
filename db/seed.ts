import { Customer, categories } from "./data";
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient({
  log: ["error", "info", "query", "warn"],
});
``;

async function main() {
  for (let customer of Customer) {
    await prisma.customer.create({
      data: customer,
    });
  }

  for (let category of categories) {
    await prisma.category.create({
      data: category,
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
