import Image from "next/image";
import Link from "next/link";
import { auth } from "../_lib/auth";

export default async function GuestAreaLink() {
  const session = await auth();
  const image = session?.user?.image;

  if (!image) {
    return (
      <Link href="/account" className="hover:text-accent-400 transition-colors">
        Guest area
      </Link>
    );
  }

  return (
    <Link
      href="/account"
      className="hover:text-accent-400 transition-colors flex items-center gap-4"
    >
      <div className="relative h-8 w-8">
        <Image
          className="rounded-full object-cover"
          fill
          src={image}
          alt={session?.user?.name ?? "User"}
          referrerPolicy="no-referrer"
        />
      </div>
      <span>Guest area</span>
    </Link>
  );
}
