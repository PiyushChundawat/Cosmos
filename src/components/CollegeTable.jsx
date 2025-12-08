import React from 'react';

function CollegeTable() {
  const colleges = [
    {
      id: 1,
      name: 'MNNIT Allahabad',
      domain: 'mnnit.ac.in',
      amount: '20000',
      plan: 'Paid'
    },
    {
      id: 2,
      name: 'IIT Delhi',
      domain: 'iitd.ac.in',
      amount: '20000',
      plan: 'Paid'
    },
    {
      id: 3,
      name: 'XYZ Inst.',
      domain: 'xyz.edu',
      amount: '20000',
      plan: 'Paid'
    }
  ];

  const getPlanBadgeColor = (plan) => {
    return plan === 'Paid' 
      ? 'bg-emerald-100 text-emerald-800' 
      : 'bg-amber-100 text-amber-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead>
            <tr className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <th className="px-6 py-4 text-left text-sm font-semibold">College Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email Domain</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Plan</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {colleges.map((college, index) => (
              <tr
                key={college.id}
                className="hover:bg-emerald-50 transition-colors duration-200 group"
              >
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {college.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">{college.domain}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">₹{college.amount}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanBadgeColor(
                      college.plan
                    )}`}
                  >
                    {college.plan}
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