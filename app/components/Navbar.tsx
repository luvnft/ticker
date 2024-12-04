"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./Button";
import { config } from "./WagmiProvider";
import Image from "next/image";
import { truncateAddress } from "@/lib/truncateAddress";

const Navbar = () => {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect();
    const { connect } = useConnect();
    return (
        <header className="flex flex-row justify-between items-center p-4">
            <div className="items-center">
                <Image src={"/splash.png"} priority width={60} height={60} alt="Ticker Tool" />
            </div>
            <div className="items-center -mt-5">
                <Button
                    disabled={!isConnected}
                    onClick={() => isConnected
                        ? disconnect() :
                        connect({ connector: config.connectors[0] })}
                >
                    {isConnected ? truncateAddress(address as string) : "Connect Wallet"}
                </Button>
            </div>
        </header>
    );
};

export default Navbar;