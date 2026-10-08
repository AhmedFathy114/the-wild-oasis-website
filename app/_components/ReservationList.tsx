"use client";

import { useOptimistic } from "react";
import { deleteBooking } from "@/app/_lib/action";
import ReservationCard from "./ReservationCard";

interface ReservationBookings {
  id: number;
  guestId: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  created_at: string;
  cabinId: number;
  cabins: {
    name: string;
    image: string;
  }[];
}

function ReservationList({ bookings }: { bookings: ReservationBookings[] }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId) => {
      return currentBookings.filter((booking) => booking.id !== bookingId);
    },
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  return (
    <>
      <ul className="space-y-6">
        {optimisticBookings.map((booking: ReservationBookings) => (
          <ReservationCard
            booking={booking}
            key={booking.id}
            onDelete={() => handleDelete(booking.id)}
          />
        ))}
      </ul>
    </>
  );
}

export default ReservationList;
