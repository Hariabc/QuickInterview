class BroadcastChannelService {
  constructor() {
    this.channel = new BroadcastChannel('interview-assistant-sync');
    this.listeners = new Map();
  }

  // Subscribe to specific message types
  subscribe(messageType, callback) {
    if (!this.listeners.has(messageType)) {
      this.listeners.set(messageType, new Set());
    }
    this.listeners.get(messageType).add(callback);
  }

  // Unsubscribe from message types
  unsubscribe(messageType, callback) {
    if (this.listeners.has(messageType)) {
      this.listeners.get(messageType).delete(callback);
    }
  }

  // Send message to other tabs
  broadcast(messageType, data) {
    this.channel.postMessage({
      type: messageType,
      data,
      timestamp: Date.now(),
      tabId: this.getTabId(),
    });
  }

  // Handle incoming messages
  handleMessage = (event) => {
    const { type, data, timestamp, tabId } = event.data;
    
    // Don't process messages from the same tab
    if (tabId === this.getTabId()) {
      return;
    }

    // Notify all listeners for this message type
    if (this.listeners.has(type)) {
      this.listeners.get(type).forEach(callback => {
        try {
          callback(data, { timestamp, tabId });
        } catch (error) {
          console.error('Error in broadcast channel callback:', error);
        }
      });
    }
  };

  // Generate unique tab ID
  getTabId() {
    if (!this.tabId) {
      this.tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    return this.tabId;
  }

  // Initialize the service
  init() {
    this.channel.addEventListener('message', this.handleMessage);
  }

  // Cleanup
  destroy() {
    this.channel.removeEventListener('message', this.handleMessage);
    this.channel.close();
    this.listeners.clear();
  }
}

// Message types for different events
export const MESSAGE_TYPES = {
  CANDIDATE_UPDATED: 'candidate_updated',
  CANDIDATE_CREATED: 'candidate_created',
  INTERVIEW_STARTED: 'interview_started',
  INTERVIEW_PROGRESS: 'interview_progress',
  INTERVIEW_COMPLETED: 'interview_completed',
  CHAT_MESSAGE: 'chat_message',
  TIMER_UPDATE: 'timer_update',
  QUESTION_ANSWERED: 'question_answered',
};

// Create singleton instance
const broadcastChannelService = new BroadcastChannelService();
broadcastChannelService.init();

export default broadcastChannelService;
