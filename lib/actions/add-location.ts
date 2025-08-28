"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function geocodeAddress(address: string) {
  const apiKey = process.env.MAPTILER_API_KEY!;
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(address)}.json?key=${apiKey}`
  );

  const data = await response.json();

  if (!data.features || data.features.length === 0) {
    throw new Error("Address not found");
  }

  const [lng, lat] = data.features[0].geometry.coordinates;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await auth();
  if (!session) {
    throw new Error("Not authenticated");
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Missing address");
  }

  const { lat, lng } = await geocodeAddress(address);

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}


