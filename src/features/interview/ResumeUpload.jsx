import React, { useState, useRef } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Modal from '../../components/Modal';
import resumeParser from '../../utils/resumeParser';
import { validateFileType, formatFileSize, getFileIcon } from '../../utils/helpers';

const ResumeUpload = ({ onResumeUploaded }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedInfo, setParsedInfo] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [userInput, setUserInput] = useState({ name: '', email: '', phone: '' });
  const [showInputModal, setShowInputModal] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = ['pdf', 'docx'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError(null);

    // Validate file type
    if (!validateFileType(file, allowedTypes)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    // Validate file size
    if (file.size > maxFileSize) {
      setError('File size must be less than 10MB.');
      return;
    }

    setSelectedFile(file);
    parseResume(file);
  };

  const parseResume = async (file) => {
    setIsParsing(true);
    try {
      console.log("Starting resume parsing for file:", file.name);
      const info = await resumeParser.parseResume(file);
      console.log("Parsed resume info:", info);
      console.log("Resume text length:", info.fullText?.length || 0);
      console.log("Resume text preview:", info.fullText?.substring(0, 200) + "...");
      
      setParsedInfo(info);
      
      const missing = resumeParser.getMissingFields(info);
      setMissingFields(missing);
      
      // Check if resume text exists (even if short)
      if (!info.fullText || info.fullText.trim().length === 0) {
        console.warn("No resume text extracted, asking user to try again");
        setError("No text could be extracted from the resume. Please try uploading a different file or ensure the file contains readable text.");
        return;
      }

      if (missing.length > 0) {
        // Pre-fill with parsed data
        setUserInput({
          name: info.name || '',
          email: info.email || '',
          phone: info.phone || ''
        });
        setShowInputModal(true);
      } else {
        // All fields found, proceed directly
        handleResumeComplete(info);
      }
    } catch (error) {
      console.error("Resume parsing error:", error);
      setError(`Failed to parse resume: ${error.message}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInput(prev => ({ ...prev, [field]: value }));
  };

  const validateInput = () => {
    const errors = {};
    
    missingFields.forEach(field => {
      const value = userInput[field];
      if (!value.trim()) {
        errors[field] = `${field} is required`;
      } else if (!resumeParser.validateField(field, value)) {
        errors[field] = `Invalid ${field} format`;
      }
    });
    
    return errors;
  };

  const handleSubmitInput = () => {
    const errors = validateInput();
    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors.');
      return;
    }

    const completeInfo = {
      ...parsedInfo,
      ...userInput
    };
    
    setShowInputModal(false);
    handleResumeComplete(completeInfo);
  };

  const handleResumeComplete = (info) => {
    console.log("Resume completed, creating candidate data:", info);
    const candidateData = {
      name: info.name,
      email: info.email,
      phone: info.phone,
      resumeText: info.fullText,
      uploadedAt: new Date().toISOString(),
      interviewCompleted: false,
    };
    
    console.log("Candidate data to be uploaded:", candidateData);
    onResumeUploaded(candidateData);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect({ target: { files } });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setParsedInfo(null);
    setMissingFields([]);
    setUserInput({ name: '', email: '', phone: '' });
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Your AI Interview
        </h2>
        <p className="text-lg text-gray-600">
          Upload your resume to get started with your personalized interview experience.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          selectedFile ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {isParsing ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Parsing your resume...</p>
          </div>
        ) : selectedFile ? (
          <div>
            <div className="text-4xl mb-4">{getFileIcon(selectedFile.name)}</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedFile.name}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {formatFileSize(selectedFile.size)}
            </p>
            <div className="space-x-4">
              <Button onClick={resetUpload} variant="outline">
                Upload Different File
              </Button>
              <Button onClick={() => parseResume(selectedFile)}>
                Parse Resume
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Upload your resume
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your resume here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Supports PDF and DOCX files up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              Choose File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Parsed Info Display */}
      {parsedInfo && !showInputModal && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h4 className="font-medium text-green-800 mb-2">Resume Information Extracted:</h4>
          <div className="space-y-1 text-sm text-green-700">
            {parsedInfo.name && <p><strong>Name:</strong> {parsedInfo.name}</p>}
            {parsedInfo.email && <p><strong>Email:</strong> {parsedInfo.email}</p>}
            {parsedInfo.phone && <p><strong>Phone:</strong> {parsedInfo.phone}</p>}
          </div>
        </div>
      )}

      {/* Missing Fields Input Modal */}
      <Modal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        title="Complete Your Information"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            We couldn't extract all the required information from your resume. 
            Please provide the missing details:
          </p>
          
          {missingFields.map(field => (
            <Input
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={userInput[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={`Enter your ${field}`}
              required
            />
          ))}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => setShowInputModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitInput}>
              Continue to Interview
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ResumeUpload;
