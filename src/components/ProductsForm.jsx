import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem } from "@mui/material";
import { MdClose } from "react-icons/md";
import { addProductAPI, editProductAPI, getAllCategoriesAPI, getAllSubCategoriesAPI } from "../services/allAPI";

function ProductsForm({ open, handleClose, product, refreshList }) {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const initialFormState = {
        name: "",
        sku: "",
        category: "",
        subCategory: "",
        minQty: "",
        maxQty: "",
        qtyOnHand: "",
        avgDailySales: "",
        leadTime: "",
        unitPrice: "",
        supplier: "",
      }
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchAllCategories();
    fetchAllSubCategories();
  }, [])

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
    else {
      setFormData(initialFormState);
    }
  }, [product]);

  const fetchAllCategories = async () => {
    const categRes = await getAllCategoriesAPI();
    if (categRes.status == 200) {
      setCategories(categRes.data)
    }
  }

  const fetchAllSubCategories = async () => {
    const subCategRes = await getAllSubCategoriesAPI();
    if (subCategRes.status == 200) {
      setSubCategories(subCategRes.data)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    const selectedCategory = categories.find((cat) => cat.name == value);
    if (selectedCategory) {
      const respectiveSubCategories = subCategories.filter((sub) => sub.parentCategoryId == selectedCategory.id);
      console.log(respectiveSubCategories);
      setFilteredSubCategories(respectiveSubCategories)
    }
    else {
      // If category cleared
      setFilteredSubCategories([]);
    }

  }

  const clearForm = ()=>{
    setFormData(initialFormState);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    const isEdit = !!formData.id;

    try {
      const result = isEdit ? await editProductAPI(formData.id, formData) : await addProductAPI(formData)
      if (result.status == 200) {
        alert("PRoduct updated")
      }
      else if (result.status == 201) {
        alert("Product added")
      }
      handleClose();
      refreshList();
      clearForm();
    }
    catch (err) {
      console.log(err);
    }

  }

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          className="bg-white rounded-xl shadow-xl p-8 relative"
          sx={{
            width: 700,
            top: "50%",
            left: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            outline: "none",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{product?'Edit':'Add New'} Product</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={25} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Product Name */}
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* SKU */}
              <TextField
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Category */}
              <TextField
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleCategChange}
                fullWidth
                required
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No categories</MenuItem>
                )}
              </TextField>

              {/* Sub-Category */}
              <TextField
                select
                label="Sub-Category"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                fullWidth
              >
                {filteredSubCategories.length > 0 ? (
                  filteredSubCategories
                    .map((sub) => (
                      <MenuItem key={sub.id} value={sub.name}>
                        {sub.name}
                      </MenuItem>
                    ))
                ) : (
                  <MenuItem disabled>No Sub-Categories</MenuItem>
                )}
              </TextField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Min Qty */}
              <TextField
                label="Min Quantity"
                name="minQty"
                type="number"
                value={formData.minQty}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Max Qty */}
              <TextField
                label="Max Quantity"
                name="maxQty"
                type="number"
                value={formData.maxQty}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Qty on Hand */}
              <TextField
                label="Qty on Hand"
                name="qtyOnHand"
                type="number"
                value={formData.qtyOnHand}
                onChange={handleChange}
                fullWidth
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Avg Daily Sales */}
              <TextField
                label="Avg Daily Sales"
                name="avgDailySales"
                type="number"
                value={formData.avgDailySales}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Lead Time */}
              <TextField
                label="Lead Time (days)"
                name="leadTime"
                type="number"
                value={formData.leadTime}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Unit Price */}
              <TextField
                label="Unit Price"
                name="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={handleChange}
                fullWidth
              />

              {/* Supplier */}
              <TextField
                label="Supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                fullWidth
              />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClose}
              className="capitalize"
              sx={{
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              onClick={onSubmit}
              sx={{
                backgroundColor: "#008FC3",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              Save
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default ProductsForm