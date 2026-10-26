import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-700 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle max-w-sm">
      <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 px-4 py-3 rounded-xl shadow-2xl border border-stone-700 flex items-center space-x-3">
        {getIcon()}
        <span className="text-sm font-medium tracking-wide leading-tight">
          {toastMessage.message}
        </span>
      </div>
    </div>
  );
};
