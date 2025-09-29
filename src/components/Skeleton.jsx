import React from 'react';

const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`}></div>
  );
};

export const CandidateCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="w-24 h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-3" />
        <Skeleton className="w-3/4 h-3" />
        <Skeleton className="w-1/2 h-3" />
      </div>
    </div>
  );
};

export const InterviewSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Skeleton className="w-48 h-6 mb-4" />
        <Skeleton className="w-full h-2 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <Skeleton className="w-full h-32" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton className="w-16 h-4" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton className="w-20 h-4" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton className="w-12 h-4" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Skeleton className="w-16 h-4" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Skeleton className="w-10 h-10 rounded-full mr-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="w-32 h-4 mb-1" />
                  <Skeleton className="w-24 h-3" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="w-16 h-4" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Skeleton className="w-20 h-4" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Skeleton;
