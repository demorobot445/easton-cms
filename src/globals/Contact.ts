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
        {
          name: "pdfLabel",
          label: "PDF Label",
          type: "text",
          required: true,
        },
        {
          name: "pdf",
          type: "upload",
          relationTo: "media",
          required: true,
          filterOptions: { mimeType: { equals: "application/pdf" } },
          admin: { description: "Only PDF files are supported." },
        },
      ],
    },
  ],
};
