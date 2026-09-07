// src/utils/listingDisplay.tsx
// Small, deterministic "visual identity" helpers for listings that have no
// photo — a category icon plus a gradient, so the catalog doesn't read as a
// wall of identical gray cards.
import Category from '@mui/icons-material/Category';
import Chair from '@mui/icons-material/Chair';
import Devices from '@mui/icons-material/Devices';
import EditNote from '@mui/icons-material/EditNote';
import MenuBook from '@mui/icons-material/MenuBook';
import Science from '@mui/icons-material/Science';
import { createElement, type ComponentType, type ReactElement } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';
import type { ListingStatus } from '../features/listings/listingTypes';

type IconComponent = ComponentType<SvgIconProps>;

const CATEGORY_ICONS: Record<string, IconComponent> = {
  textbooks: MenuBook,
  electronics: Devices,
  furniture: Chair,
  stationery: EditNote,
  'lab equipment': Science,
};

const GRADIENTS = [
  'linear-gradient(135deg, #2451b5 0%, #5b7fd6 100%)',
  'linear-gradient(135deg, #0ea5a3 0%, #4fd1cf 100%)',
  'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
  'linear-gradient(135deg, #d97706 0%, #fbbf24 100%)',
  'linear-gradient(135deg, #db2777 0%, #f472b6 100%)',
  'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

// Returns a ready-to-render element (not a component reference) — the
// lookup key varies per render, and returning an element instead avoids the
// "components created during render" pattern React lint rules flag when a
// PascalCase variable produced by a function call is rendered as JSX.
export function getCategoryIcon(categoryName: string, props?: SvgIconProps): ReactElement {
  const Icon = CATEGORY_ICONS[categoryName.trim().toLowerCase()] ?? Category;
  return createElement(Icon, props);
}

export function getCategoryGradient(categoryName: string): string {
  const index = hashString(categoryName) % GRADIENTS.length;
  return GRADIENTS[index];
}

export const STATUS_LABEL: Record<ListingStatus, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
  ARCHIVED: 'Archived',
};

export function getStatusChipProps(status: ListingStatus): {
  color: 'success' | 'warning' | 'default';
  variant: 'filled' | 'outlined';
} {
  switch (status) {
    case 'AVAILABLE':
      return { color: 'success', variant: 'filled' };
    case 'RESERVED':
      return { color: 'warning', variant: 'filled' };
    case 'SOLD':
      return { color: 'default', variant: 'filled' };
    case 'ARCHIVED':
    default:
      return { color: 'default', variant: 'outlined' };
  }
}
