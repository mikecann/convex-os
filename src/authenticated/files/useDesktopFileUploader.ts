import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useErrorHandler } from "../../common/errors/useErrorHandler";
import { playSound } from "../../common/sounds/soundEffects";

export type DesktopFileUpload = {
  file: File;
  position: {
    x: number;
    y: number;
  };
};

type UploadStatus = {
  kind: "idle" | "uploading";
  completed: number;
  total: number;
};

export function useDesktopFileUploader() {
  const createFiles = useMutation(api.my.files.createAll);
  const startUpload = useMutation(api.my.files.startUpload);
  //const generateUploadUrl = useMutation(api.my.files.generateUploadUrl);
  const completeUpload = useMutation(api.my.files.completeUpload);
  const setErrorState = useMutation(api.my.files.setUploadError);
  const updateProgress = useMutation(api.my.files.updateUploadProgress);
  const [status, setStatus] = useState<UploadStatus>({
    kind: "idle",
    completed: 0,
    total: 0,
  });
  const handleError = useErrorHandler();

  const uploadFiles = async (uploads: Array<DesktopFileUpload>) => {
    if (uploads.length === 0) return;

    try {
      setStatus({ kind: "uploading", completed: 0, total: uploads.length });

      const createPayload = uploads.map(({ file, position }) => ({
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        position,
      }));

      const createdFileIds = await createFiles({ files: createPayload });

      for (let index = 0; index < uploads.length; index += 1) {
        const userFile = uploads[index];
        const fileId = createdFileIds[index];

        if (!fileId) continue;

        try {
          const { uploadUrl } = await startUpload({ fileId });

          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", uploadUrl);
            xhr.setRequestHeader(
              "Content-Type",
              userFile.file.type || "application/octet-stream",
            );

            xhr.upload.onprogress = (event) => {
              if (!event.lengthComputable) return;
              const progress = Math.round((event.loaded / event.total) * 100);
              void updateProgress({ fileId, progress });
            };

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                try {
                  const response = JSON.parse(xhr.responseText) as {
                    storageId: Id<"_storage">;
                  };
                  void completeUpload({ fileId, storageId: response.storageId })
                    .then(() => resolve())
                    .catch(reject);
                } catch (parseError) {
                  reject(
                    parseError instanceof Error
                      ? parseError
                      : new Error("Upload response could not be parsed"),
                  );
                }
                return;
              }

              reject(
                new Error(
                  `Upload failed with status ${xhr.status}: ${xhr.statusText}`,
                ),
              );
            };

            xhr.onerror = () => {
              reject(new Error("Network error occurred during upload"));
            };

            xhr.send(userFile.file);
          });
        } catch (uploadError) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "An unexpected error occurred during upload";
          await setErrorState({ fileId, message });
          throw new Error(message);
        }

        setStatus(({ total }) => ({
          kind: "uploading",
          completed: index + 1,
          total,
        }));
      }

      // Play success sound when all uploads complete
      playSound("balloon", 0.3);
    } catch (error) {
      handleError(error);
    } finally {
      setStatus({ kind: "idle", completed: 0, total: 0 });
    }
  };

  return { uploadFiles, status };
}
