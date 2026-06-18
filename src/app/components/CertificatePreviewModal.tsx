import { X, Download, GraduationCap, Award } from 'lucide-react';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  matricula: string;
  courseName: string;
  period: string;
}

const QRCodePlaceholder = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="72" fill="white" />
    {/* Top-left position square */}
    <rect x="4" y="4" width="20" height="20" fill="#1e3a5f" />
    <rect x="7" y="7" width="14" height="14" fill="white" />
    <rect x="10" y="10" width="8" height="8" fill="#1e3a5f" />
    {/* Top-right position square */}
    <rect x="48" y="4" width="20" height="20" fill="#1e3a5f" />
    <rect x="51" y="7" width="14" height="14" fill="white" />
    <rect x="54" y="10" width="8" height="8" fill="#1e3a5f" />
    {/* Bottom-left position square */}
    <rect x="4" y="48" width="20" height="20" fill="#1e3a5f" />
    <rect x="7" y="51" width="14" height="14" fill="white" />
    <rect x="10" y="54" width="8" height="8" fill="#1e3a5f" />
    {/* Data modules */}
    <rect x="28" y="4" width="4" height="4" fill="#1e3a5f" />
    <rect x="34" y="4" width="4" height="4" fill="#1e3a5f" />
    <rect x="40" y="4" width="4" height="4" fill="#1e3a5f" />
    <rect x="28" y="10" width="4" height="4" fill="#1e3a5f" />
    <rect x="34" y="10" width="4" height="4" fill="#1e3a5f" />
    <rect x="28" y="16" width="4" height="4" fill="#1e3a5f" />
    <rect x="40" y="10" width="4" height="4" fill="#1e3a5f" />
    <rect x="4" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="10" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="16" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="28" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="34" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="40" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="46" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="52" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="58" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="64" y="28" width="4" height="4" fill="#1e3a5f" />
    <rect x="4" y="34" width="4" height="4" fill="#1e3a5f" />
    <rect x="16" y="34" width="4" height="4" fill="#1e3a5f" />
    <rect x="28" y="34" width="4" height="4" fill="#1e3a5f" />
    <rect x="46" y="34" width="4" height="4" fill="#1e3a5f" />
    <rect x="58" y="34" width="4" height="4" fill="#1e3a5f" />
    <rect x="4" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="10" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="22" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="34" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="40" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="52" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="64" y="40" width="4" height="4" fill="#1e3a5f" />
    <rect x="28" y="46" width="4" height="4" fill="#1e3a5f" />
    <rect x="34" y="52" width="4" height="4" fill="#1e3a5f" />
    <rect x="40" y="46" width="4" height="4" fill="#1e3a5f" />
    <rect x="46" y="52" width="4" height="4" fill="#1e3a5f" />
    <rect x="52" y="46" width="4" height="4" fill="#1e3a5f" />
    <rect x="58" y="52" width="4" height="4" fill="#1e3a5f" />
    <rect x="64" y="46" width="4" height="4" fill="#1e3a5f" />
    <rect x="28" y="58" width="4" height="4" fill="#1e3a5f" />
    <rect x="40" y="58" width="4" height="4" fill="#1e3a5f" />
    <rect x="46" y="64" width="4" height="4" fill="#1e3a5f" />
    <rect x="58" y="58" width="4" height="4" fill="#1e3a5f" />
    <rect x="64" y="64" width="4" height="4" fill="#1e3a5f" />
  </svg>
);

