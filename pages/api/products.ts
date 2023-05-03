import mongoose from "mongoose";
import clientPromise from "../../lib/mongodb";
import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";
import { formatProduct } from "../../formatters/Product.formatters";
import { Product as IProduct } from "../../interfaces/Product.interface";

export default async function handle(
  req: any,
  res: any
): Promise<IProduct | IProduct[] | boolean> {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const { title, description, price, images } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
    });
    const formattedProduct = formatProduct(productDoc);
    res.json(formattedProduct);
  }
  if (method === "GET") {
    if (req.query?.id) {
      return res.json(await Product.findOne({ _id: req.query.id }));
    }
    const productsDoc = await Product.find();

    const formattedProducts = productsDoc.map((productDoc) =>
      formatProduct(productDoc)
    );

    res.json(formattedProducts);
  }
  if (method === "PUT") {
    const { title, description, price, _id, images } = req.body;
    await Product.updateOne({ _id }, { title, description, price, images });
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
