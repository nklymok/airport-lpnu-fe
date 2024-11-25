"use client";

import React, { useState, useEffect, useRef } from "react";
import SeatPicker from "react-seat-picker";
// Removed unused imports
// import { Button } from "@/components/ui/button";
// import { toast } from "@/hooks/use-toast";
// import { DollarSignIcon } from "lucide-react";

type SeatType = {
  classType: string;
  seatOption: string;
  price: number;
  amount: number;
};

type FlightSeatPickerProps = {
  availableSeats: SeatType[];
  onTotalPriceChange: (totalPrice: number) => void;
};

export function FlightSeatPicker({
  availableSeats,
  onTotalPriceChange,
}: FlightSeatPickerProps) {
  const [loading, setLoading] = useState(false);
  const [seatRows, setSeatRows] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Use a ref to store seat information by id
  const seatMapRef = useRef({});

  useEffect(() => {
    onTotalPriceChange(totalPrice);
  }, [totalPrice, onTotalPriceChange]);

  useEffect(() => {
    const totalSeats = 90;
    const seatsPerRow = 5;
    const totalRows = Math.ceil(totalSeats / seatsPerRow);

    const rows = [];
    let seatId = 1;
    let availableSeatIndex = 0;

    // Flatten available seats into a single array
    const availableSeatObjects = [];
    availableSeats.forEach((seatType) => {
      for (let i = 0; i < seatType.amount; i++) {
        availableSeatObjects.push({
          classType: seatType.classType,
          seatOption: seatType.seatOption,
          price: seatType.price,
          tooltip: `${seatType.classType} - ${seatType.seatOption} - $${seatType.price}`,
        });
      }
    });

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const rowSeats = [];
      for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
        let seat = null;
        if (availableSeatIndex < availableSeatObjects.length) {
          // Assign available seat
          const availableSeat = availableSeatObjects[availableSeatIndex++];
          seat = {
            id: seatId,
            number: seatNumber,
            tooltip: availableSeat.tooltip,
            isReserved: false,
          };
          // Store seat information in seatMapRef
          seatMapRef.current[seatId] = {
            price: availableSeat.price,
            classType: availableSeat.classType,
            seatOption: availableSeat.seatOption,
          };
        } else {
          // Assign unavailable dummy seat
          seat = {
            id: seatId,
            number: seatNumber,
            isReserved: true,
            tooltip: "Unavailable seat",
          };
          // Store dummy seat in seatMapRef
          seatMapRef.current[seatId] = null;
        }
        seatId++;
        rowSeats.push(seat);
      }
      rows.push(rowSeats);
    }

    setSeatRows(rows);
  }, [availableSeats]);

  const addSeatCallback = ({ row, number, id }, addCb) => {
    setLoading(true);
    setTimeout(() => {
      console.log(`Added seat ${number}, row ${row}, id ${id}`);

      // Get seat information from seatMapRef
      const seatInfo = seatMapRef.current[id];
      if (seatInfo) {
        setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, id]);
        setTotalPrice((prevTotal) => prevTotal + seatInfo.price);
      }

      addCb(row, number, id);
      setLoading(false);
    }, 1500);
  };

  const removeSeatCallback = ({ row, number, id }, removeCb) => {
    setLoading(true);
    setTimeout(() => {
      console.log(`Removed seat ${number}, row ${row}, id ${id}`);

      // Get seat information from seatMapRef
      const seatInfo = seatMapRef.current[id];
      if (seatInfo) {
        setSelectedSeats((prevSelectedSeats) =>
          prevSelectedSeats.filter((seatId) => seatId !== id)
        );
        setTotalPrice((prevTotal) => prevTotal - seatInfo.price);
      }

      removeCb(row, number);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-1/2 flex flex-col m-auto">
      {seatRows.length > 0 ? (
        <>
          <SeatPicker
            addSeatCallback={addSeatCallback}
            removeSeatCallback={removeSeatCallback}
            rows={seatRows}
            maxReservableSeats={3}
            loading={loading}
            alpha
            visible
            selectedByDefault={false}
            tooltipProps={{ multiline: true }}
          />
          {/* Removed total price display */}
        </>
      ) : (
        <p>Loading seats...</p>
      )}
    </div>
  );
}
