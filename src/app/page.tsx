import Hero from "@/components/Herro";
import FontShowcase from "@/components/Retangle";
import Dress from "@/components/dress";
import CustomerCarousel from "@/components/Customer";

import Top_sell from "./product/sell";
import Product from "./product/page";


export default function Home() {
  return (
   <div>
   
    <Hero/>
    <FontShowcase/>
    
    <Product/>
    <Top_sell/>
    <Dress/>
    <CustomerCarousel/>
    
   </div> 
  );
}
