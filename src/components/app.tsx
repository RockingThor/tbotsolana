"use client";
import { electronicProducts } from "@/data/data";
import { CardData, CartData } from "@/types/type";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ShoppingCartIcon } from "lucide-react";
import Cart from "./cart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";

// const telegram = window.Telegram.WebApp;

function App() {
  const [cartData, setCartData] = useState<CartData[]>([]);
  const cardData: CardData[] = electronicProducts;

  // useEffect(() => {
  //     telegram.ready();
  // }, []);

  const handleRemove = (id: number) => {
    const updatedCartData: CartData[] = cartData.filter(
      (item) => item.id !== id
    );
    setCartData(updatedCartData);
    console.log(cartData);
  };

  const addItem = (id: number) => {
    const existingItemIndex = cartData.findIndex((item) => item.id === id);
    if (existingItemIndex !== -1) {
      const updatedCartData = [...cartData];
      updatedCartData[existingItemIndex].quantity++;
      setCartData(updatedCartData);
    } else {
      setCartData([...cartData, { id, quantity: 1 }]);
    }
    console.log(cartData);
  };
  return (
    <>
      <div className="">
        <h1 className="text-3xl items-center justify-center flex">
          P3PT0
          <div className="">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ShoppingCartIcon />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <Cart cartData={cartData} />
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </h1>
        <div className="items-center justify-center flex-col">
          {cardData.map((card) => (
            <div className="p-2 w-[320px]" key={card.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{card.ProductName}</CardTitle>
                  <CardDescription>{card.Description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={card.ImageLink}
                    alt={card.ProductName}
                    width={300}
                    height={200}
                    className="object-fill h-[200px] w-[300px] rounded"
                  />
                </CardContent>
                <CardFooter>
                  <div className="flex">
                    <div className="p-2 text-base">Price: ${card.Price}</div>
                    <div className="p-2">
                      <Button
                        variant={"destructive"}
                        onClick={() => handleRemove(card.id)}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="p-2">
                      <Button
                        variant={"default"}
                        onClick={() => addItem(card.id)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
