import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Award, ShieldCheck, Activity, ArrowRight, Zap, TrendingDown } from 'lucide-react';

interface FeatureCardProps {
  index: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  hoveredCard: number | null;
  setHoveredCard: (index: number | null) => void;
  enableHoverEffects: boolean;
  onClick?: () => void;
}

function FeatureCard({
  index,
  title,
  description,
  icon,
  hoveredCard,
  setHoveredCard,
  enableHoverEffects,
  onClick,
}: FeatureCardProps) {
  const isHovered = enableHoverEffects && hoveredCard === index;

  return (
    <div
      className={`relative p-6 sm:p-8 rounded-2xl bg-white/90 backdrop-blur-md border border-white/50 shadow-xl transition-all duration-300 cursor-pointer ${
        isHovered ? '-translate-y-2 shadow-2xl scale-[1.02]' : 'hover:-translate-y-1 hover:shadow-lg'
      }`}
      onMouseEnter={() => enableHoverEffects && setHoveredCard(index)}
      onMouseLeave={() => enableHoverEffects && setHoveredCard(null)}
      onClick={onClick}
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-teal-500/20 border border-blue-200/50 flex items-center justify-center mb-5 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
        Explore <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </div>
  );
}

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [enableHoverEffects, setEnableHoverEffects] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine) and (min-width: 1024px)');
    const updateHoverState = () => setEnableHoverEffects(mediaQuery.matches);
    updateHoverState();

    if (typeof mediaQuery.addEventListener === 'function') {
      const listener = (event: MediaQueryListEvent) => setEnableHoverEffects(event.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(219,234,254,0.92), rgba(191,219,254,0.88)), url('/bg4.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        backgroundRepeat: 'no-repeat',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* City Skyline Background */}
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-t from-blue-200 to-transparent hidden md:block">
          <div className="absolute bottom-0 left-0 w-full h-16 sm:h-24 bg-blue-300 opacity-30">
            <div className="absolute bottom-0 left-0 w-6 sm:w-8 h-12 sm:h-16 bg-blue-400"></div>
            <div className="absolute bottom-0 left-12 sm:left-12 w-5 sm:w-6 h-16 sm:h-20 bg-blue-400"></div>
            <div className="absolute bottom-0 left-24 sm:left-24 w-8 sm:w-10 h-10 sm:h-12 bg-blue-400"></div>
            <div className="absolute bottom-0 left-40 sm:left-40 w-6 sm:w-7 h-16 sm:h-20 bg-blue-400"></div>
            <div className="absolute bottom-0 left-56 sm:left-56 w-7 sm:w-9 h-12 sm:h-14 bg-blue-400"></div>
            <div className="absolute bottom-0 left-72 sm:left-72 w-5 sm:w-6 h-20 sm:h-24 bg-blue-400"></div>
            <div className="absolute bottom-0 left-84 sm:left-84 w-6 sm:w-8 h-12 sm:h-16 bg-blue-400"></div>
            <div className="absolute bottom-0 left-96 sm:left-96 w-4 sm:w-5 h-16 sm:h-20 bg-blue-400"></div>
            <div className="absolute bottom-0 right-0 w-10 sm:w-12 h-8 sm:h-10 bg-blue-400"></div>
          </div>
        </div>

        {/* Animated Train in background */}
        <div
          className="absolute bottom-6 sm:bottom-8 w-24 sm:w-32 h-6 sm:h-8 bg-gray-300 rounded-lg opacity-40 transition-transform duration-1000 hidden md:block"
          style={{
            left: `${25 + scrollY * 0.1}%`,
            transform: `translateX(${Math.sin(scrollY * 0.01) * 20}px)`,
          }}
        >
          <div className="absolute top-0.5 sm:top-1 left-1.5 sm:left-2 w-4 sm:w-6 h-4 sm:h-6 bg-gray-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-0.5 sm:top-1 right-1.5 sm:right-2 w-4 sm:w-6 h-4 sm:h-6 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="relative min-h-[90vh] w-full flex items-center justify-center px-4 sm:px-10 py-12">
        <main
          ref={heroRef}
          className="relative z-10 w-full max-w-5xl mx-auto text-center"
          style={{
            transform: `translateY(calc(-20px + ${scrollY * 0.2}px))`,
          }}
        >
          {/* SIH26028 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 shadow-md border border-blue-200 text-xs sm:text-sm font-bold text-blue-900 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Ministry of Railways · SIH26028 · Dynamic Coaching Train ETA</span>
          </div>

          {/* HERO TITLE */}
          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.12] tracking-tight text-white mb-6 drop-shadow-[0_4px_14px_rgba(0,0,0,0.55)] cursor-default"
            style={{
              letterSpacing: '0.02em',
            }}
          >
            <span className="block whitespace-nowrap hover:scale-105 transition-transform duration-300">
              RailPulse-X
            </span>
            <span className="block text-2xl sm:text-4xl md:text-5xl font-bold text-blue-950 drop-shadow-sm mt-2">
              Dynamic Forecast of Train Arrival (ETA)
            </span>
          </h1>

          <p className="text-base sm:text-xl text-blue-900 font-medium max-w-3xl mx-auto mb-8 leading-relaxed">
            The arrival time shown for a running train is usually just timetable plus current delay, which is why it keeps being wrong. <strong>RailPulse-X</strong> predicts arrival as an adaptive distribution [P10 - P90] learning from sectional history, preceding train headways, and built-in timetable recovery allowances.
          </p>

          {/* Centered Buttons with Original Vibrant Colors */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              className="inline-flex items-center justify-center gap-3 rounded-full bg-green-500 px-8 py-3.5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-green-600 hover:shadow-2xl hover:shadow-green-500/50 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => navigate('/app/eta')}
            >
              <Clock className="w-5 h-5" />
              Dynamic ETA Studio
            </button>

            <button
              className="inline-flex items-center justify-center gap-3 rounded-full bg-orange-500 px-8 py-3.5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => navigate('/app/benchmark')}
            >
              <Award className="w-5 h-5" />
              Held-Out Backtest Proof (-66% MAE)
            </button>

            <button
              className="inline-flex items-center justify-center gap-3 rounded-full bg-blue-600 px-8 py-3.5 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl hover:shadow-blue-600/50 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={() => navigate('/app/dashboard')}
            >
              <Activity className="w-5 h-5" />
              Operations Dashboard
            </button>
          </div>

          {/* Live Metric Ribbon with Original Bright Styling */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white/85 backdrop-blur border border-blue-200 shadow-md">
              <div className="text-3xl font-black text-blue-900 font-mono">-66.0%</div>
              <div className="text-xs font-bold text-gray-700 mt-1">MAE vs Baseline</div>
              <div className="text-[11px] text-gray-500">7.4m vs 21.8m NTES</div>
            </div>

            <div className="p-4 rounded-xl bg-white/85 backdrop-blur border border-blue-200 shadow-md">
              <div className="text-3xl font-black text-emerald-600 font-mono">82.4%</div>
              <div className="text-xs font-bold text-gray-700 mt-1">Quantile Coverage</div>
              <div className="text-[11px] text-gray-500">Calibrated [P10-P90]</div>
            </div>

            <div className="p-4 rounded-xl bg-white/85 backdrop-blur border border-blue-200 shadow-md">
              <div className="text-3xl font-black text-purple-700 font-mono">&lt; 35ms</div>
              <div className="text-xs font-bold text-gray-700 mt-1">FastAPI Serving</div>
              <div className="text-[11px] text-gray-500">Network Scale Ready</div>
            </div>

            <div className="p-4 rounded-xl bg-white/85 backdrop-blur border border-blue-200 shadow-md">
              <div className="text-3xl font-black text-amber-600 font-mono">6,840</div>
              <div className="text-xs font-bold text-gray-700 mt-1">Arrival Checkpoints</div>
              <div className="text-[11px] text-gray-500">450 Held-Out Runs</div>
            </div>
          </div>
        </main>
      </div>

      {/* Features Section with Original Colors */}
      <section
        id="features"
        className="relative z-10 px-4 py-12 bg-gradient-to-br from-blue-50 via-blue-50 to-teal-50 backdrop-blur-sm sm:px-6 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block mb-3 sm:mb-4">
              <span className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm sm:text-base font-bold rounded-full shadow-lg">
                ✨ RAILPULSE-X CORE CAPABILITIES (SIH26028)
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 mb-3 sm:mb-4">
              Intelligent Train Arrival Forecasting
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-teal-600 mx-auto rounded-full mb-4"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Grounding delay predictions in real running behavior, preceding traffic headways, and timetable slack recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <FeatureCard
              index={0}
              title="Dynamic Quantile Forecasting"
              description="Predicts arrival as an uncertainty distribution (P10, P50, P90) rather than a fragile single point."
              icon={<Clock className="w-8 h-8 text-blue-600" />}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              enableHoverEffects={enableHoverEffects}
              onClick={() => navigate('/app/eta')}
            />
            <FeatureCard
              index={1}
              title="Held-Out Backtest Proof"
              description="Beats the official schedule-plus-delay baseline by 66.0% (7.4m vs 21.8m MAE) on 450 verified train runs."
              icon={<Award className="w-8 h-8 text-amber-500" />}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              enableHoverEffects={enableHoverEffects}
              onClick={() => navigate('/app/benchmark')}
            />
            <FeatureCard
              index={2}
              title="Preceding Headway & Cascades"
              description="Models yellow/double-yellow signal checks and cascading delay propagation behind slower preceding trains."
              icon={<TrendingDown className="w-8 h-8 text-purple-600" />}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              enableHoverEffects={enableHoverEffects}
              onClick={() => navigate('/app/eta')}
            />
            <FeatureCard
              index={3}
              title="Timetable Recovery Allowance"
              description="Accurately models built-in engineering slack before junctions, capturing how trains absorb delay."
              icon={<ShieldCheck className="w-8 h-8 text-emerald-600" />}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              enableHoverEffects={enableHoverEffects}
              onClick={() => navigate('/app/eta')}
            />
            <FeatureCard
              index={4}
              title="Graceful Telemetry Degradation"
              description="Under patchy GPS signals, confidence bands expand realistically via drift scaling without pipeline crashes."
              icon={<Zap className="w-8 h-8 text-orange-500" />}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              enableHoverEffects={enableHoverEffects}
              onClick={() => navigate('/app/eta')}
            />
            <FeatureCard
              index={5}
              title="What-If Disruption Simulator"
              description="Section controllers can inject delays, signal failures, or weather slowdowns to see cascading ripple effects."
              icon={<Activity className="w-8 h-8 text-teal-600" />}
              hoveredCard={hoveredCard}
              setHoveredCard={setHoveredCard}
              enableHoverEffects={enableHoverEffects}
              onClick={() => navigate('/app/simulation')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
