/* ═══════════════════════════════════════════════════════
   Planly — ScheduleSection (Step 2/3)
   ═══════════════════════════════════════════════════════ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays } from 'date-fns';

export interface ScheduleData {
  language: 'python' | 'java' | 'cpp' | 'javascript';
  dailyHours: number;
  timelinePreset: '30-days' | '60-days' | '90-days' | 'custom';
  customDate?: string;
}

interface ScheduleSectionProps {
  initialData?: Partial<ScheduleData>;
  onChange?: (data: ScheduleData) => void;
  onBack: () => void;
  onContinue: (data: ScheduleData) => void;
}

export function ScheduleSection({
  initialData,
  onChange,
  onBack,
  onContinue,
}: ScheduleSectionProps) {
  const [language, setLanguage] = useState<'python' | 'java' | 'cpp' | 'javascript'>(
    initialData?.language ?? 'python'
  );
  const [dailyHours, setDailyHours] = useState<number>(initialData?.dailyHours ?? 2);
  const [timelinePreset, setTimelinePreset] = useState<'30-days' | '60-days' | '90-days' | 'custom'>(
    initialData?.timelinePreset ?? '90-days'
  );
  const [customDate, setCustomDate] = useState<string>(
    initialData?.customDate ?? format(addDays(new Date(), 90), 'yyyy-MM-dd')
  );

  const notifyChange = (updated: ScheduleData) => {
    if (onChange) onChange(updated);
  };

  const handleLanguageSelect = (lang: 'python' | 'java' | 'cpp' | 'javascript') => {
    setLanguage(lang);
    notifyChange({ language: lang, dailyHours, timelinePreset, customDate });
  };

  const handleHoursSelect = (hours: number) => {
    setDailyHours(hours);
    notifyChange({ language, dailyHours: hours, timelinePreset, customDate });
  };

  const handleTimelineSelect = (preset: '30-days' | '60-days' | '90-days' | 'custom') => {
    setTimelinePreset(preset);
    notifyChange({ language, dailyHours, timelinePreset: preset, customDate });
  };

  const handleCustomDateChange = (date: string) => {
    setCustomDate(date);
    notifyChange({ language, dailyHours, timelinePreset, customDate: date });
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '580px',
        backgroundColor: '#121318',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        borderRadius: '20px',
        padding: '28px 30px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        textAlign: 'left',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h2 style={{ fontSize: '23px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
          Schedule & Preferences
        </h2>
        <span
          style={{
            backgroundColor: '#1f222b',
            color: '#9ba2b2',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '5px 12px',
          }}
        >
          2/3 Step
        </span>
      </div>

      {/* Questions */}
      <div style={{ paddingTop: '22px', paddingBottom: '4px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Question 1 */}
        <div>
          <label style={{ display: 'block', fontSize: '15px', color: '#ffffff', marginBottom: '12px' }}>
            1. Which programming language do you prefer?
            <span style={{ color: '#ef4444', fontWeight: 600, marginLeft: '3px' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {([
              { id: 'python', label: 'Python' },
              { id: 'java', label: 'Java' },
              { id: 'cpp', label: 'C++' },
              { id: 'javascript', label: 'JavaScript / TypeScript' },
            ] as const).map((item) => {
              const isSelected = language === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleLanguageSelect(item.id)}
                  style={{
                    height: '42px',
                    padding: '0 20px',
                    borderRadius: '9999px',
                    fontSize: '14.5px',
                    fontWeight: isSelected ? 500 : 400,
                    color: '#ffffff',
                    backgroundColor: isSelected ? '#14233e' : '#14151a',
                    border: isSelected ? '1.5px solid #2b6cb0' : '1px solid #2e323d',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 12px rgba(43, 108, 176, 0.25)' : 'none',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <label style={{ display: 'block', fontSize: '15px', color: '#ffffff', marginBottom: '12px' }}>
            2. How much time can you dedicate each day?
            <span style={{ color: '#ef4444', fontWeight: 600, marginLeft: '3px' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { hours: 1, label: '1 hour' },
              { hours: 2, label: '2 hours' },
              { hours: 3, label: '3 hours' },
              { hours: 4, label: '4+ hours' },
            ].map((item) => {
              const isSelected = dailyHours === item.hours;
              return (
                <button
                  key={item.hours}
                  type="button"
                  onClick={() => handleHoursSelect(item.hours)}
                  style={{
                    height: '42px',
                    padding: '0 20px',
                    borderRadius: '9999px',
                    fontSize: '14.5px',
                    fontWeight: isSelected ? 500 : 400,
                    color: '#ffffff',
                    backgroundColor: isSelected ? '#14233e' : '#14151a',
                    border: isSelected ? '1.5px solid #2b6cb0' : '1px solid #2e323d',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 12px rgba(43, 108, 176, 0.25)' : 'none',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question 3 */}
        <div>
          <label style={{ display: 'block', fontSize: '15px', color: '#ffffff', marginBottom: '12px' }}>
            3. What is your target timeline or deadline?
            <span style={{ color: '#ef4444', fontWeight: 600, marginLeft: '3px' }}>*</span>
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {([
              { id: '30-days', label: '30 Days' },
              { id: '60-days', label: '60 Days' },
              { id: '90-days', label: '90 Days' },
              { id: 'custom', label: 'Custom Date' },
            ] as const).map((item) => {
              const isSelected = timelinePreset === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTimelineSelect(item.id)}
                  style={{
                    height: '42px',
                    padding: '0 20px',
                    borderRadius: '9999px',
                    fontSize: '14.5px',
                    fontWeight: isSelected ? 500 : 400,
                    color: '#ffffff',
                    backgroundColor: isSelected ? '#14233e' : '#14151a',
                    border: isSelected ? '1.5px solid #2b6cb0' : '1px solid #2e323d',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 12px rgba(43, 108, 176, 0.25)' : 'none',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {timelinePreset === 'custom' && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                style={{ marginTop: '14px' }}
              >
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Pick your deadline date
                </label>
                <input
                  type="date"
                  value={customDate}
                  min={format(addDays(new Date(), 7), 'yyyy-MM-dd')}
                  onChange={(e) => handleCustomDateChange(e.target.value)}
                  style={{
                    height: '40px',
                    backgroundColor: '#14151a',
                    border: '1px solid #2e323d',
                    color: '#ffffff',
                    fontSize: '14px',
                    borderRadius: '10px',
                    padding: '0 14px',
                    outline: 'none',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          paddingTop: '22px',
          marginTop: '26px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            height: '42px',
            padding: '0 22px',
            borderRadius: '10px',
            backgroundColor: '#16181f',
            border: '1px solid #2e323d',
            color: '#ffffff',
            fontSize: '14.5px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Back
        </button>

        <button
          type="button"
          onClick={() => onContinue({ language, dailyHours, timelinePreset, customDate })}
          style={{
            height: '42px',
            padding: '0 24px',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
            border: 'none',
            color: '#000000',
            fontSize: '14.5px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
