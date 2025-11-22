import React, { useEffect, useState } from 'react'
import { LiaSyncSolid } from 'react-icons/lia'
import { LuChartColumn, LuPackage } from 'react-icons/lu'
import { PiWarning } from 'react-icons/pi'
import { TbCategoryPlus } from 'react-icons/tb'
import { getAllProductsAPI } from '../services/allAPI'

function Sidebar({ currentPage, setCurrentPage }) {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [])

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await getAllProductsAPI()
      if (response.status == 200) {
        setProducts(response.data);
      }
    }
    catch (err) {
      console.log(err);
    }
  };

  // Low Stock Items (for the card)
  const lowStockItems = products.filter((p) => {
    const min = Number(p.minQty);
    const current = Number(p.qtyOnHand);
    return current < min;
  }).length;

  return (

    <>
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="px-6 py-6 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <LuPackage className='text-[var(--color-secondary)]' /><p className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-secondary)] via-[var(--color-secondary)] to-teal-300 
           animate-gradient-x'>ClearLedge</p>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2">
          <button className={`w-full flex items-center gap-2 p-3 rounded-xl font-medium  ${currentPage == 'dashboard' ? 'bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-200 shadow text-white' : 'hover:bg-gray-100'}`} onClick={() => setCurrentPage("dashboard")}>
            <LuChartColumn className={currentPage == 'dashboard' ? 'text-white' : 'text-[var(--color-text-secondary)]'} />Dashboard
          </button>
          <button className={`w-full flex items-center gap-2 p-3 rounded-xl font-medium  ${currentPage == 'products' ? 'bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-200 shadow text-white' : 'hover:bg-gray-100'}`} onClick={() => setCurrentPage("products")}>
            <LuPackage className={currentPage == 'products' ? 'text-white' : 'text-[var(--color-text-secondary)]'} />Products
          </button>
          <button className={`w-full flex items-center gap-2 p-3 rounded-xl font-medium  ${currentPage == 'categories' ? 'bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-200 shadow text-white' : 'hover:bg-gray-100'}`} onClick={() => setCurrentPage("categories")}>
            <TbCategoryPlus className={currentPage == 'categories' ? 'text-white' : 'text-[var(--color-text-secondary)]'} />Categories
          </button>
          <button className={`w-full flex items-center gap-2 p-3 rounded-xl font-medium  ${currentPage == 'replenishment' ? 'bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-200 shadow text-white' : 'hover:bg-gray-100'}`} onClick={() => setCurrentPage("replenishment")}>
            <LiaSyncSolid className={currentPage == 'replenishment' ? 'text-white' : 'text-[var(--color-text-secondary)]'} />Replenishment
          </button>
        </nav>

        <div className="p-4 mt-auto fixed bottom-0 w-64 border-t border-gray-300">
          <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-3 py-2 rounded-xl text-sm flex items-center gap-2">
            <PiWarning className='text-warning' /><p>{lowStockItems} item{lowStockItems>0?'s':''} need{lowStockItems>0?'':'s'} restocking</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar