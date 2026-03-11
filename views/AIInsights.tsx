
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Sparkles, Zap, ChevronRight, Loader2 } from 'lucide-react';
import { getBusinessAdvice } from '../services/geminiService';
import { Product } from '../types';

interface AIInsightsProps {
  stats: any;
  products: Product[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ stats, products }) => {
  const [advice, setAdvice] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await getBusinessAdvice({ stats, productsCount: products.length });
    setAdvice(result.advice || []);
    setLoading(false);
  };

  useEffect(() => {
    if (advice.length === 0) fetchAdvice();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4 bg-white bg-opacity-20 w-fit px-3 py-1 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              Impulsado por Gemini AI
            </div>
            <h2 className="text-3xl font-bold mb-4">Optimiza tu Asado con Inteligencia Artificial</h2>
            <p className="text-orange-100 text-lg max-w-xl">
              Analizamos tus datos de ventas e inventario para darte recomendaciones accionables que aumenten tus ganancias.
            </p>
            <button 
              onClick={fetchAdvice}
              disabled={loading}
              className="mt-8 bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {loading ? 'Analizando datos...' : 'Generar nuevos insights'}
            </button>
          </div>
          <div className="hidden md:block">
            <BrainCircuit className="w-48 h-48 opacity-20" />
          </div>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-white border border-gray-100 rounded-2xl animate-pulse shadow-sm" />
          ))
        ) : (
          advice.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                  item.impact === 'Alto' ? 'bg-green-100 text-green-700' : 
                  item.impact === 'Medio' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  Impacto {item.impact}
                </span>
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                   <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))
        )}
      </div>

      {advice.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
           <BrainCircuit className="w-16 h-16 text-gray-300 mx-auto mb-4" />
           <p className="text-gray-500 font-medium">No hay consejos disponibles. Haz clic en el botón para generar.</p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
