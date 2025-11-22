import { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, TextareaAutosize } from "@mui/material";
import { MdClose } from "react-icons/md";
import { addCategoryAPI, editCategoryAPI, getAllCategoriesAPI, getAllSubCategoriesAPI } from "../services/allAPI";

function CategoriesForm({ open, handleClose, category, refreshList }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const initialFormState = {
    name: "",
    description: "",
  }

  useEffect(() => {
    if (category) {
      setFormData(category);
    }
    else {
      setFormData(initialFormState);
    }
  }, [category]);

  /*const fetchAllCategories = async () => {
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
  }*/

  // Set data to formdata state on change of each input element
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form after Add or update
  const clearForm = () => {
    setFormData(initialFormState);
  }

  // Add or update item on submit of form
  const onSubmit = async (e) => {
    e.preventDefault();

    const isEdit = !!formData.id;

    console.log(isEdit);

    try {
      const result = isEdit ? await editCategoryAPI(formData.id, formData) : await addCategoryAPI(formData)
      if (result.status == 200) {
        alert("Category updated")
      }
      else if (result.status == 201) {
        alert("Category added")
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
            <h2 className="text-xl font-semibold">{category?'Edit':'Add New'} Category</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={25} />
            </button>
          </div>

          {/* FORM */}
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Category Name */}
              <TextField
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />

              {/* Description */}
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Minimum 3 rows"
                style={{ width: '100%', borderStyle: 'solid', borderWidth: '1px', borderColor: 'rgba(0, 0, 0, 0.3)' }}
                className="rounded p-2"
                name="description"
                value={formData.description}
                onChange={handleChange}
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

export default CategoriesForm