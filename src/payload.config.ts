import path from "path";

import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";

import Users from "./collections/Users";
import Media from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Selector } from "./globals/Selector";
import { About } from "./globals/About";
import { Contact } from "./globals/Contact";

export default buildConfig({
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
  },
  editor: slateEditor({}),
  collections: [Users, Media, Projects],
  globals: [Contact, About, Selector],
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  cors: [
    "https://easton-app.vercel.app",
    "http://localhost:3000",
    process.env.FRONTEND_URI,
  ],
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
  plugins: [],
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
});
