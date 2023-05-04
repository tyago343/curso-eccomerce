import { NextApiRequest, NextApiResponse } from "next";
import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";
import { formatCategory } from "../../formatters/Category.formatters";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  await mongooseConnect();
  if (method === "GET") {
    const categories = await Category.find().populate("parent");
    const formattedCategories = categories.map((category) =>
      formatCategory(category)
    );
    res.json(formattedCategories);
  }
  if (method === "POST") {
    const { name, parentCategory } = body;
    const categoryDoc = await Category.create({ name, parent: parentCategory });
    res.json(formatCategory(categoryDoc));
  }
}
