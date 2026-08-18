// Run with:
// npx ts-node scripts/backfill-commercial-subcate.ts

import payload from "payload";

require("dotenv").config();

const run = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.DATABASE_URI,
    local: true,
  });

  const { docs } = await payload.find({
    collection: "projects",
    where: {
      cate: {
        equals: "commercial",
      },
    },
    limit: 1000,
    depth: 0,
  });

  console.log(`Found ${docs.length} commercial projects. Updating subCate...`);

  for (const doc of docs) {
    await payload.update({
      collection: "projects",
      id: doc.id,
      data: {
        subCate: "commercial",
      },
      overrideAccess: true,
    });

    console.log(`  ${doc.name} -> subCate: commercial`);
  }

  console.log("Done.");
  process.exit(0);
};

run().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
