import {createNavigation} from 'next-intl/navigation';
import {routing} from './routing';

// ใช้ wrapper ของ next-intl แทน next/navigation
export const {Link, redirect, useRouter, usePathname, getPathname} =
  createNavigation(routing);
