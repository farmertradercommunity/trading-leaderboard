import axios from "axios";

export default async function handler(req, res) {
  const email = process.env.MYFX_EMAIL;
  const password = process.env.MYFX_PASSWORD;

  try {
    // Login ke Myfxbook
    const loginRes = await axios.get("https://www.myfxbook.com/api/login.json", {
      params: { email, password },
    });

    const session = loginRes.data.session;
    if (!session) throw new Error("Login gagal");

    // Ambil data akun
    const accountRes = await axios.get(
      `https://www.myfxbook.com/api/get-my-accounts.json?session=${session}`
    );

    // Logout
    await axios.get(
      `https://www.myfxbook.com/api/logout.json?session=${session}`
    );

    res.status(200).json({
      success: true,
      accounts: accountRes.data.accounts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
