import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      `${process.env.RENDER_BACKEND_URL}/api/ping`,
    );

    return res.status(200).json({
      success: true,
      backend: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
