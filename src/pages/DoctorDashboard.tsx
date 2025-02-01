import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { connectWallet } from "@/lib/solana";
import { registerDoctor, fetchDoctors } from "@/lib/program";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
  });
  const [answerText, setAnswerText] = useState("");

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the doctor dashboard",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    checkWalletConnection();
    fetchDoctorInfo();
    fetchOpenQuestions();
  }, [session]);

  const checkWalletConnection = async () => {
    try {
      await connectWallet();
    } catch (error) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      navigate("/");
    }
  };

  const fetchDoctorInfo = async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const { data: doctorData, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      
      if (doctorData) {
        setDoctorInfo(doctorData);
      }
    } catch (error) {
      console.error("Error fetching doctor info:", error);
    }
    setIsLoading(false);
  };

  const fetchOpenQuestions = async () => {
    // TODO: Implement fetching open questions from Solana
    setQuestions([]);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Error",
        description: "Please sign in first",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      // Register on Solana
      const success = await registerDoctor(formData.name, formData.specialization);
      
      if (success) {
        // Save to Supabase
        const { error } = await supabase
          .from('doctors')
          .insert({
            user_id: session.user.id,
            name: formData.name,
            specialization: formData.specialization,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Doctor registration submitted successfully",
        });
        await fetchDoctorInfo();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to register doctor",
        variant: "destructive",
      });
    }
    setIsRegistering(false);
  };

  const handleAnswerQuestion = async (questionId: string) => {
    // TODO: Implement answering questions through Solana
    console.log("Answering question:", questionId, answerText);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!doctorInfo ? (
        <Card>
          <CardHeader>
            <CardTitle>Register as Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={isRegistering}>
                {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Register
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Name:</strong> {doctorInfo.name}</p>
                <p><strong>Specialization:</strong> {doctorInfo.specialization}</p>
                <p><strong>Verification Status:</strong> {doctorInfo.isVerified ? "Verified" : "Pending Verification"}</p>
                <p><strong>Rating:</strong> {doctorInfo.rating}/5 ({doctorInfo.reviewCount} reviews)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Open Questions</CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <p className="text-muted-foreground">No open questions available</p>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <Card key={question.id}>
                      <CardContent className="p-4">
                        <p className="font-medium">{question.text}</p>
                        <p className="text-sm text-muted-foreground">Bounty: {question.bounty} SOL</p>
                        <div className="mt-4">
                          <Textarea
                            placeholder="Write your answer..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                          />
                          <Button
                            className="mt-2"
                            onClick={() => handleAnswerQuestion(question.id)}
                          >
                            Submit Answer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;