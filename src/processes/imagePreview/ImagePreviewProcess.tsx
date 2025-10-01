import { Process } from "../../../convex/processes/schema";


export const ImagePreviewProcess = ({ process }: { process: Process<"image_preview"> }) => {
  return <ImagePreviewWindow process={process} />;
};
