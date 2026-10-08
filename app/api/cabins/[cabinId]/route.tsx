import { getBookedDatesByCabinId, getCabin } from "@/app/_lib/data-service";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ cabinId: string }>;
  },
) {
  const { cabinId } = await params;
  try {
    const [cabin, bookedDates] = await Promise.all([
      getCabin(Number(cabinId)),
      getBookedDatesByCabinId(Number(cabinId)),
    ]);
    return Response.json({ cabin, bookedDates });
  } catch {
    return Response.json({ message: "cabin not found" });
  }
}

export async function POST() {}
