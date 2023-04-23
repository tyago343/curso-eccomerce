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
}
