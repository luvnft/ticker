"use client"

import sdk, { type FrameContext } from "@farcaster/frame-sdk";
import DeployToken from "./components/DeployToken";
import { useEffect, useState } from "react";
import { Redirect } from "./components/Redirect";
import { useAccount } from "wagmi";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();
  const { address } = useAccount();

  useEffect(() => {
    const load = async () => {
      const frameContext = await sdk.context;
      setContext(frameContext);
      await sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  useEffect(() => {
    if (address) {
      // Trigger Farcaster login automatically
      sdk.actions.addFrame();
    }
  }, [address]);

  if (!isSDKLoaded) {
    return <Loading />;
  }

  if (!context?.user.fid) {
    return (
      <Redirect />
    );
  }

  return (
    <div className="p-4">
      <Navbar />
      <DeployToken />
      <footer className="text-center">
        <p>
          &copy; {new Date().getFullYear()} Manifested with ❤ By{" "}
          <span className="font-semibold"><a target="_blank" href="https://warpcast.com/hahz" className="text-blue-600">Wizard of Hahz</a></span>
        </p>
      </footer>
    </div>
  );
}
