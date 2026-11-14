import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { loadCurriculum } from '@/lib/curriculum';
import { loadAllPlanTopics } from '@/lib/progress';
import { useAuth } from '@/contexts/AuthContext';
import type { Subject } from '@/lib/types';

export function SubjectDetailPage() {
  const { subjectId } = useParams();
  const { user } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      const curriculum = await loadCurriculum();
      if (!active) return;
      if (curriculum.error) { setError(curriculum.error.message); setLoading(false); return; }
      setSubject(curriculum.subjects.find((item) => item.id === subjectId) ?? null);
      if (user) {
        const plan = await loadAllPlanTopics(user.id);
        if (plan.error) setError(plan.error.message);
        setCompletedIds(new Set(plan.topics.filter((item) => item.status === 'done').map((item) => item.topicId)));
      }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [subjectId, user]);

  const topicCount = useMemo(() => subject?.sections?.reduce((total, section) => total + (section.topics?.length ?? 0), 0) ?? 0, [subject]);
  const completedCount = useMemo(() => subject?.sections?.reduce((total, section) => total + (section.topics?.filter((topic) => completedIds.has(topic.id)).length ?? 0), 0) ?? 0, [subject, completedIds]);

  if (loading) return <div className="text-[var(--text-sm)] text-[var(--color-text-tertiary)]">Loading subject…</div>;
  if (error) return <div className="surface rounded-[var(--radius-xl)] p-6 text-[var(--text-sm)] text-[var(--color-error)]">{error}</div>;
  if (!subject) return <div className="space-y-4"><Link to="/progress" className="inline-flex items-center gap-1.5 text-[var(--text-sm)] text-[var(--color-text-tertiary)]"><ArrowLeft className="w-3.5 h-3.5" />Back to progress</Link><p className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">Subject not found.</p></div>;

  return (
    <div className="space-y-8">
      <Link to="/progress" className="inline-flex items-center gap-1.5 text-[var(--text-sm)] text-[var(--color-text-tertiary)]"><ArrowLeft className="w-3.5 h-3.5" />Back to progress</Link>
      <div><p className="text-[var(--text-xs)] uppercase tracking-[0.12em] text-[var(--color-accent)] mb-3">Subject</p><h1 className="text-[var(--text-3xl)] font-semibold text-[var(--color-text-display)]">{subject.name}</h1><p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] mt-2">{completedCount} of {topicCount} topics completed</p></div>
      <div className="space-y-4">{subject.sections?.map((section) => <section key={section.id} className="surface rounded-[var(--radius-lg)] p-5"><h2 className="text-[var(--text-lg)] font-medium text-[var(--color-text-primary)]">{section.name}</h2>{section.description && <p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-1">{section.description}</p>}<div className="mt-4 space-y-2">{section.topics?.map((topic) => <Link key={topic.id} to={`/topic/${topic.id}`} className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-3 hover:border-[var(--color-border-hover)]"><span className="text-[var(--text-sm)] text-[var(--color-text-primary)]">{completedIds.has(topic.id) ? '✓ ' : ''}{topic.title}</span><span className="text-[var(--text-xs)] text-[var(--color-text-tertiary)]">{topic.estimatedMinutes} min</span></Link>)}</div></section>)}</div>
    </div>
  );
}
