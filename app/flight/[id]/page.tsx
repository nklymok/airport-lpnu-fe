"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, BellIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceHistoryChart } from "@/components/PriceHistoryChart/PriceHistoryChart";
import { Button } from "@/components/ui/button";
import SubscriptionModal from "@/components/SubscriptionModal";

type FlightDetailsDTO = {
  id: number;
  departureLocation: string;
  arrivalLocation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  airline: string;
  availableSeats: { seatNumber: string; classType: string }[];
  luggageOptions: { type: string; price: number }[];
  prices: { [key: string]: number };
  priceHistory: {
    historyByClass: {
      [classType: string]: {
        price: number;
        timestamp: string;
      }[];
    };
  };
};

export default function FlightDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [flightDetails, setFlightDetails] = useState<FlightDetailsDTO | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/flights/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flight details");
        }
        const data = await response.json();
        setFlightDetails(data);
      } catch (error) {
        setError(
          "An error occurred while fetching flight details. Please try again."
        );
        console.error("Error fetching flight details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlightDetails();
  }, [id]);

  const handleSubscribe = () => {
    setIsModalOpen(true);
  };

  const handleSubscriptionConfirm = (email: string) => {
    toast({
      title: "Subscription Confirmed",
      description: "Successfully subscribed to free ticket tracking",
    });
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!flightDetails) {
    return <div>No flight details found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back Arrow */}
      <button
        onClick={() => router.push("/")} // Replace with the actual flight search page route
        className="flex items-center text-blue-500 hover:underline mb-4"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" /> Back to Flight Search
      </button>

      <h1 className="text-2xl font-bold mb-4">Flight Details</h1>
      <Card>
        <CardHeader>
          <CardTitle>{flightDetails.airline}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {flightDetails.departureLocation} to {flightDetails.arrivalLocation}
          </p>
          <p>
            Departure: {new Date(flightDetails.departureTime).toLocaleString()}
          </p>
          <p>Arrival: {new Date(flightDetails.arrivalTime).toLocaleString()}</p>
          <p>Duration: {flightDetails.duration}</p>

          <h2 className="text-xl font-semibold mt-4">Available Seats</h2>
          <ul>
            {flightDetails.availableSeats.map((seat, index) => (
              <li key={index}>
                {seat.seatNumber} - {seat.classType}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Luggage Options</h2>
          <ul>
            {flightDetails.luggageOptions.map((option, index) => (
              <li key={index}>
                {option.type} - ${option.price}
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mt-4">Prices</h2>
          <ul>
            {Object.entries(flightDetails.prices).map(([classType, price]) => (
              <li key={classType}>
                {classType}: ${price}
              </li>
            ))}
          </ul>

          <PriceHistoryChart priceHistory={flightDetails.priceHistory} />

          <Button className="mt-4" onClick={handleSubscribe}>
            <BellIcon className="mr-2 h-4 w-4" /> Track Price
          </Button>
        </CardContent>
      </Card>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubscriptionConfirm}
      />
    </div>
  );
}
