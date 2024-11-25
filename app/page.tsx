"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BellIcon,
  DrawingPinIcon,
  ClockIcon,
  CalendarIcon,
  PersonIcon as TicketIcon,
  BackpackIcon,
  ArrowRightIcon,
  HeartIcon,
  HeartFilledIcon,
} from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import SubscriptionModal from "@/components/SubscriptionModal";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/Sidebar/Sidebar";

type Seat = {
  id: string;
  isAvailable: boolean;
  isWindow: boolean;
  row: number;
  column: string;
};

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
  seats: Seat[];
};

// New EmptyState Component
function EmptyState() {
  return (
    <div className="text-center mt-8">
      <h2 className="text-xl font-semibold">No Results Found</h2>
      <p className="mt-2 text-gray-600">
        We couldn't find any flights matching your search criteria.
      </p>
      <p className="mt-2 text-gray-600">
        Try adjusting your search parameters or check back later.
      </p>
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [flights, setFlights] = useState<FlightDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // New state variable
  const [error, setError] = useState<string | null>(null);
  const [favoriteFlights, setFavoriteFlights] = useState<FlightDTO[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteFlights");
    if (storedFavorites) {
      setFavoriteFlights(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setHasSearched(true); // Set hasSearched to true when search is initiated
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
    toast({
      title: "Subscription Confirmed",
      description: "Successfully subscribed to free ticket tracking",
    });
    setIsModalOpen(false);
  };

  const toggleFavorite = (flight: FlightDTO) => {
    const storedFavorites = localStorage.getItem("favoriteFlights");
    let favorites: FlightDTO[] = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    const index = favorites.findIndex((f) => f.id === flight.id);
    if (index > -1) {
      favorites.splice(index, 1);
      toast({
        title: "Removed from favorites",
        description: `Flight ${flight.id} has been removed from your favorites.`,
      });
    } else {
      favorites.push(flight);
      toast({
        title: "Added to favorites",
        description: `Flight ${flight.id} has been added to your favorites.`,
      });
    }

    localStorage.setItem("favoriteFlights", JSON.stringify(favorites));
    setFavoriteFlights(favorites);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto p-4 ml-64">
        <h1 className="text-2xl font-bold mb-4">Flight Search</h1>
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Input
            name="departureLocation"
            placeholder="Departure Location"
            startIcon={<ArrowRightIcon />}
          />
          <Input
            name="arrivalLocation"
            placeholder="Arrival Location"
            startIcon={<DrawingPinIcon />}
          />
          <Input
            name="departureDate"
            type="date"
            startIcon={<CalendarIcon />}
            placeholder="Departure date"
          />
          <Input
            name="arrivalDate"
            type="date"
            startIcon={<CalendarIcon />}
            placeholder="Arrival date"
          />
          <Input
            name="passengers"
            type="number"
            placeholder="Passengers"
            startIcon={<TicketIcon />}
          />
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

        {isLoading && <p>Loading flights...</p>}

        {!isLoading && hasSearched && flights.length === 0 && <EmptyState />}

        {!isLoading && flights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {flights.map((flight) => (
              <Card key={flight.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>{flight.airline}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleFavorite(flight)}
                    aria-label={
                      favoriteFlights.some((f) => f.id === flight.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {favoriteFlights.some((f) => f.id === flight.id) ? (
                      <HeartFilledIcon color="red" className="fill-current" />
                    ) : (
                      <HeartIcon className="fill-current" />
                    )}
                  </Button>
                </CardHeader>
                <CardContent>
                  <p>
                    {flight.departureLocation}
                    <ArrowRightIcon className="inline-block mx-2 h-4 w-4" />
                    {flight.arrivalLocation}
                  </p>
                  <p>
                    <ClockIcon className="inline-block mr-2 h-4 w-4" />
                    Departure: {new Date(flight.departureTime).toLocaleString()}
                  </p>
                  <p>
                    <ClockIcon className="inline-block mr-2 h-4 w-4" />
                    Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                  </p>
                  <p>
                    <ClockIcon className="inline-block mr-2 h-4 w-4" />
                    Duration: {flight.duration}
                  </p>
                  <p>
                    <TicketIcon className="inline-block mr-2 h-4 w-4" />
                    Min Price: ${flight.minPrice}
                  </p>
                  <p>
                    <BackpackIcon className="inline-block mr-2 h-4 w-4" />
                    Class Types: {flight.classTypes.join(", ")}
                  </p>

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
    </div>
  );
}
