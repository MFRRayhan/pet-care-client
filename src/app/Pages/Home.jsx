import Banner from "@/components/SharedComponent/Banner";
import LimitedPetShow from "@/components/SharedComponent/LimitedPetShow";
import Loading from "@/components/SharedComponent/Loading";
import PetCare from "@/components/SharedComponent/PetCare";
import PetsCategorySection from "@/components/SharedComponent/PetsCategorySection";
import PetsHappinessSection from "@/components/SharedComponent/PetsHappinessSection";
import WeProvideFeatures from "@/components/SharedComponent/WeprovideFeatures";
import React from "react";
// use smooth and cute scroll behavior for the whole app

const Home = () => {
  return (
    <>

      <section className="pt-24 md:pt-32 lg:pt-40">
        <Banner />
      </section>
      <PetsCategorySection />
      <WeProvideFeatures />
      <LimitedPetShow />
      <PetsHappinessSection />
      <PetCare />
    </>
  );
};

export default Home;
