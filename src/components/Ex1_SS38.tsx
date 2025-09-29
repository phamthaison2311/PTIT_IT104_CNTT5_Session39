import axios from "axios";
import { useState } from "react";

export default function Ex1_SS38() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Vui lòng chọn file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "re_upload");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dwwedoumo/image/upload",
        formData
      );

      if (response.status === 200) {
        setImageUrl(response.data.secure_url);
      }
      console.log("Upload success:", response.data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div>
      <h2>Bài 1</h2>
      <img src={imageUrl} />
      <input type="file" onChange={handleChangeFile} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
