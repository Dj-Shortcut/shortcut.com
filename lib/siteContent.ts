import rawContent from '@/content/content.json';

export type ContentLinkMap = {
  soundcloud?: string;
  facebook?: string;
  youtubeChannel?: string;
  instagram?: string;
};

export type ContentSet = {
  title?: string;
  platform?: string;
  url?: string;
  description?: string;
};

export type ContentGig = {
  date?: string;
  venue?: string;
  city?: string;
  note?: string;
};

export type SiteContent = {
  djName: string;
  tagline: string;
  bioShort: string;
  genres: string[];
  bpmRange: string;
  region: string;
  links: ContentLinkMap;
  coverPhoto: string;
  ogImage?: string;
  sets: ContentSet[];
  gigs: ContentGig[];
  contact: string;
  bootLogLines: string[];
};

type RawSiteContent = Partial<SiteContent> & {
  higherDimensionsSets?: ContentSet[];
};

const fallbackContent: SiteContent = {
  djName: 'DJ PROFILE',
  tagline: 'Terminal mode engaged.',
  bioShort: 'Artist profile currently loading.',
  genres: ['Electronic'],
  bpmRange: '120-140 BPM',
  region: 'Unknown Region',
  links: {},
  coverPhoto: '/cover.jpg',
  sets: [],
  gigs: [],
  contact: 'DM for bookings.',
  bootLogLines: ['[SYS] BOOTING PROFILE...', '[WARN] CONTENT SOURCE NOT AVAILABLE', '[OK] SAFE MODE READY']
};

export function getSiteContent(): SiteContent {
  try {
    const content = rawContent as RawSiteContent;
    const mappedSets = Array.isArray(content.sets)
      ? content.sets
      : Array.isArray(content.higherDimensionsSets)
        ? content.higherDimensionsSets
        : fallbackContent.sets;

    return {
      djName: content.djName || fallbackContent.djName,
      tagline: content.tagline || fallbackContent.tagline,
      bioShort: content.bioShort || fallbackContent.bioShort,
      genres: Array.isArray(content.genres) && content.genres.length ? content.genres : fallbackContent.genres,
      bpmRange: content.bpmRange || fallbackContent.bpmRange,
      region: content.region || fallbackContent.region,
      links: content.links || fallbackContent.links,
      coverPhoto: content.coverPhoto || fallbackContent.coverPhoto,
      ogImage: content.ogImage || content.coverPhoto || fallbackContent.coverPhoto,
      sets: mappedSets,
      gigs: Array.isArray(content.gigs) ? content.gigs : fallbackContent.gigs,
      contact: content.contact || fallbackContent.contact,
      bootLogLines:
        Array.isArray(content.bootLogLines) && content.bootLogLines.length
          ? content.bootLogLines
          : fallbackContent.bootLogLines
    };
  } catch {
    return fallbackContent;
  }
}
