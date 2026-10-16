import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { Product } from '../../types';

interface VoiceInputProps {
  onProductDetected: (product: Partial<Product>) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onProductDetected }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedItem, setParsedItem] = useState<Partial<Product> | null>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
    }
  }, []);

  const parseVoiceText = (text: string): Partial<Product> | null => {
    // Examples:
    // "Add 20 kg basmati rice for 350 rupees"
    // "Add 15 packets amul milk"
    // "Added 5 bottles mustard oil"
    const cleaned = text.toLowerCase().replace(/^(add|added|please add|record)\s+/i, '');

    // Match quantity and unit: (e.g. 20 kg, 5 packets, 10 bottles)
    const match = cleaned.match(/^(\d+)\s*(kg|bags|bottles|packets|boxes|strips|vials|liters|l|g)?\s+(.+?)(?:\s+(?:for|at|rate)\s+(\d+)\s*(?:rupees|rs)?)?$/i);

    if (match) {
      const qty = parseInt(match[1]) || 1;
      const unit = match[2] || 'units';
      const nameRaw = match[3];
      const price = match[4] ? parseInt(match[4]) : 100;

      // Capitalize name
      const name = nameRaw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

      return {
        name,
        quantity: qty,
        unit,
        price,
        costPrice: Math.round(price * 0.8),
        category: unit === 'strips' || unit === 'vials' ? 'Pharmaceuticals' : 'Grocery Stock',
        supplierName: 'Voice Ingestion'
      };
    }

    // Fallback simple extraction
    return {
      name: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      quantity: 10,
      unit: 'units',
      price: 100,
      costPrice: 80,
      category: 'General Voice Ingest'
    };
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Indian English / Hinglish friendly

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setParsedItem(null);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const text = event.results[current][0].transcript;
      setTranscript(text);

      if (event.results[current].isFinal) {
        const item = parseVoiceText(text);
        setParsedItem(item);
        if (item) {
          setTimeout(() => {
            onProductDetected(item);
          }, 1500);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!supported) return null;

  return (
    <div className="relative inline-block">
      <button
        onClick={startListening}
        disabled={isListening}
        title="Speak to add stock (e.g. 'Add 15 bags Basmati Rice for 350 rupees')"
        className={`p-2 rounded-xl transition flex items-center gap-1.5 text-xs font-bold ${
          isListening
            ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-900/50'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
        }`}
      >
        {isListening ? (
          <>
            <Mic className="w-4 h-4 text-white animate-bounce" />
            <span className="hidden sm:inline">Listening...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Voice Add</span>
          </>
        )}
      </button>

      {/* Floating Listening Feedback Box */}
      {isListening && (
        <div className="absolute right-0 top-11 z-50 w-72 bg-slate-900 border border-emerald-500/50 rounded-xl p-3 shadow-2xl animate-fade-in text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Speak item name & quantity...</span>
          </div>
          <p className="text-slate-300 italic bg-slate-950 p-2 rounded-lg border border-slate-800">
            {transcript ? `"${transcript}"` : 'e.g. "Add 20 kg Sugar for 45 rupees"'}
          </p>
        </div>
      )}

      {/* Item Parsed Success Toast */}
      {parsedItem && !isListening && (
        <div className="absolute right-0 top-11 z-50 w-72 bg-slate-900 border border-emerald-500 rounded-xl p-3 shadow-2xl animate-fade-in text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Voice Item Recognized!</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg text-slate-200">
            <strong>{parsedItem.name}</strong> • {parsedItem.quantity} {parsedItem.unit} (₹{parsedItem.price})
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">Adding to inventory...</div>
        </div>
      )}
    </div>
  );
};
