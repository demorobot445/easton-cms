// scripts/backfill-project-slugs.ts
import payload from "payload";
import slugify from "slugify";

require("dotenv").config();

const getUniqueSlug = async (
  title: string,
  currentId: string | number,
): Promise<string> => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const { docs } = await payload.find({
      collection: "projects",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 0,
    });

    // No document has this slug
    if (docs.length === 0) {
      return slug;
    }

    // Same document, keep it
    if (docs[0].id === currentId) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const run = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    mongoURL: process.env.DATABASE_URI!,
    local: true,
  });

  const { docs } = await payload.find({
    collection: "projects",
    sort: "createdAt",
    limit: 1000,
    depth: 0,
  });

  console.log(`Fixing slugs for ${docs.length} projects...`);

  for (const doc of docs) {
    const title = doc.title || doc.name;

    if (!title) {
      console.log(`Skipping ${doc.id} (no title/name)`);
      continue;
    }

    const newSlug = await getUniqueSlug(title, doc.id);

    if (doc.slug === newSlug) {
      console.log(`✓ ${title} already has correct slug`);
      continue;
    }

    await payload.update({
      collection: "projects",
      id: doc.id,
      data: {
        slug: newSlug,
      },
    });

    console.log(`${title} -> ${newSlug}`);
  }

  console.log("Done.");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
