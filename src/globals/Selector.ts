import { GlobalConfig } from "payload/types";

export const Selector: GlobalConfig = {
  slug: "selector",
  access: { read: () => true },
  fields: [
    {
      name: "heading",
      type: "text",
      defaultValue: "PICK A WORLD",
      required: true,
    },
    {
      type: "group",
      name: "creative",
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
        },
        {
          name: "images",
          type: "array",
          minRows: 2,
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: "group",
      name: "commerical",
      fields: [
        {
          name: "heading",
          type: "text",
          required: true,
        },
        {
          name: "images",
          type: "array",
          minRows: 2,
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              required: true,
            },
          ],
        },
      ],
    },
  ],
};
