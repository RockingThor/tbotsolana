"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { electronicProducts } from "@/data/data";
import { Button } from "./ui/button";
import { CardData, CartData } from "@/types/type";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import Solanapay from "./solanaPay";

import axios from "axios";

interface CartProps {
  cartData: CartData[];
}

// const telegram = window.Telegram.WebApp;

const Cart = ({ cartData }: CartProps) => {
  const [fullData, setFullData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     telegram.ready();
  // }, []);
  const loadData = () => {
    cartData.forEach((item) => {
      const data = electronicProducts.find((product) => product.id === item.id);
      if (data) {
        setFullData([...fullData, data]);
      }
    });
  };
  const handleCheckout = async () => {
    setLoading(true);
  };
  const getQty = (id: number) => {
    const item = cartData.find((item) => item.id === id);
    if (item) {
      return item.quantity;
    }
    return 0;
  };
  const countTotalPrice = () => {
    let total = 0;
    cartData.forEach((item) => {
      const data = electronicProducts.find((product) => product.id === item.id);
      if (data) {
        const itemPrice = Number(data.Price);
        const itemQuantity = item.quantity;
        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
          total += itemPrice * itemQuantity;
        }
      }
    });
    return total;
  };
  useEffect(() => {
    loadData();
  }, []);
  if (cartData.length === 0) {
    return (
      <div className="text-4xl justify-center items-center flex">
        {" "}
        Your Cart is Empty
      </div>
    );
  }
  const transactionClosed = async () => {
    const res = await axios.get("http://localhost:3002/close");
  };
  return (
    <div className="">
      <div className="text-4xl justify-center items-center flex">
        Cart Items
      </div>
      <div className="">
        <Table>
          <TableCaption>Your cart items are listed above</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fullData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  {item.ProductName}
                </TableCell>
                <TableCell>{item.Price}</TableCell>
                <TableCell>{getQty(item.id)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="text-2xl justify-center items-center flex">
        Total Price : {countTotalPrice()}
      </div>
      <div className="text-2xl justify-center items-center flex mt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              color="default"
              onClick={handleCheckout}
              disabled={loading}
            >
              Checkout With Solana
              {loading ? "Processing..." : "Checkout"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Solanapay />
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={transactionClosed}
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Cart;
