'use client'
import Link from 'next/link';
import { Search, ShoppingBag, Heart, Menu, X, LayoutGrid, User } from 'lucide-react';
import { useSession, signOut } from '@/lib/auth-client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { shopMenuCategories } from '@/lib/shop-menu';
import CartDrawer from './CartDrawer';
import { useCartStore } from '@/lib/cart-store';

export default function Header() {
  const pathname = usePathname();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const defaultCategoryId = shopMenuCategories[0]?.id ?? '';
  const [activeCategoryId, setActiveCategoryId] = useState(defaultCategoryId);
  const [mobileActiveCategoryId, setMobileActiveCategoryId] = useState<string | null>(null);
  const { data: session } = useSession();
  const { getTotalItems, isOpen, setIsOpen } = useCartStore();
  const cartItemCount = mounted ? getTotalItems() : 0;

  const shopMenuRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstShopLinkRef = useRef<HTMLAnchorElement | null>(null);

  const activeCategory =
    shopMenuCategories.find((category) => category.id === activeCategoryId) ?? null;
  const mobileActiveCategory =
    shopMenuCategories.find((category) => category.id === mobileActiveCategoryId) ?? null;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileActiveCategoryId(null);
  };

  // Hide header in admin area
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 768);

    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', onResize);

    const getFavoritesCount = () => {
      try {
        const rawData = localStorage.getItem('favorites');
        console.log('Raw favorites data:', rawData);

        const favorites = JSON.parse(rawData || '[]');
        console.log('Parsed favorites:', favorites);

        // If it is a non-empty array with invalid data, clear it
        if (Array.isArray(favorites) && favorites.length > 0) {
          const validFavorites = favorites.filter(item => typeof item === 'string' && item.trim());
          if (validFavorites.length !== favorites.length) {
            console.log('Cleaning up invalid favorites data');
            localStorage.setItem('favorites', JSON.stringify(validFavorites));
          }
          console.log('Valid favorites:', validFavorites);
          setFavoritesCount(validFavorites.length);
        } else {
          // Empty or invalid array
          console.log('No valid favorites found, setting count to 0');
          setFavoritesCount(0);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoritesCount(0);
      }
    };
    getFavoritesCount();

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Custom event listeners for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        // Same validation as initial load
        const validFavorites = Array.isArray(favorites) ? favorites.filter(item => typeof item === 'string' && item.trim()) : [];
        setFavoritesCount(validFavorites.length);
      } catch {
        setFavoritesCount(0);
      }
    };

    window.addEventListener('favoritesUpdate', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('favoritesUpdate', handleFavoritesUpdate);
    };
  }, []);

  // Body scroll lock when mobile menu is open
  useLayoutEffect(() => {
    if (!isMobileMenuOpen) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  const cancelHoverTimers = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openShopMenu = () => {
    cancelHoverTimers();
    setIsShopMenuOpen(true);
    setActiveCategoryId((prev) => prev || defaultCategoryId);
  };

  const closeShopMenu = () => {
    cancelHoverTimers();
    setIsShopMenuOpen(false);
  };

  const scheduleOpenShopMenu = () => {
    cancelHoverTimers();
    openTimerRef.current = setTimeout(() => {
      setIsShopMenuOpen(true);
    }, 90);
  };

  const scheduleCloseShopMenu = () => {
    cancelHoverTimers();
    closeTimerRef.current = setTimeout(() => {
      setIsShopMenuOpen(false);
    }, 120);
  };

  useEffect(() => {
    if (!isShopMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeShopMenu();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!shopMenuRef.current?.contains(target)) {
        closeShopMenu();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isShopMenuOpen]);

  useEffect(() => {
    if (!profileOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [profileOpen]);

  useEffect(() => {
    return () => cancelHoverTimers();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl tracking-wide text-zinc-900 hover:text-zinc-700 transition-colors">
          AURFIA
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-6 text-sm">
          {/* Shop (Desktop icon) */}
          {isDesktop && (
            <div
              ref={shopMenuRef}
              className="relative"
              onMouseEnter={scheduleOpenShopMenu}
              onMouseLeave={scheduleCloseShopMenu}
            >
              <button
                type="button"
                aria-label="Open shop"
                aria-haspopup="menu"
                aria-expanded={isShopMenuOpen}
                aria-controls="shop-menu"
                className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
                onClick={() => (isShopMenuOpen ? closeShopMenu() : openShopMenu())}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    openShopMenu();
                    setTimeout(() => firstShopLinkRef.current?.focus(), 0);
                  } else if (event.key === 'Escape') {
                    closeShopMenu();
                  }
                }}
	              >
	                <LayoutGrid size={18} />
	              </button>

              <div
                id="shop-menu"
                role="menu"
                aria-label="Shop categories"
                className={[
                  'absolute right-0 mt-5 w-[92vw] max-w-[980px]',
                  'rounded-none border border-black/10 bg-[#FBFAF8]',
                  'shadow-[0_30px_80px_-60px_rgba(0,0,0,0.45)]',
                  'transition-[opacity,transform] duration-200 ease-out',
                  isShopMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-1 pointer-events-none',
                ].join(' ')}
                onMouseEnter={openShopMenu}
              >
                <div
                  className={`px-8 md:px-10 ${activeCategory ? 'py-8 md:py-10' : 'py-1 md:py-2'}`}
                >
                  <div className={`pb-6 ${activeCategory ? 'border-b border-black/10' : ''}`}>
		                    <div
		                      className="mt-4 w-full"
		                      style={{
		                        display: 'grid',
		                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
		                        columnGap: '2rem',
		                        rowGap: '0.75rem',
		                        alignItems: 'center',
		                      }}
		                    >
		                      {shopMenuCategories.map((category, index) => {
		                        const isActive = category.id === activeCategory?.id;
		                        return (
		                          <Link
		                            key={category.id}
		                            ref={index === 0 ? firstShopLinkRef : undefined}
		                            href={category.href}
		                            role="menuitem"
		                            onMouseEnter={() => setActiveCategoryId(category.id)}
		                            onFocus={() => setActiveCategoryId(category.id)}
		                            style={{
		                              textUnderlineOffset: '14px',
		                              textDecorationThickness: '1px',
		                            }}
		                            className={[
		                              'font-serif text-[15px] leading-8 py-1 text-center transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FBFAF8]',
		                              isActive
		                                ? 'text-zinc-900 font-semibold underline decoration-zinc-900/70'
                                : 'text-zinc-600 hover:text-zinc-900 no-underline hover:underline hover:decoration-zinc-900/70',
		                            ].join(' ')}
		                            onClick={closeShopMenu}
		                          >
		                            {category.label}
		                          </Link>
	                        );
	                      })}
	                    </div>
	                  </div>

	                  {activeCategory ? (
	                    <div className="pt-8">
	                      <div className="grid grid-cols-2 gap-10">
	                        {activeCategory.groups.map((group) => (
	                          <div key={group.label}>
	                            <div className="text-[11px] tracking-[0.18em] uppercase text-zinc-500">
	                              {group.label}
	                            </div>
	                            <div className="mt-5 grid grid-cols-1 gap-2">
	                              {group.items.map((item) => (
	                                <Link
	                                  key={item.slug}
	                                  href={`/shop?category=${activeCategory.id}&subcategory=${item.slug}`}
	                                  role="menuitem"
	                                  className="font-serif text-[15px] leading-8 text-zinc-900/90 hover:text-zinc-900 transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-900/30 focus-visible:ring-offset-4 focus-visible:ring-offset-[#FBFAF8]"
	                                  onClick={closeShopMenu}
	                                >
	                                  <span className="border-b border-transparent hover:border-zinc-900/25 transition-[border-color] duration-200">
	                                    {item.name}
	                                  </span>
	                                </Link>
	                              ))}
	                            </div>
	                          </div>
	                        ))}
	                      </div>
	                    </div>
	                  ) : null}
	                </div>
	              </div>
	            </div>
	          )}

          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
                    } else if (e.key === 'Escape') {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }
                  }}
                  className="w-48 md:w-64 h-8 px-3 text-sm border border-zinc-200 rounded-none focus:outline-none focus:border-zinc-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="opacity-70 hover:opacity-100 text-zinc-600 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {session ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
                aria-label="Profile"
              >
                <User size={18} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-100 shadow-lg">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-medium text-zinc-900 truncate">{session.user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/wishlist"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                    >
                      Wishlist
                    </Link>
                    {(session.user as any).role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <User size={18} />
            </Link>
          )}

          <a 
            href="/wishlist" 
            className="text-zinc-600 hover:text-zinc-900 relative flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Heart size={18} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 text-xs font-light text-zinc-900 bg-white rounded-full px-1.5">
                {favoritesCount}
              </span>
            )}
          </a>

          <button
            onClick={() => setIsOpen(true)}
            className="text-zinc-600 hover:text-zinc-900 relative flex items-center gap-1 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          >
            <ShoppingBag size={18} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 text-xs font-light text-zinc-900 bg-white rounded-full px-0.75">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          {mounted && !isDesktop && (
            <button
              className="opacity-70 hover:opacity-100 transition-opacity duration-150 cursor-pointer"
              aria-label="Open menu"
              onClick={() => {
                setIsMobileMenuOpen(true);
                setMobileActiveCategoryId(null);
              }}
            >
              <Menu size={20} />
            </button>
          )}
        </div>
      </div>

      {isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50 cursor-pointer"
            onClick={closeMobileMenu}
          />

          <div className="absolute right-0 top-0 h-full w-[88vw] max-w-sm flex flex-col bg-[#FBFAF8] border-l border-black/10 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.45)]">
            <div className="h-16 px-5 flex items-center justify-between border-b border-black/10 shrink-0">
              <span className="font-serif text-base tracking-wide text-zinc-900/90">
                AURFIA
              </span>
              <button
                className="text-zinc-700 hover:text-zinc-900 transition-colors cursor-pointer"
                onClick={closeMobileMenu}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6">
              <button
                type="button"
                className="w-full flex items-center justify-between font-serif text-[16px] tracking-wide text-zinc-900/90 py-3 border-b border-black/10 cursor-pointer"
                aria-expanded={isMobileShopOpen}
                onClick={() => setIsMobileShopOpen((v) => !v)}
              >
                <span>Shop</span>
                <span className="text-zinc-500 text-sm">{isMobileShopOpen ? '—' : '+'}</span>
              </button>

              {isMobileShopOpen && (
                <div className="pt-5 space-y-7">
                  <div>
                    <div className="mt-3 space-y-1">
                      {shopMenuCategories.map((category) => {
                        const isActive = mobileActiveCategoryId === category.id;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            className="w-full flex items-center justify-between min-h-[44px] font-serif text-[15px] text-zinc-900/90 border-b border-black/10 py-2 transition-colors duration-150 hover:text-zinc-900 cursor-pointer"
                            onClick={() =>
                              setMobileActiveCategoryId((prev) =>
                                prev === category.id ? null : category.id,
                              )
                            }
                          >
                            <span>{category.label}</span>
                            <span className="text-xs text-zinc-500">{isActive ? '—' : '+'}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {mobileActiveCategory ? (
                    <div>
                      <div className="text-[13px] uppercase tracking-[0.3em] text-zinc-500">
                        {mobileActiveCategory.label}
                      </div>
                      <Link
                        href={mobileActiveCategory.href}
                        className="inline-flex items-center text-sm font-semibold text-zinc-900"
                        onClick={closeMobileMenu}
                      >
                        View all {mobileActiveCategory.label}
                      </Link>
                      <div className="mt-5 space-y-7">
                        {mobileActiveCategory.groups.map((group) => (
                          <div key={group.label}>
                            <div className="text-[11px] tracking-[0.18em] uppercase text-zinc-500">
                              {group.label}
                            </div>
                            <div className="mt-3 space-y-1">
                              {group.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  href={`/shop?category=${mobileActiveCategory.id}&subcategory=${item.slug}`}
                                  className="flex items-center min-h-[44px] font-serif text-[15px] text-zinc-900/90"
                                  onClick={closeMobileMenu}
                                >
                                  <span className="border-b border-transparent hover:border-zinc-900/25 transition-[border-color] duration-200">
                                    {item.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-zinc-500">Tap a category to see subcategories.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-black/10 px-5 py-4 mt-2 space-y-2">
            {session ? (
              <>
                <div className="pb-2 border-b border-black/10">
                  <p className="text-sm font-medium text-zinc-900 truncate">{session.user.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{session.user.email}</p>
                </div>
                <Link
                  href="/wishlist"
                  className="block text-sm text-zinc-600 hover:text-zinc-900"
                  onClick={closeMobileMenu}
                >
                  Wishlist
                </Link>
                {(session.user as any).role === "admin" && (
                  <Link
                    href="/admin"
                    className="block text-sm text-zinc-600 hover:text-zinc-900"
                    onClick={closeMobileMenu}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); closeMobileMenu(); }}
                  className="block text-sm text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="block text-sm font-medium text-zinc-600 hover:text-zinc-900"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Cart Drawer */}
      <CartDrawer open={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}
