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
    address: 'Hostel Room 204, College Campus'
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View and manage your information</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center sticky top-6">
              <div className="w-28 h-28 bg-emerald-600 text-white rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold">
                {student.name.charAt(0)}
              </div>

              <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
              <p className="text-gray-600">{student.department}</p>
              <p className="text-sm text-gray-500 mt-1">{student.registrationNo}</p>

              <div className="mt-6 space-y-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600">CGPA</p>
                  <p className="text-xl font-bold text-emerald-700">{student.cgpa}</p>
                </div>

                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs text-gray-600">Semester</p>
                  <p className="text-lg font-semibold text-gray-900">{student.semester}</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700">
                Edit Profile
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="text-lg text-gray-900">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="text-lg text-gray-900">{student.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="text-lg text-gray-900">{student.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                  <p className="text-lg text-gray-900">{student.dateOfBirth}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 mb-1">Address</p>
                  <p className="text-lg text-gray-900">{student.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Academic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Registration Number</p>
                  <p className="text-lg text-gray-900">{student.registrationNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Student Code</p>
                  <p className="text-lg text-gray-900">{student.studentCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Department</p>
                  <p className="text-lg text-gray-900">{student.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Semester</p>
                  <p className="text-lg text-gray-900">{student.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">CGPA</p>
                  <p className="text-lg font-bold text-emerald-700">{student.cgpa}/10.0</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600">Tests Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">78%</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-sm text-gray-600">Rank</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">15</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
