import React from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { getScoreColor, getRatingEmoji, searchCandidates } from '../../utils/helpers';
import { formatDate } from '../../utils/timer';

const CandidateList = ({
  candidates,
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onCandidateSelect,
  onRefresh,
  totalCandidates
}) => {
  const handleSortChange = (newSortBy) => {
    onSortChange(newSortBy);
  };

  const getSortIcon = (field) => {
    if (sortBy === field) {
      return '↑';
    }
    return '↓';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Candidate Dashboard
          </h2>
          <Button onClick={onRefresh} variant="outline">
            Refresh
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="score">Score</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">{totalCandidates}</div>
          <div className="text-sm text-gray-500">Total Candidates</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">
            {candidates.filter(c => c.interviewCompleted).length}
          </div>
          <div className="text-sm text-gray-500">Completed Interviews</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-yellow-600">
            {candidates.filter(c => !c.interviewCompleted).length}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">
            {candidates.length > 0 
              ? Math.round(candidates.reduce((sum, c) => sum + (c.finalScore || 0), 0) / candidates.length)
              : 0
            }
          </div>
          <div className="text-sm text-gray-500">Average Score</div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {candidates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No candidates found
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Candidates will appear here once they start interviews.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('name')}>
                    Name {getSortIcon('name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('score')}>
                    Score {getSortIcon('score')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSortChange('date')}>
                    Date {getSortIcon('date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onCandidateSelect(candidate.id)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {candidate.name ? candidate.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {candidate.name || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.email}</div>
                      <div className="text-sm text-gray-500">{candidate.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {candidate.finalScore !== undefined ? (
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(candidate.finalScore)}`}>
                            {candidate.finalScore}/100
                          </span>
                          <span className="text-lg">{getRatingEmoji(candidate.finalScore >= 90 ? 'Excellent' : candidate.finalScore >= 80 ? 'Very Good' : candidate.finalScore >= 70 ? 'Good' : candidate.finalScore >= 60 ? 'Satisfactory' : 'Needs Improvement')}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not scored</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        candidate.interviewCompleted 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {candidate.interviewCompleted ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(candidate.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCandidateSelect(candidate.id);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      {candidates.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
