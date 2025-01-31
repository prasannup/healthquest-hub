import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { fetchDoctors, registerDoctor } from "@/lib/program";
import { connectWallet } from "@/lib/solana";

interface Doctor {
  authority: string;
  name: string;
  specialization: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

const Doctors = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const { data: doctors, isLoading, refetch } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
    enabled: isConnected,
  });

  const handleConnectWallet = async () => {
    try {
      const publicKey = await connectWallet();
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected with address: ${publicKey.slice(0, 8)}...`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleRegisterDoctor = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await registerDoctor("Dr. New Doctor", "General Medicine");
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Your registration as a doctor is pending verification.",
        });
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Find Doctors</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Find Doctors</h1>
        {!isConnected ? (
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        ) : (
          <Button onClick={handleRegisterDoctor}>Register as Doctor</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors?.map((doctor) => (
          <Card key={doctor.authority} className="w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                {doctor.isVerified && (
                  <Badge variant="default" className="bg-green-500">Verified</Badge>
                )}
              </div>
              <CardDescription>{doctor.specialization}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">★</span>
                  <span>{doctor.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({doctor.reviewCount} reviews)</span>
                </div>
                <Button variant="outline">View Profile</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doctors;