import mongoose from "mongoose";
import clientPromise from "../../lib/mongodb";
import { Product } from "../../models/Product";
import { mongooseConnect } from "../../lib/mongoose";

export default async function handle(req: any, res: any) {
  const { method } = req;
  const { title, description, price } = req.body;
  await mongooseConnect();
  if (method === "POST") {
    const productDoc = await Product.create({ title, description, price });
    res.json(productDoc);
  }
  if (method === "GET") {
    if (req.query?.id) {
      return res.json(await Product.findOne({ _id: req.query.id }));
    }
    const productDoc = await Product.find();
    res.json(productDoc);
  }
  if (method === "PUT") {
    const { title, description, price, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price });
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.json(true);
    }
  }
}
