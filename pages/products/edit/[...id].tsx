import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../../../components/ProductForm";

export default function EditProductPage() {
  const router = useRouter();
  const [productInfo, setProductInfo] = useState(null);
  const { id } = router.query;
  useEffect(() => {
    if (!id) return;
    axios.get(`/api/products?id=${id}`).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit product</h1>
      {productInfo ? <ProductForm {...productInfo} /> : null}
    </Layout>
  );
}
