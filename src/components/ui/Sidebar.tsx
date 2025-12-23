'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  BookOpen,
  Swords,
  Sparkles,
  Backpack,
  Skull,
  Dice6,
  Settings,
  Menu,
  X,
  ChevronRight,
  Volume2,
  VolumeX,
  Crown,
  Play,
  StickyNote,
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'play', label: 'Play Online', href: '/play', icon: <Play size={20} /> },
  { id: 'dashboard', label: 'Dashboard', href: '/', icon: <Home size={20} /> },
  { id: 'characters', label: 'Characters', href: '/characters', icon: <Users size={20} /> },
  { id: 'campaign', label: 'Campaign', href: '/campaign', icon: <BookOpen size={20} /> },
  { id: 'combat', label: 'Combat', href: '/combat', icon: <Swords size={20} /> },
  { id: 'spells', label: 'Spells', href: '/spells', icon: <Sparkles size={20} /> },
  { id: 'inventory', label: 'Inventory', href: '/inventory', icon: <Backpack size={20} /> },
  { id: 'bestiary', label: 'Bestiary', href: '/bestiary', icon: <Skull size={20} /> },
  { id: 'npc-generator', label: 'NPC Generator', href: '/tools/npc-generator', icon: <Users size={20} /> },
  { id: 'notes', label: 'Session Notes', href: '/tools/notes', icon: <StickyNote size={20} /> },
  { id: 'dice', label: 'Dice Roller', href: '/dice', icon: <Dice6 size={20} /> },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const pathname = usePathname();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleSound = () => setSoundEnabled(!soundEnabled);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={styles.sidebarHeader}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Crown size={24} className={styles.crownIcon} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className={styles.logoText}
              >
                Realm of Adventures
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button className={`${styles.collapseBtn} ${styles.desktopOnly}`} onClick={toggleCollapse}>
          <ChevronRight
            size={16}
            className={isCollapsed ? '' : styles.rotated}
          />
        </button>
        <button className={`${styles.collapseBtn} ${styles.mobileOnly}`} onClick={toggleMobile}>
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebarNav}>
        <ul>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={styles.navLabel}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={styles.activeIndicator}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <button className={styles.footerBtn} onClick={toggleSound} title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}>
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <Link href="/settings" className={styles.footerBtn} title="Settings">
          <Settings size={20} />
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`${styles.sidebar} ${styles.desktopSidebar} ${isCollapsed ? styles.collapsed : ''}`}
        style={{ width: isCollapsed ? '72px' : '260px' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Menu Button */}
      <button className={styles.mobileMenuBtn} onClick={toggleMobile}>
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.sidebarOverlay}
              onClick={toggleMobile}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className={`${styles.sidebar} ${styles.mobileSidebar}`}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
