import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

interface Props {
  params: Promise<{ cabinId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));
  return {
    title: `Cabin ${cabin.name}`,
  };
}

export async function generateStaticParams() {
  const cabins = await getCabins();
  return cabins.map((cabin) => ({ cabinId: String(cabin.id) }));
}

async function Page({ params }: Props) {
  const { cabinId } = await params;
  const cabin = await getCabin(Number(cabinId));

  const { name } = cabin;

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8">
        <Cabin cabin={cabin} />

        <div>
          <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
            Reserve {name} today. Pay on arrival.
          </h2>
          <Suspense fallback={<Spinner />}>
            <Reservation cabin={cabin} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default Page;
