import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { LuFolderOpen } from "react-icons/lu";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { getAllCategoriesAPI, getAllSubCategoriesAPI, removeCategoryAPI, removeSubCategoryAPI } from "../services/allAPI";
import CategoriesForm from "../components/CategoriesForm";
import SubCategoriesForm from "../components/SubCategoriesForm";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategoriesAPI()

      if (response.status == 200) {
        setCategories(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await getAllSubCategoriesAPI()

      if (response.status == 200) {
        setSubCategories(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      await removeCategoryAPI(catId);
      fetchCategories();
    }
    catch (err) {
      console.log(err);
    }
  }

  const handleDeleteSubCategory = async (subCatId) => {
    try {
      await removeSubCategoryAPI(subCatId);
      fetchSubCategories();
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-6 w-full">
      {/* Page Title */}
      <h2 className="text-3xl font-bold mb-2">Product Categories</h2>
      <p className="text-gray-600 mb-6">
        Organize your products with categories and sub-categories
      </p>

      {/* Category Section */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold mb-6">Categories</h3>
          <button onClick={() => { setOpen(true); setSelectedCategory(null); }} className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-lg font-medium bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-500 shadow text-white" title="Add product to inventory">
            <MdAdd className="fw-bold text-white" />Add Category
          </button>
        </div>
        <CategoriesForm open={open} handleClose={() => setOpen(false)} category={selectedCategory} refreshList={fetchCategories} />

        {/* Category List */}
        <div className="flex flex-col gap-4">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-[#f8f8f8] p-4 rounded-xl border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <LuFolderOpen className="text-[var(--color-secondary)] text-2xl" />
                    <div>
                      <p className="font-semibold text-xl">{cat.name}</p>
                      <p className="text-gray-500 text-sm">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setOpen(true); setSelectedCategory(cat); }} className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">
                      <FiEdit2 className="text-gray-600" />
                    </button>
                    <button onClick={()=>handleDeleteCategory(cat.id)} className="py-2 px-4 bg-red-100 rounded hover:bg-red-200">
                      <FiTrash2 className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                <div className="ml-10 mt-3 space-y-2">
                  {subCategories?.filter((sub) => sub.parentCategoryId == cat.id)
                    .map((sub) => (
                      <div key={sub.id} className="bg-white border border-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
                        <IoIosArrowForward className="text-sm text-gray-500" />
                        <div
                          className="flex-1 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-md font-medium">{sub.name}</p>
                            <p className="text-sm text-gray-500">{sub.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => { setOpenSub(true); setSelectedSubCategory(sub); }} className="py-1 px-3 bg-gray-200 rounded hover:bg-gray-300">
                              <FiEdit2 size={14} className="text-gray-600 text-sm" />
                            </button>
                            <button onClick={()=>handleDeleteSubCategory(sub.id)} className="py-1 px-3 bg-red-100 rounded hover:bg-red-200">
                              <FiTrash2 size={14} className="text-red-500 text-sm" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No categories found.</p>
          )}
        </div>
      </div>

      {/* Add Sub-Category Section */}
      <div className="bg-white p-5 rounded-xl shadow">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold mb-6">Add Sub-Categories</h3>
          <button onClick={() => { setOpenSub(true); setSelectedSubCategory(null); }} className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-lg font-medium bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-500 shadow text-white" title="Add product to inventory">
            <MdAdd className="fw-bold text-white" />Add Sub-Category
          </button>
          <SubCategoriesForm open={openSub} handleClose={() => setOpenSub(false)} subCategory={selectedSubCategory} refreshList={fetchSubCategories} />
        </div>
      </div>
    </div>
  );
}

export default Categories;
