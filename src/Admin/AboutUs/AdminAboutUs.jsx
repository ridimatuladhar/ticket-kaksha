import React, { useEffect, useState } from "react";

const AdminAboutUs = () => {
  const [paragraph1, setParagraph1] = useState("");
  const [paragraph2, setParagraph2] = useState("");
  const [images, setImages] = useState([]);
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");



//  const backendBase = "http://localhost/TICKETKAKSHA/Backend/aboutus";
   const backendBase = "https://ticketkaksha.com.np/Backend/aboutus";



  const showMessage = (msg, type = "info", scope = "general") => {
    const messageObj = { text: msg, type };
    if (scope === "image") {
      setImageMessage(messageObj);
      setTimeout(() => setImageMessage(""), 3000);
    } else {
      setMessage(messageObj);
      setTimeout(() => setMessage(""), 3000);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${backendBase}/get_about_us.php`);
      const data = await res.json();
      if (data.success) {
        setParagraph1(data.text.paragraph1 || "");
        setParagraph2(data.text.paragraph2 || "");
        setImages(data.images || []);
      } else {
        showMessage(data.message || "Failed to fetch data", "error");
      }
    } catch (error) {
      showMessage("Error fetching data: " + error.message, "error");
    }
  };

  const handleTextSave = async () => {
    if (!paragraph1.trim() || !paragraph2.trim()) {
      showMessage("Both paragraphs are required", "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("paragraph1", paragraph1);
      formData.append("paragraph2", paragraph2);

      const res = await fetch(`${backendBase}/update_about_us.php`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        showMessage("Text updated successfully", "success");
      } else {
        showMessage(result.message || "Failed to update text", "error");
      }
    } catch (error) {
      showMessage("Error updating text: " + error.message, "error");
    }
    setLoading(false);
  };

  const handleImageUpload = async () => {
    if (!newImage) {
      showMessage("Please select an image", "error", "image");
      return;
    }

    if (images.length >= 5) {
      showMessage("Maximum 5 images allowed. Please delete an image first.", "error", "image");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", newImage);

      const res = await fetch(`${backendBase}/upload_image.php`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success) {
        setImages([...images, result.path]);
        setNewImage(null);
        setNewImagePreview("");
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
        showMessage("Image uploaded successfully", "success", "image");
      } else {
        showMessage(result.message || "Failed to upload image", "error", "image");
      }
    } catch (error) {
      showMessage("Error uploading image: " + error.message, "error", "image");
    }
    setUploading(false);
  };


const handleDeleteImage = async (imgPath) => {
  if (!window.confirm("Are you sure you want to delete this image?")) {
    return;
  }

  try {
    const formData = new FormData();
    formData.append("path", imgPath);

    const res = await fetch(`${backendBase}/delete_image.php`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (result.success) {
      setImages(images.filter((img) => img !== imgPath));
      showMessage("Image deleted successfully", "success", "image"); // ✅ fixed message
    } else {
      showMessage(result.message || "Failed to delete image", "error", "image");
    }
  } catch (error) {
    showMessage("Error deleting image: " + error.message, "error", "image");
  }
};


const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (images.length >= 5) {
    showMessage("Maximum 5 images allowed. Please delete an image first.", "error", "image");
    e.target.value = "";
    return;
  }

  if (file) {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      showMessage("Only JPEG, PNG, and GIF files are allowed", "error", "image");
      setNewImage(null);
      setNewImagePreview("");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("File size must be less than 5MB", "error", "image");
      setNewImage(null);
      setNewImagePreview("");
      e.target.value = "";
      return;
    }

    setNewImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setNewImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }
};



  return (
    <div className="p-2 sm:p-6 max-w-full mx-auto">
      <h1 className="text-xl sm:text-2xl  font-bold mb-6 text-[#2E6FB7] text-center sm:text-left">
        About Us
      </h1>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-3 rounded ${message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Text Content */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-lg overflow-hidden">
        <h3 className="text-lg text-[#2E6FB7] font-semibold mb-4">Content Management</h3>

        <label className="block mb-2 font-semibold text-gray-700">
          Paragraph 1 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
          placeholder="Enter the first paragraph about your company..."
        />

        <label className="block mb-2 font-semibold text-gray-700">
          Paragraph 2 <span className="text-red-500">*</span>
        </label>
        <textarea
          className="w-full border border-gray-300 rounded p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows="4"
          value={paragraph2}
          onChange={(e) => setParagraph2(e.target.value)}
          placeholder="Enter the second paragraph..."
        />

        <button
          className="bg-[#245da3] hover:bg-[#3a7dc4] text-white px-6 py-2 rounded transition disabled:opacity-50 w-full sm:w-auto"
          onClick={handleTextSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Text Content"}
        </button>
      </div>

      {/* Image Management */}
      <div className="bg-white rounded-lg p-6 shadow-lg overflow-hidden">
        <h3 className="text-lg text-[#2E6FB7]  font-semibold mb-4">
          Image Management ({images.length}/5)
        </h3>
        {imageMessage && (
          <div
            className={`mb-4 p-3 rounded ${imageMessage.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : imageMessage.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-blue-100 text-blue-700 border border-blue-300"
              }`}
          >
            {imageMessage.text}
          </div>
        )}


        {/* Upload */}
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <label className="block mb-2 font-semibold text-gray-700">
            Upload New Image
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileChange}
            className="mb-2 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
          file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {newImagePreview && (
            <div className="mb-4">
              <p className="font-semibold mb-1">Preview:</p>
              <img
                src={newImagePreview}
                alt="Preview"
                className="max-w-xs w-auto h-40  rounded"
              />
            </div>
          )}

          <small className="text-gray-500 block mb-2">
            Accepted formats: JPEG, PNG, GIF. Max size: 5MB. Max 5 images.
          </small>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition disabled:opacity-50 w-full sm:w-auto"
            onClick={handleImageUpload}
            disabled={uploading || !newImage || images.length >= 5}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>

        {/* Images Preview */}
        {images.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {images.map((img, index) => (
              <div
                key={img}
                className="relative w-40 h-40 rounded overflow-hidden shadow-sm"
              >
                <img
                  //src={`http://localhost/TICKETKAKSHA/Backend/aboutus/${img}`}
                   src={`https://ticketkaksha.com.np/Backend/aboutus/${img}`}
                  alt={`About Us Image ${index + 1}`}
                  className="w-full h-full object-cover"

                />
                <button
                  onClick={() => handleDeleteImage(img)}
                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded px-2 py-1 text-xs shadow-md transition"
                  title="Delete Image"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No images uploaded yet. Upload up to 5 images to showcase here.
          </p>
        )}
      </div>
    </div>

  );
};

export default AdminAboutUs;
