export interface SocialLink {
  label: string;
  url: string;
  platform: string;
}

export interface CoverPhoto {
  src: string;
  alt: string;
}

export interface DjSet {
  platform: string;
  title: string;
  url: string;
}

export interface Gig {
  date?: string;
  venue?: string;
  city?: string;
  note?: string;
}

export interface ContactDetails {
  booking: string;
  email: string;
  instagram: string;
}

export interface BpmRange {
  min: number;
  max: number;
  note?: string;
}

export interface SiteContent {
  djName: string;
  tagline: string;
  bioShort: string;
  genres: string[];
  bpmRange: BpmRange;
  region: string;
  links: SocialLink[];
  coverPhoto: CoverPhoto;
  sets: DjSet[];
  gigs: Gig[];
  contact: ContactDetails;
}

function assertString(value: unknown, field: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid content field: ${field} must be a non-empty string.`);
  }
}

function assertArray(value: unknown, field: string): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`Invalid content field: ${field} must be an array.`);
  }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseContent(raw: unknown): SiteContent {
  if (!isObject(raw)) {
    throw new Error("Invalid content payload: expected an object.");
  }

  assertString(raw.djName, "djName");
  assertString(raw.tagline, "tagline");
  assertString(raw.bioShort, "bioShort");
  assertString(raw.region, "region");

  assertArray(raw.genres, "genres");
  raw.genres.forEach((genre, index) => assertString(genre, `genres[${index}]`));

  if (!isObject(raw.bpmRange)) {
    throw new Error("Invalid content field: bpmRange must be an object.");
  }

  if (typeof raw.bpmRange.min !== "number" || typeof raw.bpmRange.max !== "number") {
    throw new Error("Invalid content field: bpmRange.min and bpmRange.max must be numbers.");
  }

  if (raw.bpmRange.note !== undefined) {
    assertString(raw.bpmRange.note, "bpmRange.note");
  }

  assertArray(raw.links, "links");
  raw.links.forEach((link, index) => {
    if (!isObject(link)) {
      throw new Error(`Invalid content field: links[${index}] must be an object.`);
    }
    assertString(link.label, `links[${index}].label`);
    assertString(link.url, `links[${index}].url`);
    assertString(link.platform, `links[${index}].platform`);
  });

  if (!isObject(raw.coverPhoto)) {
    throw new Error("Invalid content field: coverPhoto must be an object.");
  }
  assertString(raw.coverPhoto.src, "coverPhoto.src");
  assertString(raw.coverPhoto.alt, "coverPhoto.alt");

  assertArray(raw.sets, "sets");
  raw.sets.forEach((set, index) => {
    if (!isObject(set)) {
      throw new Error(`Invalid content field: sets[${index}] must be an object.`);
    }
    assertString(set.platform, `sets[${index}].platform`);
    assertString(set.title, `sets[${index}].title`);
    assertString(set.url, `sets[${index}].url`);
  });

  assertArray(raw.gigs, "gigs");

  if (!isObject(raw.contact)) {
    throw new Error("Invalid content field: contact must be an object.");
  }

  assertString(raw.contact.booking, "contact.booking");
  assertString(raw.contact.email, "contact.email");
  assertString(raw.contact.instagram, "contact.instagram");

  return raw as SiteContent;
}

export async function loadContent(path = "/content/content.json"): Promise<SiteContent> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load content from ${path}: ${response.status} ${response.statusText}`);
  }
  const json = (await response.json()) as unknown;
  return parseContent(json);
}
