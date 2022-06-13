import FfmpegCommand from "fluent-ffmpeg";
import path from "path";
import { createDirectory } from "src/utils/createDirectory";
import { handleError } from "src/utils/handleError";

export class VideoClient {
  private command: FfmpegCommand.FfmpegCommand;
  pathToDownloadedDir: string;
  pathToCompletedDir = path.resolve(__dirname, "../../completed");
  static completedFileName: string;

  constructor(pathToDownloadedDir: string) {
    this.command = FfmpegCommand();
    this.pathToDownloadedDir = pathToDownloadedDir;

    createDirectory(this.pathToCompletedDir);
  }

  mergeFiles(videoNames: string[], outputName: string): void {
    console.log(`Started merging for: ${outputName}`);
    videoNames.forEach((videoName) => {
      this.command = this.command.addInput(
        path.resolve(this.pathToDownloadedDir, `${videoName}.mp4`)
      );
    });

    this.command
      .mergeToFile(`${this.pathToCompletedDir}/${outputName}`)
      .on("error", (err) => {
        handleError(err);
      })
      .on("end", () => {
        console.log(`Finished for file: ${outputName}`);
        VideoClient.completedFileName = outputName;
      });
  }
}
