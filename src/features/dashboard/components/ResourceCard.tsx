import type { LearningResource } from '../dashboardState';

interface ResourceCardProps {
  resource: LearningResource;
  category: string;
  onClick: () => void;
}

export function ResourceCard({
  resource,
  category,
  onClick,
}: ResourceCardProps) {
  const typeClass = resource.type.toLowerCase();

  return (
    <div
      className="resource-card"
      onClick={onClick}
    >
      <div className="resource-top">
        <span className={`rtag ${typeClass}`}>{resource.type}</span>
        <span className="resource-cat">{category}</span>
      </div>

      <h4 className="resource-title">{resource.title}</h4>
      <p className="resource-desc">{resource.desc}</p>

      <div className="resource-meta">
        <span>{resource.duration}</span>
        <span>·</span>
        <span>{resource.difficulty}</span>
      </div>

      <div className="bar-track" style={{ margin: '8px 0' }}>
        <div
          className="bar-fill"
          style={{ width: `${resource.progress}%`, background: 'var(--mint)' }}
        />
      </div>

      <div className="resource-foot">
        <span className="resource-pct">{resource.progress}% complete</span>
        <button
          className="btn primary resource-open"
          onClick={(e) => {
            e.stopPropagation();
            window.open(resource.url, '_blank', 'noopener');
          }}
        >
          {resource.type === 'Video' ? 'Watch' : 'Open resource'}{' '}
          <svg
            viewBox="0 0 24 24"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M14 3h7v7M21 3 10 14M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
