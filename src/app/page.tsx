import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import HowItWorks from "@/components/home/HowItWorks";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Highlights />
      <HowItWorks />
      <CallToAction />
    </main>
  );
}
