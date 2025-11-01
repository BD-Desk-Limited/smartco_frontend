import React from 'react';
import { 
  branchUploadInstructions, 
  generalInstructions, 
  excelTips, 
  commonErrors,
  uploadSteps 
} from '@/utilities/branchUploadInstructions';

const BranchUploadInstructions = ({ onClose }) => {
  const [activeTab, setActiveTab] = React.useState('general');

  const tabs = [
    { id: 'general', label: 'General Guidelines' },
    { id: 'fields', label: 'Field Requirements' },
    { id: 'excel', label: 'Excel Tips' },
    { id: 'errors', label: 'Common Errors' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Branch Upload Instructions</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 ${
                activeTab === tab.id 
                  ? 'border-b-2 border-brand-blue text-brand-blue' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <section>
                <h3 className="font-semibold text-lg mb-2">Upload Steps</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  {uploadSteps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="font-semibold text-lg mb-2">General Instructions</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {generalInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {activeTab === 'fields' && (
            <div className="space-y-6">
              {branchUploadInstructions.map((field, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <h3 className="font-semibold text-lg mb-2">{field.field}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Format: {field.format}</p>
                      <p className="text-sm text-gray-600 mb-1">Required: {field.required ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-600 mb-1">Examples:</p>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {field.examples.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rules:</p>
                      <ul className="list-disc pl-5 text-sm text-gray-600">
                        {field.rules.map((rule, i) => (
                          <li key={i}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'excel' && (
            <div className="space-y-6">
              <section>
                <h3 className="font-semibold text-lg mb-2">Excel Tips</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {excelTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </section>
            </div>
          )}

          {activeTab === 'errors' && (
            <div className="space-y-6">
              {commonErrors.map((error, index) => (
                <section key={index}>
                  <h3 className="font-semibold text-lg mb-2">{error.error}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Incorrect Examples:</p>
                      <ul className="list-disc pl-5 text-sm text-error">
                        {error.examples.incorrect.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Correct Examples:</p>
                      <ul className="list-disc pl-5 text-sm text-success">
                        {error.examples.correct.map((example, i) => (
                          <li key={i}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchUploadInstructions;