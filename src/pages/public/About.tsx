"use client";

import React from 'react';
// Assuming PublicLayout and Button are custom components in your project structure.
// If not, you can replace <PublicLayout> with a <div> and <Button> with a <button>.
import { PublicLayout } from "@/components/public/PublicLayout";
import { Button } from "@/components/ui/button";
import about_home from "@/assets/about/about-home.png"
import team1 from "@/assets/team/team1.jpg"
import about_circle from "@/assets/about/about-circle.png";
import { Link } from 'react-router-dom';


// -----------------------------------------

// --- SVG Icons for Mission & Values ---
const SpiritualIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#B5945A]">
    <path d="M2 21h20" />
    <path d="M4 14.5A2.5 2.5 0 0 1 6.5 12H8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 17.5V14.5Z" />
    <path d="M16 14.5A2.5 2.5 0 0 1 18.5 12H20a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1.5a2.5 2.5 0 0 1-2.5-2.5V14.5Z" />
    <path d="M12 4v16" />
    <path d="M8 2h8" />
  </svg>
);

const ComfortIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#B5945A]">
    <path d="M2 21h20" />
    <path d="M5 12v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
    <path d="M12 12v9" />
    <path d="M2 12h20" />
  </svg>
);

const TrustIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-[#B5945A]">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);


export const About = () => {
  const missionValues = [
    { title: "Spiritual Guidance", desc: "Expert-led faith journeys that let the core of your pilgrimage shine.", icon: <SpiritualIcon /> },
    { title: "Luxury Comfort", desc: "Premium accommodations and seamless transport.", icon: <ComfortIcon /> },
    { title: "Trustworthy Service", desc: "24/7 support, visa assistance, and complete logistics.", icon: <TrustIcon /> },
  ];

  const team = [
    { name: "Maulana Syed Ata Haider Rizvi", role: "Tour Lead",Phone:"+91-98198 37579", photo: team1 },
    { name: "Farman Rizvi", role: "Tour Director",Phone:"+91-82944 56639", photo: "https://i.pinimg.com/1200x/41/e0/39/41e0398984b0f1a0c79acfb0694bfcce.jpg" },
  ];

  return (
    <PublicLayout>
        {/* Hero Section */}
        <section
          className="relative h-[450px] md:h-[550px] bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${about_home})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">About Ar-Rahman Ziyarat Tours</h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8">Guiding your spiritual journey with care and faith</p>
            <Button className="border-2 border-white bg-transparent px-8 py-3 text-white hover:bg-white hover:text-black">
              Our Mission
            </Button>
          </div>
        </section>

        {/* Our Journey of Faith Section */}
        <section className="relative bg-[#F5F0E8] py-16 md:py-24 -mt-12 md:-mt-16 rounded-t-3xl shadow-2xl">
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-6">Our Journey of Faith</h2>
                    <p className="text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                      Ar-Rahman Tours is founded by <b>(Maulana) Ata Haider Rizvi </b>, a prominent religious leader and a volunteer for past twenty years, who has been actively engaged in organising Umrah and Ziarat Groups with core focus of serving community. Ar-Rahman Tours is a muslim travel agency which is highly charged up team of skilled and dedicated professionals work for the company since the year 2008. 
                    </p>
                </div>
                <div className="flex justify-center">
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                         <div className="absolute inset-0 bg-white rounded-full shadow-2xl transform rotate-6"></div>
                         <img 
                            src={about_circle} 
                            alt="Group of happy pilgrims" 
                            className="relative w-full h-full object-cover rounded-full shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Our Mission & Values Section */}
       <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
                
                {/* Column 1: Mission & Values */}
                <div className="text-left">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-12">Our Mission & Values</h2>
                    <div className="space-y-8">
                        {missionValues.map((item) => (
                            <div key={item.title} className="flex items-start gap-4">
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-[#F5F0E8] rounded-lg">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-800 mb-1">{item.title}</h3>
                                    <p className="text-gray-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 2: Meet Our Team */}
                <div className="bg-[#F5F0E8] p-8 rounded-xl">
                     <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-8 text-left">Meet Our Team</h2>
                     <div className="space-y-6">
                        {team.map((member) => (
                          <div key={member.name} className="bg-white p-4 rounded-lg shadow-md flex items-center gap-4 transition-shadow duration-300 hover:shadow-xl">
                            <img src={member.photo} alt={member.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-200" />
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
                                <p className="text-gray-500 text-sm">{member.role}</p>
                                <p className="text-black-500 text-sm font-bold">{member.Phone}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="mt-8 text-left">
                      <Link to="/contact">
                        <Button className="bg-[#B5945A] text-white px-8 py-3 hover:bg-opacity-90">
                            Contact Us
                        </Button>
</Link>
                    </div>
                </div>
            </div>
        </section>
        

        {/* Footer CTA Section */}
        <section className="bg-[#B5945A] text-white py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Join Our Spiritual Family</h2>
            <p className="max-w-xl mx-auto mb-8">Let us handle the details while you focus on your faith. Contact us to begin your journey.</p>
            <Link to="/contact">
            <Button className="bg-white text-[#B5945A] px-10 py-3 hover:bg-gray-100">
              Contact Us
            </Button>
            </Link>
          </div>
        </section>
    </PublicLayout>
  );
};

export default About;