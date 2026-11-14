import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { COMPANY_REGION_OPTIONS, ROUTES } from '@/lib/constants';
import { useOnboarding } from '@/contexts/OnboardingContext';
import type { CompanyRegion } from '@/lib/types';

export function RegionStep() {
  const navigate = useNavigate();
  const { answers, setCompanyRegion } = useOnboarding();
  return <div><h2 className="text-[var(--text-2xl)] md:text-[var(--text-3xl)] font-bold text-[var(--color-text-display)] tracking-[-0.02em] mb-2">Which region’s companies<br />are you preparing for?</h2><p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mb-6">We’ll tune the plan to your target market</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">{COMPANY_REGION_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => setCompanyRegion(option.value as CompanyRegion)} className={`border rounded-[var(--radius-lg)] p-4 text-left transition-all cursor-pointer ${answers.companyRegion === option.value ? 'border-[var(--color-accent)] bg-[rgba(112,148,219,0.18)] shadow-[0_0_0_1px_var(--color-accent),0_0_16px_rgba(112,148,219,0.2)]' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'}`}><span className="text-[var(--text-sm)] font-medium text-[var(--color-text-primary)]">{option.label}</span></button>)}</div><Button className="mt-8" fullWidth size="lg" disabled={!answers.companyRegion} onClick={() => navigate(ROUTES.ONBOARDING_GOAL)} icon={<ArrowRight className="w-4 h-4" />} iconPosition="right">Continue</Button></div>;
}
