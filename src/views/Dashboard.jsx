import { useEffect, useState } from 'react'
import { AiOutlineExclamation } from 'react-icons/ai'
import { LuPackage } from 'react-icons/lu'
import { MdOutlineCurrencyRupee } from 'react-icons/md'
import { PiWarning } from 'react-icons/pi'
import { TbCategoryPlus } from 'react-icons/tb'
import { getAllCategoriesAPI, getAllProductsAPI } from '../services/allAPI'

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [replenishments, setReplenishments] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchAllCategories();
  }, [])

  useEffect(() => {
    refreshReplenishments();
  }, [products])

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
  // Fetch all categories
  const fetchAllCategories = async () => {
    const categRes = await getAllCategoriesAPI();
    if (categRes.status == 200) {
      setCategories(categRes.data)
    }
  }

  // Total number of Products
  const totalProducts = products.length;

  // Total number of Categories
  const totalCategories = categories.length;

  // Total Inventory Value = Σ (qtyOnHand * unitPrice)
  const totalInventoryValue = products.reduce((sum, p) => {
    const qty = Number(p.qtyOnHand) || 0;
    const price = Number(p.unitPrice) || 0;
    return sum + qty * price;
  }, 0);

  // Recently added products (last 5)
  const recentProducts = [...products].reverse().slice(0, 5);

  // Low Stock Items (for the card)
  const lowStockItems = products.filter((p) => {
    const min = Number(p.minQty);
    const current = Number(p.qtyOnHand);
    return current < min;
  }).length;


  // Low Stock Items (for the card)
  const criticalStockItems = products.filter((p) => {
    const min = Number(p.minQty);
    const current = Number(p.qtyOnHand);
    return current < min * 0.5;
  }).length;

  const getStockStatus = (qty, minQty, maxQty) => {
    if (qty <= 0) return "OUT OF STOCK";
    if (qty < minQty * 0.5) return "CRITICAL";
    if (qty < minQty) {
      if ((qty < minQty * 0.5)) {
        return "CRITICAL";
      }
      else {
        return "LOW";
      }
    }
    if (qty > maxQty) return "SURPLUS";
    return "OPTIMAL";
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      case "LOW":
        return "bg-yellow-100 text-yellow-700";
      case "SURPLUS":
        return "bg-blue-100 text-blue-700";
      case "OPTIMAL":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  const calculateReplenishment = (products) => {
    const alerts = [];

    products.forEach((p) => {
      const threshold = p.minQty + (p.avgDailySales * p.leadTime);

      if (p.qtyOnHand < threshold) {
        const urgency = p.qtyOnHand < p.minQty ? "HIGH" : "MEDIUM";

        const restockQty = p.maxQty - p.qtyOnHand;
        const cost = restockQty * p.unitPrice;

        alerts.push({
          id: p.id,
          name: p.name,
          sku: p.sku,
          currentQty: p.qtyOnHand,
          threshold,
          restockQty,
          cost,
          urgency
        });
      }
    });

    const obj = {
      itemsToRestock: alerts.length,
      highUrgency: alerts.filter(a => a.urgency == "HIGH").length,
      totalRestockQty: alerts.reduce((sum, a) => sum + a.restockQty, 0),
      estimatedCost: alerts.reduce((sum, a) => sum + a.cost, 0),
      alerts
    }
    obj.alerts.reverse();
    
    return obj
  }

  const refreshReplenishments = () => {
    const replesh = calculateReplenishment(products)
    setReplenishments(replesh)
  }

  return (
    <>
      <div className="p-6 w-full">
        <h2 className="text-3xl font-bold text-gray-800">Inventory Dashboard</h2>
        <p className="text-gray-500 mb-8">Overview of your Inventory</p>
  
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Total Products</p>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <LuPackage className='text-[var(--color-secondary)]' />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
          </div>
  
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Categories</p>
              <div className="p-3 bg-green-50 rounded-xl">
                <TbCategoryPlus className='text-green-600' />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalCategories}</p>
          </div>
  
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                <PiWarning />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{lowStockItems}</p>
          </div>
  
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Critical Stock</p>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <AiOutlineExclamation />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{criticalStockItems}</p>
          </div>
          {/*Inventory Value */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Total Inventory Value</p>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <MdOutlineCurrencyRupee />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">₹{totalInventoryValue}</p>
          </div>
        </div>
  
        {/* Recent Replenishment  */}
        <h4 className="text-xl font-semibold mb-0 pl-3 pt-3">Recent Replenishment Alerts</h4>
        <p className="text-gray-500 mb-3 pl-3">Stock Status of recent Replenishment Alerts</p>
        <div className="bg-white rounded-2xl shadow mb-8 overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="p-3 pl-4">PRODUCT</th>
                <th className="p-3">SKU</th>
                <th className="p-3">ON HAND</th>
                <th className="p-3">RESTOCK QTY</th>
                <th className="p-3">URGENCY</th>
              </tr>
            </thead>
            <tbody>
              {
                replenishments?.alerts?.reverse().slice(0, 3).map((item) => (
                  <tr key={item?.id} className="border-b border-gray-100 text-gray-700">
                    <td className="p-3 pl-4">{item?.name}</td>
                    <td className="p-3">{item?.sku}</td>
                    <td className="p-3">{item?.currentQty}</td>
                    <td className="p-3">{item?.restockQty}</td>
                    <td className="p-3">
                      {
                        (() => {
                          const classes = getStatusClasses(item?.urgency);
  
                          return (
                            <span className={`${classes} px-3 py-1 rounded-full text-sm font-medium`}>
                              {item?.urgency}
                            </span>
                          );
                        })()
                      }
                    </td>
                  </tr>
                ))
              }
  
            </tbody>
          </table>
        </div>
  
        {/* Recent Products Table */}
        <h4 className="text-xl font-semibold mb-0 pl-3 pt-3">Recent Products</h4>
        <p className="text-gray-500 mb-3 pl-3">Stock Status of recently added Products</p>
        <div className="bg-white rounded-2xl shadow overflow-x-auto mb-5">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-100">
                <th className="p-3 pl-4">PRODUCT</th>
                <th className="p-3">SKU</th>
                <th className="p-3">QTY ON HAND</th>
                <th className="p-3">MIN QTY</th>
                <th className="p-3">MAX QTY</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {
                recentProducts?.length > 0 &&
                recentProducts?.map((pdt) => (
                  <tr key={pdt?.id} className="border-b border-gray-100 text-gray-700">
                    <td className="p-3 pl-4">{pdt?.name}</td>
                    <td className="p-3">{pdt?.sku}</td>
                    <td className="p-3">{pdt?.qtyOnHand}</td>
                    <td className="p-3">{pdt?.minQty}</td>
                    <td className="p-3">{pdt?.maxQty}</td>
                    <td className="p-3">
                      {
                        (() => {
                          const status = getStockStatus(Number(pdt?.qtyOnHand), Number(pdt?.minQty), Number(pdt?.maxQty));
                          const classes = getStatusClasses(status);
  
                          return (
                            <span className={`${classes} px-3 py-1 rounded-full text-sm font-medium`}>
                              {status}
                            </span>
                          );
                        })()
                      }
  
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard