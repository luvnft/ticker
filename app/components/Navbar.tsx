"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "./Button";
import { config } from "./WagmiProvider";
import Image from "next/image";

const Navbar = () => {
    const { isConnected } = useAccount()
    const { disconnect } = useDisconnect();
    const { connect } = useConnect();
    return (
        <header className="flex flex-row justify-between items-center p-4">
            <div className="items-center">
                <Image src={"/splash.png"} priority width={60} height={60} alt="Ticker Tool" />
            </div>
            <div className="items-center -mt-5">
                <Button
                    onClick={() => isConnected
                        ? disconnect() :
                        connect({ connector: config.connectors[0] })}
                >
                    {isConnected ? "Disconnect" : "Connect Wallet"}
                </Button>
            </div>
        </header>
    );
};

export default Navbar;