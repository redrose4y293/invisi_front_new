export type FileKind = 'NDA' | 'Spec' | 'Report' | 'Marketing';

export type Lead = {
  name: string;
  email: string;
  company?: string;
  type: 'General' | 'Prototype' | 'Dealership';
  message?: string;
};

export type Dealer = {
  id: string;
  email: string;
  name?: string;
};

export type FileItem = {
  id: string;
  name: string;
  kind: FileKind;
  size?: number;
  url: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};
