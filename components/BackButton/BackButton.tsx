import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className="flex items-center text-blue-500 hover:underline mb-4"
    >
      <ArrowLeftIcon className="mr-2 h-5 w-5" /> Back to Flight Search
    </button>
  );
};
