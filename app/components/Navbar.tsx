"use client";

import { useAccount } from "wagmi";
import { Button } from "./Button";
import Image from "next/image";
import { truncateAddress } from "@/lib/truncateAddress";

const Navbar = () => {
    const { address, isConnected } = useAccount()
    return (
        <header className="flex flex-row justify-between items-center p-4">
            <div className="items-center">
                <Image src={"/splash.png"} priority width={60} height={60} alt="Ticker Tool" />
            </div>
            <div className="items-center -mt-5">
                <Button
                    disabled
                >
                    {isConnected ? truncateAddress(address as string) : "Open in Warpcast"}
                </Button>
            </div>
        </header>
    );
};

export default Navbar;