/* ═══════════════════════════════════════════════════════
   Planly Dashboard — Types & Initial Mock Data
   Source: Planly — Dashboard_c.html
   ═══════════════════════════════════════════════════════ */

export interface TaskItem {
  id: number;
  title: string;
  cat: string;
  tagClass: 'work' | 'focus' | 'plan' | 'routine' | 'urgent';
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
  done: boolean;
  when: 'today' | 'later';
}

export interface PlanItem {
  id: number;
  title: string;
  chip: 'today' | 'tmrw' | 'date';
  sub: string;
}

export interface DeadlineItem {
  id: number;
  title: string;
  when: string;
  status: 'upcoming' | 'done';
}

export interface GoalItem {
  id: number;
  name: string;
  pct: number;
  color: string;
}

export interface ProgressState {
  completed: number;
  inProgress: number;
  revision: number;
  skipped: number;
  pending: number;
}

export interface NotificationItem {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

export interface LearningResource {
  id: string;
  title: string;
  desc: string;
  type: 'Video' | 'Documentation' | 'Course' | 'Article';
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  url: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  who: 'user' | 'bot';
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'today', label: 'Today' },
  { id: 'plans', label: 'Plans' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'goals', label: 'Goals' },
  { id: 'insights', label: 'Insights' },
  { id: 'learning', label: 'Learning' },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]['id'];

export const LEARNING_CATS = [
  { key: 'cpp', label: 'C++' },
  { key: 'python', label: 'Python' },
  { key: 'backend', label: 'Backend Foundation' },
] as const;

export const LEARNING_DATA: Record<string, LearningResource[]> = {
  cpp: [
    {
      id: 'cpp1',
      title: 'C++ Tutorial for Beginners - Full Course',
      desc: 'A complete walkthrough of core C++ concepts, from syntax to OOP, taught by Mike Dane.',
      type: 'Video',
      duration: '4h 1m',
      difficulty: 'Beginner',
      progress: 20,
      url: 'https://www.youtube.com/watch?v=vLnPwxZdW4Y',
    },
    {
      id: 'cpp2',
      title: 'C++ Language Reference',
      desc: 'The complete, authoritative reference for C++ syntax, the standard library, and language features.',
      type: 'Documentation',
      duration: 'Reference',
      difficulty: 'Intermediate',
      progress: 0,
      url: 'https://en.cppreference.com/w/cpp',
    },
    {
      id: 'cpp3',
      title: 'LearnCpp.com — Full C++ Course',
      desc: 'A structured, self-paced course covering C++ from fundamentals through advanced topics.',
      type: 'Course',
      duration: 'Self-paced',
      difficulty: 'Beginner',
      progress: 45,
      url: 'https://www.learncpp.com/',
    },
  ],
  python: [
    {
      id: 'py1',
      title: 'Python for Beginners - Full Course',
      desc: 'A full introductory course covering Python syntax, data structures, and functions.',
      type: 'Video',
      duration: '4h 26m',
      difficulty: 'Beginner',
      progress: 60,
      url: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
    },
    {
      id: 'py2',
      title: 'The Python Tutorial',
      desc: "Python's official tutorial covering the language from first steps to modules and classes.",
      type: 'Documentation',
      duration: 'Reference',
      difficulty: 'Beginner',
      progress: 10,
      url: 'https://docs.python.org/3/tutorial/index.html',
    },
    {
      id: 'py3',
      title: 'Build Real-World Applications with Python',
      desc: 'A Microsoft Learn path covering object orientation and building real apps in Python.',
      type: 'Course',
      duration: '~6h',
      difficulty: 'Intermediate',
      progress: 0,
      url: 'https://learn.microsoft.com/en-us/training/paths/python-language',
    },
  ],
  backend: [
    {
      id: 'be1',
      title: 'Express.js & Node.js Course for Beginners',
      desc: 'A full tutorial on building backend servers and REST APIs with Node.js and Express.',
      type: 'Video',
      duration: '2h 28m',
      difficulty: 'Beginner',
      progress: 0,
      url: 'https://www.youtube.com/watch?v=G8uL0lFFoN0',
    },
    {
      id: 'be2',
      title: 'Client-Server Overview',
      desc: 'An MDN article explaining how clients and servers communicate over HTTP in dynamic websites.',
      type: 'Article',
      duration: '15 min read',
      difficulty: 'Beginner',
      progress: 100,
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview',
    },
    {
      id: 'be3',
      title: 'Create a Web API with ASP.NET Core',
      desc: 'A Microsoft Learn module on building a RESTful CRUD service with ASP.NET Core.',
      type: 'Course',
      duration: '~3h',
      difficulty: 'Intermediate',
      progress: 30,
      url: 'https://learn.microsoft.com/en-us/training/modules/build-web-api-aspnet-core',
    },
  ],
};

