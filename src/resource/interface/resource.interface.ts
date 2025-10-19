export interface Resource {
  id: number;
  title: string;
  url: string;
  type: string;
  content: string | null;
  createdAt: Date | string;
}

export enum ResourceType {
  ARTICLE = 'ARTICLE',
  VIDEO = 'VIDEO',
  COURSE = 'COURSE',
  PDF = 'PDF',
}

