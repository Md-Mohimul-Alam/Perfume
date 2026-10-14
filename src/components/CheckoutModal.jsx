import React, {
  useEffect,
  useState,
} from 'react';

import {
  motion,
} from 'framer-motion';

import {
  X,
  User,
  Phone,
  MapPin,
  Building2,
  Loader2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import API from '../api/axios';

import {
  useCart,
} from '../contexts/CartContext';

const CheckoutModal = ({
  isOpen,
  onClose,
  onSuccess,
  shippingZone = 'inside',
  shippingLabel = 'Inside Dhaka',
  shippingCharge = 70,
}) => {
  const {
    cart,
    getCartTotal,
    clearCart,
  } = useCart();

  const totals =
    getCartTotal(
      shippingCharge
    );

  const [
    form,
    setForm,
  ] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
  });

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState(null);

  /* ========================================
     PRE-FILL CITY
  ======================================== */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      (
        previous
      ) => ({
        ...previous,

        city:
          previous.city ||
          (
            shippingZone ===
            'inside'
              ? 'Dhaka'
              : ''
          ),
      })
    );
  }, [
    isOpen,
    shippingZone,
  ]);

  if (!isOpen) {
    return null;
  }

  /* ========================================
     INPUT
  ======================================== */

  const handleChange =
    (
      event
    ) => {
      setForm(
        (
          previous
        ) => ({
          ...previous,

          [event.target.name]:
            event.target.value,
        })
      );

      setError('');
    };

  /* ========================================
     VALIDATION
  ======================================== */

  const validate =
    () => {
      if (
        !form.name.trim()
      ) {
        return 'Please enter your name';
      }

      if (
        !form.mobile.trim() ||
        form.mobile.trim()
          .length <
          10
      ) {
        return 'Please enter a valid mobile number';
      }

      if (
        !form.address.trim()
      ) {
        return 'Please enter your address';
      }

      if (
        !form.city.trim()
      ) {
        return 'Please enter your city';
      }

      if (
        cart.length ===
        0
      ) {
        return 'Your cart is empty';
      }

      return null;
    };

  /* ========================================
     SUBMIT
  ======================================== */

  const handleSubmit =
    async (
      event
    ) => {
      event.preventDefault();

      const validationError =
        validate();

      if (
        validationError
      ) {
        setError(
          validationError
        );

        return;
      }

      setLoading(true);
      setError('');

      try {
        const payload =
          {
            customer:
              {
                name:
                  form.name.trim(),

                mobile:
                  form.mobile.trim(),

                address:
                  form.address.trim(),

                city:
                  form.city.trim(),
              },

            items:
              cart.map(
                (
                  item
                ) => {
                  /*
                    Empty bottle
                  */

                  if (
                    item.itemType ===
                    'bottle'
                  ) {
                    return {
                      itemType:
                        'bottle',

                      bottle:
                        item.bottleId,

                      name:
                        item.name,

                      sizeMl:
                        item.size,

                      quantity:
                        item.quantity,
                    };
                  }

                  /*
                    Normal perfume
                  */

                  return {
                    itemType:
                      'product',

                    product:
                      item.productId,

                    name:
                      item.name,

                    sizeMl:
                      item.size,

                    quantity:
                      item.quantity,
                  };
                }
              ),

            /*
              Backend should calculate
              trusted item prices.

              These totals are useful only
              for displaying on the client.
            */

            subtotal:
              totals.subtotal,

            tax:
              0,

            shipping:
              shippingCharge,

            totalAmount:
              totals.total,

            notes:
              `Delivery: ${shippingLabel}`,
          };

        const {
          data,
        } =
          await API.post(
            '/orders',
            payload
          );

        setSuccess({
          orderNo:
            data.orderNo,

          total:
            totals.total,
        });

        clearCart();

        setTimeout(
          () => {
            if (
              onSuccess
            ) {
              onSuccess(
                data.order
              );
            }

            onClose();
          },
          4000
        );
      } catch (
        error
      ) {
        setError(
          error.response
            ?.data
            ?.message ||
            'Failed to place order. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={
          !loading &&
          !success
            ? onClose
            : undefined
        }
      />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="relative max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold/30 bg-gradient-to-br from-gray-900 via-black to-gray-800 shadow-2xl shadow-gold/20"
      >
        <button
          type="button"
          onClick={
            onClose
          }
          disabled={
            loading
          }
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-gold transition hover:bg-gold hover:text-black disabled:opacity-50"
        >
          <X
            size={
              20
            }
          />
        </button>

        <div className="border-b border-gold/20 bg-gradient-to-r from-gold/10 via-gold/5 to-transparent p-6">
          <h2 className="font-display text-2xl font-light uppercase tracking-widest text-white">
            Complete Your Order
          </h2>

          <p className="mt-1 text-xs uppercase tracking-widest text-gold/80">
            Fill in your delivery details
          </p>
        </div>

        <div className="p-6">
          {success ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="py-8 text-center"
            >
              <CheckCircle
                size={
                  64
                }
                className="mx-auto mb-4 text-green-400"
              />

              <h3 className="mb-2 font-display text-2xl text-white">
                Order Placed!
              </h3>

              <p className="mb-4 text-gray-400">
                Thank you for your order
              </p>

              <div className="inline-block rounded-lg border border-gold/30 bg-gold/10 p-4">
                <p className="text-sm uppercase tracking-widest text-gold">
                  Order No
                </p>

                <p className="text-xl font-bold text-white">
                  {
                    success.orderNo
                  }
                </p>

                <p className="mt-2 text-sm text-gray-300">
                  Total: ৳
                  {success.total.toFixed(
                    2
                  )}
                </p>
              </div>

              <p className="mt-6 text-xs text-gray-500">
                We'll contact you soon to confirm
              </p>
            </motion.div>
          ) : (
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-4"
            >
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/20 px-4 py-3 text-sm text-red-300">
                  <AlertCircle
                    size={
                      18
                    }
                    className="mt-0.5 flex-shrink-0"
                  />

                  <span>
                    {
                      error
                    }
                  </span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-white">
                  Full Name *
                </label>

                <div className="relative">
                  <User
                    size={
                      18
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60"
                  />

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Your name"
                    disabled={
                      loading
                    }
                    className="w-full rounded-lg border border-gold/20 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-gold focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-white">
                  Mobile Number *
                </label>

                <div className="relative">
                  <Phone
                    size={
                      18
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60"
                  />

                  <input
                    type="tel"
                    name="mobile"
                    value={
                      form.mobile
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="01XXXXXXXXX"
                    disabled={
                      loading
                    }
                    className="w-full rounded-lg border border-gold/20 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-gold focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-white">
                  Delivery Address *
                </label>

                <div className="relative">
                  <MapPin
                    size={
                      18
                    }
                    className="absolute left-4 top-4 text-gold/60"
                  />

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House / Road / Area"
                    rows="3"
                    disabled={
                      loading
                    }
                    className="w-full resize-none rounded-lg border border-gold/20 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-gold focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-widest text-white">
                  City *
                </label>

                <div className="relative">
                  <Building2
                    size={
                      18
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60"
                  />

                  <input
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Dhaka"
                    disabled={
                      loading
                    }
                    className="w-full rounded-lg border border-gold/20 bg-black/50 py-3 pl-12 pr-4 text-white placeholder-gray-500 transition focus:border-gold focus:outline-none disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-gold/15 bg-black/40 p-4">
                <p className="mb-3 text-xs uppercase tracking-widest text-gold">
                  Order Summary
                </p>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>
                      Subtotal
                    </span>

                    <span>
                      ৳
                      {totals.subtotal.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>
                      Shipping (
                      {
                        shippingLabel
                      }
                      )
                    </span>

                    <span>
                      ৳
                      {shippingCharge.toFixed(
                        2
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between border-t border-gold/20 pt-2 text-lg font-bold text-white">
                    <span>
                      Total
                    </span>

                    <span className="text-gold">
                      ৳
                      {totals.total.toFixed(
                        2
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  loading
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-gold to-yellow-600 py-4 text-base font-bold uppercase tracking-widest text-black transition-all hover:shadow-lg hover:shadow-gold/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={
                        20
                      }
                      className="animate-spin"
                    />

                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order · ৳
                    {totals.total.toFixed(
                      2
                    )}
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                Cash on Delivery available · We'll call to confirm
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutModal;