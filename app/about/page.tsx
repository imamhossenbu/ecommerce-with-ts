import React from 'react';
import StorySection from './_components/StorySection';
import JourneySection from './_components/JourneySection';
import PhilosophySection from './_components/PhilosophySection';
import IngredientsSection from './_components/IngredientSection';
import JoinCommunity from '@/components/JoinCommunity';



export default function AboutPage() {
  return (
    <main className="overflow-x-hidden">
      <div className="">
        
        <StorySection />
        
        <JourneySection />
        
        <PhilosophySection />
        <IngredientsSection/>
        <JoinCommunity/>
        
      </div>
    </main>
  );
}