import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Product } from "../../../interfaces/Product.interface";

export default function DeletePRoductPage({}) {
  const router = useRouter();
  const { id } = router.query;
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  function goBack() {
    router.back();
  }
  async function deleteProduct() {
    await axios.delete("/api/products?id=" + id);
    goBack();
  }
  useEffect(() => {
    if (!id) return;
    // delete product
    axios.get("/api/products?id=" + id).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>
        Do you really wanto to delete product &quot;{productInfo?.title}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button onClick={goBack} className="btn-default">
          No
        </button>
      </div>
    </Layout>
  );
}
