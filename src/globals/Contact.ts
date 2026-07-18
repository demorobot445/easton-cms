import { GlobalConfig } from "payload/types";

export const Contact: GlobalConfig = {
  slug: "contact",
  label: "Contact",
  access: { read: () => true },
  fields: [
    {
      name: "firstAgency",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "email",
          type: "email",
          required: true,
        },
      ],
    },

    {
      name: "secondAgency",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
        },
        {
          name: "tagline",
          type: "text",
          required: true,
        },
        {
          name: "email",
          type: "email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
