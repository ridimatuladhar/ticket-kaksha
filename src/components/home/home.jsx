import MainPage from "../main/mainPage"
import Nav from "../nav/nav"
import AboutUs from "../pages/AboutUS/AboutUs"
import Banners from "../pages/banners/Banners"
import ContactForm from "../pages/contactForm/ContactForm"
import CsrCards from "../pages/csr/csrsection"
import PopularDestinations from "../pages/destinations/PopularDestinations"
import Footer from "../pages/footer/footer"
import Services from "../pages/services/Services"
import GetTestimonials from "../pages/testimonials/GetTestimonials"
// import Testimonials from "../pages/testimonials/Testimonials"





const Home = () => {
  return (
    <div>
       <Nav/>
       <MainPage/>
       <AboutUs/>
       {/* <Testimonials/> */}
       <GetTestimonials />
       <Services/>
       <Banners/>
       <CsrCards/>
       <PopularDestinations/>
       <ContactForm/>
       <Footer/>
      
    </div>
  )
}

export default Home
