import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const CartContext =
  createContext();

export const useCart =
  () => {
    const context =
      useContext(
        CartContext
      );

    if (!context) {
      throw new Error(
        'useCart must be used within a CartProvider'
      );
    }

    return context;
  };

export const CartProvider =
  ({
    children,
  }) => {
    const [
      cart,
      setCart,
    ] = useState([]);

    /* ======================================
       LOAD CART
    ====================================== */

    useEffect(() => {
      try {
        const saved =
          localStorage.getItem(
            'storeCart'
          );

        if (saved) {
          const parsed =
            JSON.parse(
              saved
            );

          if (
            Array.isArray(
              parsed
            )
          ) {
            /*
              Older cart items do not have
              itemType.

              They are perfume products.
            */

            setCart(
              parsed.map(
                (
                  item
                ) => ({
                  ...item,

                  itemType:
                    item.itemType ||
                    'product',
                })
              )
            );
          }
        }
      } catch (
        error
      ) {
        console.error(
          'Failed to load cart',
          error
        );
      }
    }, []);

    /* ======================================
       SAVE CART
    ====================================== */

    useEffect(() => {
      try {
        localStorage.setItem(
          'storeCart',
          JSON.stringify(
            cart
          )
        );
      } catch (
        error
      ) {
        console.error(
          'Failed to save cart',
          error
        );
      }
    }, [
      cart,
    ]);

    /* ======================================
       ADD PERFUME
    ====================================== */

    const addToCart =
      useCallback(
        (
          product,
          size,
          quantity = 1
        ) => {
          if (
            !product ||
            !product.id
          ) {
            console.warn(
              'Invalid product'
            );

            return;
          }

          if (
            !size ||
            typeof size.sellingPrice !==
              'number' ||
            size.sellingPrice <=
              0
          ) {
            console.warn(
              'Invalid size or missing sellingPrice'
            );

            return;
          }

          const qty =
            Math.max(
              1,
              Number(
                quantity
              ) ||
                1
            );

          const cartItem =
            {
              id:
                `product-${product.id}-${size._id || size.sizeMl}`,

              itemType:
                'product',

              productId:
                product.id,

              bottleId:
                null,

              name:
                product.name,

              category:
                product.category ||
                (
                  product.type ===
                  'spray'
                    ? 'perfume'
                    : 'oil'
                ),

              type:
                product.type,

              size:
                Number(
                  size.sizeMl
                ),

              sizeLabel:
                `${size.sizeMl}ml${
                  size.bottleType
                    ? ` ${size.bottleType}`
                    : ''
                }`,

              price:
                Number(
                  size.sellingPrice
                ),

              quantity:
                qty,

              imageEmoji:
                product.category ===
                'perfume'
                  ? '🌸'
                  : '💧',
            };

          setCart(
            (
              previous
            ) => {
              const existingIndex =
                previous.findIndex(
                  (
                    item
                  ) =>
                    (
                      item.itemType ||
                      'product'
                    ) ===
                      'product' &&
                    item.productId ===
                      product.id &&
                    Number(
                      item.size
                    ) ===
                      Number(
                        size.sizeMl
                      )
                );

              if (
                existingIndex >=
                0
              ) {
                const updated =
                  [
                    ...previous,
                  ];

                updated[
                  existingIndex
                ] = {
                  ...updated[
                    existingIndex
                  ],

                  quantity:
                    updated[
                      existingIndex
                    ].quantity +
                    qty,
                };

                return updated;
              }

              return [
                ...previous,
                cartItem,
              ];
            }
          );
        },
        []
      );

    /* ======================================
       ADD EMPTY BOTTLE
    ====================================== */

    const addBottleToCart =
      useCallback(
        (
          bottle,
          quantity = 1
        ) => {
          if (
            !bottle ||
            !bottle._id
          ) {
            console.warn(
              'Invalid bottle'
            );

            return;
          }

          const stock =
            Number(
              bottle.currentStock
            );

          const price =
            Number(
              bottle.sellingPrice
            );

          if (
            !Number.isFinite(
              stock
            ) ||
            stock <= 0
          ) {
            console.warn(
              'Bottle is out of stock'
            );

            return;
          }

          if (
            !Number.isFinite(
              price
            ) ||
            price <= 0
          ) {
            console.warn(
              'Bottle selling price is not configured'
            );

            return;
          }

          const requestedQty =
            Math.max(
              1,
              Math.floor(
                Number(
                  quantity
                ) ||
                  1
              )
            );

          const qty =
            Math.min(
              requestedQty,
              stock
            );

          const typeLabel =
            bottle.type ===
            'roll-on'
              ? 'Roll-on'
              : 'Spray';

          const cartItem =
            {
              id:
                `bottle-${bottle._id}`,

              itemType:
                'bottle',

              productId:
                null,

              bottleId:
                bottle._id,

              name:
                `${bottle.sizeMl}ml ${typeLabel} Bottle`,

              category:
                'bottle',

              type:
                bottle.type,

              size:
                Number(
                  bottle.sizeMl
                ),

              sizeLabel:
                `${bottle.sizeMl}ml ${typeLabel}`,

              price,

              quantity:
                qty,

              maxStock:
                stock,

              imageEmoji:
                '🧴',
            };

          setCart(
            (
              previous
            ) => {
              const existingIndex =
                previous.findIndex(
                  (
                    item
                  ) =>
                    item.itemType ===
                      'bottle' &&
                    item.bottleId ===
                      bottle._id
                );

              if (
                existingIndex >=
                0
              ) {
                const updated =
                  [
                    ...previous,
                  ];

                const currentQty =
                  Number(
                    updated[
                      existingIndex
                    ].quantity
                  ) ||
                  0;

                updated[
                  existingIndex
                ] = {
                  ...updated[
                    existingIndex
                  ],

                  quantity:
                    Math.min(
                      stock,
                      currentQty +
                        qty
                    ),

                  maxStock:
                    stock,
                };

                return updated;
              }

              return [
                ...previous,
                cartItem,
              ];
            }
          );
        },
        []
      );

    /* ======================================
       UPDATE QUANTITY
    ====================================== */

    const updateCartItemQuantity =
      useCallback(
        (
          itemId,
          delta
        ) => {
          setCart(
            (
              previous
            ) =>
              previous.map(
                (
                  item
                ) => {
                  if (
                    item.id !==
                    itemId
                  ) {
                    return item;
                  }

                  let nextQuantity =
                    Math.max(
                      1,
                      Number(
                        item.quantity
                      ) +
                        Number(
                          delta
                        )
                    );

                  if (
                    item.itemType ===
                      'bottle' &&
                    Number.isFinite(
                      Number(
                        item.maxStock
                      )
                    )
                  ) {
                    nextQuantity =
                      Math.min(
                        nextQuantity,
                        Number(
                          item.maxStock
                        )
                      );
                  }

                  return {
                    ...item,

                    quantity:
                      nextQuantity,
                  };
                }
              )
          );
        },
        []
      );

    /* ======================================
       REMOVE
    ====================================== */

    const removeFromCart =
      useCallback(
        (
          itemId
        ) => {
          setCart(
            (
              previous
            ) =>
              previous.filter(
                (
                  item
                ) =>
                  item.id !==
                  itemId
              )
          );
        },
        []
      );

    /* ======================================
       CLEAR
    ====================================== */

    const clearCart =
      useCallback(
        () => {
          setCart([]);
        },
        []
      );

    /* ======================================
       TOTAL
    ====================================== */

    const getCartTotal =
      useCallback(
        (
          shippingCharge = 0
        ) => {
          const subtotal =
            cart.reduce(
              (
                total,
                item
              ) =>
                total +
                Number(
                  item.price ||
                    0
                ) *
                  Number(
                    item.quantity ||
                      0
                  ),
              0
            );

          return {
            subtotal,

            shipping:
              shippingCharge,

            total:
              subtotal +
              shippingCharge,
          };
        },
        [
          cart,
        ]
      );

    const getCartCount =
      useCallback(
        () => {
          return cart.reduce(
            (
              total,
              item
            ) =>
              total +
              Number(
                item.quantity ||
                  0
              ),
            0
          );
        },
        [
          cart,
        ]
      );

    const value =
      {
        cart,

        addToCart,

        addBottleToCart,

        updateCartItemQuantity,

        removeFromCart,

        clearCart,

        getCartTotal,

        getCartCount,
      };

    return (
      <CartContext.Provider
        value={
          value
        }
      >
        {
          children
        }
      </CartContext.Provider>
    );
  };