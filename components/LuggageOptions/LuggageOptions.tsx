import { LuggageOption } from "@/lib/types/FlightDetailsDTO";
import { BackpackIcon } from "@radix-ui/react-icons";

type LuggageOptionsProps = {
  luggageOptions: LuggageOption[];
  selectedLuggageOption: LuggageOption | null;
  handleLuggageOptionChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export const LuggageOptions = ({
  luggageOptions,
  selectedLuggageOption,
  handleLuggageOptionChange,
}: LuggageOptionsProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4">
        <BackpackIcon className="inline-block mr-2 h-4 w-4" />
        Select Luggage Option
      </h2>
      <ul>
        <li>
          <label>
            <input
              type="radio"
              name="luggageOption"
              value="none"
              checked={selectedLuggageOption === null}
              onChange={handleLuggageOptionChange}
              className="mr-2"
            />
            No Luggage
          </label>
        </li>
        {luggageOptions.map((option) => (
          <li key={option.name}>
            <label>
              <input
                type="radio"
                name="luggageOption"
                value={option.name}
                checked={selectedLuggageOption?.name === option.name}
                onChange={handleLuggageOptionChange}
                className="mr-2"
              />
              {option.name} - ${option.price}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
};
