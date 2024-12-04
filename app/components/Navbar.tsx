"use client";

import { truncateAddress } from "@/lib/truncateAddress";
import { useAccount } from "wagmi";

const Navbar = () => {
    const { address } = useAccount()
    return (
        <div className="flex justify-between h-20 items-center p-4">
            <h1 className="text-2xl font-bold">
                #TickerTool
            </h1>
            {address && (
                <h1 className="text-xl font-bold">
                    {truncateAddress(address)}
                </h1>
            )}
        </div>
    );
};

export default Navbar;