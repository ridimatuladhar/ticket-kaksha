// import React from "react";

// const testimonials = [
//   {
//     text: "Ticket Kaksha made my travel planning so easy! The booking process was seamless and the customer service was outstanding. Highly recommend!",
//     name: "Aman Raut",
//     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//   },
//   // {
//   //   text: "I had a great experience with Ticket Kaksha. The platform is user-friendly and very efficient.",
//   //   name: "Sita Karki",
//   //   image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//   // },
//   {
//     text: "Best travel service I've used so far. Will definitely book again!",
//     name: "Ram Thapa",
//     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//   },
//   {
//     text: "Super fast and convenient. Kudos to the team!",
//     name: "Sunita Sharma",
//     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//   },
// ];

// const Testimonials = () => {
//   // Create enough duplicates for seamless infinite scroll
//   const duplicatedTestimonials = [
//     ...testimonials,
//     ...testimonials,
//     ...testimonials,
//   ];

//   return (
//     <div className="py-10 bg-[#f8fafc] overflow-hidden">
//       <h1
//         className="text-4xl text-center font-bold mb-10 text-[#2E6FB7]"
//         style={{ fontFamily: "Satisfy" }}
//       >
//         Testimonials
//       </h1>

//       {/* Desktop View - Infinite Scroll */}
//       <div className="relative w-full overflow-hidden hidden md:block">
//         <div
//           className="flex gap-6 animate-scroll"
//           style={{
//             width: `${duplicatedTestimonials.length * 318}px`,
//             animation: "scroll 60s linear infinite",
//           }}
//         >
//           {duplicatedTestimonials.map((item, index) => (
//             <div
//               key={index}
//               className="min-w-[450px] max-w-md bg-white shadow-md border border-[#2F8DCC] rounded-xl p-6  flex flex-col justify-between"
//             >
//               <p className="text-gray-700 text-md mb-6 leading-relaxed">
//                 "{item.text}"
//               </p>
//               <div className="flex items-center gap-3">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <p className="text-gray-500 text-sm">{item.name}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Mobile View - Show All Testimonials */}
//       <div className="block md:hidden px-4">
//         <div className="grid gap-6">
//           {testimonials.map((item, index) => (
//             <div
//               key={index}
//               className="w-full bg-white shadow-md border border-[#2F8DCC] rounded-xl p-6 flex flex-col justify-between"
//             >
//               <p className="text-gray-700 text-md mb-6 leading-relaxed">
//                 "{item.text}"
//               </p>
//               <div className="flex items-center gap-3">
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <p className="text-gray-500 text-sm">{item.name}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <style jsx>{`
//         @keyframes scroll {
//           0% {
//             transform: translateX(0);
//           }
//           100% {
//             transform: translateX(-${testimonials.length * 318}px);
//           }
//         }
        
//         .animate-scroll:hover {
//           animation-play-state: paused;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Testimonials;