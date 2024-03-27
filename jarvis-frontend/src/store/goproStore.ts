import { makeAutoObservable } from "mobx";
import { createContext } from "react";

export interface GoPro {
  SSID: string;
  hardware_info: {
    protocol: string;
    status: number;
    data: {
      model_number: number;
      model_name: string;
      firmware_version: string;
      serial_number: string;
      ap_mac_addr: string;
      ap_ssid: string;
    };
    identifier: number;
  };
  ble_connected: boolean;
  is_open: boolean;
  http_connected: boolean;
}

class GoProStore {
  private _gopro: GoPro | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public get gopro() {
    return this._gopro;
  }

  public set gopro(gopro: GoPro | null) {
    this._gopro = gopro;
  }
}

export const goProStore = new GoProStore();
export const GoProStoreContext = createContext(goProStore);
