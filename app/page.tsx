"use client";

import "../globals.css";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BellIcon } from "@radix-ui/react-icons";
import { toast } from "../hooks/use-toast";
import SubscriptionModal from "../components/SubscriptionModal";
import { Toaster } from "../components/ui/toaster";

type FlightDTO = {
  id: number;
  departureLocation: string;
  arrivalLocation: string;
  departureTime: string;
  arrivalTime: string;
  airline: string;
  duration: string;
  minPrice: number;
  classTypes: string[];
};

export default function SearchPage() {
  const router = useRouter();
  const [flights, setFlights] = useState<FlightDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const searchParams = new URLSearchParams();
    formData.forEach((value, key) => {
      if (value) searchParams.append(key, value.toString());
    });

    try {
      const response = await fetch(`/api/flights?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch flights");
      }
      const data = await response.json();
      setFlights(data.content);
    } catch (error) {
      setError("An error occurred while fetching flights. Please try again.");
      console.error("Error fetching flights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = (flightId: number) => {
    setSelectedFlightId(flightId);
    setIsModalOpen(true);
  };

  const handleSubscriptionConfirm = (email: string) => {
    console.log("toasting");
    toast({
      title: "Subscription Confirmed",
      description: "Successfully subscribed to free ticket tracking",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flight Search</h1>
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <Input name="departureLocation" placeholder="Departure Location" />
        <Input name="arrivalLocation" placeholder="Arrival Location" />
        <Input name="departureDate" type="date" />
        <Input name="arrivalDate" type="date" />
        <Input name="passengers" type="number" placeholder="Passengers" />
        <Select name="classType">
          <SelectTrigger>
            <SelectValue placeholder="Class Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ECONOMY">Economy</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
            <SelectItem value="FIRST">First</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className="md:col-span-3" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search Flights"}
        </Button>
      </form>

      {error && (
        <>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => setIsModalOpen(true)}>
            Subscribe to Price Changes
          </Button>
        </>
      )}

      {isLoading ? (
        <p>Loading flights...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {flights.map((flight) => (
            <Card key={flight.id}>
              <CardHeader>
                <CardTitle>{flight.airline}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {flight.departureLocation} to {flight.arrivalLocation}
                </p>
                <p>
                  Departure: {new Date(flight.departureTime).toLocaleString()}
                </p>
                <p>Arrival: {new Date(flight.arrivalTime).toLocaleString()}</p>
                <p>Duration: {flight.duration}</p>
                <p>Min Price: ${flight.minPrice}</p>
                <p>Class Types: {flight.classTypes.join(", ")}</p>
                <div className="flex justify-between mt-4">
                  <Button onClick={() => router.push(`/flight/${flight.id}`)}>
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubscribe(flight.id)}
                  >
                    <BellIcon className="mr-2 h-4 w-4" /> Track Price
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleSubscriptionConfirm}
      />
      <Toaster />
    </div>
  );
}
