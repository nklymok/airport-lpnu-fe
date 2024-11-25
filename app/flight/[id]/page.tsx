"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PriceHistoryChart } from "@/components/PriceHistoryChart/PriceHistoryChart";
import SubscriptionModal from "@/components/SubscriptionModal";
import { toast } from "@/hooks/use-toast";
import { FlightSeatPicker } from "@/components/FlightSeatPicker/FlightSeatPicker";
import { BackButton } from "@/components/BackButton/BackButton";
import { FlightHeader } from "@/components/FlightHeader/FlightHeader";
import { FlightInfo } from "@/components/FlightInfo/FlightInfo";
import { LuggageOptions } from "@/components/LuggageOptions/LuggageOptions";
import { PriceList } from "@/components/PriceList/PriceList";
import { TotalPrice } from "@/components/TotalPrice/TotalPrice";
import { Button } from "@/components/ui/button";
import { FlightDetailsDTO, LuggageOption } from "@/lib/types/FlightDetailsDTO";
import { BellIcon } from "@radix-ui/react-icons";

export default function FlightDetailsPage() {
  const { id } = useParams();
  const [flightDetails, setFlightDetails] = useState<FlightDetailsDTO | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLuggageOption, setSelectedLuggageOption] =
    useState<LuggageOption | null>(null);
  const [seatTotalPrice, setSeatTotalPrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(60);

  // Fetch flight details
  const fetchFlightDetails = useCallback(async () => {
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
  }, [id]);

  // Initial fetch
  useEffect(() => {
    fetchFlightDetails();
  }, [fetchFlightDetails]);

  // Timer effect
  useEffect(() => {
    if (isLoading) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          fetchFlightDetails();
          return 60;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, fetchFlightDetails]);

  // Update total price whenever seatTotalPrice or selectedLuggageOption changes
  useEffect(() => {
    const luggagePrice = selectedLuggageOption
      ? selectedLuggageOption.price
      : 0;
    setTotalPrice(seatTotalPrice + luggagePrice);
  }, [seatTotalPrice, selectedLuggageOption]);

  // Handle subscription
  const handleSubscribe = () => {
    setIsModalOpen(true);
  };

  const handleSubscriptionConfirm = (email: string) => {
    toast({
      title: "Subscription Confirmed",
      description: "Successfully subscribed to price tracking",
    });
    setIsModalOpen(false);
  };

  // Handle seat total price update from FlightSeatPicker
  const handleSeatTotalPriceUpdate = (newSeatTotalPrice: number) => {
    setSeatTotalPrice(newSeatTotalPrice);
  };

  // Handle luggage option change
  const handleLuggageOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedName = event.target.value;
    if (selectedName === "none") {
      setSelectedLuggageOption(null);
    } else {
      const selectedOption = flightDetails?.luggageOptions.find(
        (option) => option.name === selectedName
      );
      if (selectedOption) {
        setSelectedLuggageOption(selectedOption);
      }
    }
  };

  // Calculate minutes and seconds for timer display
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

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
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Flight Details</h1>
      <Card>
        <FlightHeader
          airline={flightDetails.airline}
          minutes={minutes}
          seconds={seconds}
        />
        <CardContent>
          <FlightInfo flightDetails={flightDetails} />

          <LuggageOptions
            luggageOptions={flightDetails.luggageOptions}
            selectedLuggageOption={selectedLuggageOption}
            handleLuggageOptionChange={handleLuggageOptionChange}
          />

          <PriceList prices={flightDetails.prices} />

          <PriceHistoryChart priceHistory={flightDetails.priceHistory} />

          <Button className="mt-4" onClick={handleSubscribe}>
            <BellIcon className="mr-2 h-4 w-4" /> Track Price
          </Button>

          <FlightSeatPicker
            availableSeats={flightDetails.availableSeats}
            onTotalPriceChange={handleSeatTotalPriceUpdate}
          />

          <TotalPrice totalPrice={totalPrice} />
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
