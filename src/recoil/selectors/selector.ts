import { selector } from "recoil";
import { cartState } from "../atom/atom";
import { electronicProducts } from "@/data/data";
import { CardData } from "@/types/type";

export const cartDataSelectror = selector({
  key: "cartDataSelectror",
  get: ({ get }) => {
    const data = get(cartState);
    return data;
  },
});

export const getFullDataCart = selector({
  key: "getFullDataCart",
  get: ({ get }) => {
    let fullData: CardData[] = [];
    const cData = get(cartDataSelectror);
    cData.forEach((item) => {
      const data = electronicProducts.find((product) => product.id === item.id);
      fullData.push(data as CardData);
    });
    return fullData;
  },
});

export const cartItemNumber = selector({
  key: "cartItemNumber",
  get: ({ get }) => {
    const data = get(cartDataSelectror);
    let num: number = 0;
    data.forEach((item) => {
      num += item.quantity;
    });
    return num;
  },
});
