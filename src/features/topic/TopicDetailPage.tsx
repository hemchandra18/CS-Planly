import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { loadTopic } from '@/lib/progress';
import type { TopicData } from '@/lib/types';

export function TopicDetailPage() {
  const { topicId = '' } = useParams(); const [topic, setTopic] = useState<TopicData | null>(null); const [error, setError] = useState('');
  useEffect(() => { loadTopic(topicId).then((result) => { setTopic(result.topic); if (result.error) setError(result.error.message); }); }, [topicId]);
  return <div className="space-y-8"><Link to={ROUTES.DASHBOARD} className="inline-flex items-center gap-1.5 text-[var(--text-sm)] text-[var(--color-text-tertiary)]"><ArrowLeft className="w-3.5 h-3.5" />Back</Link>{error && <p className="text-[var(--text-sm)] text-[var(--color-error)]">{error}</p>}{topic && <><div><h1 className="text-[var(--text-2xl)] font-semibold text-[var(--color-text-display)]">{topic.title}</h1><p className="text-[var(--text-sm)] text-[var(--color-text-tertiary)] mt-2">{topic.difficulty} · {topic.estimatedMinutes} minutes</p></div><section className="space-y-3"><h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)]">Concept</h2><p className="text-[var(--text-sm)] text-[var(--color-text-secondary)] whitespace-pre-wrap">{topic.concept.explanation}</p>{topic.concept.examples.map((example) => <p key={example} className="text-[var(--text-sm)] text-[var(--color-text-secondary)] border-l-2 border-[var(--color-accent)] pl-3">{example}</p>)}</section><section><h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-text-primary)] mb-3">Practice problems</h2><div className="space-y-2">{topic.problems.map((problem) => <a key={problem.id} href={problem.externalUrl} target="_blank" rel="noreferrer" className="block border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 text-[var(--text-sm)] text-[var(--color-accent)]">{problem.title} <span className="text-[var(--color-text-tertiary)]">· {problem.platform}</span></a>)}</div></section></>}</div>;
}
