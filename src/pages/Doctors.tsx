import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Doctor {
  authority: string;
  name: string;
  specialization: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
}

const mockDoctors: Doctor[] = [
  {
    authority: "abc123",
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    isVerified: true,
    rating: 4,
    reviewCount: 28
  },
  {
    authority: "def456",
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    isVerified: true,
    rating: 5,
    reviewCount: 42
  },
  {
    authority: "ghi789",
    name: "Dr. Emily Williams",
    specialization: "Pediatrics",
    isVerified: false,
    rating: 0,
    reviewCount: 0
  }
];

const Doctors = () => {
  const [isConnected] = useState(false);

  const { data: doctors, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      // TODO: Implement actual Solana connection and fetch doctors
      return new Promise<Doctor[]>((resolve) => {
        setTimeout(() => resolve(mockDoctors), 1000);
      });
    }
  });

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
        {!isConnected && (
          <Button variant="default">Connect Wallet to Register</Button>
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