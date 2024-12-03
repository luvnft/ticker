import DeployTokenForm from "./components/DeployTokenForm";

export default function Home() {
  return (
    <div className="mt-1">
      <h1 className="text-3xl font-bold">Welcome to #TickerTool</h1>
      <p className="mb-4 text-gray-400">
        This interface allows you to deploy new erc-20 token and interact with the <a target="_blank" href="https://basescan.org/address/0x9f8719E3C1852B3c6Be9a14F4B91a095382EcD9e" className="text-blue-600 font-bold">TickerTool contract.</a>
      </p>
      <DeployTokenForm contractAddress="0x9f8719E3C1852B3c6Be9a14F4B91a095382EcD9e" targetChainId={8453} />
    </div>
  );
}
