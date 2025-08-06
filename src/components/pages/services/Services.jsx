import { FaPlaneDeparture, FaGlobeAsia, FaQuestionCircle, FaCcVisa } from "react-icons/fa";

const services = [
  {
    icon: <FaPlaneDeparture size={40} className="text-white mx-auto" />,
    text: "Assistance in booking flights across Nepal.",
  },
  {
    icon: <FaGlobeAsia size={40} className="text-white mx-auto" />,
    text: "Booking support for global destinations.",
  },
  {
    icon: <FaQuestionCircle size={40} className="text-white mx-auto" />,
    text: "Advice on travel plans, best time to book, layovers, and airlines.",
  },
  {
    icon: <FaCcVisa size={40} className="text-white mx-auto" />,
    text: "Assistance with visa documentation and application process.",
  },
];

const Services = () => {
  return (
    <section className="py-12 bg-white text-center " id="services">
      <h3 className="text-2xl md:text-4xl font-semibold text-[#2E6FB7] mb-8 font-cursive" style={{ fontFamily: 'Satisfy' }}>Services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 max-w-6xl mx-auto ">
        {services.map((service, index) => (
          <div key={index} className="bg-[#269BD6] rounded-xl p-6 shadow-md hover:scale-105 transition-transform duration-300">
            <div className="mb-4">{service.icon}</div>
            <p className="text-white text-sm font-medium">{service.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
