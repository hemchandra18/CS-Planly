/* ═══════════════════════════════════════════════════════
   Planly — AboutYouSection (Step 1/3)
   ═══════════════════════════════════════════════════════ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AboutYouData {
  role: 'sde-intern' | 'software-engineer';
  experience?: '0-2-years' | '2-5-years' | '5-plus-years';
  targetCompany: 'startups' | 'faang' | 'product-companies' | 'open-to-all';
  region: 'india' | 'us-europe-others';
}

interface AboutYouSectionProps {
  initialData?: Partial<AboutYouData>;
  onChange?: (data: AboutYouData) => void;
  onContinue?: (data: AboutYouData) => void;
}

function pillStyle(isSelected: boolean): React.CSSProperties {
  return {
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
  };
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '15px',
  color: '#ffffff',
  marginBottom: '12px',
};

const requiredStar: React.CSSProperties = {
  color: '#ef4444',
  fontWeight: 600,
  marginLeft: '3px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
};

export function AboutYouSection({ initialData, onChange, onContinue }: AboutYouSectionProps) {
  const [role, setRole] = useState<'sde-intern' | 'software-engineer'>(
    initialData?.role ?? 'software-engineer'
  );
  const [experience, setExperience] = useState<'0-2-years' | '2-5-years' | '5-plus-years'>(
    initialData?.experience ?? '0-2-years'
  );
  const [targetCompany, setTargetCompany] = useState<
    'startups' | 'faang' | 'product-companies' | 'open-to-all'
  >(initialData?.targetCompany ?? 'product-companies');
  const [region, setRegion] = useState<'india' | 'us-europe-others'>(
    initialData?.region ?? 'india'
  );

  const notifyChange = (updated: AboutYouData) => {
    if (onChange) onChange(updated);
  };

  const handleRoleChange = (newRole: 'sde-intern' | 'software-engineer') => {
    setRole(newRole);
    notifyChange({ role: newRole, experience, targetCompany, region });
  };

  const isSE = role === 'software-engineer';
  const companyQ = isSE ? 3 : 2;
  const regionQ = isSE ? 4 : 3;

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
          About you
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
          1/3 Step
        </span>
      </div>

      {/* Questions */}
      <div style={{ paddingTop: '22px', paddingBottom: '4px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Q1: Role */}
        <div>
          <label style={labelStyle}>
            1. Which role are you preparing for?
            <span style={requiredStar}>*</span>
          </label>
          <div style={rowStyle}>
            <button type="button" onClick={() => handleRoleChange('sde-intern')} style={pillStyle(role === 'sde-intern')}>
              SDE Intern
            </button>
            <button type="button" onClick={() => handleRoleChange('software-engineer')} style={pillStyle(role === 'software-engineer')}>
              Software Engineer
            </button>
          </div>
        </div>

        {/* Q2 (conditional): Experience */}
        <AnimatePresence>
          {isSE && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              <label style={labelStyle}>
                2. How much experience do you have?
                <span style={requiredStar}>*</span>
              </label>
              <div style={rowStyle}>
                {([
                  { id: '0-2-years', label: '0 – 2 years' },
                  { id: '2-5-years', label: '2 – 5 years' },
                  { id: '5-plus-years', label: '5+ years' },
                ] as const).map((exp) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => {
                      setExperience(exp.id);
                      notifyChange({ role, experience: exp.id, targetCompany, region });
                    }}
                    style={pillStyle(experience === exp.id)}
                  >
                    {exp.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Q3: Target Companies */}
        <div>
          <label style={labelStyle}>
            {companyQ}. What kind of interviews are you mainly targeting?
            <span style={requiredStar}>*</span>
          </label>
          <div style={rowStyle}>
            {([
              { id: 'startups', label: 'Startups' },
              { id: 'faang', label: 'FAANG' },
              { id: 'product-companies', label: 'All Product Based Companies' },
              { id: 'open-to-all', label: 'Open to all' },
            ] as const).map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => {
                  setTargetCompany(comp.id);
                  notifyChange({ role, experience, targetCompany: comp.id, region });
                }}
                style={pillStyle(targetCompany === comp.id)}
              >
                {comp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Q4: Region */}
        <div>
          <label style={labelStyle}>
            {regionQ}. Which region are you preparing for?
            <span style={requiredStar}>*</span>
          </label>
          <div style={rowStyle}>
            {([
              { id: 'india', label: 'India' },
              { id: 'us-europe-others', label: 'US / Europe / Others' },
            ] as const).map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => {
                  setRegion(reg.id);
                  notifyChange({ role, experience, targetCompany, region: reg.id });
                }}
                style={pillStyle(region === reg.id)}
              >
                {reg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {onContinue && (
        <div
          style={{
            paddingTop: '22px',
            marginTop: '26px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <button
            type="button"
            onClick={() => onContinue({ role, experience: isSE ? experience : undefined, targetCompany, region })}
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
      )}
    </div>
  );
}
