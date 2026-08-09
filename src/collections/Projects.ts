import GalleryMediaField from "../admin/components/GalleryMediaField";
import { CollectionConfig } from "payload/types";
import slugify from "slugify";

export const Projects: CollectionConfig = {
  slug: "projects",
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "ID", "cate"],
  },
  endpoints: [
    {
      path: "/reorder",
      method: "post",
      handler: async (req, res) => {
        const { orderedIds } = req.body as { orderedIds: string[] };

        if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
          return res.status(400).json({ error: "orderedIds required" });
        }

        await Promise.all(
          orderedIds.map((id, index) =>
            req.payload.update({
              collection: "projects",
              id,
              data: { order: index + 1 },
              overrideAccess: true,
            }),
          ),
        );

        return res.status(200).json({ success: true });
      },
    },
  ],
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "order",
      type: "number",
      admin: {
        hidden: true,
      },
      index: true,
      hooks: {
        beforeChange: [
          async ({ value, operation, req }) => {
            if (
              operation === "create" &&
              (value === undefined || value === null)
            ) {
              const highest: any = await req.payload.find({
                collection: "projects",
                sort: "-order",
                limit: 1,
                depth: 0,
              });
              const max = highest.docs[0]?.order ?? 0;
              return max + 1;
            }
            return value;
          },
        ],
      },
    },
    {
      name: "cate",
      type: "select",
      required: true,
      options: [
        {
          label: "Creative",
          value: "creative",
        },
        {
          label: "Commercial",
          value: "commercial",
        },
      ],
    },
    {
      name: "heroMedia",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        description: "Automatically generated from the project name.",
        readOnly: true, // prevent editors from typing random slugs
      },
      hooks: {
        beforeValidate: [
          async ({ data, req, originalDoc }) => {
            if (!data?.name) return originalDoc?.slug;

            const baseSlug = slugify(data.name, {
              lower: true,
              strict: true,
              trim: true,
            });

            let slug = baseSlug;
            let counter = 2;

            while (true) {
              const { docs } = await req.payload.find({
                collection: "projects",
                where: {
                  slug: {
                    equals: slug,
                  },
                },
                limit: 1,
                depth: 0,
              });

              const existing = docs[0];

              // Slug doesn't exist
              if (!existing) break;

              // It's the same document being edited
              if (existing.id === originalDoc?.id) break;

              slug = `${baseSlug}-${counter}`;
              counter++;
            }

            return slug;
          },
        ],
      },
    },
    {
      name: "galleryMedia",
      type: "array",
      fields: [
        {
          name: "media",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      type: "ui",
      name: "galleryPreview",
      admin: {
        components: {
          Field: GalleryMediaField,
        },
      },
    },
  ],
};
