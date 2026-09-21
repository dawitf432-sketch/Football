import { useState, useEffect } from "react";
import PublicNavbar from "../../components/public/PublicNavbar";
import HomeHero from "../../components/public/home/HomeHero";
import HomeAcademyIntro from "../../components/public/home/HomeAcademyIntro";
import HomeDevelopmentOverview from "../../components/public/home/HomeDevelopmentOverview";
import HomeHowItWorks from "../../components/public/home/HomeHowItWorks";
import HomeEcosystem from "../../components/public/home/HomeEcosystem";
import HomeFinalCta from "../../components/public/home/HomeFinalCta";
import PublicFooter from "../../components/public/PublicFooter";

export default function HomePage() {
  const [stats, setStats] = useState({
    trainingDrills: 260,
    verifiedAthletes: 280,
    certifiedCoaches: 42,
    accreditedScouts: 19,
  });

  useEffect(() => {
    fetch("/api/public/stats")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load platform stats");
      })
      .then((data) => {
        if (data && typeof data === "object") {
          setStats({
            trainingDrills: data.trainingDrills ?? 260,
            verifiedAthletes: data.verifiedAthletes ?? 280,
            certifiedCoaches: data.certifiedCoaches ?? 42,
            accreditedScouts: data.accreditedScouts ?? 19,
          });
        }
      })
      .catch(() => {
        // Fallback default values maintain visual stability
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#030611] text-white selection:bg-[#00ff88] selection:text-black font-sans antialiased overflow-x-hidden">
      {/* 1. Clean responsive navbar */}
      <PublicNavbar />

      <main>
        {/* 2. Hero section with Pro Football Class logo, headline, short description and CTA */}
        <HomeHero stats={stats} />

        {/* 3. Short Academy introduction (5-Pillar Framework) */}
        <HomeAcademyIntro />

        {/* 4. Compact Training / Development overview */}
        <HomeDevelopmentOverview />

        {/* 5. Simple "How It Works" section */}
        <HomeHowItWorks />

        {/* 6. Short section explaining Players, Coaches, Scouts and Scholarship Providers */}
        <HomeEcosystem />

        {/* 7. Final CTA */}
        <HomeFinalCta />
      </main>

      {/* 8. Clean footer */}
      <PublicFooter />
    </div>
  );
}
