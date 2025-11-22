import { Box, Button, MenuItem, Modal, TextareaAutosize, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';
import { addSubCategoryAPI, editSubCategoryAPI, getAllCategoriesAPI, getAllSubCategoriesAPI } from '../services/allAPI';

function SubCategoriesForm({ open, handleClose, subCategory, refreshList }) {
    const [categories, setCategories] = useState([]);
    const initialFormState = {
        parentCategoryId: "",
        parentCategoryName: "",
        name: "",
        description: "",
    }
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchAllCategories();
    }, [])

    useEffect(() => {
        if (subCategory) {
            setFormData(subCategory);
        }
        else {
            setFormData(initialFormState);
        }
    }, [subCategory]);

    const fetchAllCategories = async () => {
        const categRes = await getAllCategoriesAPI();
        if (categRes.status == 200) {
            setCategories(categRes.data)
        }
    }

    // Set data to formdata state on change of each input element
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Set data to formdata state on change of parent category
    const handleCategoryChange = (e) => {
        const { value } = e.target;

        const selectedCat = categories.find(cat => cat.name === value);

        if (selectedCat) {
            setFormData(prev => ({
                ...prev,
                parentCategoryId: selectedCat.id,
                parentCategoryName: selectedCat.name,
            }));
        }
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
            const result = isEdit ? await editSubCategoryAPI(formData.id, formData) : await addSubCategoryAPI(formData)
            if (result.status == 200) {
                alert("Sub-Category updated")
            }
            else if (result.status == 201) {
                alert("Sub-Category added")
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
                        <h2 className="text-xl font-semibold">{subCategory?'Edit':'Add New'} Sub-Category</h2>
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
                            {/* Category */}
                            <TextField
                                select
                                label="Parent Category"
                                name="category"
                                value={formData.parentCategoryName}
                                onChange={handleCategoryChange}
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
                            {/* Category Name */}
                            <TextField
                                label="Sub-Category Name"
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

export default SubCategoriesForm