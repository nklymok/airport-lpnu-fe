"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  HeartIcon,
  DrawingPinFilledIcon as TicketIcon,
  BackpackIcon,
  HeartFilledIcon,
} from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

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

export default function FavoriteFlightsPage() {
  const router = useRouter();
  const [favoriteFlights, setFavoriteFlights] = useState<FlightDTO[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favoriteFlights");
    if (storedFavorites) {
      setFavoriteFlights(JSON.parse(storedFavorites));
    }
  }, []);

  const removeFavorite = (flightId: number) => {
    const newFavorites = favoriteFlights.filter((f) => f.id !== flightId);
    setFavoriteFlights(newFavorites);
    localStorage.setItem("favoriteFlights", JSON.stringify(newFavorites));
    toast({
      title: "Removed from favorites",
      description: `Flight ${flightId} has been removed from your favorites.`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-blue-500 hover:underline mb-4"
      >
        <ArrowLeftIcon className="mr-2 h-5 w-5" /> Back to Flight Search
      </button>

      <h1 className="text-2xl font-bold mb-4">Favorite Flights</h1>

      {favoriteFlights.length === 0 ? (
        <p>You haven't added any flights to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteFlights.map((flight) => (
            <Card key={flight.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  {flight.airline}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFavorite(flight.id)}
                    aria-label="Remove from favorites"
                  >
                    {favoriteFlights.some((f) => f.id === flight.id) ? (
                      <HeartFilledIcon color="red" className="fill-current" />
                    ) : (
                      <HeartIcon className="fill-current" />
                    )}
                  </Button>
                </CardTitle>
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
}
