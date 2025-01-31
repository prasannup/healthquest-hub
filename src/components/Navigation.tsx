import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { connectWallet } from "@/lib/solana";
import { useToast } from "@/components/ui/use-toast";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      const publicKey = await connectWallet();
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected with address: ${publicKey.slice(0, 8)}...`,
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error?.message || "Unable to connect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-primary">MedChain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/doctors"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            >
              Find Doctors
            </Link>
            <Link
              to="/patient-dashboard"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            >
              Patient Dashboard
            </Link>
            <Link
              to="/doctor-dashboard"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            >
              Doctor Dashboard
            </Link>
            <Link
              to="/admin-dashboard"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md"
            >
              Admin
            </Link>
            <Button onClick={handleConnectWallet} variant="default">
              {isConnected ? "Wallet Connected" : "Connect Wallet"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/doctors"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Find Doctors
            </Link>
            <Link
              to="/patient-dashboard"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Patient Dashboard
            </Link>
            <Link
              to="/doctor-dashboard"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Doctor Dashboard
            </Link>
            <Link
              to="/admin-dashboard"
              className="block px-3 py-2 text-gray-700 hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
            <div className="px-3 py-2">
              <Button onClick={handleConnectWallet} variant="default">
                {isConnected ? "Wallet Connected" : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
