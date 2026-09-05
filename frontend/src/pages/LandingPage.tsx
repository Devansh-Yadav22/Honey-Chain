import React, { useEffect, useRef, useState } from 'react';
import { 
  ShieldCheck, 
  QrCode, 
  ArrowRight, 
  Search,
  CheckCircle2, 
  UserCheck, 
  FlaskConical, 
  MapPin,
  Droplets,
  FileCheck
} from 'lucide-react';
import { useTranslation } from '../context/I18nContext';

interface LandingPageProps {
  onOpenVerifyModal: () => void;
  onNavigateLogin: () => void;
  onSelectBatch?: (id: string) => void;
  onVerifyBatch?: (id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenVerifyModal,
  onNavigateLogin,
  onSelectBatch,
  onVerifyBatch
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [heroSearchInput, setHeroSearchInput] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('hc-revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const animatedEls = containerRef.current?.querySelectorAll('.hc-scroll-reveal');
    animatedEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleSelect = (id: string) => {
    if (onSelectBatch) onSelectBatch(id);
    if (onVerifyBatch) onVerifyBatch(id);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      handleSelect(heroSearchInput.trim().toUpperCase());
    }
  };

  return (
    <div ref={containerRef} className="space-y-16 pb-12 select-none">
      {/* Scoped CSS for landing page scroll animations only */}
      <style>{`
        .hc-scroll-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .hc-scroll-reveal.hc-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .hc-delay-1 { transition-delay: 0.08s; }
        .hc-delay-2 { transition-delay: 0.16s; }
        .hc-delay-3 { transition-delay: 0.24s; }
      `}</style>

      {/* 1. Hero Section with Subtly Faded Natural Honey Apiary Background Image */}
      <section className="hc-scroll-reveal relative overflow-hidden rounded-2xl border border-[#D6C7B2] bg-gradient-to-b from-[#FFFDF9] via-[#FAF6F0] to-[#F5ECE0] shadow-sm">
        {/* Soft, elegantly faded background image (opacity-20) */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
          style={{ backgroundImage: `url('/assets/honey_apiary_bg.jpg')` }}
        />

        <div className="relative z-10 p-10 md:p-18 text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            {t('heroHeadline')}
          </h1>

          <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-2xl mx-auto font-medium">
            {t('heroSubheadline')}
          </p>

          {/* Integrated Search / Batch Verification Box with Round Corners */}
          <div className="max-w-xl mx-auto pt-2">
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  type="text"
                  value={heroSearchInput}
                  onChange={(e) => setHeroSearchInput(e.target.value)}
                  placeholder="Enter batch code (e.g. HC-2026-0001)"
                  className="w-full h-11 bg-white border border-[#D6C7B2] focus:border-amber-700 rounded-full pl-11 pr-4 text-xs font-medium text-stone-900 placeholder-stone-400 outline-none transition shadow-2xs"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="h-11 px-6 rounded-full bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Verify Batch</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenVerifyModal}
                  className="h-11 px-4 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-[#D6C7B2] font-semibold text-xs transition flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                  title="Scan QR with camera"
                >
                  <QrCode className="w-4 h-4 text-amber-700" />
                  <span className="hidden sm:inline">Scan QR</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. How Traceability Works (4 Simple Real-World Steps) */}
      <section id="how-it-works" className="hc-scroll-reveal space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            How Honey Traceability Works
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            A transparent four-step quality journey ensuring purity from sustainable apiaries to your home.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="hc-scroll-reveal hc-delay-1 p-6 bg-white border border-[#D6C7B2] rounded-2xl space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-[#D6C7B2] flex items-center justify-center text-amber-800 font-bold text-base">
              1
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-700" />
                Apiary Harvest
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Registered local beekeepers log harvest batches with exact geographical origin, flora variety, and colony health data.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="hc-scroll-reveal hc-delay-2 p-6 bg-white border border-[#D6C7B2] rounded-2xl space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-[#D6C7B2] flex items-center justify-center text-amber-800 font-bold text-base">
              2
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-amber-700" />
                Gentle Processing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Honey is filtered and stabilized with minimal heat, preserving delicate natural enzymes, vitamins, and wildflower aroma.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="hc-scroll-reveal hc-delay-3 p-6 bg-white border border-[#D6C7B2] rounded-2xl space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-[#D6C7B2] flex items-center justify-center text-amber-800 font-bold text-base">
              3
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-amber-700" />
                Laboratory Testing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Accredited food safety labs test for moisture, freshness (HMF), and zero artificial sugar adulteration (C4 test).
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="hc-scroll-reveal hc-delay-1 p-6 bg-white border border-[#D6C7B2] rounded-2xl space-y-3 shadow-2xs hover:shadow-xs transition">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-base">
              4
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Digital QR Passport
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Each sealed jar receives a tamper-evident QR code allowing consumers to review the complete origin and test story instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Two Provenance Pathways */}
      <section className="hc-scroll-reveal space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t('twoModelsTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            {t('twoModelsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Model A: Direct Beekeeper */}
          <div className="hc-scroll-reveal hc-delay-1 bg-white border border-[#D6C7B2] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs hover:border-amber-500 transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold font-mono uppercase tracking-wider">
                  Pathway A
                </span>
                <h3 className="text-lg font-bold text-stone-900">{t('modelDirectBeekeeper')}</h3>
              </div>
              <div className="w-11 h-11 rounded-full bg-amber-50 border border-[#D6C7B2] flex items-center justify-center text-2xl">
                🐝
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t('modelDirectBeekeeperDesc')}
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-stone-800 font-medium">Single-source harvest direct from registered apiarists</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="text-stone-800 font-medium">GPS-verified forest and farm origin documentation</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-bold">Instant consumer verification on every direct batch</span>
              </div>
            </div>

