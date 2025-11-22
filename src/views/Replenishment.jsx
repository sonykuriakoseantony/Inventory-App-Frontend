import React, { useEffect, useState } from 'react'
import { getAllProductsAPI } from '../services/allAPI';
import { PiWarning } from 'react-icons/pi';
import { AiOutlineExclamation } from 'react-icons/ai';
import { LuPackage } from 'react-icons/lu';
import { MdOutlineCurrencyRupee } from 'react-icons/md';
import { GoGraph } from 'react-icons/go';
import { LiaSyncSolid } from 'react-icons/lia';

function Replenishment() {
  const [products, setProducts] = useState([]);
  const [replenishments, setReplenishments] = useState([]);

  useEffect(() => {
    fetchProducts();
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

  const totalRestockQty = products
    .filter(p => p.qtyOnHand < (p.minQty + p.avgDailySales * p.leadTime))
    .reduce((sum, p) => sum + (p.maxQty - p.avgDailySales), 0);

  const estimatedCost = products
    .filter(p => p.qtyOnHand < (p.minQty + p.ads * p.leadTime))
    .reduce((sum, p) => sum + ((p.maxQty - p.qtyOnHand) * p.unitPrice), 0);

  const calculateReplenishment = (products) => {
    const alerts = [];

    products.forEach((p) => {
      const threshold = Number(p.minQty) + (p.avgDailySales * p.leadTime);

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

    return {
      itemsToRestock: alerts.length,
      highUrgency: alerts.filter(a => a.urgency == "HIGH").length,
      totalRestockQty: alerts.reduce((sum, a) => sum + a.restockQty, 0),
      estimatedCost: alerts.reduce((sum, a) => sum + a.cost, 0),
      alerts
    };
  }

  const refreshReplenishments = () => {
    const replesh = calculateReplenishment(products)
    setReplenishments(replesh)
  }

  const getStatusClasses = (status) => {
    switch (status) {
      case "HIGH":
        return "bg-red-100 text-red-700";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  return (
    <>
      <div className="w-full p-6">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-bold mb-2">Order Replenishment Dashboard</h1>
        <p className="text-gray-500 mb-10">
          Smart inventory replenishment based on sales velocity and lead time
        </p>

        {/* TOP CARDS */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {/* Low Stock */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Items to restock</p>
              <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                <PiWarning />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{lowStockItems}</p>
          </div>
          {/* Critical Stock */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Critical Stock</p>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <AiOutlineExclamation />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{criticalStockItems}</p>
          </div>

          {/* Total restock */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Total Restock</p>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
                <LuPackage className='text-[var(--color-secondary)]' />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalRestockQty}</p>
          </div>
          {/*Inventory Value */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-2" style={{ minHeight: '10rem' }}>
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">Estimated Cost</p>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <MdOutlineCurrencyRupee />
              </div>
            </div>
            <p className="text-4xl font-bold text-gray-800 mt-2">₹{estimatedCost}</p>
          </div>
        </div>
        {/* REPLENISHMENT FORMULA BOX */}
        <div className="bg-white rounded-xl p-4 border shadow-sm mb-10 border-gray-100">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
            <span className="text-blue-500">
              <span className="flex p-3 bg-blue-50 text-blue-500 rounded-xl"><GoGraph className='text-[var(--color-secondary)]' />
              </span>
            </span> Replenishment Formula
          </h3>
          <div className='py-6 px-7 bg-blue-50 rounded-xl'>
            <p> <strong>Restock Threshold</strong> = Min Quantity + (Average Daily Sales {'×'} Lead Time) </p>
            <p> <strong>Trigger Condition</strong> = When Quantity on Hand {'<'} Restock Threshold </p>
            <p> <strong>Restock Quantity</strong> = Max Quantity {'−'} Quantity on Hand </p>
          </div>
        </div>
        {/* ALERT LIST */}
        <div className="">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">Replenishment Alerts</h3>
              <p className="text-gray-500">Smart inventory replenishment alerts</p>
            </div>
            <button onClick={refreshReplenishments} className="flex items-center gap-2 p-2 pl-3 pr-4 rounded-lg font-medium bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-secondary)] to-cyan-500 shadow text-white" title="Refresh Order Replenishment">
              <LiaSyncSolid className="fw-bold text-white" />Refresh Data
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow overflow-x-auto mb-5 shadow-md">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100">
                  <th className="p-3 pl-4">URGENCY</th>
                  <th className="p-3">PRODUCT</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">CURRENT QTY</th>
                  <th className="p-3">RESTOCK QTY</th>
                  <th className="p-3">EST. COST</th>
                </tr>
              </thead>
  
              <tbody>
                {replenishments?.alerts?.map((item) => (
                  <tr key={item?.id} className="border-b border-gray-100 text-gray-700 hover:bg-gray-50">
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
                    <td className="p-3">{item?.name}</td>
                    <td className="p-3">{item?.sku}</td>
                    <td className="p-3">{item?.currentQty}</td>
                    <td className="p-3">{item?.restockQty}</td>
                    <td className="p-3">${item?.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Replenishment