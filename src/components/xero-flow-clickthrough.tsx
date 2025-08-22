"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface FlowStep {
  name: string
  screen: string
}

interface FlowConfig {
  title: string
  steps: FlowStep[]
}

const flowConfig: FlowConfig = {
  title: "Dev App Store Experience",
  steps: [
    { name: "HOMEPAGE", screen: "homepage.html" },
    { name: "XERO SIGNUP", screen: "xero-signup.html" },
    { name: "HOMEPAGE", screen: "homepage.html" },
    { name: "XERO LOGIN", screen: "xero-login.html" },
    { name: "APPS TAB (EMPTY STATE)", screen: "apps-tab-empty.html" },
    { name: "ADD A NEW XERO APP STORE APP", screen: "add-app.html" },
    { name: "TELL US ABOUT YOUR APP", screen: "tell-us-about-app.html" },
    { name: "INTEGRATION DETAILS", screen: "integration-details.html" },
    { name: "INTEGRATION DETAILS, PAGE TWO", screen: "integration-details-2.html" },
    { name: "STILL TO DO FORM", screen: "still-to-do.html" },
    { name: "APP DETAILS CONFIRM", screen: "app-details-confirm.html" },
    { name: "APP READINESS", screen: "app-readiness.html" },
    { name: "TERMS AND CONDITIONS", screen: "terms-conditions.html" },
  ],
}

export default function XeroFlowClickthrough() {
  const [currentStep, setCurrentStep] = useState(0)
  const [config, setConfig] = useState<FlowConfig>(flowConfig)
  const [screenContent, setScreenContent] = useState<string>("")

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const stepParam = urlParams.get("step")
      if (stepParam) {
        const stepIndex = Number.parseInt(stepParam)
        if (stepIndex >= 0 && stepIndex < config.steps.length) {
          setCurrentStep(stepIndex)
        }
      }
    }
  }, [config.steps.length])

  useEffect(() => {
    loadScreenContent(config.steps[currentStep].screen)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("step", currentStep.toString())
      window.history.replaceState({}, "", url.toString())
    }
  }, [currentStep, config.steps])

  const loadScreenContent = async (screenFile: string) => {
    try {
      const response = await fetch(`/screens/${screenFile}`)
      if (response.ok) {
        const content = await response.text()
        setScreenContent(content)
      } else {
        setScreenContent(`<div class="text-center text-gray-500">Screen not found: ${screenFile}</div>`)
      }
    } catch (error) {
      setScreenContent(`<div class="text-center text-red-500">Error loading screen: ${screenFile}</div>`)
    }
  }

  const goToNext = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full bg-gray-50 border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">{config.title}</h2>
            <div className="flex items-center gap-4">
              <button
                onClick={goToPrevious}
                disabled={currentStep === 0}
                className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{currentStep + 1}</span>
                <span>of</span>
                <span>{config.steps.length}</span>
              </div>

              <button
                onClick={goToNext}
                disabled={currentStep === config.steps.length - 1}
                className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {config.steps.map((step, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`
                  px-2 py-1 text-xs font-medium transition-colors cursor-pointer rounded-full border
                  ${
                    index === currentStep
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {step.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-gray-100 p-8 rounded-lg shadow-sm min-w-[600px] min-h-[400px] overflow-auto">
          <div dangerouslySetInnerHTML={{ __html: screenContent }} className="prose prose-sm max-w-none" />
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Screen: {config.steps[currentStep].screen} |
          <a href={`?step=${currentStep}`} className="ml-2 text-blue-600 hover:underline">
            Direct link
          </a>
        </div>
      </div>
    </div>
  )
}
