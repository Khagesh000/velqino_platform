import Navbar from "@/features/common/Navbar";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Home - Velqino Platform",
  description: "Find the best wholesalers and retailers near you",
};

export default function Home() {
  return (
    <>
      <div>
        <Navbar />
      </div>
    </>
  );
}