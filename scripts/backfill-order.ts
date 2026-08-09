//for run  : npx ts-node scripts/backfill-order.ts

import payload from "payload";

require("dotenv").config();

const run = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.DATABASE_URI, // or your DB config
    local: true,
  });

  // Preserve whatever order they currently appear in — createdAt ascending
  // is usually the closest thing to "current order" you have.
  const { docs } = await payload.find({
    collection: "projects",
    sort: "createdAt",
    limit: 1000,
    depth: 0,
  });

  console.log(`Backfilling order for ${docs.length} projects...`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (doc.order) continue; // idempotent — skip if already set
    await payload.update({
      collection: "projects",
      id: doc.id,
      data: { order: i + 1 },
    });
    console.log(`  ${doc.name} -> order ${i + 1}`);
  }

  console.log("Done.");
  process.exit(0);
};

run();
