type TotalPriceProps = {
  totalPrice: number;
};

export const TotalPrice = ({ totalPrice }: TotalPriceProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mt-4">Total Price</h2>
      <p>${totalPrice}</p>
    </>
  );
};
