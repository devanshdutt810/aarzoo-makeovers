import { readdirSync } from "fs";
import { join } from "path";

export async function GET() {
  const categories = ["bridal", "party", "hair"];

  const portfolio = categories.flatMap((category) => {
    const folderPath = join(process.cwd(), "public", category);

    const files = readdirSync(folderPath).filter((file) =>
      /\.(jpg|jpeg|png|webp|heic)$/i.test(file)
    );

    return files.map((file) => ({
      id: `${category}-${file}`,
      cat: category.charAt(0).toUpperCase() + category.slice(1),
      src: `/${category}/${file}`,
      fileName: file,
    }));
  });

  return Response.json(portfolio);
}