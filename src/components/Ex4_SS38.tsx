import { useState } from "react";
import axios from "axios";

export default function Ex4_SS38() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const compressImage = (file: File, quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject(new Error("Không tạo được context"));
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error("Không tạo blob"));
              resolve(blob);
            },
            "image/jpeg",
            quality     
          );
        };
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const compressed = await compressImage(file, 0.7);

      const formData = new FormData();
      formData.append("file", compressed, file.name.replace(/\.[^.]+$/, "") + "-q70.jpg");
      formData.append("upload_preset", "re_upload"); 

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwwedoumo/image/upload",
        formData
      );
      setImageUrl(res.data.secure_url);
    } catch (err) {
      console.error(err);
      alert("Upload thất bại!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2>Upload với chất lượng giảm</h2>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Đang upload...</p>}

      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <p>Ảnh đã nén & upload:</p>
          <img src={imageUrl} alt="Compressed" style={{ maxWidth: "100%", borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
