// Common types for the LILO platform

export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface LinkItem {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  href: string;
  current?: boolean;
}