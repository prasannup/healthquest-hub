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

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    bounty: "",
  });

  useEffect(() => {
    checkWalletConnection();
    fetchQuestions();
  }, []);

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

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement fetching questions from Solana
      setQuestions([]);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setIsLoading(false);
  };

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement submitting question to Solana
      toast({
        title: "Success",
        description: "Question submitted successfully",
      });
      setNewQuestion({ text: "", bounty: "" });
      await fetchQuestions();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit question",
        variant: "destructive",
      });
    }
    setIsLoading(false);
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
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Ask a Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <Label htmlFor="question">Your Question</Label>
                <Textarea
                  id="question"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="bounty">Bounty (SOL)</Label>
                <Input
                  id="bounty"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newQuestion.bounty}
                  onChange={(e) => setNewQuestion({ ...newQuestion, bounty: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Question
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-muted-foreground">No questions yet</p>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <Card key={question.id}>
                    <CardContent className="p-4">
                      <p className="font-medium">{question.text}</p>
                      <p className="text-sm text-muted-foreground">Bounty: {question.bounty} SOL</p>
                      {question.answer && (
                        <div className="mt-4 p-4 bg-muted rounded-md">
                          <p className="font-medium">Answer from Dr. {question.doctorName}:</p>
                          <p className="mt-2">{question.answer}</p>
                        </div>
                      )}
                      <div className="mt-2 text-sm text-muted-foreground">
                        Status: {question.isAnswered ? "Answered" : "Pending"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDashboard;