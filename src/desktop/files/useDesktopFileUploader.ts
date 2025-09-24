import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useErrorHandler } from "../../common/errors/useErrorHandler";

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
  const createFiles = useMutation(api.files.createDesktopFiles);
  const startUpload = useMutation(api.files.startDesktopUpload);
  const generateUploadUrl = useMutation(api.files.generateDesktopUploadUrl);
  const completeUpload = useMutation(api.files.completeDesktopUpload);
  const setErrorState = useMutation(api.files.setDesktopUploadError);
  const updateProgress = useMutation(api.files.updateDesktopUploadProgress);
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
          const uploadUrl = await generateUploadUrl();
          await startUpload({ fileId });

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
    } catch (error) {
      handleError(error);
    } finally {
      setStatus({ kind: "idle", completed: 0, total: 0 });
    }
  };

  return { uploadFiles, status };
}
