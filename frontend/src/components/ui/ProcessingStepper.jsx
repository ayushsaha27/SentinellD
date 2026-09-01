import React from 'react';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export default function ProcessingStepper({ currentStep = 1 }) {
  const steps = [
    { num: 1, title: 'Module 1: OCR Data Extraction', desc: 'Extracting fields & MRZ format...' },
    { num: 2, title: 'Module 2: Document Validation', desc: 'Verifying checksums & SSB watchlist...' },
    { num: 3, title: 'Module 3: Tampering & Forgery AI', desc: 'Analyzing ELA compression & spatial noise...' },
    { num: 4, title: 'Module 4: Face Biometric Match', desc: 'Comparing 1:1 face embedding distance...' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto py-6">
      <div className="space-y-4">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isCurrent = currentStep === step.num;

          return (
            <div 
              key={step.num}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                isCurrent 
                  ? 'bg-amber-50 border-[#FFC300] shadow-sm scale-[1.01]' 
                  : isDone 
                  ? 'bg-emerald-50/70 border-emerald-300' 
                  : 'bg-white border-[#C7D6E8] opacity-60'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-7 h-7 text-[#2E7D32]" />
                ) : isCurrent ? (
                  <Loader2 className="w-7 h-7 text-[#0B2545] animate-spin" />
                ) : (
                  <Circle className="w-7 h-7 text-gray-300" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold text-base ${isCurrent ? 'text-[#0B2545]' : isDone ? 'text-[#2E7D32]' : 'text-gray-500'}`}>
                    {step.title}
                  </h4>
                  {isDone && <span className="text-xs font-semibold text-[#2E7D32] uppercase">Completed</span>}
                  {isCurrent && <span className="text-xs font-semibold text-[#0B2545] animate-pulse uppercase">Processing...</span>}
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
