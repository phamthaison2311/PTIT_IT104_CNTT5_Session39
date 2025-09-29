import { useState } from "react";
import axios from "axios";

type ImgItem = {
  url: string;
  publicId: string;
};

export default function Ex2_SS39() {
  const [images, setImages] = useState<ImgItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const API_BASE = "http://localhost:5173"; 

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "re_upload"); 
      // thay cloud_name nếu khác
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwwedoumo/image/upload",
        formData
      );

      const url = res.data.secure_url as string;
      const publicId = res.data.public_id as string;

      setImages((prev) => [{ url, publicId }, ...prev]);
      (e.target as HTMLInputElement).value = ""; 
    } catch (err) {
      console.error(err);
      alert("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    const prev = images;
    setImages((lst) => lst.filter((i) => i.publicId !== publicId));
    try {
      await axios.post(`${API_BASE}/api/delete-image`, { publicId });
    } catch (err) {
      console.error(err);
      alert("Xoá thất bại, khôi phục lại danh sách.");
      setImages(prev); 
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2>Upload → Lưu public_id → Xoá ảnh Cloudinary</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Đang upload...</p>}

      <div
        style={{
          marginTop: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        {images.map((img) => (
          <figure key={img.publicId} style={{ margin: 0, border: "1px solid #eee", borderRadius: 8, padding: 8 }}>
            <img
              src={img.url}
              alt={img.publicId}
              style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 6 }}
            />
            <figcaption style={{ fontSize: 12, marginTop: 6, wordBreak: "break-all" }}>
              public_id: <code>{img.publicId}</code>
            </figcaption>
            <button
              onClick={() => handleDelete(img.publicId)}
              style={{ marginTop: 8, width: "100%" }}
            >
              Xoá ảnh
            </button>
          </figure>
        ))}
      </div>
    </div>
  );
}
