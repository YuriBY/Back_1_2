import { logsCollection } from "./db";
import { IPandURLDbType } from "../models/commonTypes";
import { addSeconds } from "date-fns";

export const logsRepository = {
  async countRequests(requestData: IPandURLDbType): Promise<number> {
    try {
      const { ip, URL, date } = requestData;
      const tenSecondsAgo = addSeconds(date, -10);

      const filter = {
        ip: ip,
        URL: URL,
        date: { $gte: tenSecondsAgo, $lte: date },
      };

      const totalCount: number = await logsCollection.countDocuments(filter);
      console.log("tot", totalCount);
      return totalCount;
    } catch (error) {
      console.error("Error counting requests:", error);
      return 0;
    }
  },

  async saveToDb(requestData: IPandURLDbType): Promise<IPandURLDbType> {
    const result = await logsCollection.insertOne(requestData);
    return requestData;
  },
};