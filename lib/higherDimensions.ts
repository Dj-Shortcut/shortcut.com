import { unstable_cache } from 'next/cache';

import { getSiteContent } from '@/lib/siteContent';

export const DESCRIPTION_FALLBACK = 'Description not loaded — see YouTube';

export type DescriptionOption = 'A' | 'B' | 'C';

export type HigherDimensionsSet = {
  title: string;
  url: string;
  description?: string;
  duration?: string;
  descriptionOption?: DescriptionOption;
};

type YouTubeSnippet = {
  items?: Array<{
    snippet?: {
      title?: string;
      description?: string;
    };
  }>;
};

type OEmbedResponse = {
  title?: string;
};

const isYouTubeApiEnabled =
  process.env.NEXT_PUBLIC_ENABLE_YOUTUBE_DATA_API === 'true' &&
  Boolean(process.env.YOUTUBE_API_KEY);

const fetchYouTubeSnippet = unstable_cache(
  async (videoId: string) => {
    if (!isYouTubeApiEnabled || !process.env.YOUTUBE_API_KEY) {
      return null;
    }

    const params = new URLSearchParams({
      part: 'snippet',
      id: videoId,
      key: process.env.YOUTUBE_API_KEY
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as YouTubeSnippet;
    return payload.items?.[0]?.snippet ?? null;
  },
  ['youtube-snippet'],
  { revalidate: 3600 }
);

const fetchYouTubeOEmbedTitle = unstable_cache(
  async (setUrl: string) => {
    const oEmbedUrl = new URL('https://www.youtube.com/oembed');
    oEmbedUrl.searchParams.set('url', setUrl);
    oEmbedUrl.searchParams.set('format', 'json');

    const response = await fetch(oEmbedUrl.toString(), {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as OEmbedResponse;
    return payload.title ?? null;
  },
  ['youtube-oembed-title'],
  { revalidate: 3600 }
);

const getVideoIdFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
};

export const resolveHigherDimensionsSet = async (
  set: HigherDimensionsSet
): Promise<HigherDimensionsSet> => {
  const option = set.descriptionOption ?? 'A';

  if (option === 'A') {
    return {
      ...set,
      description: set.description?.trim() ? set.description : DESCRIPTION_FALLBACK
    };
  }

  if (option === 'B') {
    const videoId = getVideoIdFromUrl(set.url);

    if (videoId) {
      const snippet = await fetchYouTubeSnippet(videoId);
      if (snippet?.description?.trim()) {
        return {
          ...set,
          title: snippet.title?.trim() || set.title,
          description: snippet.description
        };
      }
    }

    return {
      ...set,
      description: set.description?.trim() ? set.description : DESCRIPTION_FALLBACK
    };
  }

  const oEmbedTitle = await fetchYouTubeOEmbedTitle(set.url);
  return {
    ...set,
    title: oEmbedTitle?.trim() || set.title,
    description: DESCRIPTION_FALLBACK
  };
};

export const getHigherDimensionsSets = async (): Promise<HigherDimensionsSet[]> => {
  const content = getSiteContent();
  const sets = content.sets as HigherDimensionsSet[];

  return Promise.all(sets.map((set) => resolveHigherDimensionsSet(set)));
};
