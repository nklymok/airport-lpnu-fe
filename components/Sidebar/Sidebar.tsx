import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HeartIcon } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4 fixed left-0 top-0">
      <h2 className="text-2xl font-bold mb-4">Flight Search</h2>
      <Button asChild className="w-full">
        <Link href="/favorites">
          <HeartIcon className="mr-2 h-4 w-4" />
          Favorite Flights
        </Link>
      </Button>
    </div>
  );
}
