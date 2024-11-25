import { CardHeader, CardTitle } from "@/components/ui/card";
import { ClockIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

type FlightHeaderProps = {
  airline: string;
  minutes: number;
  seconds: number;
};

export const FlightHeader = ({
  airline,
  minutes,
  seconds,
}: FlightHeaderProps) => {
  return (
    <CardHeader className="flex items-center justify-between">
      <CardTitle>{airline}</CardTitle>
      <div className="flex items-center">
        <ClockIcon className="mr-1 h-4 w-4" />
        <span
          className={cn(
            minutes * 60 + seconds < 10 ? "text-red-500" : "text-black"
          )}
        >
          Price update in {minutes}:{String(seconds).padStart(2, "0")}
        </span>
      </div>
    </CardHeader>
  );
};
