import React from 'react';

export default function ResumeAnalysis() {
  const analysisData = {
    score: 78,
    totalScore: 100,
    skills: [
      'React',
      'JavaScript',
      'Python',
      'Git',
      'Problem Solving',
      'Team Collaboration'
    ],
    strengths: [
      'Clear and concise formatting',
      'Strong technical skills section',
      'Quantifiable achievements in project descriptions',
      'Good use of action verbs',
      'Well-structured work experience'
    ],
    improvements: [
      'Add more specific metrics to achievements',
      'Include certifications section',
      'Expand on leadership experience',
      'Add keywords relevant to target job role',
      'Include links to portfolio/GitHub',
      'Optimize for ATS compatibility'
    ],
    sections: [
      { name: 'Contact Information', score: 95, status: 'excellent' },
      { name: 'Professional Summary', score: 70, status: 'good' },
      { name: 'Work Experience', score: 80, status: 'good' },
      { name: 'Education', score: 90, status: 'excellent' },
      { name: 'Skills', score: 75, status: 'good' },
      { name: 'Projects', score: 65, status: 'needs-improvement' }
    ]
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    if (status === 'excellent') return 'bg-emerald-100 text-emerald-800';
    if (status === 'good') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
          <p className="text-gray-600 mt-1">Detailed insights and recommendations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-10 text-center mb-10">
          <div className="text-5xl font-bold text-gray-900">
            {analysisData.score}/{analysisData.totalScore}
          </div>
          <p className="text-gray-700 mt-4 font-medium">
            {analysisData.score >= 80
              ? 'Excellent Resume'
              : analysisData.score >= 60
              ? 'Good Resume — Can Improve'
              : 'Needs Improvement'}
          </p>
          <div className="w-full bg-gray-200 h-3 rounded-full mt-6">
            <div
              className="bg-emerald-600 h-3 rounded-full"
              style={{ width: `${analysisData.score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Key Skills Detected
              </h2>
              <div className="flex flex-wrap gap-3">
                {analysisData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Strengths</h2>
              <ul className="space-y-3">
                {analysisData.strengths.map((item, index) => (
                  <li
                    key={index}
                    className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-gray-900"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Suggested Improvements
              </h2>
              <ul className="space-y-3">
                {analysisData.improvements.map((item, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-10 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Section-wise Breakdown
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysisData.sections.map((section, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 border border-gray-200 rounded-xl"
              >
                <h3 className="font-bold text-gray-900 mb-3">{section.name}</h3>

                <div className="flex items-center justify-between mb-3">
                  <span className={`text-3xl font-bold ${getScoreColor(section.score)}`}>
                    {section.score}%
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      section.status
                    )}`}
                  >
                    {section.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${section.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="py-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700">
            Download Full Report
          </button>
          <button className="py-4 border border-emerald-600 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50">
            Upload New Resume
          </button>
          <button className="py-4 border border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50">
            Save Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
