"use client"
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

interface Iproducts {
  imageUrl: string;
  discountPercent: number;
  isNew: boolean;
  name: string;
  description: string;
  price: number;
  _id: string;
}

// Star icons array
const star = [
  <FaStar key={1} />,
  <FaStar key={2} />,
  <FaStar key={3} />,
  <FaStar key={4} />,
  <FaStar key={5} />,
];

export default function Products() {
  const [products, setProducts] = useState<Iproducts[]>([]);    //products: Holds the list of products (starts as an empty array []).
                                                              //setProducts: A function that updates the products state. You’ll call this when new data (products) is fetched. 
  const [loading, setLoading] = useState(true);                 //: This keeps track of whether the data is still being fetched. It starts as true because you assume loading starts when the component first mounts.
  
  
  const [error, setError] = useState<string | null>(null);//his holds an error message if there’s an issue fetching the products. It starts as null because no error is assumed initially.

  useEffect(() => {
    // Fetch products with error handling
    const fetchProducts = async () => {
      try {
        setLoading(true);    //loading is set to true while the data is being fetched.
        setError(null);
        const fetchedProducts: Iproducts[] = await client.fetch(
          `*[_type == 'products']{
            "imageUrl": image.asset->url,
            category,
            discountPercent,
            isNew,
            name,
            description,
            price,
            _id
          }[13...17]`
        );
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError("Failed to load products. Please try again later.");    //
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);         //If the data is fetched successfully, products is updated with the list of products, and loading is set to false.
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full mt-10 max-w-screen-xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-center">TOP SELLING</h1>
      <div className="relative mt-10 overflow-x-auto flex space-x-5 px-8">
        {products.map((data) => (
          <div key={data._id} className="flex-shrink-0">
            <Link href={`/product/${data._id}`}>
              <div className="w-[200px] md:w-[283px] h-[200px] md:h-[290px] bg-[#F0EEED] rounded-[20px]">
                {data.imageUrl ? (
                  <Image
                    src={urlFor(data.imageUrl).url()}
                    alt={data.name}
                    className="w-full h-full rounded-[20px]"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center bg-gray-300 rounded-[20px]">
                    <p>No Image</p>
                  </div>
                )}
              </div>
            </Link>
            <div className="pl-2">
              <p className="text-lg mt-2 font-bold">{data.name}</p>
              <div className="flex text-yellow-400">
                {star.map((icon, index) => (
                  <span key={index}>{icon}</span>
                ))}
              </div>
              <p className="font-bold mt-1">
                ${data.price.toFixed(2)}
                {data.discountPercent ? (
                  <span className="text-gray-400 font-bold line-through ml-2">
                    {data.discountPercent}%
                  </span>
                ) : null}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-start mt-5">
        <Link href="/casual">
          <Button
            variant={"outline"}
            className="sm:mt-0 w-[80%] sm:w-[200px] rounded-[20px]"
          >
            View all
          </Button>
        </Link>
      </div>
    </div>
  );
}