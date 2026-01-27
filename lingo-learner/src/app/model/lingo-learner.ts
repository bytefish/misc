export type SegmentType = 'text' | 'gap';

export interface Segment {
  type: SegmentType;
  content?: string;
  answer?: string;
  placeholder?: string;
  isEnding?: boolean;
}

export interface Lesson {
  id: string;
  language: string;
  title: string;
  description: Record<string, string>;
  segments: Segment[];
}
