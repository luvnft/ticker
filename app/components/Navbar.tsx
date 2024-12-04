"use client";

import { truncateAddress } from "@/lib/truncateAddress";
import { useAccount } from "wagmi";

const Navbar = () => {
    const { address } = useAccount()
    return (
        <div className="py-5 text-center">
            {address && (
                <span className="text-2xl font-bold">
                    {truncateAddress(address)}
                </span>
            )}
        </div>
    );
};

export default Navbar;