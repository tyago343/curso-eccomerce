import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function Categories() {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  async function saveCategory(event: any) {
    event.preventDefault();
    await axios.post("/api/categories", { name, parentCategory }).then(() => {
      setName("");
      fetchCategories();
    });
  }
  function fetchCategories() {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }
  function editCategory(category: any) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id || "");
  }
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "New category name"}
      </label>
      <form className="flex gap-1" onSubmit={saveCategory}>
        <input
          type="text"
          placeholder="Category name"
          className="mb-0"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target.value)}
        >
          <option value="0">No parent category</option>
          {categories.length
            ? categories.map((category: any) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))
            : null}
        </select>
        <button className="btn-primary py-1" type="submit">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length
            ? categories.map((category: any) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      className="mr-1 btn-primary"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button className="btn-primary">Delete</button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </Layout>
  );
}
