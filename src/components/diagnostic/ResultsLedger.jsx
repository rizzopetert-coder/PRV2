"use client";

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * ResultsLedger // Principal Resolution
 * Refactored: Production-hardened PDF engine and branded dispatch.
 * Tone: Absolute Candor.
 */
export default function ResultsLedger({ summary, dispatchUrl, onReset }) {
  const { 
    total, 
    monthlyBurn, 
    historicalWaste, 
    executionGap, 
    glossary, 
    state 
  } = summary;
  
  const [optInPDF, setOptInPDF] = useState(true);
  const [optInMemos, setOptInMemos] = useState(false);
  const reportRef = useRef(null);

  // Recovery Dividend logic
  const monthlyRecovery = Math.round(monthlyBurn * 0.10);
  const annualRecovery = monthlyRecovery * 12;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const downloadPDF = async () => {
    const element = reportRef.current;
    
    const canvas = await html2canvas(element, {
      scale: 3,
      backgroundColor: "#FFFFFF", 
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedReport = clonedDoc.querySelector('[data-report-container]');
        if (clonedReport) {
          clonedReport.style.color = "#000000";
          clonedReport.style.backgroundColor = "#FFFFFF";
        }
      }
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Principal_Resolution_Analysis_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-12 animate-stately">
      
      {/* 🏛️ THE ANALYSIS RECORD */}
      <div 
        ref={reportRef}
        data-report-container
        className="bg-brand-card border border-brand-border p-10 md:p-20 shadow-2xl relative overflow-hidden text-left transition-colors duration-700"
      >
        <div className="absolute top-10 right-10 font-mono text-[10px] uppercase tracking-institutional opacity-20 rotate-90 origin-top-right text-brand-text font-bold">
          Confidential // PR-v2.6
        </div>

        <div className="space-y-20">
          {/* HEADER: THE VERDICT */}
          <div className="space-y-8">
            <span className="font-mono text-[11px] uppercase tracking-institutional text-brand-accent font-bold block">
              Institutional State
            </span>
            <h2 className="text-7xl md:text-9xl font-serif italic tracking-tightest text-brand-text leading-verdict">
              {state.label}.
            </h2>
            <p className="text-2xl md:text-3xl font-serif italic text-brand-muted max-w-2xl border-l-4 border-brand-accent pl-12 py-2">
              "{state.desc}"
            </p>
          </div>

          {/* METRIC GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 border-y border-brand-border/40 py-16">
            <div className="space-y-16">
              <div className="space-y-4">
                <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted block font-bold">Total Financial Impact</span>
                <span className="text-6xl md:text-8xl font-serif text-brand-text tracking-tightest leading-none">
                  {formatCurrency(total)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted block font-bold italic">Monthly Burn</span>
                  <span className="text-4xl font-serif text-brand-accent block tracking-tighter">
                    {formatCurrency(monthlyBurn)}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted block font-bold italic">Execution Gap</span>
                  <span className="text-4xl font-serif text-brand-text block tracking-tighter">
                    {formatCurrency(executionGap)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-brand-accent/5 p-12 border border-brand-accent/20 space-y-10 backdrop-blur-sm">
              <span className="font-mono text-[11px] uppercase tracking-briefing text-brand-text font-bold block border-b border-brand-border pb-6">
                Analysis Context
              </span>
              <div className="space-y-8">
                {Object.entries(glossary).map(([key, value]) => (
                  <div key={key}>
                    <h4 className="font-serif italic text-xl text-brand-accent mb-2 capitalize tracking-tight">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <p className="text-sm text-brand-muted font-serif italic leading-relaxed">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECOVERY ROI */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-1 space-y-6">
              <span className="font-mono text-[10px] uppercase tracking-institutional text-brand-accent font-bold">Recovery Ratio</span>
              <h3 className="text-3xl font-serif italic text-brand-text leading-tight">
                Stopping the bleed.
              </h3>
              <p className="text-lg font-serif italic text-brand-muted leading-relaxed">
                A conservative 10 percent reduction in friction recovers <span className="text-brand-text font-bold">{formatCurrency(annualRecovery)}</span> per year.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { name: "The Roadmap", fee: 9500 },
                { name: "The Intervention", fee: 29500 }
              ].map(protocol => (
                <div key={protocol.name} className="p-8 bg-brand-card border border-brand-border group hover:border-brand-accent transition-all duration-700">
                  <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted block mb-6 font-bold">{protocol.name}</span>
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="font-mono text-[9px] uppercase text-brand-muted font-bold tracking-widest">Recovery Time</p>
                      <p className="text-4xl font-serif text-brand-text tracking-tighter">
                        {Math.ceil(protocol.fee / Math.max(1, monthlyRecovery))} <span className="text-lg italic text-brand-muted">Months</span>
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-brand-accent group-hover:animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🏛️ PROTOCOL DISPATCH */}
      <div className="bg-brand-card border border-brand-border p-12 space-y-10 text-left shadow-2xl relative overflow-hidden">
        <div className="space-y-4">
          <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-accent font-bold">Protocol // Dispatch</span>
          <h4 className="text-3xl font-serif italic text-brand-text tracking-tighter">Secure your Professional Record.</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <label className="flex items-center gap-6 cursor-pointer group">
            <div 
              onClick={() => setOptInPDF(!optInPDF)}
              className={`w-6 h-6 border border-brand-border flex items-center justify-center transition-all ${optInPDF ? 'bg-brand-accent border-brand-accent shadow-[0_0_10px_rgba(255,87,51,0.4)]' : ''}`}
            >
              {optInPDF && <div className="w-2 h-2 bg-white" />}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted group-hover:text-brand-text transition-colors font-bold">
              Email analysis record to leadership
            </span>
          </label>

          <label className="flex items-center gap-6 cursor-pointer group">
            <div 
              onClick={() => setOptInMemos(!optInMemos)}
              className={`w-6 h-6 border border-brand-border flex items-center justify-center transition-all ${optInMemos ? 'bg-brand-accent border-brand-accent shadow-[0_0_10px_rgba(255,87,51,0.4)]' : ''}`}
            >
              {optInMemos && <div className="w-2 h-2 bg-white" />}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-briefing text-brand-muted group-hover:text-brand-text transition-colors font-bold">
              Receive intelligence briefings
            </span>
          </label>
        </div>

        <div className="flex flex-col md:flex-row gap-8 pt-8">
          <button 
            onClick={downloadPDF}
            className="flex-1 border border-brand-border text-brand-text px-12 py-8 font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-text hover:text-brand-bg transition-all active:scale-95 shadow-lg"
          >
            Download Direct Dispatch
          </button>
          
          <button 
            onClick={() => {
              if (dispatchUrl) {
                window.location.href = dispatchUrl;
              }
            }}
            className="flex-1 bg-brand-text text-brand-bg px-12 py-8 font-mono text-[11px] uppercase tracking-institutional font-bold hover:bg-brand-accent hover:text-white transition-all shadow-2xl active:scale-95"
          >
            Initiate Resolution Protocol
          </button>
        </div>
      </div>
    </div>
  );
}