import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Award, Printer, ShieldCheck, Sparkles } from 'lucide-react';

export const CertificateModal = () => {
  const { isCertificateOpen, setIsCertificateOpen, certificateArtwork, artistSettings } = useShop();

  if (!isCertificateOpen || !certificateArtwork) return null;

  const serialNumber = `COA-AKS-${certificateArtwork.year || '2026'}-${(certificateArtwork.id || 'ART').toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#faf9f6]">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-stone-700" />
            <span className="font-serif font-medium text-stone-900 text-sm">Certificate of Authenticity</span>
          </div>
          <button
            onClick={() => setIsCertificateOpen(false)}
            className="w-8 h-8 rounded-full border border-stone-200 hover:border-stone-900 flex items-center justify-center text-stone-400 hover:text-stone-900 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Parchment Document */}
        <div className="p-8 sm:p-12 bg-[#fdfbf7] relative">
          
          {/* Certificate Clean Border */}
          <div className="border border-stone-300 p-8 sm:p-10 rounded-xl relative bg-white shadow-sm text-center">
            
            {/* Header */}
            <div className="space-y-1 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-medium">
                Official Provenance Document
              </span>
              <h2 className="font-serif text-3xl font-light text-stone-900 mt-1">
                Certificate of Authenticity
              </h2>
              <div className="w-12 h-px bg-stone-300 mx-auto my-3"></div>
              <p className="text-xs text-stone-500">
                Studio: <strong>Art by Akshatha</strong> • Serial ID: <code className="font-mono text-stone-800 font-semibold">{serialNumber}</code>
              </p>
            </div>

            {/* Declaration Text */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto mb-6">
              This document certifies that the original artwork cataloged below is a genuine, one-of-a-kind handmade creation personally executed by artist <strong>{artistSettings.name}</strong>.
            </p>

            {/* Artwork Specifications Table */}
            <div className="bg-stone-50/70 border border-stone-200 rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between border-b border-stone-200/80 pb-1.5">
                <span className="text-stone-500">Artwork Title:</span>
                <span className="font-serif font-medium text-stone-900 text-sm">{certificateArtwork.title}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/80 pb-1.5">
                <span className="text-stone-500">Medium & Surface:</span>
                <span className="text-stone-800 text-right">{certificateArtwork.medium}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/80 pb-1.5">
                <span className="text-stone-500">Dimensions:</span>
                <span className="text-stone-800">{certificateArtwork.dimensions}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/80 pb-1.5">
                <span className="text-stone-500">Year of Creation:</span>
                <span className="text-stone-800">{certificateArtwork.year || '2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Edition:</span>
                <span className="text-stone-900 font-medium">Original 1 of 1</span>
              </div>
            </div>

            {/* Archival Material Guarantee */}
            <div className="flex items-center justify-center space-x-2 text-[11px] text-stone-500 mb-8">
              <ShieldCheck className="w-4 h-4 text-stone-600" />
              <span>Created with archival acid-free pigments and protective finish</span>
            </div>

            {/* Signatures & Seal */}
            <div className="flex items-center justify-between pt-6 border-t border-stone-200 max-w-md mx-auto">
              {/* Studio Seal Graphic */}
              <div className="w-14 h-14 rounded-full border border-stone-300 flex flex-col items-center justify-center text-stone-700 bg-stone-50">
                <Sparkles className="w-3.5 h-3.5 mb-0.5 text-stone-500" />
                <span className="text-[8px] uppercase font-semibold tracking-wider">Studio Seal</span>
              </div>

              {/* Artist Signature */}
              <div className="text-right">
                <div className="font-serif italic text-2xl text-stone-900 font-normal -mb-1">
                  Akshatha Gopalkar
                </div>
                <div className="w-32 h-px bg-stone-400 ml-auto mt-1"></div>
                <p className="text-[9px] text-stone-500 uppercase tracking-widest mt-1">Solo Artist & Creator</p>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            A hand-signed copy is enclosed with your artwork parcel.
          </p>
          <button
            onClick={handlePrint}
            className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center space-x-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Certificate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
