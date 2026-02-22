import type { SiteContent } from '@/lib/siteContent';

export type SceneId =
  | 'intro'
  | 'help'
  | 'play'
  | 'mixes'
  | 'mix_detail'
  | 'booking'
  | 'links'
  | 'about';

export type ActionChip = {
  label: string;
  actionId: 'goto' | 'mix.select' | 'open.current' | 'back' | 'clear' | 'copy.booking';
  args?: {
    scene?: SceneId;
    mixIndex?: number;
  };
};

export type TerminalState = {
  lastScene: SceneId;
  selectedMixIndex: number | null;
  lastOpened: string | null;
  userInterest: string[];
  history: SceneId[];
};

export type TransitionResult = {
  state: TerminalState;
  lines: string[];
  actions: ActionChip[];
  openUrl?: string;
  copyValue?: string;
  clearOutput?: boolean;
  showThinking?: boolean;
};

const BASE_ACTIONS: ActionChip[] = [
  { label: 'Help', actionId: 'goto', args: { scene: 'help' } },
  { label: 'Mixes', actionId: 'goto', args: { scene: 'mixes' } },
  { label: 'Latest', actionId: 'goto', args: { scene: 'play' } },
  { label: 'Book', actionId: 'goto', args: { scene: 'booking' } },
  { label: 'Links', actionId: 'goto', args: { scene: 'links' } },
  { label: 'About', actionId: 'goto', args: { scene: 'about' } }
];

export const initialTerminalState: TerminalState = {
  lastScene: 'intro',
  selectedMixIndex: null,
  lastOpened: null,
  userInterest: [],
  history: []
};

const getInstagramDmTarget = (content: SiteContent): string => {
  if (!content.links.instagram) {
    return 'Instagram handle missing in content.json';
  }

  return content.links.instagram.startsWith('@') ? content.links.instagram : `@${content.links.instagram}`;
};

const withBackAction = (actions: ActionChip[], state: TerminalState): ActionChip[] => {
  if (state.history.length === 0) {
    return actions;
  }
  return [{ label: 'Back', actionId: 'back' }, ...actions];
};

export const getSceneOutput = (scene: SceneId, state: TerminalState, content: SiteContent): Omit<TransitionResult, 'state'> => {
  const mixes = content.sets;
  const latest = mixes[0];

  if (scene === 'intro') {
    return {
      lines: [
        `> Booting ${content.djName} terminal guide...`,
        'This is a scripted assistant experience (no live AI API).',
        `${content.tagline}`,
        `Region: ${content.region} | Tempo: ${content.bpmRange}`,
        'Tap any action chip below or type "help".'
      ],
      actions: BASE_ACTIONS,
      showThinking: false
    };
  }

  if (scene === 'help') {
    return {
      lines: [
        'Commands: help, mixes, mix <n>, play/latest, book, links, about, open, back, clear.',
        'Mobile-first tip: everything works through action chips too.'
      ],
      actions: withBackAction(BASE_ACTIONS, state),
      showThinking: false
    };
  }

  if (scene === 'play') {
    const hasMix = Boolean(latest?.url);
    return {
      lines: hasMix
        ? [`Now loading latest mix: ${latest.title || 'Untitled Mix'}.`, latest.description || 'No description available.']
        : ['No mixes available yet in content/content.json.'],
      actions: withBackAction(
        [
          hasMix ? { label: 'Open Latest', actionId: 'mix.select', args: { mixIndex: 0 } } : { label: 'Mixes', actionId: 'goto', args: { scene: 'mixes' } },
          ...BASE_ACTIONS
        ],
        state
      ),
      showThinking: true
    };
  }

  if (scene === 'mixes') {
    const lines =
      mixes.length > 0
        ? ['Available mixes:', ...mixes.map((mix, index) => `${index + 1}. ${mix.title || `Mix ${index + 1}`} (${mix.platform || 'Platform N/A'})`)]
        : ['No mixes found in content/content.json.'];

    const mixActions = mixes.slice(0, 6).map((mix, index) => ({
      label: `Mix ${index + 1}`,
      actionId: 'mix.select' as const,
      args: { mixIndex: index }
    }));

    return {
      lines,
      actions: withBackAction([...mixActions, ...BASE_ACTIONS], state),
      showThinking: true
    };
  }

  if (scene === 'mix_detail') {
    const selected = state.selectedMixIndex === null ? null : mixes[state.selectedMixIndex];

    if (!selected) {
      return {
        lines: ['No mix selected. Use "mixes" and choose one with chips or "mix <n>".'],
        actions: withBackAction(BASE_ACTIONS, state),
        showThinking: false
      };
    }

    const selectedGenre = content.genres[state.selectedMixIndex % content.genres.length]?.toLowerCase() || '';
    const nextSuggestion =
      selectedGenre.includes('melodic techno') || selected.title?.toLowerCase().includes('melodic techno')
        ? 'Since you picked melodic techno, try indie dance next.'
        : state.userInterest.includes('melodic techno')
          ? 'You might also enjoy indie dance textures in the next set.'
          : 'Want another direction? Try the next mix from the list.';

    return {
      lines: [
        `Selected mix ${state.selectedMixIndex + 1}: ${selected.title || 'Untitled'}`,
        selected.description || 'No description available for this mix.',
        selected.url ? `Link ready: ${selected.url}` : 'No URL saved for this mix.',
        nextSuggestion
      ],
      actions: withBackAction(
        [
          { label: 'Open Mix', actionId: 'open.current' },
          { label: 'Mixes', actionId: 'goto', args: { scene: 'mixes' } },
          ...BASE_ACTIONS
        ],
        state
      ),
      showThinking: true
    };
  }

  if (scene === 'booking') {
    const dmTarget = getInstagramDmTarget(content);

    return {
      lines: [
        'Booking flow:',
        `DM on Instagram: ${dmTarget}`,
        'Preferred message: "Hi, I want to book you for a set in [city/date]."'
      ],
      actions: withBackAction(
        [
          { label: 'Copy DM Handle', actionId: 'copy.booking' },
          ...BASE_ACTIONS
        ],
        state
      ),
      copyValue: dmTarget,
      showThinking: false
    };
  }

  if (scene === 'links') {
    const links = Object.entries(content.links).filter(([, value]) => Boolean(value));

    return {
      lines: links.length > 0 ? ['Official links:', ...links.map(([name, value]) => `- ${name}: ${value}`)] : ['No links found in content/content.json.'],
      actions: withBackAction(BASE_ACTIONS, state),
      showThinking: false
    };
  }

  return {
    lines: [
      `${content.djName} — ${content.bioShort}`,
      `Genres: ${content.genres.join(', ')}`
    ],
    actions: withBackAction(BASE_ACTIONS, state),
    showThinking: false
  };
};

