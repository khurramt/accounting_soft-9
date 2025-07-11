import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WelcomeWizard = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    company_name: '',
    legal_name: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    phone: '',
    fax: '',
    email: '',
    
    // Step 2: Industry & Settings
    industry: 'general',
    include_payroll: false,
    multi_currency: false,
    
    // Step 3: File Settings
    file_location: '',
    multi_user: false,
    audit_trail: true,
    encrypt_file: false,
    password: '',
    confirm_password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const industries = [
    { id: 'general', name: 'General Business', icon: '🏢' },
    { id: 'contractor', name: 'Contractor', icon: '🔨' },
    { id: 'nonprofit', name: 'Nonprofit', icon: '🤝' },
    { id: 'manufacturing', name: 'Manufacturing', icon: '🏭' },
    { id: 'retail', name: 'Retail', icon: '🛍️' },
    { id: 'professional', name: 'Professional Services', icon: '💼' },
    { id: 'accountant', name: 'Accountant', icon: '📊' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Create company record
      const companyData = {
        name: formData.company_name,
        legal_name: formData.legal_name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        phone: formData.phone,
        fax: formData.fax,
        email: formData.email,
        industry: formData.industry,
        settings: {
          include_payroll: formData.include_payroll,
          multi_currency: formData.multi_currency,
          multi_user: formData.multi_user,
          audit_trail: formData.audit_trail,
          encrypt_file: formData.encrypt_file
        }
      };

      await axios.post(`${API}/company`, companyData);
      
      // Store company setup completion
      localStorage.setItem('qbclone_company_setup', 'completed');
      localStorage.setItem('qbclone_company_name', formData.company_name);
      
      onComplete();
    } catch (err) {
      setError('Failed to create company. Please try again.');
      console.error('Company creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-t-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold">QB</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">Welcome to QBClone</h1>
          <p className="text-blue-100 text-center text-lg">Let's set up your accounting system</p>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-6 bg-gray-50 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600">
              Step {currentStep} of 3
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Company Information</span>
            <span>Industry & Settings</span>
            <span>File Preferences</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600">Tell us about your business</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => updateFormData('company_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Legal Name
                  </label>
                  <input
                    type="text"
                    value={formData.legal_name}
                    onChange={(e) => updateFormData('legal_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Legal business name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP/Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => updateFormData('zip_code', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ZIP code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Industry & Settings</h2>
                <p className="text-gray-600">Choose your industry and preferences</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Your Industry
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {industries.map((industry) => (
                    <div
                      key={industry.id}
                      onClick={() => updateFormData('industry', industry.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.industry === industry.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{industry.icon}</div>
                        <div className="font-medium text-gray-900">{industry.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Features</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="payroll"
                      checked={formData.include_payroll}
                      onChange={(e) => updateFormData('include_payroll', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="payroll" className="ml-3 text-sm text-gray-700">
                      Include Payroll Module
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="multicurrency"
                      checked={formData.multi_currency}
                      onChange={(e) => updateFormData('multi_currency', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="multicurrency" className="ml-3 text-sm text-gray-700">
                      Multi-currency Support
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">File Preferences</h2>
                <p className="text-gray-600">Configure your company file settings</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security & Access</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="multiuser"
                      checked={formData.multi_user}
                      onChange={(e) => updateFormData('multi_user', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="multiuser" className="ml-3 text-sm text-gray-700">
                      Enable Multi-user Mode
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="audit"
                      checked={formData.audit_trail}
                      onChange={(e) => updateFormData('audit_trail', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="audit" className="ml-3 text-sm text-gray-700">
                      Enable Audit Trail
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="encrypt"
                      checked={formData.encrypt_file}
                      onChange={(e) => updateFormData('encrypt_file', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="encrypt" className="ml-3 text-sm text-gray-700">
                      Encrypt Company File
                    </label>
                  </div>
                </div>
              </div>

              {formData.encrypt_file && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-blue-900 mb-4">File Encryption</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={formData.confirm_password}
                        onChange={(e) => updateFormData('confirm_password', e.target.value)}
                        className="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 rounded-b-2xl border-t">
          <div className="flex justify-between items-center">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => onComplete()}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Skip Setup
              </button>
              
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
                disabled={loading || (currentStep === 1 && !formData.company_name)}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  currentStep === 3 ? 'Finish Setup' : 'Next'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeWizard;