import React, { useEffect, useState } from 'react';
import { Shield, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProcessingStepper from '../components/ui/ProcessingStepper';

export default function Processing() {
  const { setActivePage } = useApp();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Stage 1: OCR (800ms)
    const t1 = setTimeout(() => setCurrentStep(2), 800);
    // Stage 2: Validation (1600ms)
    const t2 = setTimeout(() => setCurrentStep(3), 1600);
    // Stage 3: Tampering (2400ms)
    const t3 = setTimeout(() => setCurrentStep(4), 2400);
    // Stage 4: Face Match Done (3200ms -> Navigate to Result)
    const t4 = setTimeout(() => {
      setActivePage('result');
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [setActivePage]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0B2545] text-[#FFC300] shadow-lg animate-bounce">
        <Cpu className="w-8 h-8" />
      </div>

      <div>
        <h2 className="text-2xl font-bold font-serif text-[#0B2545]">
          Executing SentinelID Multi-Layer AI Pipeline...
        </h2>
        <p className="text-xs text-gray-600 mt-1 font-mono">
          Running OCR Extraction • Standard Validation • ELA Tampering Forensics • Biometric Face Verification
        </p>
      </div>

      <div className="bg-white border border-[#C7D6E8] rounded-xl p-6 shadow-md text-left">
        <ProcessingStepper currentStep={currentStep} />
      </div>

      <p className="text-xs text-gray-500 font-mono italic">
        Target performance: &lt;3.5s total edge processing time
      </p>
    </div>
  );
}
