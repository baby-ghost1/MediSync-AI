import multer from "multer";

const storage =
  multer.memoryStorage();

const fileFilter = (
  req,
  file,
  cb
) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "text/plain",
    "text/csv",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (
    allowed.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type."
      )
    );
  }
};

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      20 * 1024 * 1024,
  },
});

export default upload;