const pushHistory = (state: TerminalState, nextScene: SceneId): TerminalState => ({
  ...state,
  history: state.lastScene === nextScene ? state.history : [...state.history, state.lastScene],
  lastScene: nextScene
});

export const runAction = (
  action: ActionChip,
  state: TerminalState,
  content: SiteContent
): TransitionResult => {
  if (action.actionId === 'clear') {
    const sceneOutput = getSceneOutput(state.lastScene, state, content);
    return {
      ...sceneOutput,
      state,
      clearOutput: true
    };
  }

  if (action.actionId === 'back') {
    const previous = state.history[state.history.length - 1] || 'intro';
    const nextState = {
      ...state,
      lastScene: previous,
      history: state.history.slice(0, -1)
    };
    const sceneOutput = getSceneOutput(previous, nextState, content);
    return { ...sceneOutput, state: nextState };
  }

  if (action.actionId === 'goto' && action.args?.scene) {
    const nextState = pushHistory(state, action.args.scene);
    const sceneOutput = getSceneOutput(action.args.scene, nextState, content);
    return {
      ...sceneOutput,
      state: nextState
    };
  }

  if (action.actionId === 'mix.select' && typeof action.args?.mixIndex === 'number') {
    const mixIndex = action.args.mixIndex;
    const mix = content.sets[mixIndex];
    const loweredGenreBlob = `${mix?.title || ''} ${mix?.description || ''}`.toLowerCase();
    const userInterest = new Set(state.userInterest);

    if (loweredGenreBlob.includes('melodic techno') || content.genres[mixIndex % content.genres.length]?.toLowerCase().includes('melodic techno')) {
      userInterest.add('melodic techno');
    }

    const nextState = pushHistory(
      {
        ...state,
        selectedMixIndex: mixIndex,
        lastOpened: mix?.url || state.lastOpened,
        userInterest: Array.from(userInterest)
      },
      'mix_detail'
    );

    const sceneOutput = getSceneOutput('mix_detail', nextState, content);

    return {
      ...sceneOutput,
      state: nextState
    };
  }

  if (action.actionId === 'open.current') {
    const currentUrl =
      (typeof state.selectedMixIndex === 'number' ? content.sets[state.selectedMixIndex]?.url : null) || state.lastOpened || null;

    const lines = currentUrl ? [`Opening link: ${currentUrl}`] : ['No current mix link available. Select a mix first.'];

    return {
      state,
      lines,
      actions: withBackAction(BASE_ACTIONS, state),
      openUrl: currentUrl || undefined,
      showThinking: false
    };
  }

  if (action.actionId === 'copy.booking') {
    const dmTarget = getInstagramDmTarget(content);

    return {
      state,
      lines: [`Copied booking handle: ${dmTarget}`],
      actions: withBackAction(BASE_ACTIONS, state),
      copyValue: dmTarget,
      showThinking: false
    };
  }

  const fallback = getSceneOutput('help', state, content);
  return {
    ...fallback,
    state
  };
};

export const commandToAction = (raw: string): ActionChip | null => {
  const normalized = raw.trim().toLowerCase();

  if (!normalized) {
    return null;
  }

  if (normalized === 'help') return { label: 'Help', actionId: 'goto', args: { scene: 'help' } };
  if (normalized === 'mixes') return { label: 'Mixes', actionId: 'goto', args: { scene: 'mixes' } };
  if (normalized === 'book') return { label: 'Book', actionId: 'goto', args: { scene: 'booking' } };
  if (normalized === 'links') return { label: 'Links', actionId: 'goto', args: { scene: 'links' } };
  if (normalized === 'about') return { label: 'About', actionId: 'goto', args: { scene: 'about' } };
  if (normalized === 'play' || normalized === 'latest') return { label: 'Latest', actionId: 'goto', args: { scene: 'play' } };
  if (normalized === 'open') return { label: 'Open Current', actionId: 'open.current' };
  if (normalized === 'back') return { label: 'Back', actionId: 'back' };
  if (normalized === 'clear') return { label: 'Clear', actionId: 'clear' };

  const mixMatch = normalized.match(/^mix\s+(\d+)$/);
  if (mixMatch) {
    const index = Number(mixMatch[1]) - 1;
    if (Number.isFinite(index) && index >= 0) {
      return { label: `Mix ${index + 1}`, actionId: 'mix.select', args: { mixIndex: index } };
    }
  }

  return null;
};
