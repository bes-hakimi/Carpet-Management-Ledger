import { createRouteHandler, createUploadthing, type FileRouter } from "uploadthing/next";

// ایجاد آپلودینگ
const f = createUploadthing();

// تعریف فایل روت
const ourFileRouter = {
  anyFile: f({ blob: { maxFileSize: "64MB" } })
    .onUploadComplete(({ file }) => {
      return { fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

// صادر کردن متدهای GET و POST
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
