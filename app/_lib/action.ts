"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

interface BookingData {
  startDate: Date | undefined;
  endDate: Date | undefined;
  numNights: number;
  cabinPrice: number;
  cabinId: number;
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const nationalID = formData.get("nationalID");

  if (
    typeof nationalID !== "string" ||
    !/^[a-zA-Z0-9]{6,12}$/.test(nationalID)
  ) {
    throw new Error("Please provide a valid national ID");
  }

  const nationalityValue = formData.get("nationality");

  if (typeof nationalityValue !== "string") {
    throw new Error("Please select a country");
  }

  const [nationality, countryFlag] = nationalityValue.split("%");

  if (!nationality || !countryFlag) {
    throw new Error("Please select a valid country");
  }

  const updateData = { nationality, countryFlag, nationalID };

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteBooking(bookingId: number) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("you are not allow to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const reservId = Number(formData.get("reservId"));

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(reservId))
    throw new Error("you are not allow to update this booking");

  const updatedFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000),
  };

  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", reservId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${reservId}`);

  redirect("/account/reservations");
}

export async function createBooking(
  bookingData: BookingData,
  formData: FormData,
) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations")?.slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}
