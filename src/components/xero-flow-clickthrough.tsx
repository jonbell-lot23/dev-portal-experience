"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [screenSrc, setScreenSrc] = useState<string>(`/screens/${flowConfig.steps[0].screen}`)

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
    setScreenSrc(`/screens/${config.steps[currentStep].screen}`)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href)
      url.searchParams.set("step", currentStep.toString())
      window.history.replaceState({}, "", url.toString())
    }
  }, [currentStep, config.steps])

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNext()
      } else if (event.key === "ArrowLeft") {
        goToPrevious()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentStep, config.steps.length])

  // No-op fetch: we render screens in an iframe to isolate styles

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
      {/* Prototype banner */}
      <div className="w-full bg-amber-100 text-amber-900 text-xs text-center py-2 border-b border-amber-200">
        These are not real screens, they are prototype approximations to understand the user flow
      </div>
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

      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-100 p-2 rounded-lg shadow-sm w-full overflow-hidden">
            <iframe
              key={screenSrc}
              src={screenSrc}
              title={config.steps[currentStep].name}
              className="w-full h-[75vh] min-h-[520px] bg-white rounded"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
