export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: PostStatus;
  publishedAt?: string | null;
};

export type SocialLink = { label: string; href: string };

export type EnquiryStage = "New" | "Replied" | "Call booked" | "Proposal" | "Won" | "Lost";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  message: string;
  source: string;
  stage: EnquiryStage;
  icpFit: string;
  notes: string;
  createdAt: string;
};

export type MediaAsset = {
  id: string;
  filename: string;
  mime: string;
  size: number;
  alt: string;
  createdAt: string;
  /** Public path to fetch the bytes */
  url: string;
};
