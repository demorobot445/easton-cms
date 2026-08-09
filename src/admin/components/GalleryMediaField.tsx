import React, { useCallback, useState } from "react";
import { Upload, CheckCircle2, Loader2, ImagePlus } from "lucide-react";
import { useForm } from "payload/components/forms";
import { useConfig } from "payload/components/utilities";

const GalleryMediaField = () => {
  const path = "galleryMedia";

  const { addFieldRow } = useForm();
  const { serverURL, routes } = useConfig();

  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const [progress, setProgress] = useState({
    done: 0,
    total: 0,
  });

  const uploadFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList?.length) return;

      const files = Array.from(fileList);

      setUploading(true);
      setProgress({
        done: 0,
        total: files.length,
      });

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const alt = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ")
          .trim();

        formData.append(
          "_payload",
          JSON.stringify({
            alt: alt || "Gallery image",
          }),
        );

        try {
          const res = await fetch(`${serverURL}${routes.api}/media`, {
            method: "POST",
            credentials: "include",
            body: formData,
          });

          if (res.ok) {
            const created = await res.json();

            await addFieldRow({
              path,
              rowIndex: undefined,
              data: {
                media: created.doc.id,
              },
            });
          }
        } catch (err) {
          console.error(err);
        }

        setProgress((p) => ({
          ...p,
          done: p.done + 1,
        }));
      }

      setUploading(false);

      setTimeout(() => {
        setProgress({
          done: 0,
          total: 0,
        });
      }, 800);
    },
    [addFieldRow, path, routes.api, serverURL],
  );

  const percent =
    progress.total === 0
      ? 0
      : Math.round((progress.done / progress.total) * 100);

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadFiles(e.dataTransfer.files);
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          minHeight: 180,
          border: `2px dashed ${
            dragging ? "var(--theme-success-800)" : "var(--theme-elevation-250)"
          }`,
          borderRadius: 10,
          background: dragging
            ? "var(--theme-success-50)"
            : "var(--theme-elevation-50)",
          transition: "all .2s ease",
          cursor: uploading ? "default" : "pointer",
          padding: 24,
        }}
      >
        {uploading ? (
          <>
            <Loader2 size={34} className="animate-spin" />

            <div style={{ fontWeight: 600 }}>
              Uploading {progress.done} of {progress.total}
            </div>

            <div
              style={{
                width: "100%",
                maxWidth: 350,
                height: 8,
                background: "var(--theme-elevation-150)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  background: "black",
                  transition: "width .25s",
                }}
              />
            </div>

            <small>{percent}% complete</small>
          </>
        ) : (
          <>
            <ImagePlus size={42} />

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Upload Gallery Images
            </div>

            <div
              style={{
                color: "var(--theme-text-secondary)",
                textAlign: "center",
                maxWidth: 320,
              }}
            >
              Drag & drop multiple images here or click to browse.
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                borderRadius: 8,
                border: 0,
                background: "black",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Upload size={16} />
              Choose Images
            </div>
          </>
        )}

        {!uploading && (
          <input
            hidden
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        )}
      </label>

      {!uploading && progress.done === progress.total && progress.total > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginTop: 12,
            color: "black",
          }}
        >
          <CheckCircle2 size={18} />
          Upload complete
        </div>
      )}
    </div>
  );
};

export default GalleryMediaField;
