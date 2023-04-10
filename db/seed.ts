import { Customer } from "./data";
import { PrismaClient } from "@prisma/client";

let prisma = new PrismaClient({
  log: ["error", "info", "query", "warn"],
});

async function main() {
  for (let customer of Customer) {
    await prisma.customer.create({
      data: customer,
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
