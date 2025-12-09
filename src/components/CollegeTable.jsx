import React from 'react';

function CollegeTable({ colleges }) {
  if (!colleges || colleges.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-600">No colleges enrolled yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">College Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email Domain</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">TPO Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">TPO Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {colleges.map((college) => (
              <tr
                key={college._id}
                className="hover:bg-emerald-50 transition-colors duration-200 group"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {college.name || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">
                    {college.emailDomain || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">
                    {college.tpoName || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">
                    {college.tpoPhone || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">
                    {college.address || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CollegeTable;