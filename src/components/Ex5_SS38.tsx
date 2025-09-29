import { useState } from "react";
import axios from "axios";

const buildTransformedUrl = (originalUrl: string, transform: string) => {
  return originalUrl.replace("/upload/", `/upload/${transform}/`);
};

export default function Ex5_SS38() {
  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [thumbUrl, setThumbUrl] = useState<string>("");
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "re_upload"); 
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwwedoumo/image/upload",
        formData
      );

      const url = res.data.secure_url as string;
      setOriginalUrl(url);
      const thumb = buildTransformedUrl(
        url,
        "c_fill,w_300,h_300,f_auto,q_auto"
      );
      setThumbUrl(thumb);
      setShowOriginal(false);
    } catch (err) {
      console.error(err);
      alert("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2>Upload → Tạo thumbnail → Click xem ảnh gốc</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Đang upload...</p>}  
      {thumbUrl && (
        <div style={{ marginTop: 16 }}>
          <p>Thumbnail (click để xem ảnh gốc):</p>
          <img
            src={thumbUrl}
            alt="Thumbnail"
            style={{
              width: 300,
              height: 300,
              objectFit: "cover",
              cursor: "pointer",
              borderRadius: 8,
            }}
            onClick={() => setShowOriginal((v) => !v)}
          />
        </div>
      )}
      {showOriginal && originalUrl && (
        <div style={{ marginTop: 16 }}>
          <p>Ảnh gốc:</p>
          <img
            src={originalUrl}
            alt="Original"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
          <div style={{ marginTop: 8 }}>
            <a href={originalUrl} target="_blank" rel="noreferrer">
              Mở ảnh gốc trong tab mới
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
