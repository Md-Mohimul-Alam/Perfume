import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

import {
  useCart,
} from '../contexts/CartContext';

/* ========================================
   CONFIG
======================================== */

const INITIAL_VISIBLE_COUNT =
  8;

/* ========================================
   HELPERS
======================================== */

const number = (
  value
) => {
  const parsed =
    Number(
      value
    );

  return Number.isFinite(
    parsed
  )
    ? parsed
    : 0;
};

const typeLabel = (
  type
) =>
  type ===
  'roll-on'
    ? 'Roll-on'
    : 'Spray';

const bottleName = (
  bottle
) =>
  `${number(
    bottle?.sizeMl
  )}ml ${typeLabel(
    bottle?.type
  )} Bottle`;

const formatPrice = (
  value
) =>
  new Intl.NumberFormat(
    'en-BD',
    {
      maximumFractionDigits:
        0,
    }
  ).format(
    number(
      value
    )
  );

/* ========================================
   IMAGE GALLERY
======================================== */

const BottleImage = ({
  bottle,
}) => {
  const images =
    Array.isArray(
      bottle?.images
    )
      ? bottle.images
          .map(
            (
              image
            ) =>
              String(
                image ||
                  ''
              ).trim()
          )
          .filter(
            Boolean
          )
      : [];

  const [
    imageIndex,
    setImageIndex,
  ] = useState(
    0
  );

  const [
    failedImages,
    setFailedImages,
  ] = useState(
    {}
  );

  const activeImage =
    images[
      imageIndex
    ];

  const imageFailed =
    Boolean(
      failedImages[
        imageIndex
      ]
    );

  const changeImage = (
    index
  ) => {
    if (
      images.length ===
      0
    ) {
      return;
    }

    const total =
      images.length;

    const nextIndex =
      (
        index +
        total
      ) %
      total;

    setImageIndex(
      nextIndex
    );
  };

  const previous = (
    event
  ) => {
    event.stopPropagation();

    changeImage(
      imageIndex -
        1
    );
  };

  const next = (
    event
  ) => {
    event.stopPropagation();

    changeImage(
      imageIndex +
        1
    );
  };

  return (
    <div className="relative h-[280px] overflow-hidden bg-gradient-to-b from-white/[0.06] via-white/[0.025] to-transparent sm:h-[300px]">

      {/* LIGHT */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.13),transparent_52%)]" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-full bg-black/60 blur-2xl" />

      {/* TYPE BADGE */}

      <div className="absolute left-4 top-4 z-20">
        <span className="inline-flex items-center rounded-full border border-gold/20 bg-black/60 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gold backdrop-blur-xl">
          {typeLabel(
            bottle.type
          )}
        </span>
      </div>

      {/* IMAGE */}

      <AnimatePresence
        mode="wait"
      >
        {activeImage &&
        !imageFailed ? (
          <motion.img
            key={`${activeImage}-${imageIndex}`}
            src={
              activeImage
            }
            alt={
              bottleName(
                bottle
              )
            }
            initial={{
              opacity: 0,
              scale:
                0.96,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale:
                0.98,
            }}
            transition={{
              duration:
                0.3,
            }}
            loading="lazy"
            className="relative z-10 h-full w-full object-contain p-7 transition-transform duration-700 group-hover:scale-[1.045]"
            onError={() =>
              setFailedImages(
                (
                  previousState
                ) => ({
                  ...previousState,

                  [imageIndex]:
                    true,
                })
              )
            }
          />
        ) : (
          <motion.div
            key="placeholder"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="relative z-10 flex h-full flex-col items-center justify-center"
          >
            <div className="flex h-28 w-20 items-center justify-center rounded-2xl border border-gold/20 bg-gold/[0.04] shadow-[0_20px_50px_-15px_rgba(212,175,55,0.25)]">
              <Package
                size={
                  42
                }
                strokeWidth={
                  1.25
                }
                className="text-gold/60"
              />
            </div>

            <p className="mt-4 text-xs uppercase tracking-[0.16em] text-gray-600">
              Image coming soon
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* IMAGE CONTROLS */}

      {images.length >
        1 && (
        <>
          <button
            type="button"
            onClick={
              previous
            }
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/75 opacity-0 backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:bg-black/80 hover:text-gold group-hover:opacity-100"
            aria-label="Previous bottle image"
          >
            <ChevronLeft
              size={
                18
              }
            />
          </button>

          <button
            type="button"
            onClick={
              next
            }
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/55 text-white/75 opacity-0 backdrop-blur-xl transition-all duration-300 hover:border-gold/40 hover:bg-black/80 hover:text-gold group-hover:opacity-100"
            aria-label="Next bottle image"
          >
            <ChevronRight
              size={
                18
              }
            />
          </button>

          {/* IMAGE COUNTER */}

          <span className="absolute bottom-4 right-4 z-20 rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-gray-300 backdrop-blur-xl">
            {imageIndex +
              1}
            /
            {
              images.length
            }
          </span>

          {/* DOTS */}

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5">

            {images.map(
              (
                _,
                index
              ) => (
                <button
                  key={
                    index
                  }
                  type="button"
                  onClick={(
                    event
                  ) => {
                    event.stopPropagation();

                    changeImage(
                      index
                    );
                  }}
                  aria-label={`Show bottle image ${index + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    imageIndex ===
                    index
                      ? 'h-1.5 w-5 bg-gold'
                      : 'h-1.5 w-1.5 bg-white/35 hover:bg-white/70'
                  }`}
                />
              )
            )}

          </div>
        </>
      )}

    </div>
  );
};

