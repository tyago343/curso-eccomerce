import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";
import { Category } from "../interfaces/Category.interface";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }: { swal: any }) {
  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[] | []>([]);
  const [parentCategory, setParentCategory] = useState<string | undefined>(
    undefined
  );
  async function saveCategory(event: any) {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
    };
    if (editedCategory) {
      await axios
        .put(`/api/categories`, { ...data, id: editedCategory.id })
        .then(() => {
          setEditedCategory(null);
        });
    } else {
      await axios.post("/api/categories", data);
    }
    setParentCategory(undefined);
    setName("");
    fetchCategories();
  }
  async function deleteCategory(category: Category) {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        confirmButtonColor: "b55",
        confirmButtonText: "Yes, delete it!",
        reverseButtons: true,
        showCancelButton: true,
      })
      .then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
          await axios.delete(`/api/categories?id=${category.id}`);
          fetchCategories();
          swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
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
    setParentCategory(category.parent?.id || "");
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
          <option value={undefined}>No parent category</option>
          {categories.length
            ? categories.map((category: any) => (
                <option key={category.id} value={category.id}>
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
            ? categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td>
                    <button
                      className="mr-1 btn-primary"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </Layout>
  );
}
// @ts-ignore
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
