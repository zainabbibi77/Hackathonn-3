"use client"
import { Button } from "@/components/ui/button";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";  //useEffect, useState: React hooks for managing state and side effects (like fetching data).

// Adding key prop in star array
let star = [
    <FaStar key={1} />,
    <FaStar key={2} />,
    <FaStar key={3} />,
    <FaStar key={4} />,
    <FaStar key={5} />,
];

interface Iproducts {
    image: string;
    discountPercent: number;
    isNew: boolean;
    name: string;
    description: string;
    price: number;
    _id: string;
}

export default function Product() {
    const [products, setProducts] = useState<Iproducts[]>([]);    //This is the main Product component. It initializes an empty array products using the useState hook, which will later hold the list of products fetched from the database.
                                                               //products: This is the state variable. Initially, it is set to an empty array [], because we don't have any products when the component first loads.
                                                            //setProducts: This is the function that will be used to update the ( products )state variable.
    useEffect(() => {        //The useEffect hook is used to fetch product data from the database when the component loads.
        const fetchProducts = async () => {
            try {
                const fetchedProducts = await client.fetch(
                    `*[_type == 'products' && category == 'tshirt']{
                        "image": image.asset->url,
                        category,
                        discountPercent,
                        isNew,
                        name,
                        description,
                        price,
                        _id
                    }[0...4]`
                );                            //update the `products` state with the fetched data
                setProducts(fetchedProducts);      //The fetched data is then saved in the products state using setProducts.
                                                 //Whenever you want to update the state (for example, after fetching data from the server), you call setProducts() with the new value you want to store in the products state.
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();            //The fetchProducts function defines a list of products and then calls setProducts(fetchedProducts) to update the products state with the new list of products.
    }, []);

    return (
        <>
            <div className="w-full h-full mt-10 lg:mt-36 max-w-screen-xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center">NEW ARRIVALS</h1>
                <div className="relative mt-10 overflow-x-auto flex space-x-5 px-8">
                    {products.length > 0 ? (
                        products.map((data) => {
                            return (
                                <div key={data._id} className="flex-shrink-0">
                                    <Link href={`/product/${data._id}`}>
                                        <div className="w-[200px] md:w-[283px] h-[200px] md:h-[290px] bg-[#F0EEED] rounded-[20px]">
                                            {data.image && (
                                                <Image
                                                    src={urlFor(data.image).url()}
                                                    alt={data.name}
                                                    className="w-full h-full rounded-[20px]"
                                                    width={100}
                                                    height={100}
                                                />
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
                                            {data.price}{" "}
                                            <span className="text-gray-400 font-bold line-through">
                                                {data.discountPercent}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500 w-full">
                            No products available at the moment. Please try again later.
                        </p>
                    )}
                </div>
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
        </>
    );
}