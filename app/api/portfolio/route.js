import { readdirSync } from "fs";
import { join } from "path";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 24);
  const categoryFilter = searchParams.get("category");

  const categories = categoryFilter && categoryFilter !== "All"
    ? [categoryFilter.toLowerCase()]
    : ["bridal", "party", "hair"];

  const portfolio = categories.flatMap((category) => {
    const folderPath = join(process.cwd(), "public", category);

    const files = readdirSync(folderPath)
      .filter((file) => /\.(jpg|jpeg|png|webp|heic)$/i.test(file))
      .sort();

    return files.map((file) => ({
      id: `${category}-${file}`,
      cat: category.charAt(0).toUpperCase() + category.slice(1),
      src: `/${category}/${file}`,
      fileName: file,
    }));
  });

  const start = (page - 1) * limit;
  const end = start + limit;

  const images = portfolio.slice(start, end);

  return Response.json({
    images,
    hasMore: end < portfolio.length,
    total: portfolio.length,
    page,
    limit,
  });
}