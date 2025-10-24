'use client';
import React, { useState } from 'react';
import { setupStepConfigs } from './setupAdminComponents/setupConfigs';
import SetupModal from './setupAdminComponents/SetupModal';
import SetupProgressOverview from './setupAdminComponents/SetUpProgressOverview';

const SetUpAdminDisplay = ({ setupProgress }) => {
  const [currentModalStep, setCurrentModalStep] = useState(null);
  const [showOverview, setShowOverview] = useState(true);

  // Function to update allowed pages in sessionStorage
  const updateAllowedPages = (stepModule) => {
    const stepConfig = setupStepConfigs[stepModule];
    if (stepConfig && stepConfig.allowedPages) {
      const allAllowedPages = [ ...stepConfig.allowedPages];
      sessionStorage.setItem('setupAllowedPages', JSON.stringify(allAllowedPages));
    }
  };

  // Function to reset allowed pages to base only
  const resetAllowedPages = () => {
    sessionStorage.removeItem('setupAllowedPages');
  };

  // Get next incomplete mandatory step
  const getNextIncompleteStep = () => {
    return setupProgress?.setUpConfiguration?.find(
      step => step.isMandatory && !step.completed
    );
  };

  // Get next incomplete optional step
  const getNextOptionalStep = () => {
    return setupProgress?.setUpConfiguration?.find(
      step => !step.isMandatory && !step.completed
    );
  };

  const handleStartSetup = () => {
    const nextStep = getNextIncompleteStep() || getNextOptionalStep();
    if (nextStep && showOverview) {
      // Small delay to let the overview show first
      setTimeout(() => {
        setCurrentModalStep(nextStep.module);
        setShowOverview(false);
      }, 500);
    }
  };

  const handleStepComplete = () => {
    setCurrentModalStep(null);
    setShowOverview(true);
  };

  const handleSkipStep = () => {
    const nextStep = getNextIncompleteStep() || getNextOptionalStep();
    if (nextStep) {
      setCurrentModalStep(nextStep.module);
    } else {
      setCurrentModalStep(null);
      setShowOverview(true);
    }
  };

  const handleManualStepSelect = (stepModule) => {
    setCurrentModalStep(stepModule);
    setShowOverview(false);
  };

  const handleNavigateToSetup = (stepModule) => {
    // Update allowed pages before navigation
    updateAllowedPages(stepModule);
  };

  return (
    <div className="min-h-screen bg-background-1">
      {/* Setup Progress Overview */}
      {showOverview && (
        <SetupProgressOverview
          setupProgress={setupProgress}
          setupStepConfigs={setupStepConfigs}
          onStepSelect={handleManualStepSelect}
          onStartSetup={handleStartSetup}
        />
      )}

      {/* Setup Modal */}
      {currentModalStep && (
        <SetupModal
          stepModule={currentModalStep}
          stepConfig={setupStepConfigs[currentModalStep]}
          setupProgress={setupProgress}
          onComplete={handleStepComplete}
          onSkip={handleSkipStep}
          onNavigateToSetup={() => handleNavigateToSetup(currentModalStep)}
          onClose={() => {
            resetAllowedPages();
            setCurrentModalStep(null);
            setShowOverview(true);
          }}
        />
      )}
    </div>
  );
};

export default SetUpAdminDisplay;