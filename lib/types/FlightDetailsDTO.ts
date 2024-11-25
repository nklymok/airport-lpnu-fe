export type LuggageOption = {
  name: string;
  description: string;
  weightLimit: number;
  price: number;
};

export type FlightDetailsDTO = {
  id: number;
  departureLocation: string;
  arrivalLocation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  airline: string;
  availableSeats: {
    seatOption: string;
    classType: string;
    price: number;
    amount: number;
  }[];
  luggageOptions: LuggageOption[];
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
