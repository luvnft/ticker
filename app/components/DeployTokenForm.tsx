"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractAbi } from "../constant/contract";

interface DeployTokenFormProps {
  contractAddress: string;
  targetChainId: number;
}

const DeployTokenForm: React.FC<DeployTokenFormProps> = ({ contractAddress, targetChainId }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [salt, setSalt] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        const network = await provider.getNetwork();

        if (accounts.length > 0) {
          setWalletConnected(true);
          setCorrectNetwork(network.chainId === BigInt(targetChainId));
        }
      }
    };

    checkWalletConnection();

    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", checkWalletConnection);
      window.ethereum.on("chainChanged", () => window.location.reload());
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", checkWalletConnection);
        window.ethereum.removeListener("chainChanged", () => window.location.reload());
      }
    };
  }, [targetChainId]);

  // Generate salt dynamically when all inputs are filled
  useEffect(() => {
    const fetchSalt = async () => {
      if (walletConnected && name && symbol && supply) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractAbi, provider);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();

          const saltInfo = await contract.generateSalt(address, name, symbol, ethers.parseUnits(supply, 18));
          setSalt(saltInfo[0]);
        } catch (error) {
          console.error("Error fetching salt:", error);
        }
      } else {
        setSalt(null);
      }
    };

    fetchSalt();
  }, [name, symbol, supply, walletConnected, contractAddress]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        setWalletConnected(true);

        setCorrectNetwork(network.chainId === BigInt(targetChainId));

        if (network.chainId !== BigInt(targetChainId)) {
          await switchToTargetNetwork();
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      alert("Please install MetaMask or another wallet!");
    }
  };

  const switchToTargetNetwork = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x2105" }],
        });
        setCorrectNetwork(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === 4902) {
          alert("Base Chain is not added to your wallet. Please add it manually.");
        } else {
          console.error("Error switching network:", error);
        }
      }
    }
  };

  const handleDeploy = async () => {
    if (!walletConnected) {
      alert("Connect your wallet first!");
      return;
    }

    if (!correctNetwork) {
      alert("Please switch to the Base network before deploying.");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, await signer);

      const tx = await contract.deployToken(name, symbol, ethers.parseUnits(supply, 18), salt, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();

      alert("Token deployed successfully!");

      // Clear form fields
      setName("");
      setSymbol("");
      setSupply("");
      setSalt(null);
      setAmount("");

    } catch (error) {
      console.error("Error deploying token:", error);
      alert("Failed to deploy token. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleDeploy();
        }}
        className="space-y-4"
      >
        <div>
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
        <div>
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
        <div>
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
        <div>
          <label className="block text-sm font-medium mb-1">Buy (Optional)</label>
          <input
            type="text"
            placeholder="0.1 or 0 if without buy"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 bg-gray-700 placeholder-opacity-25 rounded-md border border-gray-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Generated Salt</label>
          <input
            type="text"
            value={salt || "Fill all fields to generate salt"}
            disabled
            className="w-full p-2 bg-gray-700 placeholder-opacity-25 rounded-md border border-gray-600 focus:outline-none"
          />
        </div>
        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="w-full py-2 px-4 bg-blue-700 rounded-md text-white font-semibold hover:bg-blue-600"
          >
            Connect Wallet
          </button>
        ) : !correctNetwork ? (
          <button
            onClick={switchToTargetNetwork}
            className="w-full py-2 px-4 bg-blue-700 rounded-md text-white font-semibold hover:bg-blue-600"
          >
            Switch to Base
          </button>
        ) : (
          <button
            type="submit"
            className={`w-full py-2 px-4 bg-blue-600 rounded-md text-white font-semibold ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Deploying..." : "Deploy Token"}
          </button>
        )}
      </form>
    </div>
  );
};

export default DeployTokenForm;
