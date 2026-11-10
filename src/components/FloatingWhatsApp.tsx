import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = 'https://api.whatsapp.com/send/?phone=5561999287524&text=' + encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre a compra de Tibia Coins / Gold na Capane Store.') + '&type=phone_number&app_absent=0';

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      {/* Tooltip on hover */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:block bg-[#160726] border border-emerald-500/50 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-xl">
        Atendimento WhatsApp 24/7
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Atendimento via WhatsApp"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-[0_4px_25px_rgba(16,185,129,0.5)] hover:shadow-[0_4px_35px_rgba(16,185,129,0.8)] transition-all transform hover:scale-110 active:scale-95 cursor-pointer relative"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-[#09030e] rounded-full"></span>
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};
