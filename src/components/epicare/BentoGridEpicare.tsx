import React from 'react';
import BentoGridDesktop from './BentoGridDesktop';
import BentoGridMobile from './BentoGridMobile';

export default function BentoGridEpicare() {
  return (
    <>
      <div className="hidden md:block">
        <BentoGridDesktop />
      </div>
      <div className="block md:hidden">
        <BentoGridMobile />
      </div>
    </>
  );
}
