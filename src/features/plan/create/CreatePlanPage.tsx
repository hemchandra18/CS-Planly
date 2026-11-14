/* ═══════════════════════════════════════════════════════
   Planly — Create Plan Page
   Interactive 3-Step Plan Generator
   (About You → Schedule & Preferences → Review & Generate)
   ═══════════════════════════════════════════════════════ */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants';
import { AboutYouSection, type AboutYouData } from './AboutYouSection';
import { ScheduleSection, type ScheduleData } from './ScheduleSection';
import { ReviewGenerateSection } from './ReviewGenerateSection';
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';

export function CreatePlanPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [aboutYouData, setAboutYouData] = useState<AboutYouData>({
    role: 'software-engineer',
    experience: '0-2-years',
    targetCompany: 'product-companies',
    region: 'india',
  });
  const [scheduleData, setScheduleData] = useState<ScheduleData>({
    language: 'python',
    dailyHours: 2,
    timelinePreset: '90-days',
  });

  const steps = [
    { num: 1, label: 'About You' },
    { num: 2, label: 'Schedule & Preferences' },
    { num: 3, label: 'Review & Generate' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0c0d10',
        color: '#e9eaed',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Bar ── */}
      <header
        style={{
          height: '64px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#131419',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to={ROUTES.DASHBOARD}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#8c8f99',
              textDecoration: 'none',
              fontSize: '13.5px',
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              transition: 'all 0.15s ease',
            }}
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span>Dashboard</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(37, 99, 235, 0.35)',
              }}
            >
              <Sparkles style={{ width: '15px', height: '15px', color: '#ffffff' }} />
            </div>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Planly
            </span>
          </div>
        </div>

        {/* Step Indicator Header Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isCompleted = currentStep > s.num;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : isCompleted ? '#3ddc97' : '#5c5f69',
                  padding: '4px 10px',
                  borderRadius: '16px',
                  backgroundColor: isActive
                    ? 'rgba(91, 141, 239, 0.15)'
                    : isCompleted
                    ? 'rgba(61, 220, 151, 0.1)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(91, 141, 239, 0.3)'
                    : isCompleted
                    ? '1px solid rgba(61, 220, 151, 0.2)'
                    : '1px solid transparent',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: '#3ddc97' }} />
                ) : (
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#5b8def' : '#24262d',
                      color: isActive ? '#ffffff' : '#8c8f99',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    {s.num}
                  </span>
                )}
                <span>{s.label}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* ── Main Step Content ── */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: '640px' }}>
          {currentStep === 1 && (
            <AboutYouSection
              initialData={aboutYouData}
              onChange={(data) => setAboutYouData(data)}
              onContinue={(data) => {
                setAboutYouData(data);
                setCurrentStep(2);
              }}
            />
          )}

          {currentStep === 2 && (
            <ScheduleSection
              initialData={scheduleData}
              onChange={(data) => setScheduleData(data)}
              onBack={() => setCurrentStep(1)}
              onContinue={(data) => {
                setScheduleData(data);
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <ReviewGenerateSection
              aboutYou={aboutYouData}
              schedule={scheduleData}
              onBack={() => setCurrentStep(2)}
              onPlanGenerated={() => {
                navigate(ROUTES.DASHBOARD);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
