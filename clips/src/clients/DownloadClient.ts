import axios from "axios";
import fs from "fs";
import path from "path";
import { createDirectory } from "src/utils/createDirectory";
import { handleError } from "src/utils/handleError";
import { DownloadEntity } from "./types/downloadEntity";

export class DownloadClient {
  public async downloadFileByEntity({
    url,
    fileName,
  }: DownloadEntity): Promise<void> {
    // ensure that downloaded folder is present
    const dirPath = path.resolve(__dirname, "../../downloaded");
    createDirectory(dirPath);

    const response = await axios.get(url, { responseType: "stream" });
    const filePath = path.resolve(dirPath, `${fileName}.mp4`);

    response.data.pipe(fs.createWriteStream(filePath));

    return new Promise((resolve, reject) => {
      response.data.on("end", () => {
        console.log(`Download finished for: ${fileName}`);
        resolve();
      });

      response.data.on("error", (err: unknown) => {
        handleError(err);
        reject(err);
      });
    });
  }
}
