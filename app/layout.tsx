import { Metadata } from "next";
import Header from "./_components/Header";
import { Josefin_Sans } from "next/font/google";
import "@/app/_styles/globals.css";
import { ReservationProviders } from "./_components/ReservationContext";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome | The Wild Oasis",
  },
  description:
    "luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains dark forests",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scrollbar-thumb-primary-600 scrollbar-thin">
      <body
        className={`bg-primary-950 text-primary-100 min-h-screen ${josefin.className} flex flex-col antialiased relative`}
      >
        <Header />
        <div className="flex-1 px-8 py-12 grid">
          <main className="max-w-7x mx-auto w-full">
            <ReservationProviders>{children}</ReservationProviders>
          </main>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
