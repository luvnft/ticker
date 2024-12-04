"use client";

import { useCallback, useEffect, useState } from "react";
import sdk from "@farcaster/frame-sdk";
import {
    BaseError,
    useAccount,
    useConnect,
    useReadContract,
    useWaitForTransactionReceipt,
    useWriteContract,
} from "wagmi";
import { parseUnits, Address } from "viem";

import { Button } from "./Button";
import { truncateAddress } from "@/lib/truncateAddress";
import { abi } from "@/lib/contract";
import { config } from "./WagmiProvider";
import Loading from "./Loading";

const TokenFactory = "0x9f8719E3C1852B3c6Be9a14F4B91a095382EcD9e";

export default function DeployToken() {
    const [isSDKLoaded, setIsSDKLoaded] = useState(false);

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [supply, setSupply] = useState("");
    const [salt, setSalt] = useState("");
    const [buyAmount, setBuyAmount] = useState("");

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();

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

    // Generate salt dynamically when all inputs are filled
    useEffect(() => {
        const fetchSalt = () => {
            if (address && name && symbol && supply) {
                try {

                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const saltInfo = useReadContract({
                        abi,
                        address: TokenFactory,
                        functionName: "generateSalt",
                    })
                    setSalt(saltInfo.data?.[0] as string);

                } catch (error) {
                    console.error("Error fetching salt:", error);
                }
            } else {
                setSalt("");
            }
        };

        fetchSalt();
    }, [name, symbol, supply, address]);

    const linkToBaseScan = useCallback((hash?: string) => {
        if (hash) {
            sdk.actions.openUrl(`https://basescan.org/tx/${hash}`);
        }
    }, []);

    if (!isSDKLoaded) {
        return <Loading />;
    }

    return (
        <div className="w-full py-4">
            <div className="mb-4">
                {address && (
                    <div className="text-sm text-gray-500 text-right">
                        {truncateAddress(address)}
                    </div>
                )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Token Name</label>
                    <input
                        type="text"
                        placeholder="Snake DOG Coin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-2 bg-gray-700 placeholder-opacity-25 rounded-md border border-gray-600 focus:outline-none"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Token Symbol</label>
                    <input
                        type="text"
                        placeholder="SDC"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        required
                        className="w-full p-2 bg-gray-700 placeholder-opacity-25 rounded-md border border-gray-600 focus:outline-none"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Max Supply</label>
                    <input
                        type="text"
                        placeholder="420690000000"
                        value={supply}
                        onChange={(e) => setSupply(e.target.value)}
                        required
                        className="w-full p-2 bg-gray-700 placeholder-opacity-25 rounded-md border border-gray-600 focus:outline-none"
                    />
                </div>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">Buy (Optional)</label>
                    <input
                        type="text"
                        placeholder="0.1 or 0 if without buy"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="w-full p-2 bg-gray-700 placeholder-opacity-25 rounded-md border border-gray-600 focus:outline-none"
                    />
                </div>
                {/* Button Deploy Token */}
                <Button
                    disabled={!isConnected || isPending}
                    onClick={() => isConnected ?
                        writeContract({
                            abi,
                            address: TokenFactory,
                            functionName: "deployToken",
                            value: parsedBuyAmount,
                            args: [
                                name,
                                symbol,
                                parsedSupply as bigint,
                                salt as Address
                            ],
                        }) : connect({ connector: config.connectors[0] })
                    }
                >
                    {!isConnected
                        ? "Connect Wallet"
                        : isPending
                            ? "Confirming..."
                            : isConfirming
                                ? "Waiting for confirmation..."
                                : "Deploy Token"}
                </Button>
                {isConfirmed && (
                    <div
                        className="text-green-500 text-center mt-4"
                        onClick={() => linkToBaseScan(hash)}
                    >
                        <p>🎉 Transaction Confirmed!</p>
                        <p>Tap to View on Basescan</p>
                    </div>
                )}
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )}

            </div>
        </div>
    );
}