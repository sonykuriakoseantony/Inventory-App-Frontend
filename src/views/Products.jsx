
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import ProductsForm from "../components/ProductsForm";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { getAllProductsAPI, removeProductAPI } from "../services/allAPI";

function Products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // use useEffect hook to get all product on page load
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await getAllProductsAPI()
      if (response.status >= 200 && response.status < 300) {
        setProducts(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  const handleDeleteProduct = async (pId) => {
    try{
      await removeProductAPI(pId);
      fetchProducts();
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold mb-0">Product Inventory</h2>
          <p className="text-gray-500 mb-4">Overview of your Inventory</p>
        </div>
        <button className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-lg font-medium bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-500 shadow text-white" title="Add product to inventory" onClick={() => { setOpen(true); setSelectedProduct(null); }}>
          <MdAdd className="fw-bold text-white" />Add Product
        </button>
      </div>
      <ProductsForm open={open} handleClose={() => setOpen(false)} product={selectedProduct} refreshList={fetchProducts} />
      <table className="table-auto w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="text-left bg-gray-100">
            <th className="p-3">Name</th>
            <th className="p-3">SKU</th>
            <th className="p-3">Category</th>
            <th className="p-3">Unit Price</th>
            <th className="p-3">Avg Daily Sales</th>
            <th className="p-3">Qty on-hand</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((p) => (
            <tr key={p.id} className="border-t border-gray-300">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.sku}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3">{p.unitPrice}</td>
              <td className="p-3">{p.avgDailySales}</td>
              <td className="p-3">{p.qtyOnHand}</td>
              <td className="p-3">
                <div className="flex gap-3">
                  <button className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300" onClick={() => { setOpen(true); setSelectedProduct(p); }}>
                    <FiEdit2 className="text-gray-600" />
                  </button>
                  <button className="py-2 px-4 bg-red-100 rounded hover:bg-red-200" onClick={() => handleDeleteProduct(p.id)}>
                    <FiTrash2 className="text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Products