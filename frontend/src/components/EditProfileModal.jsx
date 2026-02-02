import React, { useState } from 'react';

export default function EditProfileModal({ isOpen, onClose, student, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    year: student?.year || '',
    branch: student?.branch || '',
    rollNumber: student?.rollNumber || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    if (formData.name && formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (formData.rollNumber && formData.rollNumber.length < 2) {
      newErrors.rollNumber = 'Roll number must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Clean up form data - remove empty values
      const cleanedData = {
        name: formData.name.trim(),
      };
      
      if (formData.year && formData.year !== '') {
        cleanedData.year = formData.year;
      }
      if (formData.branch && formData.branch.trim() !== '') {
        cleanedData.branch = formData.branch.trim();
      }
      if (formData.rollNumber && formData.rollNumber.trim() !== '') {
        cleanedData.rollNumber = formData.rollNumber.trim();
      }
      
      console.log("Submitting cleaned form data:", cleanedData);
      onSave(cleanedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-indigo-600 transition ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Year Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Year/Semester
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition disabled:bg-gray-100"
              disabled={loading}
            >
              <option value="">Select Year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          {/* Branch Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department/Branch
            </label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition disabled:bg-gray-100"
              disabled={loading}
            />
          </div>

          {/* Roll Number Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="e.g., BCS-001"
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-indigo-600 transition ${
                errors.rollNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={loading}
            />
            {errors.rollNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.rollNumber}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin">⚙️</span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
