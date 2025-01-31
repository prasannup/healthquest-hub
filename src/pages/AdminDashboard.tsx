import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { connectWallet } from "@/lib/solana";
import { fetchDoctors } from "@/lib/program";

const ADMIN_WALLET = "YOUR_ADMIN_WALLET_ADDRESS"; // Replace with actual admin wallet address

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

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
      fetchDoctorsList();
    } catch (error) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchDoctorsList = async () => {
    setIsLoading(true);
    try {
      const doctorsList = await fetchDoctors();
      setDoctors(doctorsList);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch doctors list",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleVerifyDoctor = async (doctorAddress: string) => {
    try {
      // TODO: Implement doctor verification through Solana
      toast({
        title: "Success",
        description: "Doctor verified successfully",
      });
      await fetchDoctorsList();
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
          {doctors.length === 0 ? (
            <p className="text-muted-foreground">No registered doctors</p>
          ) : (
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <Card key={doctor.authority.toString()}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Specialization: {doctor.specialization}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Wallet: {doctor.authority.toString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rating: {doctor.rating}/5 ({doctor.reviewCount} reviews)
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm mr-2">Status:</span>
                          {doctor.isVerified ? (
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
                      {!doctor.isVerified && (
                        <Button
                          onClick={() => handleVerifyDoctor(doctor.authority.toString())}
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