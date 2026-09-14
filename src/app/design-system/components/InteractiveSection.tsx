"use client";

import React from "react";


export default function InteractiveSection() {


  return (
    <>
      <section className="mb-32 animate-fade-up">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-h1">5. Interactive & Glass</h2>
            <div className="h-[0.0625rem] flex-1 bg-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="flex flex-col gap-2">
              <h3 className="text-h3">Action Buttons</h3>
              <p className="text-body-sm text-[var(--color-text-muted)] mb-6">Awwwards Kinetic Architecture.</p>
              <div className="relative rounded-3xl overflow-hidden py-12 px-6 bg-transparent border border-[var(--color-border-Strokes-default)] flex flex-col justify-center items-center gap-8 min-h-[25rem] bg-repeat" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23000000\" fill-opacity=\"0.03\" fill-rule=\"evenodd\"%3E%3Ccircle cx=\"2\" cy=\"2\" r=\"2\"/%3E%3C/g%3E%3C/svg%3E')"}}>
                
                {/* Awwwards Liquid Reveal Perfecto (Now standard primary) */}
                <button className="btn-primary w-full max-w-[18rem]">
                  <span>Primary Button</span>
                </button>
                
                {/* Awwwards Kinetic Slide Perfecto */}
                <button className="btn-kinetic-primary w-full max-w-[18rem]">
                  <span className="text-wrapper">
                    <span className="text-main">Kinetic Slide</span>
                    <span className="text-clone">Kinetic Slide</span>
                  </span>
                </button>
                
                {/* Awwwards Iconic Glass */}
                <button className="btn-magnetic-glass w-full max-w-[18rem] flex justify-between group">
                  <span>Breathing Glass</span>
                  <div className="icon-pill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </div>
                </button>

              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden p-12 flex items-center justify-center min-h-[25rem] bg-[var(--color-surface-BG-2)]">
              <div className="absolute top-10 right-10 w-48 h-48 bg-[var(--color-brand-orange)] rounded-full mix-blend-screen filter blur-2xl opacity-50" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-[var(--color-brand-blue)] rounded-full mix-blend-screen filter blur-3xl opacity-30" />
              <div className="organic-glass-panel breathing-card w-full max-w-sm p-8 relative z-10">
                <p className="text-overline text-[var(--color-brand-orange)] mb-2">Signature Glass</p>
                <h4 className="text-h3 mb-4 text-[var(--color-text-primary)]">Soft Organic Card</h4>
                <p className="text-body-sm text-[var(--color-text-muted)] mb-6">Foundation of our liquid organic interface.</p>
                <button className="btn-secondary w-full">Interact</button>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}