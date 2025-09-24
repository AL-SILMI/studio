'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BrainCircuit,
  LayoutDashboard,
  Mic,
  Puzzle,
  LineChart,
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/tasks',
    label: 'Cognitive Tasks',
    icon: BrainCircuit,
    subLinks: [
      { href: '/tasks/memory', label: 'Memory Game' },
      { href: '/tasks/pattern', label: 'Pattern Game' },
    ],
  },
  {
    href: '/speech',
    label: 'Speech Analysis',
    icon: Mic,
  },
  {
    href: '/history',
    label: 'Performance History',
    icon: LineChart,
    disabled: true,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === link.href}
            disabled={link.disabled}
            tooltip={link.label}
          >
            <Link href={link.disabled ? '#' : link.href}>
              <link.icon />
              <span>{link.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
