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
  const [properties, setProperties] = useState<any[]>([]);
  async function saveCategory(event: any) {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((property) => ({
        name: property.name,
        values: property.values.split(","),
      })),
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
    setProperties([]);
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
    setProperties(category.properties);
  }
  function addProperty() {
    setProperties((oldProperties) => [
      ...oldProperties,
      { name: "", values: "" },
    ]);
  }
  function handlePropertyNameChange(property: any, value: any, index: number) {
    setProperties((properties) => {
      const newProperties = [...properties];
      newProperties[index].name = value;
      return newProperties;
    });
  }
  function removeProperty(index: number) {
    setProperties((properties) => {
      const newProperties = [...properties];
      newProperties.splice(index, 1);
      return newProperties;
    });
  }
  function handlePropertyValuesChange(
    property: any,
    value: any,
    index: number
  ) {
    setProperties((properties) => {
      const newProperties = [...properties];
      newProperties[index].values = value;
      return newProperties;
    });
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
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            className="mb-0"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <select
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
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            className="btn-default text-sm mb-2"
            type="button"
            onClick={addProperty}
          >
            Add new property
          </button>

          {properties?.map((property, index) => (
            <div key={index} className="flex gap-1 mt-1 mb-2">
              <input
                type="text"
                placeholder="Property name"
                className="mb-0"
                value={property.name}
                onChange={(ev) =>
                  handlePropertyNameChange(property, ev.target.value, index)
                }
              />
              <input
                type="text"
                placeholder="Property values"
                className="mb-0"
                value={property.values}
                onChange={(ev) =>
                  handlePropertyValuesChange(property, ev.target.value, index)
                }
              />
              <button
                className="btn-default"
                type="button"
                onClick={() => removeProperty(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory ? (
            <button
              className="btn-default"
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory(undefined);
              }}
            >
              Cancel
            </button>
          ) : null}
          <button className="btn-primary py-1" type="submit">
            Save
          </button>
        </div>
      </form>
      {!editedCategory ? (
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
      ) : null}
    </Layout>
  );
}
// @ts-ignore
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