export function CertificatePreviewModal({
  isOpen,
  onClose,
  studentName,
  matricula,
  courseName,
  period,
}: CertificatePreviewModalProps) {
  if (!isOpen) return null;

  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col">
        {/* Modal toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#1e3a5f]" />
            <span className="font-semibold text-gray-900">Previsualización de Constancia</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate body */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Diploma card */}
          <div
            className="relative bg-white border-4 border-[#1e3a5f] rounded-xl p-1 mx-auto"
            style={{ maxWidth: '680px' }}
          >
            {/* Inner decorative border */}
            <div className="border-2 border-[#c8a84b] rounded-lg p-6">
              {/* Institution header */}
              <div className="text-center mb-6 border-b-2 border-[#1e3a5f] pb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <GraduationCap className="w-10 h-10 text-[#1e3a5f]" />
                  <div>
                    <p
                      className="text-[#1e3a5f] tracking-widest uppercase"
                      style={{ fontSize: '11px', fontWeight: 600 }}
                    >
                      República Mexicana
                    </p>
                    <h1
                      className="text-[#1e3a5f]"
                      style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}
                    >
                      Universidad Tecnológica Nacional
                    </h1>
                    <p className="text-gray-500" style={{ fontSize: '12px' }}>
                      Sistema Académico Institucional
                    </p>
                  </div>
                  <GraduationCap className="w-10 h-10 text-[#1e3a5f]" />
                </div>
              </div>

              {/* Certificate title */}
              <div className="text-center mb-6">
                <p
                  className="text-gray-500 uppercase tracking-widest mb-1"
                  style={{ fontSize: '11px' }}
                >
                  Hace constar que
                </p>
                <h2
                  className="text-[#1e3a5f] border-b-2 border-[#c8a84b] inline-block pb-1"
                  style={{ fontSize: '26px', fontWeight: 700 }}
                >
                  {studentName}
                </h2>
                <p className="text-gray-600 mt-2" style={{ fontSize: '13px' }}>
                  Matrícula:{' '}
                  <span className="font-semibold text-gray-900">{matricula}</span>
                </p>
              </div>

              {/* Certificate body text */}
              <div className="text-center mb-6 space-y-2">
                <p className="text-gray-700" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                  ha acreditado satisfactoriamente el
                </p>
                <p
                  className="text-[#1e3a5f] px-4 py-2 bg-blue-50 rounded-lg inline-block"
                  style={{ fontSize: '16px', fontWeight: 700 }}
                >
                  {courseName}
                </p>
                <p className="text-gray-700" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                  correspondiente al periodo{' '}
                  <span className="font-semibold text-gray-900">{period}</span>
                </p>
              </div>

              {/* Certificate details grid */}
              <div className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 rounded-lg p-4">
                <div className="text-center">
                  <p className="text-gray-500 uppercase tracking-wide mb-1" style={{ fontSize: '10px' }}>
                    Horas Acreditadas
                  </p>
                  <p className="text-[#1e3a5f]" style={{ fontSize: '22px', fontWeight: 700 }}>
                    120
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '11px' }}>horas</p>
                </div>
                <div className="text-center border-x border-gray-200">
                  <p className="text-gray-500 uppercase tracking-wide mb-1" style={{ fontSize: '10px' }}>
                    Tipo de Participación
                  </p>
                  <p className="text-gray-900" style={{ fontSize: '13px', fontWeight: 600 }}>
                    Proyecto Integrador
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '11px' }}>modalidad presencial</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 uppercase tracking-wide mb-1" style={{ fontSize: '10px' }}>
                    Fecha de Expedición
                  </p>
                  <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 600 }}>
                    {today}
                  </p>
                </div>
              </div>

              {/* Signature section */}
              <div className="flex items-end justify-between mb-4">
                <div className="text-center flex-1">
                  <div className="border-b-2 border-gray-400 mx-8 mb-2 h-8 flex items-end justify-center">
                    <span className="text-gray-400 italic pb-1" style={{ fontSize: '11px' }}>
                      firma digital
                    </span>
                  </div>
                  <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 600 }}>
                    Dr. Roberto Sánchez Flores
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '11px' }}>
                    Secretaría Académica
                  </p>
                  <p className="text-gray-500" style={{ fontSize: '11px' }}>
                    Universidad Tecnológica Nacional
                  </p>
                </div>

                {/* QR + Folio */}
                <div className="text-center">
                  <QRCodePlaceholder />
                  <p className="text-gray-500 mt-1" style={{ fontSize: '9px' }}>
                    Verificar autenticidad
                  </p>
                </div>
              </div>

              {/* Folio footer */}
              <div className="text-center pt-3 border-t border-gray-200">
                <p className="text-gray-400" style={{ fontSize: '10px' }}>
                  Folio:{' '}
                  <span className="font-mono text-gray-600">UTN-2026-PI-00847</span>
                  {' '}·{' '}
                  Este documento tiene validez oficial con código QR verificable en{' '}
                  <span className="text-[#1e3a5f]">sistema.utn.edu.mx/verificar</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            Cerrar previsualización
          </button>
          <button
            className="px-5 py-2.5 rounded-lg bg-[#1e3a5f] text-white hover:bg-[#2d5280] transition-colors flex items-center gap-2"
            style={{ fontSize: '14px', fontWeight: 500 }}
          >
            <Download className="w-4 h-4" />
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
