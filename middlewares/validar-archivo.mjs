const validarArchivoSubir = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json("No hay archivos para subir - validarArchivoSubir");
    return;
  }

  next();
};
export { validarArchivoSubir };
