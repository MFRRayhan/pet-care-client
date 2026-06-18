import React, { useContext, useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { AuthContext } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
const CheckoutForm = ({
  amount,
  campaignId,
  petName,
  ownerEmail,
  onSuccess,
  image,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Create PaymentIntent from backend
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount,
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: petName,
              email: ownerEmail,
            },
          },
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      if (paymentIntent.status === "succeeded") {
        // 3. Store donation in DB
        const donation = {
          campaignId,
          amount,
          transactionId: paymentIntent.id,
          ownerEmail,
          petName,
          donatedAt: new Date(),
          donatedBy: user.email,
          image,
        };

        const postdonation = await axiosSecure.post("/donations", donation);

        // 4. Update campaign donated amount
        const result = await axiosSecure.put("/update-donation-amount", {
          campaignId,
          amount,
        });

        // 4. Callback to parent
        onSuccess();

        // update donation value
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Card Details
      </label>
      <div className="p-3 border border-gray-300 rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#a0aec0" },
              },
              invalid: { color: "#e53e3e" },
            },
          }}
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold disabled:opacity-50 flex justify-center items-center"
      >
        {processing ? (
          <span className="animate-spin border-b-2 border-white rounded-full w-5 h-5 mr-2"></span>
        ) : null}
        {processing ? "Processing..." : `Pay $${amount}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
