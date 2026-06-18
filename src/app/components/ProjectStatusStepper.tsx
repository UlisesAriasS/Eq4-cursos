import { CheckCircle2, Clock, XCircle, Package, Search, ClipboardCheck } from 'lucide-react';

interface ProjectStatusStepperProps {
  currentStep: number;
  finalStatus?: 'approved' | 'rejected' | null;
  dictamen?: string;
}

const steps = [
  { label: 'Entregado', icon: Package },
  { label: 'En revisión', icon: Search },
  { label: 'Revisado', icon: ClipboardCheck },
  { label: 'Dictamen', icon: CheckCircle2 },
];

export function ProjectStatusStepper({
  currentStep,
  finalStatus = null,
  dictamen,
}: ProjectStatusStepperProps) {
  const getStepState = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getFinalIcon = () => {
    if (finalStatus === 'approved') return <CheckCircle2 className="w-5 h-5" />;
    if (finalStatus === 'rejected') return <XCircle className="w-5 h-5" />;
    return <ClipboardCheck className="w-5 h-5" />;
  };

  const getFinalLabel = () => {
    if (finalStatus === 'approved') return 'Aprobado';
    if (finalStatus === 'rejected') return 'Rechazado';
    return 'Dictamen';
  };

  return (
    <div>
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const state = getStepState(index);
          const isLast = index === steps.length - 1;
          const Icon = step.icon;
          const isFinalActive = isLast && currentStep === index;
          const isFinalCompleted = isLast && currentStep > index;

          return (
            <div key={step.label} className="flex-1 flex flex-col items-center relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-colors ${
                    state === 'completed' ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isLast
                    ? isFinalCompleted || isFinalActive
                      ? finalStatus === 'approved'
                        ? 'bg-green-500 text-white'
                        : finalStatus === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-[#1e3a5f] text-white'
                      : 'bg-gray-100 text-gray-400'
                    : state === 'completed'
                    ? 'bg-green-500 text-white'
                    : state === 'active'
                    ? 'bg-[#1e3a5f] text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isLast ? (
                  isFinalCompleted || isFinalActive ? (
                    getFinalIcon()
                  ) : (
                    <span className="text-xs font-semibold">4</span>
                  )
                ) : state === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : state === 'active' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-xs text-center leading-tight ${
                  isLast
                    ? isFinalCompleted || isFinalActive
                      ? finalStatus === 'approved'
                        ? 'text-green-700 font-semibold'
                        : finalStatus === 'rejected'
                        ? 'text-red-700 font-semibold'
                        : 'text-[#1e3a5f] font-semibold'
                      : 'text-gray-400'
                    : state === 'completed'
                    ? 'text-green-700 font-medium'
                    : state === 'active'
                    ? 'text-[#1e3a5f] font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {isLast ? getFinalLabel() : step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Dictamen area */}
      {currentStep >= 3 && finalStatus && dictamen && (
        <div
          className={`mt-4 p-3 rounded-lg border text-sm ${
            finalStatus === 'approved'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <p className="font-medium mb-1">Dictamen:</p>
          <p className="leading-relaxed">{dictamen}</p>
        </div>
      )}
    </div>
  );
}
