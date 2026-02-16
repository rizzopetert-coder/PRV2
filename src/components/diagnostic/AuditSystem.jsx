"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import { calculateRealitySummary, INDUSTRY_BENCHMARKS } from '../../lib/diagnostic-logic';
import { useDiagnosticEngine } from '../../hooks/useDiagnosticEngine';
import ResultsLedger from './ResultsLedger';
import IdentityAnchor from './IdentityAnchor';

/**
 * AuditSystem // Principal Resolution
 * Refactored: Internalized Context Anchors and 4-Point Data Harvest.
 * Tenet: Absolute Candor.
 */
export default function AuditSystem() {
  const [step, setStep] = useState(-1); 
  const [data, setData] = useState({
    payroll: '', 
    industry: 'TECH',
    totalCompanyHeadcount: '',
    revenueBest: '', 
    revenueWorst: '', 
    meetingHours: 5, 
    stalledProjectCapital: '',
    isUnsurePayroll: false,
    isUnsureRevenue: false,
    personnel: [
      { id: 'EXECUTIVE', label: 'Executives & Owners', count: 0 },
      { id: 'MANAGER', label: 'Managers & Directors', count: 0 },
      { id: 'PROFESSIONAL', label: 'Staff & Specialists', count: 0 }
    ]
  });
  const [result, setResult] = useState(null);
  const [dispatchUrl, setDispatchUrl] = useState(''); // Anchor for Dubsado Handshake

  const { liveInsight, burnIntensity } = useDiagnosticEngine(step, data);

  const formatCurrency = (val) => {
    if (!val || val === 'UNSURE') return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
    }).format(val);
  };

  const handleNumericInput = (field, rawValue) => {
    const numericValue = rawValue.replace(/[^0-9]/g, "");
    setData({ ...data, [field]: numericValue, [`isUnsure${field.charAt(0).toUpperCase() + field.slice(1)}`]: false });
  };

  const updatePersonnel = (id, delta) => {
    setData(prev => ({
      ...prev,
      personnel: prev.personnel.map(p => 
        p.id === id ? { ...p, count: Math.max(0, p.count + delta) } : p
      )
    }));
  };

  const resetAudit = () => {
    setData({
      payroll: '', industry: 'TECH', totalCompanyHeadcount: '', revenueBest: '', 
      revenueWorst: '', meetingHours: 5, stalledProjectCapital: '',
      isUnsurePayroll: false, isUnsureRevenue: false,
      personnel: data.personnel.map(p => ({ ...p, count: 0 }))
    });
    setStep(0);
    setResult(null);
  };

  const handleAudit = () => {
    const summary = calculateRealitySummary(data);
    setResult(summary);
    
    // 1. Extract the specific data points for institutional capture
    const verdict = summary.state.label;
    const industryLabel = INDUSTRY_BENCHMARKS[data.industry]?.label || data.industry;
    const payroll = data.isUnsurePayroll ? "Industry Estimate" : formatCurrency(data.payroll);
    const headcount = data.personnel.reduce((acc, p) => acc + p.count, 0);

    // 2. Build the encoded parameters for the hidden Dubsado fields
    const params = new URLSearchParams({
      'Audit_Verdict': verdict,
      'Industry': industryLabel,
      'Annual_Payroll': payroll,
      'Headcount': headcount
    });

    // 3. Final URL Construction
    const formID = "698e21f6638e90df485f3b60"; 
    const finalDispatchURL = `https://portal.principalresolution.com/public/form/view/${formID}?${params.toString()}`;

    setDispatchUrl(finalDispatchURL);
    setStep(4);
  };

  return (
    <section id="audit" className="py-32 bg-brand-bg text-brand-text relative transition-colors duration-700 overflow-hidden border-t border-brand-border/50">
      
      {/* ATMOSPHERIC HEAT INDICATOR */}
      <motion.div 
        animate={{ 
          opacity: 0.05 + (burnIntensity * 0.3),
          scale: 1 + (burnIntensity * 0.4),
          backgroundColor: burnIntensity > 0.4 ? "#FF5733" : "#3B82F6" 
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[160px] pointer-events-none transition-colors duration-1000" 
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
        
        {/* STEWARDSHIP NAVIGATION */}
        {step >= 0 && (
          <div className="flex justify-between items-center mb-16">
            {step < 4 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-institutional text-brand-muted hover:text-brand-accent transition-colors"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : <div />}
            <button 
              onClick={resetAudit}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-institutional text-brand-muted hover:text-brand-accent transition-colors"
            >
              <RotateCcw size={14} /> Reset Audit
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-12">
          
          <div className="max-w-2xl text-left space-y-12">
            <div className="space-y-6">
              <span className="font-mono text-[11px] uppercase tracking-institutional text-brand-accent font-bold block mb-6">
                Direct Analysis // 2026
              </span>
              <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-verdict mb-8">
                Price the <br /><span className="text-brand-accent not-italic">Friction.</span>
              </h2>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={liveInsight}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-10 border-l-4 border-brand-accent bg-brand-card shadow-2xl backdrop-blur-md"
                >
                  <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold block mb-4 italic">Advisor Note</span>
                  <p className="text-2xl md:text-3xl font-serif italic text-brand-text leading-tight-editorial tracking-tighter">"{liveInsight}"</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full">
            <AnimatePresence mode="wait">
              {step === -1 && <IdentityAnchor key="anchor" onComplete={() => setStep(0)} />}

              {step >= 0 && step < 4 && (
                <motion.div 
                  key="audit-terminal" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-brand-card border border-brand-border p-12 md:p-16 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
                >
                  <div className="mb-12 text-left relative z-10">
                    <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold block mb-4">Module 0{step + 1}</span>
                    <h3 className="text-4xl font-serif italic tracking-tighter text-brand-text">
                      {step === 0 && "Defining the Baseline."}
                      {step === 1 && "Mapping the Room."}
                      {step === 2 && "Measuring the Gap."}
                      {step === 3 && "Identifying the Drag."}
                    </h3>
                  </div>

                  <motion.div 
                    key={`context-${step}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12 p-8 bg-brand-accent/5 border-l-2 border-brand-accent relative group"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-institutional text-brand-accent font-bold block mb-3">Why This Matters</span>
                    <p className="text-lg font-serif italic text-brand-muted leading-relaxed">
                      {step === 0 && "Total payroll allows us to calculate the specific price of a single hour of lost productivity across your entire firm."}
                      {step === 1 && "Who is in the room dictates the cost of the conversation. Executive density directly increases decision latency."}
                      {step === 2 && "By comparing your best month to your current trend we identify exactly how much potential is being trapped by friction."}
                      {step === 3 && "Stalled projects are quiet capital killers. We look for money tied up in initiatives that have lost institutional momentum."}
                    </p>
                  </motion.div>

                  <div className="relative z-10 space-y-12">
                    {step === 0 && (
                      <div className="space-y-12 text-left">
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold block italic">Your Industry</label>
                            <select 
                              value={data.industry} 
                              onChange={(e) => setData({...data, industry: e.target.value})} 
                              className="w-full bg-transparent border-b border-brand-border py-4 text-xl font-serif italic text-brand-text focus:outline-none appearance-none"
                            >
                              {Object.entries(INDUSTRY_BENCHMARKS).map(([key, val]) => (
                                <option key={key} value={key} className="bg-brand-bg text-brand-text">{val.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold italic">Annual Payroll (Entire Company)</label>
                              <button 
                                onClick={() => setData({...data, isUnsurePayroll: true, payroll: 'UNSURE'})}
                                className="text-[10px] font-mono uppercase text-brand-accent hover:underline font-bold"
                              >
                                I don't know
                              </button>
                            </div>
                            <input 
                              type="text" placeholder="Estimate is fine" 
                              value={data.isUnsurePayroll ? "USING INDUSTRY ESTIMATE" : formatCurrency(data.payroll)} 
                              onChange={(e) => handleNumericInput('payroll', e.target.value)} 
                              className={`w-full bg-transparent border-b border-brand-border py-4 text-4xl font-serif italic focus:outline-none ${data.isUnsurePayroll ? 'text-brand-accent' : 'text-brand-text'}`} 
                            />
                          </div>
                        </div>
                        <button onClick={() => setStep(1)} className="btn-primary w-full py-8 bg-brand-text text-brand-bg font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl">Next Module</button>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-10 text-left">
                        <div className="space-y-6">
                          {data.personnel.map(tier => (
                            <div key={tier.id} className="flex items-center justify-between p-6 border border-brand-border bg-brand-bg/5 hover:border-brand-accent transition-all">
                              <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-text font-bold">{tier.label}</span>
                              <div className="flex items-center gap-6">
                                <button onClick={() => updatePersonnel(tier.id, -1)} className="w-8 h-8 border border-brand-border text-brand-muted hover:text-brand-accent transition-colors font-bold">—</button>
                                <span className="font-serif text-2xl text-brand-text w-6 text-center">{tier.count}</span>
                                <button onClick={() => updatePersonnel(tier.id, 1)} className="w-8 h-8 border border-brand-border text-brand-muted hover:text-brand-accent transition-colors font-bold">+</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button onClick={() => setStep(2)} className="btn-primary w-full py-8 bg-brand-text text-brand-bg font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl">Next Module</button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-12 text-left">
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold italic block">Target Monthly Revenue (Ideal State)</label>
                            <input 
                              type="text" placeholder="What should you be hitting?" 
                              value={formatCurrency(data.revenueBest)} 
                              onChange={(e) => handleNumericInput('revenueBest', e.target.value)} 
                              className="w-full bg-transparent border-b border-brand-border py-4 text-3xl font-serif italic focus:outline-none text-brand-text" 
                            />
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold italic">Current Trending Revenue</label>
                              <button 
                                onClick={() => setData({...data, isUnsureRevenue: true, revenueWorst: 'UNSURE'})}
                                className="text-[10px] font-mono uppercase text-brand-accent hover:underline font-bold"
                              >
                                I don't know
                              </button>
                            </div>
                            <input 
                              type="text" placeholder="Current actual trend" 
                              value={data.isUnsureRevenue ? "USING SECTOR PROJECTION" : formatCurrency(data.revenueWorst)} 
                              onChange={(e) => handleNumericInput('revenueWorst', e.target.value)} 
                              className={`w-full bg-transparent border-b border-brand-border py-4 text-3xl font-serif italic focus:outline-none ${data.isUnsureRevenue ? 'text-brand-accent' : 'text-brand-text'}`} 
                            />
                          </div>
                        </div>
                        <button onClick={() => setStep(3)} className="btn-primary w-full py-8 bg-brand-text text-brand-bg font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-accent hover:text-white transition-all shadow-xl">Next Module</button>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-12 text-left">
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold italic block">Stalled Project Capital</label>
                              <p className="text-[10px] text-brand-muted/60 italic font-mono leading-tight">Investment tied up in projects that are currently stuck or meeting heavy.</p>
                            </div>
                            <input 
                              type="text" placeholder="Estimate tied up capital" 
                              value={formatCurrency(data.stalledProjectCapital)} 
                              onChange={(e) => handleNumericInput('stalledProjectCapital', e.target.value)} 
                              className="w-full bg-transparent border-b border-brand-border py-4 text-4xl font-serif italic focus:outline-none text-brand-text" 
                            />
                          </div>
                          <div className="space-y-4">
                            <label className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted font-bold italic block">Weekly Meeting Burden (Hours)</label>
                            <input 
                              type="range" min="0" max="40" step="1" 
                              value={data.meetingHours}
                              onChange={(e) => setData({...data, meetingHours: Number(e.target.value)})}
                              className="w-full h-1.5 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-accent"
                            />
                            <p className="font-mono text-xs text-brand-muted uppercase text-right font-bold">{data.meetingHours} Hours/Week</p>
                          </div>
                        </div>
                        <button onClick={handleAudit} className="btn-primary w-full py-8 bg-brand-accent text-white font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-text hover:text-brand-bg transition-all shadow-xl">See the Results</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {result && step === 4 && <ResultsLedger summary={result} dispatchUrl={dispatchUrl} onReset={resetAudit} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}