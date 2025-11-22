import commonAPI from "./commonAPI"
import serverURL from "./serverURL"


// Add a Product : call in UserInputs when Finish button clicked
export const addProductAPI = async (productData)=>{
    return await commonAPI("POST", `${serverURL}/products`, productData)
}

// Get All Products:
export const getAllProductsAPI = async () => {
    return await commonAPI("GET", `${serverURL}/products`, {})
}

// Edit a Product: update API call when edit button clicked
export const editProductAPI = async (id, productData) => {
    return await commonAPI("PUT", `${serverURL}/products/${id}`, productData)
}

// Remove a Product : Delete api call when delete button clicked
export const removeProductAPI = async (id) => {
    return await commonAPI("DELETE", `${serverURL}/products/${id}`, {})
}

// Add a Category
export const addCategoryAPI = async (productCateg)=>{
    return await commonAPI("POST", `${serverURL}/categories`,productCateg)
}

// Get all Categories
export const getAllCategoriesAPI = async () => {
    return await commonAPI("GET", `${serverURL}/categories`, {})
}

// Edit a Category: update API call when edit button clicked
export const editCategoryAPI = async (id, productCateg) => {
    return await commonAPI("PUT", `${serverURL}/categories/${id}`, productCateg)
}

// Remove a Category : Delete api call when delete button clicked
export const removeCategoryAPI = async (id) => {
    return await commonAPI("DELETE", `${serverURL}/categories/${id}`, {})
}

// Add a SubCategory
export const addSubCategoryAPI = async (productSubCateg)=>{
    return await commonAPI("POST", `${serverURL}/subCategories`,productSubCateg)
}

// Get all SubCategories
export const getAllSubCategoriesAPI = async () => {
    return await commonAPI("GET", `${serverURL}/subCategories`, {})
}

// Edit a Category: update API call when edit button clicked
export const editSubCategoryAPI = async (id, productSubCateg) => {
    return await commonAPI("PUT", `${serverURL}/subCategories/${id}`, productSubCateg)
}

// Remove a SubCategory : Delete api call when delete button clicked
export const removeSubCategoryAPI = async (id) => {
    return await commonAPI("DELETE", `${serverURL}/subCategories/${id}`, {})
}

// // Generate Replenishments
// export const saveReplenishmentsAPI = async (alerts)=>{
//     return await commonAPI("POST", `${serverURL}/replenishments`,alerts)
// }

// // Get all Replenishments
// export const getAllReplenishmentsAPI = async () => {
//     return await commonAPI("GET", `${serverURL}/replenishments`, {})
// }
