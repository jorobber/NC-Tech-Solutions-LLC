
import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  TrendingUp, 
  Receipt, 
  Users, 
  BrainCircuit,
  Menu,
  X,
  ClipboardList,
  DollarSign,
  Download,
  BookOpen
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);

  React.useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'menu', label: 'Menú Digital', icon: BookOpen },
    { id: 'orders', label: 'Control de pedidos', icon: ClipboardList },
    { id: 'prices', label: 'Gestión de Precios', icon: DollarSign },
    { id: 'inventory', label: 'Inventario', icon: Utensils },
    { id: 'sales', label: 'Ventas', icon: TrendingUp },
    { id: 'expenses', label: 'Gastos', icon: Receipt },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'ai', label: 'IA Insights', icon: BrainCircuit },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
            <Utensils className="w-8 h-8" />
            AsadoPro
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-orange-50 text-orange-600' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        {deferredPrompt && (
          <div className="px-4 mb-4">
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-sm"
            >
              <Download className="w-5 h-5" />
              Instalar App
            </button>
          </div>
        )}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">© 2024 AsadoPro - Gestión Inteligente</p>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-600">AsadoPro</h1>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg ${
                activeTab === item.id ? 'bg-orange-50 text-orange-600' : 'text-gray-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        {deferredPrompt && (
          <div className="px-4 mt-4">
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-orange-600 text-white"
            >
              <Download className="w-5 h-5" />
              Instalar App
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-center md:justify-start">
             <h2 className="text-lg font-semibold text-gray-800 uppercase tracking-wider">
               {menuItems.find(m => m.id === activeTab)?.label}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
              MA
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
