import { getSafeLocation, stateSafeLocations } from '../data/safeLocations';

export class SafeLocationService {
  constructor() {
    this.activeLocations = new Map();
    this.updateInterval = 5 * 60 * 1000; // Update every 5 minutes
    this.startUpdates();
  }

  async startUpdates() {
    await this.updateSafeLocations();
    setInterval(() => this.updateSafeLocations(), this.updateInterval);
  }

  async updateSafeLocations() {
    for (const state of Object.keys(stateSafeLocations)) {
      const safeLocation = await getSafeLocation(state);
      this.activeLocations.set(state, safeLocation);
    }
  }

  getCurrentSafeLocation(state) {
    return this.activeLocations.get(state);
  }

  getAllSafeLocations() {
    return Array.from(this.activeLocations.values()).filter(Boolean);
  }
}

export const safeLocationService = new SafeLocationService();