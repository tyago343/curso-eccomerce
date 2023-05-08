import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import { Category } from "../interfaces/Category.interface";
import Image from "next/image";
interface ProductFormProps {
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: Category;
}

export default function ProductForm({
  id,
  title: currentTitle,
  description: currentDescription,
  price: currentPrice,
  images: existingImages,
  category: currentCategory,
}: ProductFormProps) {
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDescription || "");
  const [price, setPrice] = useState(currentPrice || 0);
  const [images, setImages] = useState(existingImages || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    currentCategory?.id || ""
  );
  const router = useRouter();
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);
  async function uploadImages(ev: any) {
    ev.preventDefault();
    const files = ev.target?.files;
    if (files?.length) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const response = await axios.post("/api/upload", data);
      const { links } = response.data;
      setImages((oldImages) => [...oldImages, ...links]);
      setIsUploading(false);
    }
  }
  async function saveProduct(ev: any) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category: selectedCategory,
    };
    if (id) {
      //update
      await axios.put(`/api/products`, { ...data, id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }
  function updateImagesOrder(images: string[]) {
    setImages(images);
  }
  if (goToProducts) router.push("/products");
  return (
    <form onSubmit={saveProduct}>
      <h1>New product</h1>
      <label>Product name</label>
      <input
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Uncategorized</option>
        {categories.map((category: Category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images as any}
          setList={updateImagesOrder as any}
          className="flex flex-wrap gap-1"
        >
          {images?.length
            ? images.map((link) => (
                <div key={link} className="h-24 w-24">
                  <Image
                    width="1000"
                    height="1000"
                    src={link}
                    alt="product image"
                    className="rounded-lg"
                  />
                </div>
              ))
            : null}
        </ReactSortable>
        {isUploading ? (
          <div className="h-24 p-1 flex items-center">
            <Spinner />
          </div>
        ) : null}
        <label className="w-24 h-24 text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={uploadImages} />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
