"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api/client";

interface OnboardingFlow {
  step1: {
    intro: string;
    question: string;
  };
  step2: {
    question: string;
  };
  step3: {
    question: string;
  };
  step4: {
    question: string;
  };
  step5: {
    analysing: string;
    next: string;
  };
}

interface Message {
  id: number;
  type: "assistant" | "user";
  content: string;
}

interface ChildData {
  name: string;
  age: number;
  gender: string;
  aboutChildMind: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingFlow, setOnboardingFlow] = useState<OnboardingFlow | null>(null);
  const [childData, setChildData] = useState<ChildData>({
    name: "",
    age: 0,
    gender: "",
    aboutChildMind: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/signup");
    }
  }, [router, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // Auto-focus input after messages update
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchOnboardingFlow = async () => {
      try {
        const response = await apiClient.get("/onboarding/flow");
        setOnboardingFlow(response.data);
        
        // Initialize with step 1 intro and question
        if (response.data.step1) {
          setMessages([
            {
              id: 1,
              type: "assistant",
              content: response.data.step1.intro,
            },
            {
              id: 2,
              type: "assistant",
              content: response.data.step1.question,
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch onboarding flow:", error);
        // Fallback message
        setMessages([
          {
            id: 1,
            type: "assistant",
            content: "👋 Hi, I'm Zenai, your parenting assistant. Let's get to know your teen better!",
          },
        ]);
      }
    };

    if (isAuthenticated()) {
      fetchOnboardingFlow();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    const userResponse = message;
    setMessage("");
    setIsLoading(true);

    setTimeout(async () => {
      try {
        // Store the user's response based on current step
        switch (currentStep) {
          case 1:
            setChildData((prev) => ({ ...prev, name: userResponse }));
            if (onboardingFlow?.step2) {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: onboardingFlow.step2.question,
                },
              ]);
            }
            setCurrentStep(2);
            setTimeout(() => inputRef.current?.focus(), 100);
            break;

          case 2:
            const age = parseInt(userResponse);
            if (isNaN(age)) {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: "Please enter a valid age number.",
                },
              ]);
              setIsLoading(false);
              setTimeout(() => inputRef.current?.focus(), 100);
              return;
            }
            if (age > 18) {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: "This app is designed for teens aged 18 and under. Please enter a valid age.",
                },
              ]);
              setIsLoading(false);
              setTimeout(() => inputRef.current?.focus(), 100);
              return;
            }
            setChildData((prev) => ({ ...prev, age }));
            if (onboardingFlow?.step3) {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: onboardingFlow.step3.question,
                },
              ]);
            }
            setCurrentStep(3);
            setTimeout(() => inputRef.current?.focus(), 100);
            break;

          case 3:
            setChildData((prev) => ({ ...prev, gender: userResponse.toLowerCase() }));
            if (onboardingFlow?.step4) {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: onboardingFlow.step4.question,
                },
              ]);
            }
            setCurrentStep(4);
            setTimeout(() => inputRef.current?.focus(), 100);
            break;

          case 4:
            const updatedChildData = {
              ...childData,
              aboutChildMind: userResponse,
            };
            setChildData(updatedChildData);

            // Show analysing message
            if (onboardingFlow?.step5) {
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: onboardingFlow.step5.analysing,
                },
              ]);
            }

            // Submit data to API
            try {
              const response = await apiClient.post("/onboarding/child", updatedChildData);
              console.log("Child data submitted successfully:", response.data);

              // Show final message
              setTimeout(() => {
                if (onboardingFlow?.step5) {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: prev.length + 1,
                      type: "assistant",
                      content: onboardingFlow.step5.next,
                    },
                  ]);
                }
                setCurrentStep(5);

                // Redirect to next page after showing final message
                setTimeout(() => {
                  router.push("/dashboard"); // Change to your desired next page
                }, 3000);
              }, 1500);
            } catch (error) {
              console.error("Failed to submit child data:", error);
              setMessages((prev) => [
                ...prev,
                {
                  id: prev.length + 1,
                  type: "assistant",
                  content: "Sorry, there was an error saving your information. Please try again.",
                },
              ]);
            }
            break;

          default:
            break;
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex h-screen w-full font-urbanist overflow-hidden relative">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full h-full">
        <div className="w-[40%] flex items-center justify-center px-8">
          <div className="w-full max-w-xl rounded-2xl p-8 lg:p-12 bg-[#d8bacf] relative overflow-hidden h-[91vh] shadow-lg flex flex-col">
            <div className="absolute inset-0 z-0">
              <Image
                src="/rightboxbg.jpg"
                alt="Background"
                fill
                className="object-cover opacity-30"
              />
            </div>

            <div className="relative z-10 flex flex-col flex-1">
              <div className="text-center">
                <h1 className="text-3xl text-black mb-2">
                  Welcome to{" "}
                  <span className="text-[#704180] font-semibold ">ZenAI</span>
                </h1>
                <p className="text-sm font-semibold text-black uppercase ">
                  PARENTAL PORTAL
                </p>
              </div>

              <div className="relative h-72 mx-auto w-60 overflow-hidden my-auto">
                <Image
                  src="/family.png"
                  alt="Family"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div
                className="rounded-xl p-6 py-3 text-white"
                style={{
                  background:
                    "linear-gradient(90deg, #8B2D6C 0%, #704180 100%)",
                }}
              >
                <p className="text-base leading-relaxed">
                  Zenomi helps understanding your teen&apos;s world helps you
                  guide them better.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[60%] flex flex-col min-h-[91vh] h-full p-6 lg:p-8 relative">
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4 justify-end">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-end ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.type === "assistant" && (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="/bot.svg"
                      alt="Bot"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                <div
                  className={` px-4 py-3 mb-1 ${
                    msg.type === "assistant"
                      ? "bg-[#F8E4FF] text-black rounded-tl-xl rounded-tr-xl rounded-br-xl"
                      : "bg-white text-[#704180] rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                  }`}
                >
                  <p className="text-sm lg:text-base leading-relaxed font-medium">
                    {msg.content}
                  </p>
                </div>
                {msg.type === "user" && (
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-gray-200">
                    <User className="w-6 h-6 text-black" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your answer here..."
              disabled={isLoading}
              autoFocus
              className="w-full px-4 py-3 pr-12 rounded-full bg-white text-[#704180] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#704180]/20 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
              }}
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
