/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ShoppingCart, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sun,
  Moon,
  Maximize2,
  Share2,
  Mail,
  ExternalLink,
  DollarSign,
  Package,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// --- Types ---

interface MetricProps {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  tooltip: string;
}

// --- Components ---

const MetricCard = ({ label, value, change, icon, tooltip }: MetricProps) => {
  const isPositive = change >= 0;
  return (
    <div className="flex flex-col p-4 neumorphic-card group hover:border-emerald-500/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
          {label}
          <div className="relative group/tooltip">
            <Info className="w-3 h-3 cursor-help opacity-50 hover:opacity-100" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none">
              {tooltip}
            </div>
          </div>
        </span>
        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className={cn(
          "flex items-center text-xs font-bold px-2 py-0.5 rounded-full",
          isPositive 
            ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
            : "text-rose-600 bg-rose-50 dark:bg-rose-900/20"
        )}>
          {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
};

const SliderInput = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  prefix = "", 
  suffix = "" 
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min: number; 
  max: number; 
  step?: number;
  prefix?: string;
  suffix?: string;
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="px-3 py-1 neumorphic-inset text-sm font-bold text-emerald-600 dark:text-emerald-400">
        {prefix}{value}{suffix}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
    />
  </div>
);

const FormulaTooltip = ({ formula, description, align = "center" }: { formula: string; description?: string; align?: "left" | "center" | "right" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-1">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-400 hover:text-emerald-500 transition-colors focus:outline-none"
      >
        <Info className="w-3.5 h-3.5 cursor-help" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className={cn(
              "absolute bottom-full mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl z-[100] border border-slate-700 pointer-events-none",
              align === "center" && "left-1/2 -translate-x-1/2",
              align === "left" && "left-0",
              align === "right" && "right-0"
            )}
          >
            <div className="space-y-2">
              <div>
                <p className="font-bold text-emerald-400 mb-1 uppercase tracking-tighter text-[10px]">Calculation Formula</p>
                <p className="font-mono bg-black/30 p-2 rounded border border-white/5 break-words">
                  {formula}
                </p>
              </div>
              {description && (
                <div className="pt-2 border-t border-white/10 text-slate-400 italic">
                  {description}
                </div>
              )}
            </div>
            {/* Arrow */}
            <div className={cn(
              "absolute top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 dark:border-t-slate-800",
              align === "center" && "left-1/2 -translate-x-1/2",
              align === "left" && "left-3",
              align === "right" && "right-3"
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<{
    winner: 'A' | 'B';
    confidence: number;
    lift: number;
    days: number;
  } | null>(null);
  
  // Inputs
  const [variantName, setVariantName] = useState("Furniture: Cabinets & Storage");
  const [variantId, setVariantId] = useState("18269912203329");
  const [currentPrice, setCurrentPrice] = useState(551.00);
  const [suggestedPrice, setSuggestedPrice] = useState(440.80);
  const [cogs, setCogs] = useState(280);
  
  // Baseline Performance (Current)
  const [baseImpressions, setBaseImpressions] = useState(10000);
  const [baseCTR, setBaseCTR] = useState(2.5); // %
  const [baseCVR, setBaseCVR] = useState(3.2); // %

  // Google's Projected % Changes
  const [projImpChange, setProjImpChange] = useState(3.45);
  const [projClickChange, setProjClickChange] = useState(6.25);
  const [projConvChange, setProjConvChange] = useState(42.77);

  const [targetMargin, setTargetMargin] = useState(20);

  // Calculations
  const calculations = useMemo(() => {
    // Current State
    const currentClicks = (baseImpressions * baseCTR) / 100;
    const currentOrders = (currentClicks * baseCVR) / 100;
    const currentRevenue = currentOrders * currentPrice;
    const currentProfit = currentOrders * (currentPrice - cogs);
    const currentMargin = ((currentPrice - cogs) / currentPrice) * 100;

    // Suggested State (Based on Google's % changes)
    const suggestedImpressions = baseImpressions * (1 + projImpChange / 100);
    const suggestedClicks = currentClicks * (1 + projClickChange / 100);
    const suggestedOrders = currentOrders * (1 + projConvChange / 100);
    const suggestedRevenue = suggestedOrders * suggestedPrice;
    const suggestedProfit = suggestedOrders * (suggestedPrice - cogs);
    const suggestedMargin = ((suggestedPrice - cogs) / suggestedPrice) * 100;

    const profitChange = suggestedProfit - currentProfit;
    const revenueChange = suggestedRevenue - currentRevenue;
    const roiUplift = currentProfit !== 0 ? (profitChange / currentProfit) * 100 : 0;
    
    // New CTR/CVR based on projections
    const suggestedCTR = (suggestedClicks / suggestedImpressions) * 100;
    const suggestedCVR = (suggestedOrders / suggestedClicks) * 100;

    // Profit-Neutral Price Calculation
    // We want: suggestedOrders * (neutralPrice - cogs) = currentProfit
    // neutralPrice = (currentProfit / suggestedOrders) + cogs
    const profitNeutralPrice = suggestedOrders > 0 ? (currentProfit / suggestedOrders) + cogs : currentPrice;

    let decision: 'Accept' | 'Reject' | 'Test' = 'Test';
    if (profitChange > 0 && suggestedMargin >= targetMargin) decision = 'Accept';
    else if (profitChange < 0) decision = 'Reject';

    return {
      currentOrders,
      suggestedOrders,
      currentProfit,
      suggestedProfit,
      profitChange,
      revenueChange,
      roiUplift,
      currentMargin,
      suggestedMargin,
      suggestedCTR,
      suggestedCVR,
      currentRevenue,
      suggestedRevenue,
      profitNeutralPrice,
      decision
    };
  }, [currentPrice, suggestedPrice, cogs, baseImpressions, baseCTR, baseCVR, projImpChange, projClickChange, projConvChange, targetMargin]);

  const chartData = [
    { name: 'Current', profit: calculations.currentDailyProfit },
    { name: 'Suggested', profit: calculations.suggestedDailyProfit },
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl neumorphic-card overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-emerald-600 dark:bg-emerald-700 p-4 md:p-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Sale Price Suggestion</h1>
              <p className="text-xs opacity-80 font-medium">Presented by XYZ AI Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Inputs & Metrics */}
          <div className="lg:col-span-7 space-y-8">
            {/* Product Top Info */}
            <div className="flex gap-4 items-start">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 shrink-0">
                <Package className="w-8 h-8 text-slate-400" />
              </div>
              <div className="space-y-2 flex-1">
                <input 
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                  className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 rounded px-1"
                />
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">
                  ID: {variantId}
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Current</p>
                    <div className="flex items-center text-xl font-bold text-slate-400 line-through">
                      <DollarSign className="w-4 h-4" />
                      {currentPrice.toFixed(2)}
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 mt-4" />
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-emerald-500">Suggested</p>
                    <div className="flex items-center text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      <DollarSign className="w-5 h-5" />
                      <input 
                        type="number"
                        value={suggestedPrice}
                        onChange={(e) => setSuggestedPrice(Number(e.target.value))}
                        className="w-24 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google AI Projections</h3>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                  <Zap className="w-3 h-3 fill-current" />
                  Effectiveness: High
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 neumorphic-card group relative">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Impressions</p>
                    <FormulaTooltip 
                      formula="Base Impressions × (1 + Projection %)" 
                      description="Total projected visibility in search results."
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">+</span>
                    <input 
                      type="number" 
                      value={projImpChange} 
                      onChange={(e) => setProjImpChange(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div className="p-4 neumorphic-card group relative">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Clicks</p>
                    <FormulaTooltip 
                      formula="(Base Imp × Base CTR) × (1 + Projection %)" 
                      description="Total projected visits to your product page."
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">+</span>
                    <input 
                      type="number" 
                      value={projClickChange} 
                      onChange={(e) => setProjClickChange(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div className="p-4 neumorphic-card group relative">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Conversions</p>
                    <FormulaTooltip 
                      formula="(Base Orders) × (1 + Projection %)" 
                      description="Total projected sales volume increase."
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-500 font-bold">+</span>
                    <input 
                      type="number" 
                      value={projConvChange} 
                      onChange={(e) => setProjConvChange(Number(e.target.value))}
                      className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 p-6 neumorphic-inset">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-500" />
                  Cost & Target
                </h3>
                <div className="space-y-6">
                  <SliderInput 
                    label="COGS per unit" 
                    value={cogs} 
                    onChange={setCogs} 
                    min={1} 
                    max={1000} 
                    prefix="$" 
                  />
                  <SliderInput 
                    label="Target Margin" 
                    value={targetMargin} 
                    onChange={setTargetMargin} 
                    min={0} 
                    max={100} 
                    suffix="%" 
                  />
                </div>
              </div>

              <div className="space-y-6 p-6 neumorphic-inset">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Baseline Performance
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Monthly Impressions</label>
                      <FormulaTooltip 
                        formula="Baseline Traffic" 
                        description="Your current monthly traffic volume before any price changes."
                        align="right"
                      />
                    </div>
                    <input 
                      type="number" 
                      value={baseImpressions} 
                      onChange={(e) => setBaseImpressions(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm font-bold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Current CTR (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={baseCTR} 
                        onChange={(e) => setBaseCTR(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Current CVR (%)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={baseCVR} 
                        onChange={(e) => setBaseCVR(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-sm font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Analysis & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Output Dashboard */}
            <div className="p-6 neumorphic-card bg-slate-900 dark:bg-black text-white space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Projected Daily Profit</h3>
                    <FormulaTooltip 
                      formula="((Monthly Orders / 30) × (Price - COGS))" 
                      description="Where Monthly Orders = (Impressions × CTR × CVR)"
                      align="left"
                    />
                  </div>
                  <div className="text-3xl font-black mt-1 flex items-baseline gap-2">
                    ${(calculations.suggestedProfit / 30).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className={cn(
                      "text-sm font-bold",
                      calculations.profitChange >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      ({calculations.profitChange >= 0 ? '+' : ''}${(calculations.profitChange / 30).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                    </span>
                  </div>
                  <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Net Monthly Impact</p>
                    <p className={cn(
                      "text-lg font-black",
                      calculations.profitChange >= 0 ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {calculations.profitChange >= 0 ? '+' : ''}${Math.abs(calculations.profitChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-1 italic">
                    Calculated as: (Daily Volume × Unit Margin)
                  </p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1",
                  calculations.decision === 'Accept' ? "bg-emerald-500 text-white" : 
                  calculations.decision === 'Reject' ? "bg-rose-500 text-white" : "bg-amber-500 text-white"
                )}>
                  {calculations.decision === 'Accept' && <CheckCircle2 className="w-3 h-3" />}
                  {calculations.decision === 'Reject' && <XCircle className="w-3 h-3" />}
                  {calculations.decision === 'Test' && <AlertCircle className="w-3 h-3" />}
                  {calculations.decision === 'Accept' ? 'Strong Accept' : calculations.decision === 'Reject' ? 'Reject' : 'Test Recommended'}
                </div>
              </div>

              {/* Chart */}
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Current', profit: calculations.currentProfit / 30 },
                    { name: 'Suggested', profit: calculations.suggestedProfit / 30 },
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Daily Profit']}
                    />
                    <Bar dataKey="profit" radius={[4, 4, 0, 0]}>
                      <Cell fill="#64748b" />
                      <Cell fill={calculations.profitChange >= 0 ? '#10b981' : '#f43f5e'} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Projected Revenue</p>
                    <FormulaTooltip 
                      formula="Orders × Price" 
                      description="Total monthly sales volume."
                      align="left"
                    />
                  </div>
                  <p className="text-xl font-black text-white">
                    ${calculations.suggestedRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </p>
                  <p className={cn(
                    "text-[10px] font-bold",
                    calculations.revenueChange >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {calculations.revenueChange >= 0 ? '↑' : '↓'} {Math.abs((calculations.revenueChange / calculations.currentRevenue) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">ROI Score</p>
                    <FormulaTooltip 
                      formula="((New Profit - Old Profit) / Old Profit) × 100" 
                      description="Measures the percentage growth in total profit efficiency."
                      align="right"
                    />
                  </div>
                  <p className={cn(
                    "text-xl font-black",
                    calculations.roiUplift >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}>
                    {calculations.roiUplift.toFixed(1)}%
                  </p>
                  <p className="text-[9px] text-slate-500 mt-0.5 italic">
                    Profit Growth %
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">New CTR</p>
                  <p className="text-sm font-bold text-white">{calculations.suggestedCTR.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">New CVR</p>
                  <p className="text-sm font-bold text-white">{calculations.suggestedCVR.toFixed(2)}%</p>
                </div>
              </div>
            </div>

            {/* Proof Panel */}
            <div className="neumorphic-card overflow-hidden">
              <button 
                onClick={() => setIsProofOpen(!isProofOpen)}
                className="w-full p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Proof & Data Insights
                </div>
                {isProofOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <AnimatePresence>
                {isProofOpen && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <div className={cn(
                        "flex gap-3 p-3 rounded-xl border",
                        calculations.profitChange >= 0 
                          ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20" 
                          : "bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20"
                      )}>
                        {calculations.profitChange >= 0 ? <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0" /> : <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />}
                        <p>
                          Based on your current baseline, this strategy is projected to {calculations.profitChange >= 0 ? 'increase' : 'decrease'} your monthly profit by <span className={cn("font-bold", calculations.profitChange >= 0 ? "text-emerald-600" : "text-rose-600")}>${Math.abs(calculations.profitChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>.
                        </p>
                      </div>
                      <div className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <Info className="w-4 h-4 text-slate-400 shrink-0" />
                        <p>
                          Your conversion volume is expected to grow from <span className="font-bold text-slate-900 dark:text-white">{calculations.currentOrders.toFixed(1)}</span> to <span className="font-bold text-slate-900 dark:text-white">{calculations.suggestedOrders.toFixed(1)}</span> orders per month.
                        </p>
                      </div>
                      <div className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <Target className="w-4 h-4 text-slate-400 shrink-0" />
                        <p>
                          The new margin of <span className="font-bold text-slate-900 dark:text-white">{calculations.suggestedMargin.toFixed(1)}%</span> {calculations.suggestedMargin >= targetMargin ? 'exceeds' : 'falls below'} your target of <span className="font-bold text-slate-900 dark:text-white">{targetMargin}%</span>.
                        </p>
                      </div>

                      <div className="space-y-4 pt-2">
                        {/* AI Optimized "Safety" Price */}
                        <div className="p-4 bg-slate-900 dark:bg-black rounded-2xl border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Recommended "Safety" Price</p>
                            <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold rounded-full border border-emerald-500/20">BREAK-EVEN</div>
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white">${calculations.profitNeutralPrice.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              ({((calculations.profitNeutralPrice - currentPrice) / currentPrice * 100).toFixed(1)}% vs Current)
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            Price at <span className="text-white font-bold">${calculations.profitNeutralPrice.toFixed(2)}</span> to capture growth without losing current profit.
                          </p>
                        </div>

                        {/* Dynamic Risk & Solution Cards */}
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Risk & Solution Analysis</h4>
                          
                          {/* Risk 1: Margin */}
                          <div className={cn(
                            "p-3 rounded-xl border transition-all",
                            calculations.suggestedMargin < targetMargin 
                              ? "bg-rose-500/5 border-rose-500/20" 
                              : "bg-emerald-500/5 border-emerald-500/20"
                          )}>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                                {calculations.suggestedMargin < targetMargin ? "⚠️ Margin Warning" : "✅ Margin Healthy"}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500">{calculations.suggestedMargin.toFixed(1)}%</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {calculations.suggestedMargin < targetMargin 
                                ? `Unit margin is ${Math.abs(targetMargin - calculations.suggestedMargin).toFixed(1)}% below target. Solution: Reduce COGS or bundle products to increase AOV.`
                                : "Margin exceeds target. Solution: Reinvest surplus profit into aggressive ad scaling."}
                            </p>
                          </div>

                          {/* Risk 2: Profitability */}
                          <div className={cn(
                            "p-3 rounded-xl border transition-all",
                            calculations.profitChange < 0 
                              ? "bg-rose-500/5 border-rose-500/20" 
                              : "bg-emerald-500/5 border-emerald-500/20"
                          )}>
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                                {calculations.profitChange < 0 ? "❌ Profit Leakage" : "🚀 Profit Growth"}
                              </p>
                              <span className="text-[10px] font-mono text-slate-500">
                                {calculations.profitChange >= 0 ? '+' : '-'}${Math.abs(calculations.profitChange / 30).toFixed(2)}/day
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {calculations.profitChange < 0 
                                ? `Volume lift doesn't cover price drop. Solution: Test a smaller discount (try $${((currentPrice + suggestedPrice) / 2).toFixed(2)}) to find the sweet spot.`
                                : `Net gain of $${Math.abs(calculations.profitChange).toLocaleString()} monthly. Solution: Apply immediately to capture early-mover advantage.`}
                            </p>
                          </div>

                          {/* Risk 3: Volume vs CPA */}
                          <div className="p-3 bg-slate-500/5 border border-slate-500/10 rounded-xl">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">📊 Scale Efficiency</p>
                              <span className="text-[10px] font-mono text-slate-500">+{projConvChange}% Orders</span>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {projConvChange > 30 
                                ? "High volume growth detected. Solution: Ensure inventory levels can handle the surge to avoid stockouts."
                                : "Moderate growth. Solution: Pair price drop with a 'Limited Time' tag to boost urgency and conversion."}
                            </p>
                          </div>
                        </div>

                        {/* Final Verdict - Simplified */}
                        <div className={cn(
                          "p-4 rounded-2xl text-center border-2",
                          calculations.decision === 'Accept' ? "bg-emerald-600 text-white border-emerald-400" :
                          calculations.decision === 'Reject' ? "bg-rose-600 text-white border-rose-400" :
                          "bg-amber-500 text-white border-amber-300"
                        )}>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Final Verdict</p>
                          <p className="text-sm font-bold">
                            {calculations.decision === 'Accept' ? "STRONGLY RECOMMENDED" : 
                             calculations.decision === 'Reject' ? "NOT RECOMMENDED" : "A/B TEST REQUIRED"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <AnimatePresence mode="wait">
                {!isRejecting ? (
                  <motion.div 
                    key="actions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-3"
                  >
                    <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                      <ShoppingCart className="w-5 h-5" />
                      Apply to Shopify
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => {
                          setIsSimulating(true);
                          setSimulationResult(null);
                          // Simulate a 3-second test
                          setTimeout(() => {
                            setSimulationResult({
                              winner: calculations.profitChange >= 0 ? 'B' : 'A',
                              confidence: 95 + Math.random() * 4,
                              lift: Math.abs(calculations.roiUplift) * (0.8 + Math.random() * 0.4),
                              days: 14
                            });
                            setIsSimulating(false);
                          }, 2000);
                        }}
                        disabled={isSimulating}
                        className="py-3 px-4 neumorphic-card hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        {isSimulating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          >
                            <Zap className="w-4 h-4 text-amber-500" />
                          </motion.div>
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {isSimulating ? "Simulating..." : "A/B Test"}
                      </button>
                      <button 
                        onClick={() => setIsRejecting(true)}
                        className="py-3 px-4 neumorphic-card hover:bg-rose-50 dark:hover:bg-rose-900/10 text-sm font-bold text-rose-600 flex items-center justify-center gap-2 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>

                    {/* Simulation Result Overlay/Section */}
                    <AnimatePresence>
                      {simulationResult && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 neumorphic-inset bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30 space-y-3"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest">Simulation Results (14-Day Forecast)</h4>
                            <button onClick={() => setSimulationResult(null)} className="text-slate-400 hover:text-slate-600">
                              <XCircle className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-amber-900/20">
                              <p className="text-[9px] text-slate-400 uppercase font-bold">Winning Variant</p>
                              <p className="text-lg font-black text-slate-900 dark:text-white">
                                Variant {simulationResult.winner} 
                                <span className="text-[10px] ml-1 text-emerald-500">
                                  ({simulationResult.winner === 'A' ? 'Current' : 'Suggested'})
                                </span>
                              </p>
                            </div>
                            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-100 dark:border-amber-900/20">
                              <p className="text-[9px] text-slate-400 uppercase font-bold">Confidence</p>
                              <p className="text-lg font-black text-emerald-500">{simulationResult.confidence.toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Projected Profit Lift: {simulationResult.lift.toFixed(1)}%
                            </p>
                            <p className="text-[9px] text-slate-500 mt-1">
                              Based on simulated traffic of {(baseImpressions / 2).toLocaleString()} users per variant.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="reject-form"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 neumorphic-inset bg-rose-50/50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/30 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase text-rose-600 dark:text-rose-400 tracking-widest">Confirm Rejection</h4>
                      <button 
                        onClick={() => setIsRejecting(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-rose-100 dark:border-rose-900/20 space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Profit Impact Detail</p>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400">Monthly Loss/Gain</p>
                          <p className={cn(
                            "text-lg font-black",
                            calculations.profitChange >= 0 ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {calculations.profitChange >= 0 ? '+' : ''}${Math.abs(calculations.profitChange).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] text-slate-400">Margin Change</p>
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                            {calculations.currentMargin.toFixed(1)}% → {calculations.suggestedMargin.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Reason for Rejection</label>
                      <textarea 
                        autoFocus
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g., Margin too low, Brand positioning..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none h-20"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          console.log("Rejected with reason:", rejectReason);
                          setIsRejecting(false);
                          setRejectReason("");
                        }}
                        className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all"
                      >
                        Confirm & Log
                      </button>
                      <button 
                        onClick={() => setIsRejecting(false)}
                        className="px-4 py-3 neumorphic-card text-xs font-bold text-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center px-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex gap-4">
                <button className="text-slate-400 hover:text-emerald-500 transition-colors"><Mail className="w-4 h-4" /></button>
                <button className="text-slate-400 hover:text-emerald-500 transition-colors"><Share2 className="w-4 h-4" /></button>
              </div>
              <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                View Variant Details
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
