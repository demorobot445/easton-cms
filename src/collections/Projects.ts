import { CollectionConfig } from "payload/types";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
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
        description: "Automatically generated from the title.",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Keep existing slug if already set
            if (value) return value;

            return data?.name
              ?.toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, "")
              .replace(/\s+/g, "-")
              .replace(/-+/g, "-");
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
  ],
};