export const PROGRESS_ORDER: (keyof ProgressState)[] = [
  'completed',
  'inProgress',
  'revision',
  'skipped',
  'pending',
];

export const PROGRESS_META: Record<
  keyof ProgressState,
  { label: string; hex: string }
> = {
  completed: { label: 'Completed', hex: '#3ddc97' },
  inProgress: { label: 'In Progress', hex: '#5b8def' },
  revision: { label: 'Revision', hex: '#a78bfa' },
  skipped: { label: 'Skipped', hex: '#f0a83a' },
  pending: { label: 'Pending', hex: '#6b7280' },
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 1,
    title: 'Finish portfolio case study',
    cat: 'Deep Work',
    tagClass: 'work',
    duration: '2h',
    priority: 'High',
    notes:
      'Pull final numbers from the June engagement and tighten the narrative before sending to the client.',
    done: false,
    when: 'today',
  },
  {
    id: 2,
    title: 'Deep work session',
    cat: 'Focus',
    tagClass: 'focus',
    duration: '1h 30m',
    priority: 'Medium',
    notes: 'Heads-down block, notifications off.',
    done: false,
    when: 'today',
  },
  {
    id: 3,
    title: 'Review weekly goals',
    cat: 'Planning',
    tagClass: 'plan',
    duration: '30m',
    priority: 'Medium',
    notes: 'Check progress against the three goals set on Monday.',
    done: false,
    when: 'today',
  },
  {
    id: 4,
    title: 'Plan tomorrow',
    cat: 'Routine',
    tagClass: 'routine',
    duration: '15m',
    priority: 'Low',
    notes: "Set tomorrow's top three priorities before logging off.",
    done: true,
    when: 'today',
  },
  {
    id: 5,
    title: 'Reply to client feedback thread',
    cat: 'Urgent',
    tagClass: 'urgent',
    duration: '20m',
    priority: 'High',
    notes:
      'Client flagged two sections in the proposal — address both directly.',
    done: false,
    when: 'later',
  },
  {
    id: 6,
    title: 'Update project timeline doc',
    cat: 'Planning',
    tagClass: 'plan',
    duration: '25m',
    priority: 'Medium',
    notes: 'Reflect the new Friday milestone and notify the team.',
    done: false,
    when: 'later',
  },
  {
    id: 7,
    title: 'Stretch & walk break',
    cat: 'Routine',
    tagClass: 'routine',
    duration: '15m',
    priority: 'Low',
    notes: 'Short break away from the screen.',
    done: false,
    when: 'later',
  },
  {
    id: 8,
    title: 'Read design system notes',
    cat: 'Focus',
    tagClass: 'focus',
    duration: '30m',
    priority: 'Low',
    notes: 'Catch up on the new token naming conventions.',
    done: false,
    when: 'later',
  },
];

export const INITIAL_PLANS: PlanItem[] = [
  { id: 1, title: 'Team sync', chip: 'today', sub: '4:00 PM – 4:30 PM' },
  { id: 2, title: 'Design review', chip: 'tmrw', sub: '11:00 AM – 12:00 PM' },
  {
    id: 3,
    title: 'Gym',
    chip: 'date',
    sub: 'Fri, Jan 31 · 6:00 PM – 7:00 PM',
  },
  {
    id: 4,
    title: 'Quarterly planning',
    chip: 'date',
    sub: 'Mon, Feb 3 · 9:30 AM – 10:30 AM',
  },
];

export const INITIAL_DEADLINES: DeadlineItem[] = [
  { id: 1, title: 'Portfolio case study', when: 'Today', status: 'upcoming' },
  { id: 2, title: 'Design review', when: 'Tomorrow', status: 'upcoming' },
  { id: 3, title: 'Client proposal draft', when: 'Fri', status: 'upcoming' },
  { id: 4, title: 'Quarterly planning', when: 'Mon', status: 'upcoming' },
];

export const INITIAL_GOALS: GoalItem[] = [
  { id: 1, name: 'Ship portfolio redesign', pct: 80, color: 'var(--mint)' },
  { id: 2, name: '3 deep work sessions', pct: 100, color: 'var(--blue)' },
  { id: 3, name: 'Read 2 chapters', pct: 40, color: 'var(--amber)' },
];

export const INITIAL_PROGRESS: ProgressState = {
  completed: 54,
  inProgress: 18,
  revision: 12,
  skipped: 8,
  pending: 36,
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    text: 'Design review moved to 11:00 AM tomorrow.',
    time: '10m ago',
    read: false,
  },
  {
    id: 2,
    text: 'Client replied on the proposal thread.',
    time: '1h ago',
    read: false,
  },
  {
    id: 3,
    text: 'Weekly goals refresh in 2 days.',
    time: 'Yesterday',
    read: true,
  },
];

