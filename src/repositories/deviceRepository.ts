import { deviceCollection } from "./db";
import { DevicesDbType } from "../models/commonTypes";

export const deviceRepository = {
  async addDevice(deviceData: DevicesDbType): Promise<DevicesDbType | null> {
    const token = await deviceCollection.insertOne(deviceData);

    if (!token) return null;
    return deviceData;
  },

  async deleteDevice(deviceId: string, userId: string): Promise<boolean> {
    const result = await deviceCollection.deleteOne({
      deviceId: deviceId,
      userId: userId,
    });
    return result.deletedCount === 1;
  },

  async deleteAllDeviceExceptOne(
    userId: string, 
    deviceId: string    
  ): Promise<number> {
    const filter = {
      userId: userId,
      deviceId: { $ne: deviceId },
    };

    const result = await deviceCollection.deleteMany(filter);
    return result.deletedCount || 0;
  },

  async updateDevice(
    deviceId: string,
    activatedDate: string,
    expDate: string
  ): Promise<boolean> {
    const result = await deviceCollection.updateOne(
      { deviceId: deviceId },
      { $set: { lastActiveDate: activatedDate, expDate } }
    );
    return result.matchedCount === 1;
  },
};
