import FfmpegCommand from "fluent-ffmpeg";
import path from "path";
import { convertTimeToSeconds } from "src/utils/convertTimeToSeconds";
import { createDirectory } from "src/utils/createDirectory";
import { handleError } from "src/utils/handleError";
import { VideoPart } from "./types/videoPart";

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

  muteVideoByParts(videoParts: VideoPart[], fileName?: string): void {
    console.log(
      `Started to mute parts of video for: ${
        fileName || VideoClient.completedFileName
      }`
    );

    const muteCommand = FfmpegCommand();

    muteCommand.addInput(
      `${this.pathToCompletedDir}/${fileName || VideoClient.completedFileName}`
    );

    // muteCommand.audioFilters(
    //   videoParts.map((videoPart) => ({
    //     filter: "volume",
    //     options: `0:enable='between(t,${convertTimeToSeconds(
    //       videoPart.start,
    //       ":"
    //     )}, ${convertTimeToSeconds(videoPart.end, ":")})'`,
    //   }))
    // );

    videoParts.forEach((videoPart) => {
      muteCommand.audioFilters(
        `volume=enable='between(t,${convertTimeToSeconds(
          videoPart.start,
          ":"
        )}, ${convertTimeToSeconds(videoPart.end, ":")})':volume=0`
      );
    });

    muteCommand
      .output(
        `${this.pathToCompletedDir}/muted-${
          fileName || VideoClient.completedFileName
        }`
      )
      .on("end", () => {
        console.log(
          `Finished muting video: ${fileName || VideoClient.completedFileName}`
        );
      })
      .run();
  }
}
