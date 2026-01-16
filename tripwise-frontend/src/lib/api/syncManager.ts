import { useProfileStore, type TravelerInfo, type TravelDates, type DestinationPreference, type BudgetPreference, type AccommodationPreference, type TransportPreference, type TravelPurpose, type Activities, type FoodPreference, type DocumentStatus, type TravelExperience, type CommunicationPreference } from '@/store/profileStore';
import { ProfileApi } from './profileApi';
import type { ApiResponse } from './profileApi';

// Sync queue item interface
interface SyncQueueItem {
  id: string;
  profileId: string;
  stepId: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  nextRetryTime?: number;
}

// Sync status enum
export enum SyncStatus {
  IDLE = 'idle',
  SYNCING = 'syncing',
  SAVED = 'saved',
  ERROR = 'error',
  OFFLINE = 'offline',
}

class SyncManager {
  private queue: SyncQueueItem[] = [];
  private isProcessing = false;
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private status: SyncStatus = SyncStatus.IDLE;
  private statusCallbacks: ((status: SyncStatus) => void)[] = [];

  constructor() {
    // Listen for online/offline events
    if (typeof window !== 'undefined') {
      window.addEventListener('online', this.handleOnline.bind(this));
      window.addEventListener('offline', this.handleOffline.bind(this));
    }
  }

  // Subscribe to status changes
  public onStatusChange(callback: (status: SyncStatus) => void): void {
    this.statusCallbacks.push(callback);
  }

  // Unsubscribe from status changes
  public offStatusChange(callback: (status: SyncStatus) => void): void {
    this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
  }

  // Notify status change
  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.statusCallbacks.forEach(callback => callback(status));
    
