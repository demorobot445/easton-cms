import { GlobalConfig } from "payload/types";

export const About: GlobalConfig = {
  slug: "about",
  label: "About",
  access: { read: () => true },
  fields: [
    {
      name: "portrait",
      label: "Portrait",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "content",
      type: "array",
      minRows: 1,
      fields: [
        {
          name: "paragraph",
          type: "textarea",
          required: true,
        },
      ],
    },
  ],
};
