import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken = "") => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name: nombre, picture: img, email: correo } = ticket.getPayload();
  // const userid = payload["sub"];
  return {
    nombre,
    img,
    correo,
  };
};

export { googleVerify };
