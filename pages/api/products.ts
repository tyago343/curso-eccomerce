import mongoose from "mongoose";
import clientPromise from "../../lib/mongodb";
import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";
import { formatProduct } from "../../formatters/Product.formatters";
import { Product as IProduct } from "../../interfaces/Product.interface";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<IProduct | IProduct[] | boolean | void> {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const { title, description, price, images, category } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
    });
    const formattedProduct = formatProduct(productDoc);
    res.json(formattedProduct);
  }
  if (method === "GET") {
    if (req.query?.id) {
      const productDoc = await Product.findOne({ _id: req.query.id });
      return res.json(formatProduct(productDoc));
    }
    const productsDoc = await Product.find();

    const formattedProducts = productsDoc.map((productDoc) =>
      formatProduct(productDoc)
    );

    res.json(formattedProducts);
  }
  if (method === "PUT") {
    const { title, description, price, id, images, category } = req.body;
    await Product.updateOne(
      { _id: id },
      { title, description, price, images, category }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
  return false;
}
