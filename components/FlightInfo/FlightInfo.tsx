import { FlightDetailsDTO } from "@/lib/types/FlightDetailsDTO";
import { ClockIcon } from "@radix-ui/react-icons";
import { TicketIcon } from "lucide-react";

type FlightInfoProps = {
  flightDetails: FlightDetailsDTO;
};

export const FlightInfo = ({ flightDetails }: FlightInfoProps) => {
  return (
    <>
      <p>
        <TicketIcon className="inline-block mr-2 h-4 w-4" />
        {flightDetails.departureLocation} to {flightDetails.arrivalLocation}
      </p>
      <p>
        <ClockIcon className="inline-block mr-2 h-4 w-4" />
        Departure: {new Date(flightDetails.departureTime).toLocaleString()}
      </p>
      <p>
        <ClockIcon className="inline-block mr-2 h-4 w-4" />
        Arrival: {new Date(flightDetails.arrivalTime).toLocaleString()}
      </p>
      <p>
        <ClockIcon className="inline-block mr-2 h-4 w-4" />
        Duration: {flightDetails.duration}
      </p>
    </>
  );
};
