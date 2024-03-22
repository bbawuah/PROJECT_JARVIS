import { useContext } from "react";
import { GoPro, GoProStoreContext } from "../store/goproStore";

export const useStore = () => {
  const store = useContext(GoProStoreContext);

  return { gopro: store.gopro, updateGoPro };

  function updateGoPro(gopro: GoPro) {
    store.gopro = gopro;
  }
};
