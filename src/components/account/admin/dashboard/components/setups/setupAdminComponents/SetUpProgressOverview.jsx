'use client';
import React from 'react';
import { useAuth } from '@/contexts/authContext';

const SetupProgressOverview = ({ setupProgress, setupStepConfigs, onStepSelect, onStartSetup }) => {
  const { user } = useAuth();

  const mandatorySteps = setupProgress?.setUpConfiguration?.filter(step => step.isMandatory) || [];
  const optionalSteps = setupProgress?.setUpConfiguration?.filter(step => !step.isMandatory) || [];

  const getStepStatusColor = (completed, isMandatory) => {
    if (completed) return 'bg-green-500';
    if (isMandatory) return 'bg-red-200';
    return 'bg-gray-400';
  };

  const getStepStatusText = (completed, isMandatory) => {
    if (completed) return 'Completed';
    if (isMandatory) return 'Required';
    return 'Optional';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-blue rounded-full mb-6">
            <span className="text-white text-3xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SmartCo, {user?.fullName}!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let&apos;s get your business system configured. Complete the required steps below to get started with all features.
          </p>
        </div>

        {/* Progress Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mandatory Setup</h3>
                <p className="text-3xl font-bold text-red-500 mt-2">
                  {setupProgress?.setUpCompletionPercentage?.mandatory.toFixed(0) || 0}%
                </p>
              </div>
              <div className="text-red-400 text-3xl">⚠️</div>
            </div>
            <p className="text-gray-600 mt-2">Required to access all features</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Optional Setup</h3>
                <p className="text-3xl font-bold text-blue-500 mt-2">
                  {setupProgress?.setUpCompletionPercentage?.nonMandatory.toFixed(0) || 0}%
                </p>
              </div>
              <div className="text-blue-400 text-3xl">💡</div>
            </div>
            <p className="text-gray-600 mt-2">Enhance your experience</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Progress</h3>
                <p className="text-3xl font-bold text-green-500 mt-2">
                  {setupProgress?.setUpCompletionPercentage?.totalCompletion.toFixed(0) || 0}%
                </p>
              </div>
              <div className="text-green-400 text-3xl">📈</div>
            </div>
            <p className="text-gray-600 mt-2">Overall completion</p>
          </div>
        </div>

        {/* Mandatory Steps */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🔴</span>
            <h2 className="text-2xl font-bold text-gray-900">Required Setup Steps</h2>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              Must Complete
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mandatorySteps.map((step) => {
              const config = setupStepConfigs[step.module];
              if (!config) return null;
              return (
                <div
                  key={step.module}
                  onClick={() => onStepSelect(step.module)}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                    step.completed ? 'border-green-200' : 'border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{config?.icon}</div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      step.completed 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {getStepStatusText(step.completed, step.isMandatory)}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {config?.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{config?.description}</p>
                  
                  <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    getStepStatusColor(step.completed, step.isMandatory)
                  }`}>
                    {step.completed ? 'Review Setup' : 'Start Setup'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Steps */}
        {optionalSteps.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">💡</span>
              <h2 className="text-2xl font-bold text-gray-900">Optional Enhancements</h2>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Recommended
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {optionalSteps.map((step) => {
                const config = setupStepConfigs[step.module];
                if (!config) return null;
                return (
                  <div
                    key={step.module}
                    onClick={() => onStepSelect(step.module)}
                    className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                      step.completed ? 'border-green-200' : 'border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{config?.icon}</div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        step.completed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {getStepStatusText(step.completed, step.isMandatory)}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {config?.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{config?.description}</p>
                    
                    <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      step.completed
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}>
                      {step.completed ? 'Review Setup' : 'Start Setup'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center">
          <button 
            onClick={onStartSetup}
            className="bg-brand-blue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Continue to Setup Process
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupProgressOverview;