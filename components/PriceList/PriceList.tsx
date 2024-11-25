import { PaperPlaneIcon } from "@radix-ui/react-icons";

type PriceListProps = {
  prices: { [key: string]: number };
};

export const PriceList = ({ prices }: PriceListProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4">
        <PaperPlaneIcon className="inline-block mr-2 h-4 w-4" />
        Prices
      </h2>
      <ul>
        {Object.entries(prices).map(([classType, price]) => (
          <li key={classType}>
            {classType}: ${price}
          </li>
        ))}
      </ul>
    </>
  );
};
