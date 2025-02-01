import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { connectWallet } from "@/lib/solana";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const ADMIN_WALLET = "P8RCPm3afJUGwAY3rxxGxN4DxbrnnSot6rJLr8jN5tZ"; // Replace with actual admin wallet address

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  is_verified: boolean;
  rating: number;
  review_count: number;
  user_id: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: doctors, refetch } = useQuery({
    queryKey: ["admin-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*');
      
      if (error) throw error;
      return data as Doctor[];
    },
    enabled: isAdmin,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const walletAddress = await connectWallet();
      if (walletAddress !== ADMIN_WALLET) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      setIsAdmin(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const handleVerifyDoctor = async (doctorId: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .update({ is_verified: true })
        .eq('id', doctorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Doctor verified successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify doctor",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          {!doctors || doctors.length === 0 ? (
            <p className="text-muted-foreground">No registered doctors</p>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card key={doctor.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Specialization: {doctor.specialization}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          User ID: {doctor.user_id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rating: {doctor.rating}/5 ({doctor.review_count} reviews)
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm mr-2">Status:</span>
                          {doctor.is_verified ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center text-yellow-600">
                              <XCircle className="h-4 w-4 mr-1" />
                              Pending Verification
                            </span>
                          )}
                        </div>
                      </div>
                      {!doctor.is_verified && (
                        <Button
                          onClick={() => handleVerifyDoctor(doctor.id)}
                        >
                          Verify Doctor
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;