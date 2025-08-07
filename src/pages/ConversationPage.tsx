import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuestionCard from "@/components/QuestionCard";
import {
  Mic,
  MicOff,
  CheckCircle,
  Square,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockQuestions = [
  "Did you assess the patient's pain level using a standardized scale?",
  "Have you documented the patient's current medications and any changes?",
  "Did you evaluate the patient's ability to perform activities of daily living?",
  "Have you assessed the patient's home safety and fall risk factors?",
  "Did you check the patient's vital signs and document any concerns?"
];

const ConversationPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isEnding, setIsEnding] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "Ambient transcription is now active",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped",
      description: "Transcription paused",
    });
  };

  const handleValidate = async () => {
    setIsValidating(true);
    
    // Simulate API call
    setTimeout(() => {
      const randomQuestions = mockQuestions
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      setQuestions(randomQuestions);
      setIsValidating(false);
      
      toast({
        title: "Validation Complete",
        description: `Found ${randomQuestions.length} missing assessment questions`,
      });
    }, 2000);
  };

  const handleEndConversation = async () => {
    setIsEnding(true);
    
    // Simulate processing
    setTimeout(() => {
      navigate("/filling");
    }, 3000);
  };

  const dismissQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  if (isEnding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Processing Conversation</h2>
          <p className="text-muted-foreground">
            Transcribing audio and preparing OASIS form...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Question Cards */}
      {questions.map((question, index) => (
        <QuestionCard
          key={index}
          question={question}
          onDismiss={() => dismissQuestion(index)}
        />
      ))}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Patient Visit Recording
          </h1>
          <p className="text-muted-foreground mb-12">
            Start recording your conversation to begin ambient transcription
          </p>

          {/* Main Recording Control */}
          <div className="mb-12">
            <Button
              size="lg"
              onClick={isRecording ? handleStopRecording : handleStartRecording}
              className={`
                h-32 w-32 rounded-full text-lg font-semibold
                ${isRecording 
                  ? 'bg-destructive hover:bg-destructive/90 animate-recording' 
                  : 'bg-primary hover:bg-primary-hover'
                }
                transition-all duration-300
              `}
            >
              <div className="flex flex-col items-center space-y-2">
                {isRecording ? (
                  <>
                    <MicOff className="h-8 w-8" />
                    <span className="text-sm">Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-8 w-8" />
                    <span className="text-sm">Start</span>
                  </>
                )}
              </div>
            </Button>
            
            {isRecording && (
              <p className="text-primary font-medium mt-4 animate-pulse-soft">
                Listening...
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={handleValidate}
              disabled={!isRecording || isValidating}
              className="flex items-center space-x-2"
            >
              {isValidating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
              <span>
                {isValidating ? "Validating..." : "Validate Conversation"}
              </span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleEndConversation}
              disabled={!isRecording}
              className="flex items-center space-x-2"
            >
              <Square className="h-5 w-5" />
              <span>End Conversation</span>
            </Button>
          </div>

          {/* Status Card */}
          {isRecording && (
            <Card className="mt-8 p-6 bg-medical-blue-light border-primary/20">
              <div className="flex items-center justify-center space-x-3">
                <div className="h-3 w-3 bg-primary rounded-full animate-pulse"></div>
                <p className="text-foreground font-medium">
                  Ambient transcription active
                </p>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Speak naturally with your patient. The system will capture conversation 
                and identify missing assessment questions.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;