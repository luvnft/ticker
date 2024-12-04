"use client";

import { useCallback, useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import {
    BaseError,
    useAccount,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import { parseUnits } from "viem";

import { Button } from "./Button";
import { abi } from "@/lib/contract";
import Loading from "./Loading";

const TokenFactory = "0x963c81e052a2B0d1528f53bb85c552C2b44A59aB";

export default function DeployToken() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [supply, setSupply] = useState("");
    const [buyAmount, setBuyAmount] = useState("");

    const { isConnected } = useAccount();

    const parsedSupply = supply
        ? parseUnits(supply, 18)
        : undefined;

    const parsedBuyAmount = buyAmount
        ? parseUnits(buyAmount, 18)
        : undefined;

    const { data: hash, error, isPending, writeContract } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    useEffect(() => {
        const load = async () => {
            sdk.actions.ready();
        };
        if (sdk && !isSDKLoaded) {
            setIsSDKLoaded(true);
            load();
        }
    }, [isSDKLoaded]);

    useEffect(() => {
        if (isConfirmed) {
            setName("")
            setSymbol("")
            setSupply("")
            setBuyAmount("")
        }
    }, [isConfirmed])

    const linkToBaseScan = useCallback((hash?: string) => {
        if (hash) {
            sdk.actions.openUrl(`https://basescan.org/tx/${hash}`);
        }
    }, []);

    if (!isSDKLoaded) {
        return <Loading />;
    }

    return (
        <div className="bg-[#282828] p-4 rounded-lg shadow-md">
            <div className="mb-2">
                <label className="block text-xs font-medium mb-1 pl-2">Token Name</label>
                <input
                    type="text"
                    placeholder="Snake DOG Coin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 bg-[#1f1f1f] placeholder:text-[#282828] placeholder-opacity-25 rounded-md border-none focus:outline-none"
                />
            </div>
            <div className="mb-2">
                <label className="block text-xs font-medium mb-1 pl-2">Token Symbol</label>
                <input
                    type="text"
                    placeholder="SDC"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                    className="w-full p-2 bg-[#1f1f1f] placeholder:text-[#282828] placeholder-opacity-25 rounded-md border-none focus:outline-none"
                />
            </div>
            <div className="mb-2">
                <label className="block text-xs font-medium mb-1 pl-2">Max Supply</label>
                <input
                    type="text"
                    placeholder="420690000000"
                    value={supply}
                    onChange={(e) => setSupply(e.target.value)}
                    required
                    className="w-full p-2 bg-[#1f1f1f] placeholder:text-[#282828] placeholder-opacity-25 rounded-md border-none focus:outline-none"
                />
            </div>
            <div className="mb-2">
                <label className="block text-xs font-medium mb-1 pl-2">Buy (Optional)</label>
                <input
                    type="text"
                    placeholder="0.1 or 0 if without buy"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="w-full p-2 bg-[#1f1f1f] placeholder:text-[#282828] placeholder-opacity-25 rounded-md border-none focus:outline-none"
                />
            </div>
            {/* Button Deploy Token */}
            <Button
                disabled={!isConnected || isPending}
                onClick={() => isConnected &&
                    writeContract({
                        abi,
                        address: TokenFactory,
                        functionName: "deploy",
                        value: parsedBuyAmount,
                        args: [
                            name,
                            symbol,
                            parsedSupply as bigint
                        ],
                    })
                }
            >
                {isPending
                    ? "Confirming..."
                    : isConfirming
                        ? "Waiting for confirmation..."
                        : "Deploy Token"}
            </Button>
            {isConfirmed && (
                <>
                    <p className="my-2 text-xl text-green-600 font-extrabold">
                        🎉 Transaction Confirmed!
                    </p>
                    <Button
                        onClick={() => linkToBaseScan(hash)}
                    >
                        View on Basescan
                    </Button>
                </>
            )}
            {error && (
                <div>Error: {(error as BaseError).shortMessage || error.message}</div>
            )}

        </div>
    );
}