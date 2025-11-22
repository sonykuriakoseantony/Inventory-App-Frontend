import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './views/Dashboard'
import Products from './views/Products'
import Categories from './views/Categories'
import Replenishment from './views/Replenishment'

function App() {

  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "categories":
        return <Categories />;
      case "replenishment":
        return <Replenishment />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-blue-100">
        <Sidebar currentPage={activeTab} setCurrentPage={setActiveTab}/>
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </>
  )
}

export default App
