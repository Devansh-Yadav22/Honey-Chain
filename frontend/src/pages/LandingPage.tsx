import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Search,
  Leaf,
  ShieldCheck,
  Users,
  Heart,
  CheckCircle2,
  Menu,
  X,
  LogIn,
} from 'lucide-react';
import { useTranslation } from '../context/I18nContext';
import { LanguageSelector } from '../components/LanguageSelector';

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
  const [traceInput, setTraceInput] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleTrace = (e: React.FormEvent) => {
    e.preventDefault();
    const val = traceInput.trim().toUpperCase();
    if (val) {
      if (onSelectBatch) onSelectBatch(val);
      if (onVerifyBatch) onVerifyBatch(val);
    }
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const NAV_LINKS = [
    { label: t('navHome'), action: () => scrollTo('hero') },
    { label: t('navAbout'), action: () => scrollTo('features') },
    { label: t('navHowItWorks'), action: () => scrollTo('how-it-works') },
    { label: t('navOurHoney'), action: () => scrollTo('mission') },
    { label: t('navTrace'), action: () => scrollTo('trace') },
    { label: t('navContact'), action: () => scrollTo('footer') },
  ];

  return (
    <div ref={containerRef} className="select-none">
      {/* Scoped CSS */}
      <style>{`
        .hc-scroll-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: opacity, transform;
        }
        .hc-scroll-reveal.hc-revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .hc-delay-1 { transition-delay: 0.1s; }
        .hc-delay-2 { transition-delay: 0.2s; }
        .hc-delay-3 { transition-delay: 0.3s; }
        .hc-delay-4 { transition-delay: 0.4s; }
      `}</style>

      {/* ─── NAVBAR ─── */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => scrollTo('hero')}>
            <div className="w-9 h-9 rounded-full bg-[#3D5A3A] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-stone-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {t('appName')}
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-sm text-stone-600 hover:text-stone-900 font-medium transition"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <LanguageSelector variant="pill" />
            <button
              onClick={onNavigateLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-700 hover:text-stone-900 text-sm font-semibold transition shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-stone-500" />
              <span>{t('navSignIn')}</span>
            </button>
            <button
              onClick={() => scrollTo('trace')}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#3D5A3A] hover:bg-[#2E4A2E] text-white text-sm font-semibold transition shadow-sm cursor-pointer"
            >
              {t('landingHeroCta')}
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="w-full text-left px-3 py-2.5 text-sm text-stone-700 hover:bg-stone-50 rounded-lg font-medium"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); onNavigateLogin(); }}
              className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 rounded-full border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-stone-500" />
              <span>{t('navSignIn')}</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); scrollTo('trace'); }}
              className="w-full mt-2 px-4 py-2.5 rounded-full bg-[#3D5A3A] text-white text-sm font-semibold cursor-pointer"
            >
              {t('landingHeroCta')}
            </button>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section id="hero" className="bg-gradient-to-b from-[#FAFAF5] to-[#F5F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left - Text Content */}
            <div className="hc-scroll-reveal space-y-6 max-w-xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500" style={{ letterSpacing: '0.2em' }}>
                {t('landingHeroTag')}
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-stone-900 leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('landingHeroTitle').split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </h1>
              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-md">
                {t('landingHeroDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => scrollTo('trace')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#3D5A3A] hover:bg-[#2E4A2E] text-white text-sm font-semibold transition shadow-md"
                >
                  {t('landingHeroCta')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-stone-500 italic">
                {t('landingHeroDiscover')}
              </p>
            </div>

            {/* Right - Hero Image with badges */}
            <div className="hc-scroll-reveal hc-delay-2 relative flex justify-center lg:justify-end">
              <div className="relative">
                <img
                  src="/assets/hero_honey_jar.jpg"
                  alt="Pure raw honey jar with honey dipper"
                  className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
                />
                {/* 100% Traceable Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg border border-stone-200/50 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#3D5A3A]" />
                  <div>
                    <p className="text-xs font-bold text-stone-900">{t('landingBadgeTraceable')}</p>
                    <p className="text-[10px] text-stone-500">{t('landingBadgeTraceableSub')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURE STRIP ─── */}
      <section id="features" className="bg-white border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: <Leaf className="w-7 h-7" />, title: t('landingFeatureSource'), desc: t('landingFeatureSourceDesc') },
              { icon: <ShieldCheck className="w-7 h-7" />, title: t('landingFeaturePure'), desc: t('landingFeaturePureDesc') },
              { icon: <Users className="w-7 h-7" />, title: t('landingFeatureSupport'), desc: t('landingFeatureSupportDesc') },
              { icon: <Heart className="w-7 h-7" />, title: t('landingFeatureHealthy'), desc: t('landingFeatureHealthyDesc') },
            ].map((feature, i) => (
              <div key={i} className={`hc-scroll-reveal hc-delay-${i + 1} text-center space-y-3`}>
                <div className="mx-auto w-14 h-14 rounded-full bg-[#F0F5EE] flex items-center justify-center text-[#3D5A3A]">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-stone-900 text-sm">{feature.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="hc-scroll-reveal text-center space-y-3 mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400">
              {t('landingHowTag')}
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('landingHowTitle')}
            </h2>
            <p className="text-sm text-stone-500 max-w-md mx-auto">
              {t('landingHowDesc')}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-6">
            {[
              { num: 1, img: '/assets/step_hive.jpg', title: t('landingStep1Title'), desc: t('landingStep1Desc') },
              { num: 2, img: '/assets/step_beekeepers.jpg', title: t('landingStep2Title'), desc: t('landingStep2Desc') },
              { num: 3, img: '/assets/step_processing.jpg', title: t('landingStep3Title'), desc: t('landingStep3Desc') },
              { num: 4, img: '/assets/step_qr_trace.jpg', title: t('landingStep4Title'), desc: t('landingStep4Desc') },
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                {/* Arrow between steps (desktop only) */}
                {i > 0 && (
                  <div className="hidden md:flex items-center text-stone-300">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
                <div className={`hc-scroll-reveal hc-delay-${i + 1} flex flex-col items-center text-center space-y-3 max-w-[180px]`}>
                  {/* Circular image with step number */}
                  <div className="relative">
                    <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Step number badge */}
                    <div className="absolute -top-1 -left-1 w-8 h-8 rounded-full bg-[#3D5A3A] text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white">
                      {step.num}
                    </div>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">{step.title}</h3>
                  <p className="text-xs text-stone-500 leading-relaxed">{step.desc}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MORE THAN HONEY + TRACE ─── */}
      <section id="mission" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[420px]">
            {/* Left - Mission with landscape background */}
            <div className="hc-scroll-reveal relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/landscape_nature.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
              <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-end h-full min-h-[380px]">
                <h2
                  className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('landingMissionTitle')}
                </h2>
                <p className="text-sm text-white/85 leading-relaxed mb-6 max-w-md">
                  {t('landingMissionDesc')}
                </p>
                <div>
                  <button
                    onClick={onNavigateLogin}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-stone-900 text-sm font-semibold hover:bg-stone-100 transition shadow-sm"
                  >
                    {t('landingMissionCta')}
                  </button>
                </div>
              </div>
            </div>

            {/* Right - Trace Your Honey */}
            <div id="trace" className="hc-scroll-reveal hc-delay-2 bg-[#F5F0E8] rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none p-8 sm:p-12 flex flex-col justify-center">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-stone-400 mb-3">
                {t('landingTraceTag')}
              </p>
              <h2
                className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('landingTraceTitle')}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed mb-6 max-w-sm">
                {t('landingTraceDesc')}
              </p>

              <form onSubmit={handleTrace} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={traceInput}
                  onChange={(e) => setTraceInput(e.target.value)}
                  placeholder={t('landingTracePlaceholder')}
                  className="flex-1 h-12 bg-white border border-stone-300 focus:border-[#3D5A3A] rounded-lg px-4 text-sm text-stone-900 placeholder-stone-400 outline-none transition shadow-xs"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-lg bg-[#3D5A3A] hover:bg-[#2E4A2E] text-white text-sm font-semibold transition shadow-sm shrink-0"
                >
                  {t('landingTraceBtn')}
                </button>
              </form>

              <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
                <ShieldCheck className="w-4 h-4 text-[#3D5A3A]" />
                <span>{t('landingTraceNote')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="footer" className="bg-[#F5F0E8] border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8">
            {/* Logo & Tagline */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#3D5A3A] flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-lg text-stone-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {t('appName')}
                </span>
              </div>
              <p className="text-xs text-stone-500 italic pl-10">{t('footerTagline')}</p>
            </div>

            {/* Footer Nav Links */}
            <div className="flex flex-wrap gap-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm text-stone-600 hover:text-stone-900 font-medium transition"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a href="#" className="w-9 h-9 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-600 hover:bg-stone-300/50 transition" aria-label="Instagram">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-9 h-9 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-600 hover:bg-stone-300/50 transition" aria-label="LinkedIn">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-9 h-9 rounded-full bg-stone-200/50 flex items-center justify-center text-stone-600 hover:bg-stone-300/50 transition" aria-label="YouTube">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-stone-300/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-stone-500">{t('footerRights')}</p>
            <div className="flex items-center gap-6 text-xs text-stone-500">
              <a href="#" className="hover:text-stone-700 transition">{t('footerPrivacy')}</a>
              <a href="#" className="hover:text-stone-700 transition">{t('footerTerms')}</a>
              <a href="#" className="hover:text-stone-700 transition">{t('footerSitemap')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
