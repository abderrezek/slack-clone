import React from "react";
import { Progress } from "semantic-ui-react";

const ProgressBar = ({ uploadState, percentUploaded }) =>
  uploadState === "uploading" && (
    <Progress
      className="progress_bar"
      percent={percentUploaded}
      size="medium"
      progress
      indicating
      inverted
    />
  );

export default ProgressBar;
