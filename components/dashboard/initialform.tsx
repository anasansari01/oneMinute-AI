'use client'
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, Command, Sparkles, Building2, Globe, Link } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';

interface InitialData {
  businessName: string;
  websiteUrl: string;
  externalLinks: string;
}

const STEPS = [
  {
    id: "name",
    label: "Business Name",
    question: "What is the name of your Business?",
    description: "This will be the identity of your organisation.",
    icon: Building2,
    placeholder: "e.g. Acme Corp",
    type: "text",
    field: "businessName" as keyof InitialData,
  },
  {
    id: "website",
    label: "Website",
    question: "What is your website URL?",
    description: "We will scrape data from here to train your chatbot.",
    icon: Globe,
    placeholder: "https://acme.com",
    type: "url",
    field: "websiteUrl" as keyof InitialData,
  },
  {
    id: "links",
    label: "Extra Context",
    question: "Any other link to add?",
    description: "Add external links like Notion pages or Help docs to improve knowledge.",
    icon: Link,
    placeholder: "https://notion.so/docs...",
    type: "textarea",
    badge: "Optional",
    field: "externalLinks" as keyof InitialData,
  }
]

const InitialForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InitialData>({
    businessName: "",
    websiteUrl: "",
    externalLinks: "",
  });

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const stepData = STEPS[currentStep];
  const Icon = stepData.icon;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentStep]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const response = await fetch("/api/metadata/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        business_name: formData.businessName,
        website_url: formData.websiteUrl,
        external_links: formData.externalLinks,
      })
    });

    await response.json();
    setIsSubmitting(false);
    window.location.reload();
  }

  const isStepValid =
    currentStep >= 2 ||
    (formData[stepData.field] &&
      formData[stepData.field].trim() !== "");

  const handleNext = async () => {
    if (isSubmitting) return;

    const currentField = STEPS[currentStep].field;
    const value = formData[currentField];

    if (currentStep > 2 && (!value || value.trim() === "")) return;

    if (currentStep < STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleSubmit();
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (STEPS[currentStep].type === 'textarea') {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleNext();
      }
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  }

  return (
    <div className='w-full max-w-xl mx-auto min-h-100 flex flex-col justify-center'>
      <div className='fixed top-0 left-0 w-full h-1 bg-white/5'>
        <div
          className='h-full bg-indigo-500 transition-all duration-500 ease-out'
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className='fixed top-6 right-6 md:top-8 md:right-8 text-xs font-medium text-zinc-600 uppercase tracking-widest pointer-events-none fade-in'>
        Set up your account
      </div>

      {isSubmitting ? (
        <div className='flex flex-col items-center justify-center text-center animate-in fade-in duration-700'>
          <div className='relative mb-8'>
            <div className='absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse opacity-70'></div>
            <div className='relative w-16 h-16 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500'>
              <Sparkles className='w-8 h-8 text-white animate-bounce' />
            </div>
          </div>
          <h2 className='text-2xl font-medium text-white mb-2'>
            Storing your organisation info!
          </h2>
          <p className='text-zinc-500'>
            Scanning {formData.websiteUrl}...
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "transition-all duration-300 ease-in-out transform",
            isAnimating
              ? "opacity-0 translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100"
          )}
        >
          <div className='flex items-center justify-between mb-8'>
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className='text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-full -ml-2 w-8 h-8'
                >
                  <ChevronLeft className='w-5 h-5' />
                </Button>
              )}
              <span className='text-xs font-medium text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500 p-2 rounded-sm'>
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='space-y-2'>
              <h1 className='text-3xl md:text-4xl font-medium text-white leading-tight'>
                {stepData.question}
              </h1>
              <p className='text-lg text-zinc-500 font-light'>{stepData.description}</p>
            </div>

            <div className='relative group'>
              {stepData.type === 'textarea' ? (
                <Textarea
                  ref={inputRef as any}
                  value={formData[stepData.field] as string}
                  onChange={(e) => {
                    setFormData({ ...formData, [stepData.field]: e.target.value })
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={stepData.placeholder}
                  className='w-full bg-transparent border-0 border-b border-white/10 text-xl md:text-2xl py-4 pr-12 text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none resize-none min-h-30 h-auto shadow-none transition-colors'
                  autoFocus
                />
              ) : (
                <Input
                  ref={inputRef as any}
                  type={stepData.type}
                  value={formData[stepData.field] as string}
                  onChange={(e) => {
                    setFormData({ ...formData, [stepData.field]: e.target.value })
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={stepData.placeholder}
                  className='w-full bg-transparent border-0 border-b border-white/10 text-xl md:text-2xl py-4 pr-12 text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none h-auto shadow-none transition-colors'
                  autoFocus
                />
              )}

              <div className='absolute right-0 top-4 md:top-5 text-zinc-600 pointer-events-none'>
                {Icon && <Icon className="w-6 h-6" />}
              </div>

              <div className='flex items-center justify-between pt-8'>
                <div className='hidden sm:flex items-center gap-2 text-xs text-zinc-600'>
                  {stepData.type === 'textarea' ? (
                    <>
                      <Command className='w-3 h-3' />
                      <span>+ Enter</span>
                    </>
                  ) : (
                    <span>Press Enter ⏎</span>
                  )}
                  <span className='ml-1'>to continue</span>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!isStepValid}
                  className={cn(
                    "rounded-full px-8 py-6 text-base font-medium transition-all duration-300 cursor-pointer",
                    !isStepValid
                      ? "bg-zinc-800 text-zinc-500 hover:bg-zinc-800 cursor-not-allowed"
                      : "bg-white text-black hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10"
                  )}
                >
                  {currentStep === STEPS.length - 1 ? "Submit" : "Continue"}
                  {currentStep === STEPS.length - 1 ? (
                    <Sparkles className='w-4 h-4 ml-2' />
                  ) : (
                    <ArrowRight className='w-4 h-4 ml-2' />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InitialForm