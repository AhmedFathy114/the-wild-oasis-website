import SelectCountry from "@/app/_components/SelectCountry";
import UpdateProfileForm from "@/app/_components/UpdateProfileForm";
import { auth } from "@/app/_lib/auth";
import { getGuest } from "@/app/_lib/data-service";
import { Metadata } from "next";
import { redirect } from "next/navigation";

interface Guest {
  id: number;
  fullName: string;
  email: string;
  nationalID: string;
  nationality: string;
  countryFlag: string;
}

export const metadata: Metadata = {
  title: "update profile",
};

async function Page() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) redirect("/login");
  const guest: Guest = await getGuest(email);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-4">
        Update your guest profile
      </h2>

      <p className="text-lg mb-8 text-primary-200">
        Providing the following information will make your check-in process
        faster and smoother. See you soon!
      </p>

      <UpdateProfileForm guest={guest}>
        <SelectCountry
          name="nationality"
          id="nationality"
          className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          defaultCountry={guest.nationality}
          defaultFlag={guest.countryFlag}
        />
      </UpdateProfileForm>
    </div>
  );
}

export default Page;
