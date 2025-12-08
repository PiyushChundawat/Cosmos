import React from 'react';

export default function StudentProfile() {
  const student = {
    name: localStorage.getItem('student_name') || 'John Doe',
    email: localStorage.getItem('student_email') || 'john.doe@college.edu',
    registrationNo: 'REG2025001',
    studentCode: 'STU12345',
    department: 'Computer Science',
    semester: '6th Semester',
    cgpa: '8.5',
    phone: '+91 98765 43210',
    dateOfBirth: '15/01/2003',
    address: 'Hostel Room 204, College Campus',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">👤 My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your personal information</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center sticky top-6">
              <div className="w-32 h-32 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-5xl font-bold">
                {student.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{student.name}</h2>
              <p className="text-gray-600 mb-1">{student.department}</p>
              <p className="text-sm text-gray-500 mb-4">{student.registrationNo}</p>
              
              <div className="space-y-3 mt-6">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-gray-600">CGPA</p>
                  <p className="text-2xl font-bold text-emerald-700">{student.cgpa}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Semester</p>
                  <p className="text-lg font-bold text-blue-700">{student.semester}</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                  <p className="text-lg text-gray-900">{student.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                  <p className="text-lg text-gray-900">{student.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
                  <p className="text-lg text-gray-900">{student.phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Date of Birth</label>
                  <p className="text-lg text-gray-900">{student.dateOfBirth}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
                  <p className="text-lg text-gray-900">{student.address}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Registration Number</label>
                  <p className="text-lg text-gray-900">{student.registrationNo}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Student Code</label>
                  <p className="text-lg text-gray-900">{student.studentCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Department</label>
                  <p className="text-lg text-gray-900">{student.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">Current Semester</label>
                  <p className="text-lg text-gray-900">{student.semester}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">CGPA</label>
                  <p className="text-lg text-emerald-700 font-bold">{student.cgpa}/10.0</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm opacity-90">Tests Completed</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-sm opacity-90">Average Score</p>
                <p className="text-3xl font-bold">78%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                <div className="text-4xl mb-2">🏆</div>
                <p className="text-sm opacity-90">Rank</p>
                <p className="text-3xl font-bold">#15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
