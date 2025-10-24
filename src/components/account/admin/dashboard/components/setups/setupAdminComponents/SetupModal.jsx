'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SetupModal = ({ stepModule, stepConfig, setupProgress, onComplete, onSkip, onClose, onNavigateToSetup, }) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(true);

  React.useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsAnimating(false), 300);
  }, []);

  const currentStep = setupProgress?.setUpConfiguration?.find(step => step.module === stepModule);
  const isCompleted = currentStep?.completed;
  const isMandatory = currentStep?.isMandatory;

  const handleNavigateToSetup = () => {
    if (stepConfig?.actionUrl) {
      // Call the parent function to update allowed pages first
      onNavigateToSetup();
      // Then navigate to the setup page
      router.push(stepConfig.actionUrl);
    }
  };

  const handleMarkComplete = () => {
    // Here you would call your API to mark the step as complete
    onComplete(stepModule);
  };

  // Helper functions for colors
  const getGradientColors = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return gradients[color] || gradients.blue;
  };

  const getButtonColors = (color) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${getGradientColors(stepConfig?.color)} text-white p-8 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{stepConfig?.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{stepConfig?.title}</h2>
                <p className="text-blue-100 mt-1">{stepConfig?.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isCompleted 
                  ? 'bg-green-500 text-white' 
                  : isMandatory 
                  ? 'bg-red-500 text-white' 
                  : 'bg-blue-500 text-white'
              }`}>
                {isCompleted ? '✓ Completed' : isMandatory ? 'Required' : 'Optional'}
              </span>
              <span className="text-blue-100 text-sm">
                Step {setupProgress?.setUpConfiguration?.findIndex(s => s.module === stepModule) + 1} of {setupProgress?.setUpConfiguration?.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Benefits */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-500">✨</span>
              Why this step matters:
            </h3>
            <ul className="space-y-2 max-h-[30vh] overflow-y-auto scrollbar-thin">
              {stepConfig?.benefits?.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Current Status */}
          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-green-500 text-xl">✅</span>
                <div>
                  <h4 className="font-medium text-green-900">Step Already Completed!</h4>
                  <p className="text-green-700 text-sm">You can review or modify your setup anytime.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleNavigateToSetup}
              className={`flex-1 ${getButtonColors(stepConfig?.color)} text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2`}
            >
              <span>{isCompleted ? 'Review Setup' : 'Start Setup'}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {isCompleted && (
              <button
                onClick={handleMarkComplete}
                className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Continue to Next Step
              </button>
            )}

            {!isMandatory && !isCompleted && (
              <button
                onClick={onSkip}
                className="sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Skip for Now
              </button>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {isMandatory 
                ? 'This step is required to access all system features'
                : 'This step is optional but recommended for better experience'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupModal;