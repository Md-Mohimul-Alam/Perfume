import React, {
  useMemo,
  useState,
} from 'react';

import {
  motion,
} from 'framer-motion';

import {
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
} from 'lucide-react';

import {
  useCart,
} from '../contexts/CartContext';

/* ========================================
   HELPERS
======================================== */

const number = (
  value
) => {
  const parsed =
    Number(value);

  return Number.isFinite(
    parsed
  )
    ? parsed
    : 0;
};

const typeLabel = (
  type
) =>
  type === 'roll-on'
    ? 'Roll-on'
    : 'Spray';

const bottleName = (
  bottle
) =>
  `${number(
    bottle.sizeMl
  )}ml ${typeLabel(
    bottle.type
  )} Bottle`;

/* ========================================
   IMAGE GALLERY
======================================== */

const BottleImage = ({
  bottle,
}) => {
  const images =
    Array.isArray(
      bottle.images
    )
      ? bottle.images.filter(
          Boolean
        )
      : [];

  const [
    imageIndex,
    setImageIndex,
  ] = useState(0);

  const [
    imageFailed,
    setImageFailed,
  ] = useState(false);

  const image =
    images[
      imageIndex
    ];

  const previous =
    (
      event
    ) => {
      event.stopPropagation();

      setImageFailed(
        false
      );

      setImageIndex(
        (
          current
        ) =>
          current <= 0
            ? images.length -
              1
            : current -
              1
      );
    };

  const next =
    (
      event
    ) => {
      event.stopPropagation();

      setImageFailed(
        false
      );

      setImageIndex(
        (
          current
        ) =>
          current >=
          images.length -
            1
            ? 0
            : current +
              1
      );
    };

  return (
    <div className="relative flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-white/[0.03] via-transparent to-gold/[0.04]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.10),transparent_65%)]" />

      {image &&
      !imageFailed ? (
        <img
          src={
            image
          }
          alt={
            bottleName(
              bottle
            )
          }
          className="relative z-10 h-full w-full object-contain p-5 transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
          onError={() =>
            setImageFailed(
              true
            )
          }
        />
      ) : (
        <div className="relative z-10 flex h-28 w-20 items-center justify-center rounded-xl border border-gold/30 bg-gold/5">
          <Package
            size={
              45
            }
            className="text-gold/70"
            strokeWidth={
              1.3
            }
          />
        </div>
      )}

      {images.length >
        1 && (
        <>
          <button
            type="button"
            onClick={
              previous
            }
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:border-gold/40 hover:text-gold"
            aria-label="Previous image"
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
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100 hover:border-gold/40 hover:text-gold"
            aria-label="Next image"
          >
            <ChevronRight
              size={
                18
              }
            />
          </button>

          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
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

                    setImageFailed(
                      false
                    );

                    setImageIndex(
                      index
                    );
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index ===
                    imageIndex
                      ? 'w-5 bg-gold'
                      : 'w-1.5 bg-white/40'
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              )
            )}
          </div>
        </>
      )}

      <span className="absolute left-4 top-4 z-20 rounded-full border border-gold/20 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur-md">
        {typeLabel(
          bottle.type
        )}
      </span>
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
  ] = useState(1);

  const stock =
    number(
      bottle.currentStock
    );

  const price =
    number(
      bottle.sellingPrice
    );

  const unavailable =
    stock <= 0 ||
    bottle.isStockOut ||
    price <= 0;

  const decrease =
    () => {
      setQuantity(
        (
          old
        ) =>
          Math.max(
            1,
            old - 1
          )
      );
    };

  const increase =
    () => {
      setQuantity(
        (
          old
        ) =>
          Math.min(
            stock,
            old + 1
          )
      );
    };

  const add =
    () => {
      if (
        unavailable
      ) {
        return;
      }

      addBottleToCart(
        bottle,
        quantity
      );
    };

  return (
    <motion.article
      layout
      initial={{
        opacity: 0,
        y: 16,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.4,
      }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-white/[0.015] transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/35 hover:shadow-[0_24px_70px_-20px_rgba(212,175,55,0.35)]"
    >
      <BottleImage
        bottle={
          bottle
        }
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.18em] text-gold/70">
            Empty Bottle
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${
              stock <= 0
                ? 'bg-red-500/10 text-red-300'
                : stock <= 3
                  ? 'bg-amber-500/10 text-amber-300'
                  : 'bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {stock <= 0
              ? 'Out of stock'
              : `${stock} available`}
          </span>
        </div>

        <h3 className="mt-3 font-display text-xl tracking-wide text-white">
          {bottleName(
            bottle
          )}
        </h3>

        <p className="mt-2 min-h-10 text-sm leading-5 text-gray-400">
          Premium empty perfume bottle for separate purchase.
        </p>

        {Array.isArray(
          bottle.images
        ) &&
          bottle.images.length >
            1 && (
          <p className="mt-2 text-xs text-gray-500">
            {bottle.images.length}{' '}
            product images
          </p>
        )}

        <div className="mt-auto border-t border-white/[0.06] pt-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Price
              </span>

              <span className="mt-1 block text-xl font-semibold text-gold">
                ৳
                {price.toLocaleString(
                  'en-BD'
                )}
              </span>
            </div>

            {!unavailable && (
              <div className="flex items-center overflow-hidden rounded-full border border-white/10 bg-black/40">
                <button
                  type="button"
                  onClick={
                    decrease
                  }
                  className="flex h-9 w-9 items-center justify-center text-lg text-gray-300 transition hover:bg-white/10 hover:text-white"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="min-w-8 text-center text-sm font-medium text-white">
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
                  className="flex h-9 w-9 items-center justify-center text-lg text-gray-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={
              add
            }
            disabled={
              unavailable
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:bg-yellow-300 hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none"
          >
            <ShoppingCart
              size={
                15
              }
              strokeWidth={
                2.4
              }
            />

            {stock <= 0
              ? 'Out of Stock'
              : price <= 0
                ? 'Unavailable'
                : 'Add to Cart'}
          </button>
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
    <div className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
      <div className="h-64 bg-white/[0.03]" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-20 rounded bg-white/[0.05]" />

        <div className="h-5 w-2/3 rounded bg-white/[0.06]" />

        <div className="h-3 w-full rounded bg-white/[0.04]" />

        <div className="h-3 w-1/2 rounded bg-white/[0.04]" />

        <div className="h-11 rounded-full bg-white/[0.05]" />
      </div>
    </div>
  );

/* ========================================
   GRID
======================================== */

const BottleGrid = ({
  bottles = [],
  loading = false,
}) => {
  const [
    activeFilter,
    setActiveFilter,
  ] = useState(
    'all'
  );

  const filtered =
    useMemo(() => {
      if (
        activeFilter ===
        'all'
      ) {
        return bottles;
      }

      return bottles.filter(
        (
          bottle
        ) =>
          bottle.type ===
          activeFilter
      );
    }, [
      bottles,
      activeFilter,
    ]);

  /*
    Don't show an empty section before
    the request has finished.
  */

  if (
    !loading &&
    bottles.length ===
      0
  ) {
    return null;
  }

  return (
    <section
      id="bottles"
      className="relative px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold/70">
            Bottle Collection
          </p>

          <h2 className="mt-3 font-display text-3xl font-light tracking-wide text-white sm:text-4xl lg:text-5xl">
            Empty Bottles
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-400 sm:text-base">
            Need an empty bottle separately? Choose from our available spray and roll-on bottles.
          </p>
        </div>

        {/* FILTER */}

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {[
            {
              key:
                'all',

              label:
                'All Bottles',
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
                  filter.key
                }
                type="button"
                onClick={() =>
                  setActiveFilter(
                    filter.key
                  )
                }
                className={`rounded-full border px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-all ${
                  activeFilter ===
                  filter.key
                    ? 'border-gold bg-gold text-black shadow-[0_6px_20px_rgba(212,175,55,0.25)]'
                    : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:border-gold/35 hover:text-gold'
                }`}
              >
                {
                  filter.label
                }
              </button>
            )
          )}
        </div>

        {/* LOADING */}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({
              length: 8,
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
        ) : filtered.length ===
          0 ? (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-14 text-center">
            <Package
              size={
                42
              }
              className="mx-auto text-gold/50"
            />

            <h3 className="mt-4 font-display text-xl text-white">
              No Bottles Available
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              No bottles are currently available in this category.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(
              (
                bottle
              ) => (
                <BottleCard
                  key={
                    bottle._id
                  }
                  bottle={
                    bottle
                  }
                />
              )
            )}
          </div>
        )}

        {!loading &&
          filtered.length >
            0 && (
          <p className="mt-8 text-center text-xs uppercase tracking-[0.18em] text-gray-600">
            {
              filtered.length
            }{' '}
            bottle
            {filtered.length ===
            1
              ? ''
              : 's'}{' '}
            available
          </p>
        )}
      </div>
    </section>
  );
};

export default BottleGrid;