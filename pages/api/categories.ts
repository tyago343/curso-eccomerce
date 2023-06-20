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
    const { name, parentCategory, properties } = body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory || undefined,
      properties,
    });
    res.json(formatCategory(categoryDoc));
  }
  if (method === "PUT") {
    const { id, name, parentCategory, properties } = body;
    const categoryDoc = await Category.findByIdAndUpdate(
      { _id: id },
      {
        name,
        parent: parentCategory || undefined,
        properties,
      },
      { new: true }
    );
    res.json(formatCategory(categoryDoc));
  }
  if (method === "DELETE") {
    const { id } = req.query;
    await Category.findByIdAndDelete({ _id: id });
    res.json(true);
  }
}
