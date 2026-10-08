import React from 'react';
import {
  Brain,
  ShieldCheck,
  CheckCircle2,
  Users,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { NavPage } from '../../types';
import { BackNavigationButton } from '../common/BackNavigationButton';

interface AboutProps {
  onNavigate: (page: NavPage) => void;
  onBack?: () => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate, onBack }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Back Navigation Button */}
      <BackNavigationButton onBack={onBack} onNavigate={onNavigate} targetPage="home" label="Back to Home" />

      {/* Header */}
      <div className="border-b app-border pb-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C4DBA]">
          <Brain className="w-4 h-4" />
          <span>About Lingua AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold app-text-primary mt-1">
          Understanding Language Support & DLD
        </h1>
        <p className="text-xs app-text-secondary mt-0.5">
          Simple answers to common questions about Developmental Language Disorder and our mission.
        </p>
      </div>

      {/* 4 Short Clear Sections as Cards */}
      <div className="space-y-4">
        {/* Card 1: What is DLD? */}
        <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤔</span>
            <h2 className="text-base font-extrabold app-text-primary">What is DLD?</h2>
          </div>
          <p className="text-xs sm:text-sm app-text-secondary leading-relaxed">
            Developmental Language Disorder (DLD) means a child’s brain processes spoken and written words differently. It is not caused by hearing loss or lack of intelligence. Children with DLD have brilliant ideas, but need extra scaffolding to understand long sentences and find the right words.
          </p>
        </div>

        {/* Card 2: Why does it matter? */}
        <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>
            <h2 className="text-base font-extrabold app-text-primary">Why does it matter?</h2>
          </div>
          <p className="text-xs sm:text-sm app-text-secondary leading-relaxed">
            DLD affects roughly 2 children in every classroom of 30. When children get supportive tools early, they read with confidence, participate happily in class, and express their thoughts without fear or frustration.
          </p>
        </div>

        {/* Card 3: How can Lingua AI help? */}
        <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-base font-extrabold app-text-primary">How can Lingua AI help?</h2>
          </div>
          <p className="text-xs sm:text-sm app-text-secondary leading-relaxed">
            Lingua AI scans textbook pages, simplifies complicated sentences, reads aloud in gentle natural voices, and provides fun NeuroPlay games to strengthen vocabulary and auditory memory.
          </p>
        </div>

        {/* Card 4: Who is it for? */}
        <div className="p-6 rounded-3xl border app-border app-bg-surface shadow-2xs space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">👥</span>
            <h2 className="text-base font-extrabold app-text-primary">Who is it for?</h2>
          </div>
          <p className="text-xs sm:text-sm app-text-secondary leading-relaxed">
            Children learning to read, parents supporting homework at home, teachers creating inclusive classrooms, and speech-language pathologists (SLPs) sharing progress.
          </p>
        </div>
      </div>

      {/* Mandatory Clinical Notice */}
      <div className="p-5 rounded-2xl bg-[#F5EFFB] dark:bg-[#281B3C] border border-[#DECDE9] dark:border-[#43305E] text-xs app-text-primary space-y-1.5">
        <div className="font-extrabold flex items-center gap-1.5 text-[#7C4DBA] dark:text-[#D8B4FE]">
          <ShieldCheck className="w-4 h-4" />
          <span>Clinical & Assistive Notice</span>
        </div>
        <p className="leading-relaxed app-text-secondary">
          "Lingua AI is an assistive and educational support platform. It does not replace professional diagnosis, speech-language assessment, or medical advice."
        </p>
      </div>

      <div className="pt-2 flex justify-center">
        <button
          onClick={() => onNavigate('home')}
          className="px-6 py-2.5 rounded-xl bg-[#4A154B] dark:bg-[#7C4DBA] text-white text-xs font-bold shadow-2xs"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};
