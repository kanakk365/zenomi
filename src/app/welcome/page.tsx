"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, User } from "lucide-react";
import { useIsAuthenticated } from "@/store/authStore";
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
  type: "assistant" | "user" | "loading";
  content: string;
  isTyping?: boolean;
}

interface ChildData {
  name: string;
  age: number;
  gender: string;
  aboutChildMind: string;
}

export default function WelcomePage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingFlow, setOnboardingFlow] = useState<OnboardingFlow | null>(
    null
  );
  const [childData, setChildData] = useState<ChildData>({
    name: "",
    age: 0,
    gender: "",
    aboutChildMind: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
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
    // Prevent duplicate initialization
    if (hasInitializedRef.current || !isAuthenticated || messages.length > 0) {
      return;
    }

    hasInitializedRef.current = true;

    const fetchOnboardingFlow = async () => {
      try {
        const response = await apiClient.get("/onboarding/flow");
        setOnboardingFlow(response.data);

        if (response.data.step1) {
          const intro = response.data.step1.intro || "";
          const question = response.data.step1.question || "";
          
          // If intro and question are the same, only show one message
          if (intro.trim() === question.trim()) {
            setMessages([
              {
                id: 1,
                type: "assistant",
                content: question || intro,
              },
            ]);
          } else {
            // Show intro first, then question after delay
            if (intro) {
              setMessages([
                {
                  id: 1,
                  type: "assistant",
                  content: intro,
                },
              ]);
            }
            // Only add question if it's different from intro
            if (question && question.trim() !== intro.trim()) {
              setTimeout(() => {
                setMessages((prev) => {
                  // Prevent duplicate question
                  if (prev.some(msg => msg.content === question)) {
                    return prev;
                  }
                  return [
                    ...prev,
                    {
                      id: Date.now(),
                      type: "assistant",
                      content: question,
                    },
                  ];
                });
              }, 1000);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch onboarding flow:", error);
        // Fallback message - only if no messages exist
        setMessages((prev) => {
          if (prev.length === 0) {
            return [
              {
                id: 1,
                type: "assistant",
                content:
                  "👋 Hi, I'm Zenai, your parenting assistant. Let's get to know your teen better!",
              },
            ];
          }
          return prev;
        });
      }
    };

    fetchOnboardingFlow();
  }, [isAuthenticated, messages.length]);

  if (!isAuthenticated) {
    return null;
  }

  const addLoadingMessage = () => {
    const loadingMessage: Message = {
      id: messages.length + 1,
      type: "loading",
      content: "",
      isTyping: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);
  };

  const removeLoadingMessage = () => {
    setMessages((prev) => prev.filter((msg) => msg.type !== "loading"));
  };

  const addMessageWithDelay = (content: string, delay: number = 1500) => {
    setTimeout(() => {
      removeLoadingMessage();
      const newMessage: Message = {
        id: Date.now(),
        type: "assistant",
        content: content,
      };
      setMessages((prev) => [...prev, newMessage]);
    }, delay);
  };

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

    // Add loading message after a short delay
    setTimeout(() => {
      addLoadingMessage();
    }, 300);

    setTimeout(async () => {
      try {
        // Store the user's response based on current step
        switch (currentStep) {
          case 1:
            setChildData((prev) => ({ ...prev, name: userResponse }));
            if (onboardingFlow?.step2) {
              addMessageWithDelay(onboardingFlow.step2.question, 2000);
            }
            setCurrentStep(2);
            setTimeout(() => {
              setIsLoading(false);
              inputRef.current?.focus();
            }, 2500);
            break;

          case 2:
            const age = parseInt(userResponse);
            if (isNaN(age)) {
              addMessageWithDelay("Please enter a valid age number.", 1500);
              setTimeout(() => {
                setIsLoading(false);
                inputRef.current?.focus();
              }, 2000);
              return;
            }
            if (age > 18) {
              addMessageWithDelay(
                "This app is designed for teens aged 18 and under. Please enter a valid age.",
                1500
              );
              setTimeout(() => {
                setIsLoading(false);
                inputRef.current?.focus();
              }, 2000);
              return;
            }
            setChildData((prev) => ({ ...prev, age }));
            if (onboardingFlow?.step3) {
              addMessageWithDelay(onboardingFlow.step3.question, 2000);
            }
            setCurrentStep(3);
            setTimeout(() => {
              setIsLoading(false);
              inputRef.current?.focus();
            }, 2500);
            break;

          case 3:
            const gender = userResponse.toLowerCase().trim();
            const validGenders = ["male", "female", "other"];
            
            if (!validGenders.includes(gender)) {
              addMessageWithDelay("Gender must be one of: male, female, other", 1500);
              setTimeout(() => {
                setIsLoading(false);
                inputRef.current?.focus();
              }, 2000);
              return;
            }
            
            setChildData((prev) => ({
              ...prev,
              gender: gender,
            }));
            if (onboardingFlow?.step4) {
              addMessageWithDelay(onboardingFlow.step4.question, 2000);
            }
            setCurrentStep(4);
            setTimeout(() => {
              setIsLoading(false);
              inputRef.current?.focus();
            }, 2500);
            break;

          case 4:
            const updatedChildData = {
              ...childData,
              aboutChildMind: userResponse,
            };
            setChildData(updatedChildData);

            // Show analysing message with delay
            if (onboardingFlow?.step5) {
              addMessageWithDelay(onboardingFlow.step5.analysing, 2000);
            }

            // Submit data to API
            try {
              const response = await apiClient.post(
                "/onboarding/child",
                updatedChildData
              );
              console.log("Child data submitted successfully:", response.data);

              // Show final message with button after longer delay
              setTimeout(() => {
                removeLoadingMessage();
                if (onboardingFlow?.step5) {
                  const finalMessage: Message = {
                    id: Date.now(),
                    type: "assistant",
                    content: onboardingFlow.step5.next,
                  };
                  setMessages((prev) => [...prev, finalMessage]);
                }
                setCurrentStep(5);
                setIsLoading(false);
              }, 3000);
            } catch (error) {
              console.error("Failed to submit child data:", error);
              removeLoadingMessage();
              addMessageWithDelay(
                "Sorry, there was an error saving your information. Please try again.",
                1500
              );
              setTimeout(() => {
                setIsLoading(false);
              }, 2000);
            }
            break;

          default:
            break;
        }
      } catch {
        removeLoadingMessage();
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="flex h-screen w-full font-urbanist relative overflow-hidden">
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

      <div className="relative z-10 flex w-full h-full rounded-xl flex-col lg:flex-row">
        <div className="hidden lg:flex w-full lg:w-[40%] rounded-2xl items-center justify-center px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-0 shrink-0">
          <div className="w-full max-w-xl rounded-xl p-4 sm:p-6 lg:p-12 bg-[#d8bacf] relative shadow-lg flex flex-col">
            <div className="absolute inset-0 z-0 rounded-xl">
              <Image
                src="/rightboxbg.jpg"
                alt="Background"
                fill
                className="object-cover opacity-30 rounded-xl"
              />
            </div>

            <div className="relative z-10 flex flex-col flex-1 gap-3 sm:gap-4">
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-black mb-1 sm:mb-2">
                  Welcome to{" "}
                  <span className="text-[#704180] font-semibold ">ZenAI</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-black uppercase ">
                  PARENTAL PORTAL
                </p>
              </div>

              <div className="relative h-48 sm:h-64 lg:h-72 mx-auto w-40 sm:w-52 lg:w-60 my-2 sm:my-4 lg:my-auto">
                <Image
                  src="/family.png"
                  alt="Family"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div
                className="rounded-xl p-3 sm:p-4 lg:p-6 py-2 sm:py-3 text-white"
                style={{
                  background:
                    "linear-gradient(90deg, #8B2D6C 0%, #704180 100%)",
                }}
              >
                <p className="text-xs sm:text-sm lg:text-base leading-relaxed">
                  Understanding your teen&apos;s world helps you guide them with greater clarity and confidence!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[60%] flex flex-col h-full lg:h-[91vh] p-4 sm:p-5 lg:p-8 relative min-h-0">
          <div className="flex-1 overflow-y-auto min-h-0 scroll-smooth" style={{ scrollbarWidth: 'thin', scrollbarColor: '#8B2D6C #F8E4FF' }}>
            <div className="flex flex-col gap-3 sm:gap-4 justify-end min-h-full pb-3 sm:pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 sm:gap-3 items-end ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {(msg.type === "assistant" || msg.type === "loading") && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 overflow-hidden">
                    <Image
                      src="/bot.svg"
                      alt="Bot"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                {msg.type === "loading" ? (
                  <div className="bg-[#F8E4FF] text-black rounded-tl-xl rounded-tr-xl rounded-br-xl px-3 sm:px-4 py-2 sm:py-3 mb-1 max-w-[85%] sm:max-w-[75%]">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-2 h-2 bg-[#8B2D6C] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-[#8B2D6C] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-[#8B2D6C] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-3 mb-1 transition-all duration-300 ease-in-out max-w-[85%] sm:max-w-[75%] lg:max-w-none ${
                      msg.type === "assistant"
                        ? "bg-[#F8E4FF] text-black rounded-tl-xl rounded-tr-xl rounded-br-xl"
                        : "bg-white text-[#704180] rounded-tl-xl rounded-tr-xl rounded-bl-xl"
                    }`}
                    style={{
                      animation: "fadeInUp 0.3s ease-out",
                    }}
                  >
                    {msg.id === messages.length && currentStep === 5 ? (
                      <div className="text-xs sm:text-sm lg:text-base leading-relaxed font-medium">
                        <p className="mb-2 sm:mb-3">Okay! great</p>
                        <p className="mb-2 sm:mb-3">
                          Let&apos;s get started with two assessments to know more
                          about your teen.
                        </p>
                        <ol className="list-decimal list-inside space-y-1 sm:space-y-2 ml-1 sm:ml-2">
                          <li className="font-semibold">
                            Relationship with your Teen
                          </li>
                          <li className="font-semibold">Challenges you face</li>
                        </ol>
                      </div>
                    ) : (
                      <p className="text-xs sm:text-sm lg:text-base leading-relaxed font-medium break-words">
                        {msg.content}
                      </p>
                    )}
                  </div>
                )}
                {msg.type === "user" && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0 border-2 border-gray-200">
                    <User className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
                  </div>
                )}
              </div>
            ))}
            {currentStep === 5 && (
              <div className="flex justify-center mt-3 sm:mt-4 mb-3 sm:mb-4">
                <button
                  onClick={() => router.push("/surveys")}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full cursor-pointer text-white text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity shadow-lg"
                  style={{
                    background:
                      "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
                  }}
                >
                  Get started
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
            </div>
          </div>

          {currentStep < 5 && (
            <form onSubmit={handleSendMessage} className="relative mt-3 sm:mt-4 shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your answer here..."
                disabled={isLoading}
                autoFocus
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-11 sm:pr-12 rounded-full bg-white text-[#704180] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#704180]/20 text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background:
                    "linear-gradient(180deg, #8B2D6C 0%, #704180 100%)",
                }}
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
