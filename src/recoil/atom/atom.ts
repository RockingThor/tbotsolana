import { CartData } from "@/types/type";
import { atom } from "recoil";

export const cartState = atom<CartData[]>({
  key: "cartState",
  default: [],
});
