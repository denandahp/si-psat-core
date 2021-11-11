exports.getDefaultError = () => {
    return { message: "Terjadi kesalahan. Mohon coba ulang." };
}

exports.getErrorTemplate = (errorMessage) => {
    return { message: errorMessage };
}