import React, { useState, useEffect } from 'react';
import CandidateList from './CandidateList';
import CandidateDetails from './CandidateDetails';
import database from '../../services/database';
import broadcastChannelService, { MESSAGE_TYPES } from '../../services/broadcastChannel';

const InterviewerPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score'); // score, name, date

  useEffect(() => {
    loadCandidates();
    setupBroadcastListeners();
  }, []);

  const setupBroadcastListeners = () => {
    // Listen for candidate updates from other tabs
    broadcastChannelService.subscribe(MESSAGE_TYPES.CANDIDATE_CREATED, handleCandidateCreated);
    broadcastChannelService.subscribe(MESSAGE_TYPES.CANDIDATE_UPDATED, handleCandidateUpdated);
    broadcastChannelService.subscribe(MESSAGE_TYPES.INTERVIEW_COMPLETED, handleInterviewCompleted);
  };

  const handleCandidateCreated = (data) => {
    loadCandidates(); // Refresh the list
  };

  const handleCandidateUpdated = (data) => {
    loadCandidates(); // Refresh the list
    if (selectedCandidate && selectedCandidate.id === data.candidateId) {
      loadCandidateDetails(data.candidateId);
    }
  };

  const handleInterviewCompleted = (data) => {
    loadCandidates(); // Refresh the list
  };

  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      const allCandidates = await database.getAllCandidates();
      
      // Sort candidates
      let sortedCandidates = [...allCandidates];
      switch (sortBy) {
        case 'score':
          sortedCandidates.sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0));
          break;
        case 'name':
          sortedCandidates.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'date':
          sortedCandidates.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
      }
      
      setCandidates(sortedCandidates);
    } catch (error) {
      console.error('Error loading candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCandidateDetails = async (candidateId) => {
    try {
      const candidate = await database.getCandidate(candidateId);
      setSelectedCandidate(candidate);
    } catch (error) {
      console.error('Error loading candidate details:', error);
    }
  };

  const handleCandidateSelect = async (candidateId) => {
    await loadCandidateDetails(candidateId);
  };

  const handleBackToList = () => {
    setSelectedCandidate(null);
  };

  const handleRefresh = () => {
    loadCandidates();
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      candidate.name?.toLowerCase().includes(term) ||
      candidate.email?.toLowerCase().includes(term) ||
      candidate.phone?.includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (selectedCandidate) {
    return (
      <CandidateDetails
        candidate={selectedCandidate}
        onBack={handleBackToList}
        onRefresh={() => loadCandidateDetails(selectedCandidate.id)}
      />
    );
  }

  return (
    <CandidateList
      candidates={filteredCandidates}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      sortBy={sortBy}
      onSortChange={setSortBy}
      onCandidateSelect={handleCandidateSelect}
      onRefresh={handleRefresh}
      totalCandidates={candidates.length}
    />
  );
};

export default InterviewerPage;
