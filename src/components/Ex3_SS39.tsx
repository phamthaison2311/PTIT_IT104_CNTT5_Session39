import { useRef, useState } from "react";
import axios from "axios";
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function Ex3_SS39() {
  const cropperRef = useRef<ReactCropperElement>(null);

  const [src, setSrc] = useState<string>("");      // ảnh gốc để crop (Object URL)
  const [imageUrl, setImageUrl] = useState<string>(""); // URL ảnh sau khi upload
  const [uploading, setUploading] = useState(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSrc(URL.createObjectURL(f));
  };

  const getCroppedBlob = (): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) return reject(new Error("Cropper chưa sẵn sàng"));
      const canvas = cropper.getCroppedCanvas();
      if (!canvas) return reject(new Error("Không tạo được canvas"));
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Không tạo được blob"));
        resolve(blob);
      }, "image/jpeg", 0.9);
    });

  const handleUpload = async () => {
    if (!src) {
      alert("Vui lòng chọn ảnh");
      return;
    }
    try {
      setUploading(true);
      const blob = await getCroppedBlob();

      const formData = new FormData();
      formData.append("file", blob, "cropped.jpg");
      formData.append("upload_preset", "re_upload"); // preset unsigned của bạn

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
    <div style={{ maxWidth: 700, margin: "0 auto", fontFamily: "system-ui" }}>
      <h2>Crop → Upload Cloudinary → Hiển thị</h2>

      <input type="file" accept="image/*" onChange={handleChangeFile} />

      {src ? (
        <div style={{ marginTop: 12 }}>
          <Cropper
            src={src}
            style={{ height: 400, width: "100%" }}
            // cấu hình cơ bản đủ dùng
            aspectRatio={NaN}      // tự do; muốn 1:1 thì đặt 1
            viewMode={1}
            guides
            autoCropArea={1}
            background={false}
            responsive
            checkOrientation
            ref={cropperRef}
          />
          <button onClick={handleUpload} disabled={uploading} style={{ marginTop: 12 }}>
            {uploading ? "Đang upload..." : "Crop & Upload"}
          </button>
        </div>
      ) : (
        <p style={{ marginTop: 12 }}>Chọn một ảnh để bắt đầu crop…</p>
      )}

      {imageUrl && (
        <div style={{ marginTop: 16 }}>
          <p>Ảnh đã crop & upload thành công:</p>
          <img src={imageUrl} alt="Cropped" style={{ maxWidth: "100%", borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}