/* ========================================
   QUANTITY CONTROL
======================================== */

const QuantityControl = ({
  quantity,
  stock,
  setQuantity,
}) => {
  const decrease =
    () => {
      setQuantity(
        (
          current
        ) =>
          Math.max(
            1,
            current -
              1
          )
      );
    };

  const increase =
    () => {
      setQuantity(
        (
          current
        ) =>
          Math.min(
            stock,
            current +
              1
          )
      );
    };

  return (
    <div className="flex items-center rounded-full border border-white/10 bg-black/30 p-1">

      <button
        type="button"
        onClick={
          decrease
        }
        disabled={
          quantity <=
          1
        }
        aria-label="Decrease quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
      >
        −
      </button>

      <span className="min-w-8 text-center text-sm font-semibold text-white">
        {
          quantity
        }
      </span>

      <button
        type="button"
        onClick={
          increase
        }
        disabled={
          quantity >=
          stock
        }
        aria-label="Increase quantity"
        className="flex h-8 w-8 items-center justify-center rounded-full text-lg text-gray-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
      >
        +
      </button>

    </div>
  );
};

/* ========================================
   BOTTLE CARD
======================================== */

const BottleCard = ({
  bottle,
}) => {
  const {
    addBottleToCart,
  } = useCart();

  const [
    quantity,
    setQuantity,
  ] = useState(
    1
  );

  const [
    added,
    setAdded,
  ] = useState(
    false
  );

  const stock =
    number(
      bottle
        .currentStock
    );

  const price =
    number(
      bottle
        .sellingPrice
    );

  const stockOut =
    stock <=
      0 ||
    Boolean(
      bottle
        .isStockOut
    );

  const lowStock =
    !stockOut &&
    stock <=
      3;

  const hasPrice =
    price >
    0;

  const canBuy =
    !stockOut &&
    hasPrice;

  const handleAdd =
    () => {
      if (
        !canBuy
      ) {
        return;
      }

      addBottleToCart(
        bottle,
        quantity
      );

      setAdded(
        true
      );

      setTimeout(
        () => {
          setAdded(
            false
          );
        },
        1400
      );
    };

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 10,
      }}
      transition={{
        duration:
          0.35,
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-white/[0.075] bg-gradient-to-b from-white/[0.055] to-white/[0.018] shadow-[0_20px_60px_-35px_rgba(0,0,0,0.9)] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/30 hover:shadow-[0_28px_80px_-35px_rgba(212,175,55,0.4)]"
    >

      <BottleImage
        bottle={
          bottle
        }
      />

      <div className="flex flex-1 flex-col p-5 sm:p-6">

        {/* STOCK */}

        <div className="flex items-center justify-between gap-3">

          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-gold/70">

            <Sparkles
              size={
                12
              }
            />

            Empty Bottle

          </span>

          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${
              stockOut
                ? 'border-red-500/20 bg-red-500/10 text-red-300'
                : lowStock
                  ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
                  : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {stockOut
              ? 'Out of stock'
              : lowStock
                ? `Only ${stock} left`
                : `${stock} in stock`}
          </span>

        </div>

        {/* NAME */}

        <h3 className="mt-4 font-display text-[22px] font-light leading-tight tracking-wide text-white">
          {bottleName(
            bottle
          )}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Premium empty perfume bottle for refilling, gifting or personal fragrance use.
        </p>

        {/* DETAILS */}

        <div className="mt-5 flex flex-wrap items-center gap-2">

          <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-400">
            {number(
              bottle
                .sizeMl
            )}
            ml
          </span>

          <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-400">
            {typeLabel(
              bottle
                .type
            )}
          </span>

          {Array.isArray(
            bottle
              .images
          ) &&
            bottle
              .images
              .filter(
                Boolean
              )
              .length >
              1 && (
            <span className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-gray-400">

              {
                bottle
                  .images
                  .filter(
                    Boolean
                  )
                  .length
              }{' '}
              photos

            </span>
          )}

        </div>

        {/* PRICE */}

        <div className="mt-auto pt-6">

          <div className="border-t border-white/[0.07] pt-5">

            <div className="flex items-end justify-between gap-4">

              <div>

                <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-600">
                  Price
                </span>

                {hasPrice ? (
                  <div className="mt-1 flex items-baseline gap-1">

                    <span className="text-sm font-medium text-gold">
                      ৳
                    </span>

                    <span className="text-2xl font-semibold tracking-tight text-gold">
                      {formatPrice(
                        price
                      )}
                    </span>

                  </div>
                ) : (
                  <span className="mt-1 block text-sm font-medium text-amber-300">
                    Price coming soon
                  </span>
                )}

              </div>

              {canBuy && (
                <QuantityControl
                  quantity={
                    quantity
                  }
                  stock={
                    stock
                  }
                  setQuantity={
                    setQuantity
                  }
                />
              )}

            </div>

            {/* CART BUTTON */}

            <motion.button
              type="button"
              whileTap={
                canBuy
                  ? {
                      scale:
                        0.98,
                    }
                  : undefined
              }
              onClick={
                handleAdd
              }
              disabled={
                !canBuy
              }
              className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-[11px] font-bold uppercase tracking-[0.17em] transition-all duration-300 ${
                canBuy
                  ? added
                    ? 'bg-emerald-400 text-black'
                    : 'bg-gold text-black hover:bg-yellow-300 hover:shadow-[0_8px_28px_rgba(212,175,55,0.3)]'
                  : 'cursor-not-allowed border border-white/[0.06] bg-white/[0.035] text-gray-600'
              }`}
            >

              {added ? (
                <>
                  <ShoppingBag
                    size={
                      15
                    }
                  />

                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={
                      15
                    }
                  />

                  {stockOut
                    ? 'Out of Stock'
                    : !hasPrice
                      ? 'Price Unavailable'
                      : 'Add to Cart'}
                </>
              )}

            </motion.button>

          </div>

        </div>

      </div>

    </motion.article>
  );
};

/* ========================================
   SKELETON
======================================== */

const SkeletonCard =
  () => (
    <div className="animate-pulse overflow-hidden rounded-[24px] border border-white/[0.06] bg-white/[0.025]">

      <div className="h-[300px] bg-white/[0.035]" />

      <div className="space-y-4 p-6">

        <div className="h-3 w-24 rounded-full bg-white/[0.06]" />

        <div className="h-6 w-2/3 rounded bg-white/[0.07]" />

        <div className="space-y-2">

          <div className="h-3 w-full rounded bg-white/[0.04]" />

          <div className="h-3 w-4/5 rounded bg-white/[0.04]" />

        </div>

        <div className="flex gap-2">

          <div className="h-7 w-14 rounded-full bg-white/[0.05]" />

          <div className="h-7 w-16 rounded-full bg-white/[0.05]" />

        </div>

        <div className="border-t border-white/[0.05] pt-4">

          <div className="h-7 w-24 rounded bg-white/[0.06]" />

          <div className="mt-4 h-12 rounded-full bg-white/[0.06]" />

        </div>

      </div>

    </div>
  );

/* ========================================
   EMPTY STATE
======================================== */

const EmptyState = ({
  title,
  description,
}) => (
  <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.02] px-6 py-16 text-center">

    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/[0.05]">

      <Package
        size={
          30
        }
        strokeWidth={
          1.4
        }
        className="text-gold/60"
      />

    </div>

    <h3 className="mt-5 font-display text-2xl font-light tracking-wide text-white">
      {
        title
      }
    </h3>

    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
      {
        description
      }
    </p>

  </div>
);

/* ========================================
   BOTTLE GRID
======================================== */

const BottleGrid = ({
  bottles = [],
  loading = false,
  error = '',
}) => {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState(
    'all'
  );

  const [
    search,
    setSearch,
  ] = useState(
    ''
  );

  const [
    stockFilter,
    setStockFilter,
  ] = useState(
    'all'
  );

  const [
    sortBy,
    setSortBy,
  ] = useState(
    'size-asc'
  );

  const [
    showMobileFilters,
    setShowMobileFilters,
  ] = useState(
    false
  );

  /*
    Only first 8 bottle cards
    are displayed initially.
  */

  const [
    showAll,
    setShowAll,
  ] = useState(
    false
  );

  /* ======================================
     FILTER + SEARCH + SORT
  ====================================== */

  const filtered =
    useMemo(
      () => {
        const query =
          search
            .trim()
            .toLowerCase();

        const result =
          bottles.filter(
            (
              bottle
            ) => {
              const stock =
                number(
                  bottle
                    .currentStock
                );

              const name =
                bottleName(
                  bottle
                )
                  .toLowerCase();

              const type =
                typeLabel(
                  bottle
                    .type
                )
                  .toLowerCase();

              const matchesSearch =
                !query ||
                name.includes(
                  query
                ) ||
                type.includes(
                  query
                ) ||
                String(
                  bottle
                    .sizeMl
                ).includes(
                  query
                );

              const matchesType =
                activeFilter ===
                  'all' ||
                bottle.type ===
                  activeFilter;

              const matchesStock =
                stockFilter ===
                  'all' ||
                (
                  stockFilter ===
                    'available' &&
                  stock >
                    0
                ) ||
                (
                  stockFilter ===
                    'out' &&
                  stock <=
                    0
                );

              return (
                matchesSearch &&
                matchesType &&
                matchesStock
              );
            }
          );

        return [
          ...result,
        ].sort(
          (
            a,
            b
          ) => {
            if (
              sortBy ===
              'price-asc'
            ) {
              return (
                number(
                  a
                    .sellingPrice
                ) -
                number(
                  b
                    .sellingPrice
                )
              );
            }

            if (
              sortBy ===
              'price-desc'
            ) {
              return (
                number(
                  b
                    .sellingPrice
                ) -
                number(
                  a
                    .sellingPrice
                )
              );
            }

            if (
              sortBy ===
              'size-desc'
            ) {
              return (
                number(
                  b
                    .sizeMl
                ) -
                number(
                  a
                    .sizeMl
                )
              );
            }

            return (
              number(
                a
                  .sizeMl
              ) -
              number(
                b
                  .sizeMl
              )
            );
          }
        );
      },
      [
        bottles,
        activeFilter,
        search,
        stockFilter,
        sortBy,
      ]
    );

  /* ======================================
     ONLY 8 CARDS INITIALLY
  ====================================== */

  const visibleBottles =
    useMemo(
      () =>
        showAll
          ? filtered
          : filtered.slice(
              0,
              INITIAL_VISIBLE_COUNT
            ),
      [
        filtered,
        showAll,
      ]
    );

  /* ======================================
     RESET TO 8 WHEN FILTER CHANGES
  ====================================== */

  useEffect(() => {
    setShowAll(
      false
    );
  }, [
    search,
    activeFilter,
    stockFilter,
    sortBy,
  ]);

  /* ======================================
     CLEAR FILTERS
  ====================================== */

  const clearFilters =
    () => {
      setSearch(
        ''
      );

      setActiveFilter(
        'all'
      );

      setStockFilter(
        'all'
      );

      setSortBy(
        'size-asc'
      );

      setShowAll(
        false
      );
    };

  const hasActiveFilters =
    Boolean(
      search ||
      activeFilter !==
        'all' ||
      stockFilter !==
        'all' ||
      sortBy !==
        'size-asc'
    );

  return (
    <section
      id="bottles"
      className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8"
    >

      {/* BACKGROUND */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gold/[0.035] blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="mx-auto mb-12 max-w-2xl text-center">

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/15 bg-gold/[0.04] px-4 py-2">

            <Sparkles
              size={
                13
              }
              className="text-gold"
            />

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold/80">
              Bottle Collection
            </span>

          </div>

          <h2 className="font-display text-4xl font-light tracking-wide text-white sm:text-5xl lg:text-6xl">

            Empty{' '}

            <span className="text-gold">
              Bottles
            </span>

          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
            Choose from our collection of premium spray and roll-on bottles, available separately for refilling or gifting.
          </p>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-5 py-4 text-sm text-red-300">

            <AlertCircle
              size={
                18
              }
              className="mt-0.5 flex-shrink-0"
            />

            <div>

              <p className="font-semibold">
                Could not load bottles
              </p>

              <p className="mt-1 text-xs text-red-300/70">
                {
                  error
                }
              </p>

            </div>

          </div>
        )}

        {/* ==================================
            SEARCH
        ================================== */}

        {!loading &&
          bottles.length >
            0 && (
          <div className="mb-5">

            <div className="relative mx-auto max-w-xl">

              <Search
                size={
                  17
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
              />

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event
                      .target
                      .value
                  )
                }
                placeholder="Search bottle size or type..."
                className="w-full rounded-full border border-white/[0.08] bg-white/[0.025] py-3.5 pl-11 pr-11 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-gold/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-gold/5"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch(
                      ''
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 transition hover:text-white"
                  aria-label="Clear search"
                >
                  <X
                    size={
                      16
                    }
                  />
                </button>
              )}

            </div>

          </div>
        )}

        {/* ==================================
            DESKTOP FILTERS
        ================================== */}

        {!loading &&
          bottles.length >
            0 && (
          <>
            <div className="mb-8 hidden items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-3 md:flex">

              <div className="flex flex-wrap items-center gap-2">

                {[
                  {
                    key:
                      'all',
                    label:
                      'All',
                  },
                  {
                    key:
                      'spray',
                    label:
                      'Spray',
                  },
                  {
                    key:
                      'roll-on',
                    label:
                      'Roll-on',
                  },
                ].map(
                  (
                    filter
                  ) => (
                    <button
                      key={
                        filter
                          .key
                      }
                      type="button"
                      onClick={() =>
                        setActiveFilter(
                          filter
                            .key
                        )
                      }
                      className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition ${
                        activeFilter ===
                        filter.key
                          ? 'bg-gold text-black'
                          : 'text-gray-500 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      {
                        filter
                          .label
                      }
                    </button>
                  )
                )}

              </div>

              <div className="flex items-center gap-2">

                <select
                  value={
                    stockFilter
                  }
                  onChange={(
                    event
                  ) =>
                    setStockFilter(
                      event
                        .target
                        .value
                    )
                  }
                  className="rounded-full border border-white/[0.08] bg-black px-4 py-2 text-xs text-gray-400 outline-none focus:border-gold/30"
                >

                  <option value="all">
                    All stock
                  </option>

                  <option value="available">
                    Available
                  </option>

                  <option value="out">
                    Out of stock
                  </option>

                </select>

                <select
                  value={
                    sortBy
                  }
                  onChange={(
                    event
                  ) =>
                    setSortBy(
                      event
                        .target
                        .value
                    )
                  }
                  className="rounded-full border border-white/[0.08] bg-black px-4 py-2 text-xs text-gray-400 outline-none focus:border-gold/30"
                >

                  <option value="size-asc">
                    Size: Low to High
                  </option>

                  <option value="size-desc">
                    Size: High to Low
                  </option>

                  <option value="price-asc">
                    Price: Low to High
                  </option>

                  <option value="price-desc">
                    Price: High to Low
                  </option>

                </select>

              </div>

            </div>

            {/* ==================================
                MOBILE FILTERS
            ================================== */}

            <div className="mb-7 md:hidden">

              <button
                type="button"
                onClick={() =>
                  setShowMobileFilters(
                    (
                      previous
                    ) =>
                      !previous
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-sm text-gray-400"
              >

                <span className="flex items-center gap-2">

                  <SlidersHorizontal
                    size={
                      16
                    }
                  />

                  Filters & Sort

                </span>

                <ChevronRight
                  size={
                    17
                  }
                  className={`transition-transform ${
                    showMobileFilters
                      ? 'rotate-90'
                      : ''
                  }`}
                />

              </button>

              <AnimatePresence>

                {showMobileFilters && (
                  <motion.div
                    initial={{
                      opacity:
                        0,
                      height:
                        0,
                    }}
                    animate={{
                      opacity:
                        1,
                      height:
                        'auto',
                    }}
                    exit={{
                      opacity:
                        0,
                      height:
                        0,
                    }}
                    className="overflow-hidden"
                  >

                    <div className="mt-3 space-y-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">

                      <div className="flex flex-wrap gap-2">

                        {[
                          {
                            key:
                              'all',
                            label:
                              'All',
                          },
                          {
                            key:
                              'spray',
                            label:
                              'Spray',
                          },
                          {
                            key:
                              'roll-on',
                            label:
                              'Roll-on',
                          },
                        ].map(
                          (
                            filter
                          ) => (
                            <button
                              key={
                                filter
                                  .key
                              }
                              type="button"
                              onClick={() =>
                                setActiveFilter(
                                  filter
                                    .key
                                )
                              }
                              className={`rounded-full border px-4 py-2 text-xs ${
                                activeFilter ===
                                filter.key
                                  ? 'border-gold bg-gold text-black'
                                  : 'border-white/10 text-gray-400'
                              }`}
                            >
                              {
                                filter
                                  .label
                              }
                            </button>
                          )
                        )}

                      </div>

                      <select
                        value={
                          stockFilter
                        }
                        onChange={(
                          event
                        ) =>
                          setStockFilter(
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-black p-3 text-sm text-gray-300"
                      >

                        <option value="all">
                          All stock
                        </option>

                        <option value="available">
                          Available
                        </option>

                        <option value="out">
                          Out of stock
                        </option>

                      </select>

                      <select
                        value={
                          sortBy
                        }
                        onChange={(
                          event
                        ) =>
                          setSortBy(
                            event
                              .target
                              .value
                          )
                        }
                        className="w-full rounded-xl border border-white/10 bg-black p-3 text-sm text-gray-300"
                      >

                        <option value="size-asc">
                          Size: Low to High
                        </option>

                        <option value="size-desc">
                          Size: High to Low
                        </option>

                        <option value="price-asc">
                          Price: Low to High
                        </option>

                        <option value="price-desc">
                          Price: High to Low
                        </option>

                      </select>

                    </div>

                  </motion.div>
                )}

              </AnimatePresence>

            </div>
          </>
        )}

        {/* ==================================
            RESULT INFO
        ================================== */}

        {!loading &&
          !error &&
          bottles.length >
            0 && (
          <div className="mb-6 flex items-center justify-between gap-3">

            <p className="text-xs text-gray-600">

              Showing{' '}

              <span className="font-semibold text-gray-400">
                {
                  visibleBottles
                    .length
                }
              </span>

              {' '}of{' '}

              <span className="font-semibold text-gray-400">
                {
                  filtered
                    .length
                }
              </span>

              {' '}matching bottles

            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="text-xs font-medium text-gold/70 transition hover:text-gold"
              >
                Clear filters
              </button>
            )}

          </div>
        )}

        {/* ==================================
            CONTENT
        ================================== */}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {Array.from({
              length:
                INITIAL_VISIBLE_COUNT,
            }).map(
              (
                _,
                index
              ) => (
                <SkeletonCard
                  key={
                    index
                  }
                />
              )
            )}

          </div>
        ) : error ? (
          <EmptyState
            title="Bottle Catalogue Unavailable"
            description="We couldn't load the bottle collection right now. Please try again shortly."
          />
        ) : filtered.length ===
          0 ? (
          <EmptyState
            title={
              hasActiveFilters
                ? 'No Matching Bottles'
                : 'No Bottles Available'
            }
            description={
              hasActiveFilters
                ? 'Try changing your search or filters to see more bottles.'
                : 'Bottle information has not been added yet.'
            }
          />
        ) : (
          <>
            {/* ==================================
                MAX 8 CARDS INITIALLY
            ================================== */}

            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >

              <AnimatePresence
                mode="popLayout"
              >

                {visibleBottles.map(
                  (
                    bottle
                  ) => (
                    <BottleCard
                      key={
                        bottle
                          ._id
                      }
                      bottle={
                        bottle
                      }
                    />
                  )
                )}

              </AnimatePresence>

            </motion.div>

            {/* ==================================
                VIEW ALL / SHOW LESS
            ================================== */}

            {filtered.length >
              INITIAL_VISIBLE_COUNT && (
              <div className="mt-12 flex justify-center">

                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (
                        previous
                      ) =>
                        !previous
                    )
                  }
                  className="group inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full border border-gold/30 bg-gold/[0.055] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black hover:shadow-[0_10px_35px_rgba(212,175,55,0.25)]"
                >

                  {showAll
                    ? 'Show Less'
                    : `View All ${filtered.length} Bottles`}

                  <ChevronRight
                    size={
                      15
                    }
                    className={`transition-transform duration-300 ${
                      showAll
                        ? '-rotate-90'
                        : 'rotate-90'
                    }`}
                  />

                </button>

              </div>
            )}

          </>
        )}

      </div>

    </section>
  );
};

export default BottleGrid;