            <button
              onClick={() => handleSelect('HC-2026-0010')}
              className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold rounded-full text-xs flex items-center justify-center gap-1.5 transition"
            >
              View Direct Beekeeper Passport Demo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Model B: Certified Managed Supply Chain */}
          <div className="hc-scroll-reveal hc-delay-2 bg-white border border-[#D6C7B2] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs hover:border-amber-500 transition-all">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-[11px] font-bold font-mono uppercase tracking-wider">
                  Pathway B
                </span>
                <h3 className="text-lg font-bold text-stone-900">{t('modelCompanyManaged')}</h3>
              </div>
              <div className="w-11 h-11 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-2xl">
                🏭
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t('modelCompanyManagedDesc')}
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="text-stone-800 font-medium">Certified multi-tier aggregation with full custody logs</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="text-stone-800 font-medium">Cold-chain logistics with temperature monitoring</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-[#FAF8F5] border border-[#EAE3D9] rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-stone-700 shrink-0" />
                <span className="text-stone-800 font-medium">Batch-wise NABL accredited chemical assay certificates</span>
              </div>
            </div>

            <button
              onClick={() => handleSelect('HC-2026-0001')}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 border border-stone-300 font-semibold rounded-full text-xs flex items-center justify-center gap-1.5 transition"
            >
              View Certified Managed Passport Demo <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Purity & Quality Standards Guaranteed */}
      <section id="technology" className="hc-scroll-reveal bg-[#FAF8F5] border border-[#D6C7B2] rounded-2xl p-8 sm:p-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Certified Purity & Quality Standards
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Adhering strictly to national and international food safety benchmarks (FSSAI & Codex Alimentarius).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl border border-[#D6C7B2] space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Moisture Control</span>
            <h4 className="font-bold text-stone-900 text-sm">Under 20.0% Moisture</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Guarantees natural shelf stability and prevents unwanted fermentation while keeping raw honey thick and rich.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D6C7B2] space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Freshness Metric</span>
            <h4 className="font-bold text-stone-900 text-sm">HMF &lt; 40 mg/kg</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Hydroxymethylfurfural testing ensures honey has never been overheated or degraded during storage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D6C7B2] space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Purity Assurance</span>
            <h4 className="font-bold text-stone-900 text-sm">Zero C4 Sugar Adulteration</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Isotopic analysis confirms honey is 100% bee-gathered without corn syrup, cane sugar, or rice syrup fillers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#D6C7B2] space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Transit Safety</span>
            <h4 className="font-bold text-stone-900 text-sm">Cold-Chain Monitored</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Logistics tracking prevents extreme temperatures in transit, safeguarding natural pollens and antioxidants.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Production Call to Action Banner with Round Corners */}
      <section className="hc-scroll-reveal bg-amber-800 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-xs">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Verify Your Honey's Origin?
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Enter the batch code printed on your jar or access the authorized partner portal to register new harvests and custody transfers.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenVerifyModal}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>Verify Honey Jar</span>
          </button>
          <button
            onClick={onNavigateLogin}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-amber-900 hover:bg-amber-950 text-white border border-amber-600 font-bold text-xs transition flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-4 h-4" />
            <span>Partner Portal Sign In</span>
          </button>
        </div>
      </section>

      {/* 6. Production-Grade Footer */}
      <footer className="pt-8 border-t border-[#EAE3D9] text-center space-y-2 text-xs text-stone-500">
        <div className="flex items-center justify-center space-x-2">
          <span className="font-bold text-stone-800 text-sm">Honey Chain</span>
          <span className="text-stone-300">•</span>
          <span className="text-stone-600">Origin & Quality Certification Network</span>
        </div>
        <p className="text-[11px] max-w-xl mx-auto text-stone-500 leading-relaxed">
          {t('footerHonestClaim')}
        </p>
        <p className="text-[10px] text-stone-400 pt-1">
          {t('footerRights')}
        </p>
      </footer>
    </div>
  );
};