    // Update store sync status
    const store = useProfileStore.getState();
    switch (status) {
      case SyncStatus.SYNCING:
        store.setSyncing(true);
        break;
      case SyncStatus.SAVED:
        store.setSyncing(false);
        store.markSaved();
        break;
      case SyncStatus.ERROR:
      case SyncStatus.OFFLINE:
        store.setSyncing(false);
        break;
      case SyncStatus.IDLE:
        store.setSyncing(false);
        break;
    }
  }

  // Handle online event
  private handleOnline(): void {
    console.log('🌐 Connection restored - Resuming sync');
    this.setStatus(SyncStatus.IDLE);
    this.processQueue();
  }

  // Handle offline event
  private handleOffline(): void {
    console.log('📵 Connection lost - Entering offline mode');
    this.setStatus(SyncStatus.OFFLINE);
  }

  // Check if online
  private isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Add item to sync queue with debouncing
  public queueSync(profileId: string, stepId: string, data: unknown): void {
    console.log(`📝 Queued sync for ${stepId}:`, data);
    
    // Clear existing timer for this step
    const existingTimer = this.debounceTimers.get(stepId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }
    
    // Remove existing items for the same step to avoid duplicate syncs
    this.queue = this.queue.filter(item => item.stepId !== stepId);
    
    // Set new timer with 800ms debounce
    const newTimer = setTimeout(() => {
      // Create new queue item
      const queueItem: SyncQueueItem = {
        id: `${stepId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        profileId,
        stepId,
        data,
        timestamp: Date.now(),
        retryCount: 0,
        maxRetries: 3,
      };
      
      // Add to queue
      this.queue.push(queueItem);
      console.log(`⏰ Debounce timer fired for ${stepId}, added to queue`);
      
      // Process queue
      if (!this.isProcessing) {
        this.processQueue();
      }
      
      // Clean up timer
      this.debounceTimers.delete(stepId);
    }, 800); // 800ms debounce - only syncs if user stops typing for 800ms
    
    this.debounceTimers.set(stepId, newTimer);
  }

  // Process the sync queue
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0 || !this.isOnline()) {
      return;
    }

    this.isProcessing = true;
    this.setStatus(SyncStatus.SYNCING);

    while (this.queue.length > 0 && this.isOnline()) {
      const item = this.queue[0];

      // Check if item should be retried
      if (item.nextRetryTime && Date.now() < item.nextRetryTime) {
        break; // Wait for retry time
      }

      try {
        await this.syncItem(item);
        // Success - remove from queue
        this.queue.shift();
        console.log(`✅ Synced ${item.stepId} successfully`);
      } catch (error) {
        console.error(`❌ Failed to sync ${item.stepId}:`, error);
        
        // Handle retry logic
        if (item.retryCount < item.maxRetries) {
          item.retryCount++;
          const delay = this.calculateRetryDelay(item.retryCount);
          item.nextRetryTime = Date.now() + delay;
          console.log(`🔄 Retrying ${item.stepId} in ${delay}ms (attempt ${item.retryCount}/${item.maxRetries})`);
          
          // Move to end of queue and wait for retry
          this.queue.push(this.queue.shift()!);
          break; // Wait for retry time
        } else {
          // Max retries reached - show error to user
          console.error(`🚫 Max retries reached for ${item.stepId}`);
          this.setStatus(SyncStatus.ERROR);
          
          // Remove from queue after showing error
          this.queue.shift();
          
          // Continue processing other items
          continue;
        }
      }
    }

    this.isProcessing = false;

    // Update status based on queue state
    if (this.queue.length === 0) {
      this.setStatus(SyncStatus.SAVED);
    } else if (!this.isOnline()) {
      this.setStatus(SyncStatus.OFFLINE);
    } else {
      this.setStatus(SyncStatus.IDLE);
    }
  }

  // Sync individual item
  private async syncItem(item: SyncQueueItem): Promise<void> {
    const { profileId, stepId, data } = item;

    // Map stepId to API call
    let apiCall: Promise<ApiResponse<unknown>>;

    switch (stepId) {
      case 'basicInfo':
        apiCall = ProfileApi.updateBasicInfo(profileId, data as TravelerInfo);
        break;
      case 'dates':
        apiCall = ProfileApi.updateDates(profileId, data as TravelDates);
        break;
      case 'destination':
        apiCall = ProfileApi.updateDestination(profileId, data as DestinationPreference);
        break;
      case 'budget':
        apiCall = ProfileApi.updateBudget(profileId, data as BudgetPreference);
        break;
      case 'accommodation':
        apiCall = ProfileApi.updateAccommodation(profileId, data as AccommodationPreference);
        break;
      case 'transport':
        apiCall = ProfileApi.updateTransport(profileId, data as TransportPreference);
        break;
      case 'purpose':
        apiCall = ProfileApi.updatePurpose(profileId, data as TravelPurpose);
        break;
      case 'interests':
        apiCall = ProfileApi.updateInterests(profileId, data as Activities);
        break;
      case 'food':
        apiCall = ProfileApi.updateFood(profileId, data as FoodPreference);
        break;
      case 'documents':
        apiCall = ProfileApi.updateDocuments(profileId, data as DocumentStatus);
        break;
      case 'experience':
        apiCall = ProfileApi.updateExperience(profileId, data as TravelExperience);
        break;
      case 'communication':
        apiCall = ProfileApi.updateCommunication(profileId, data as CommunicationPreference);
        break;
      default:
        throw new Error(`Unknown stepId: ${stepId}`);
    }

    const result = await apiCall;
    if (!result.success) {
      throw new Error(result.error || 'Sync failed');
    }
  }

  // Calculate exponential backoff delay
  private calculateRetryDelay(retryCount: number): number {
    // Exponential backoff: 1s, 2s, 4s
    return Math.pow(2, retryCount - 1) * 1000;
  }

  // Get current sync status
  public getStatus(): SyncStatus {
    return this.status;
  }

  // Get queue length
  public getQueueLength(): number {
    return this.queue.length;
  }

  // Force sync all pending items
  public async forceSync(): Promise<void> {
    if (this.queue.length > 0) {
      // Clear all debounce timers
      this.debounceTimers.forEach((timer) => clearTimeout(timer));
      this.debounceTimers.clear();
      
      // Process queue immediately
      await this.processQueue();
    }
  }

  // Clear all pending syncs
  public clearQueue(): void {
    this.queue = [];
    this.setStatus(SyncStatus.IDLE);
  }
}

// Create singleton instance
export const syncManager = new SyncManager();

// Export convenience functions
export const queueSync = (profileId: string, stepId: string, data: unknown) => {
  syncManager.queueSync(profileId, stepId, data);
};

export const getSyncStatus = () => syncManager.getStatus();

export const onSyncStatusChange = (callback: (status: SyncStatus) => void) => {
  syncManager.onStatusChange(callback);
};

export const offSyncStatusChange = (callback: (status: SyncStatus) => void) => {
  syncManager.offStatusChange(callback);
};

export const forceSyncAll = () => syncManager.forceSync();

export const clearSyncQueue = () => syncManager.clearQueue();
