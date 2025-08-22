import Hero from "@/components/home/Hero";
import Highlights from "@/components/home/Highlights";
import HowItWorks from "@/components/home/HowItWorks";
import CallToAction from "@/components/home/CallToAction";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Highlights />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
