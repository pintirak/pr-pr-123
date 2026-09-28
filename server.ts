import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Route: Send LINE Notification
  app.post('/api/line-notify', async (req: Request, res: Response) => {
    try {
      const {
        provider = 'line_notify',
        token,
        channelAccessToken,
        webhookUrl,
        message,
        to,
      } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          success: false,
          error: 'กรุณาระบุข้อความที่ต้องการส่ง (message is required)',
        });
      }

      const activeToken = (token || channelAccessToken || '').trim();
      const isDemo = !activeToken || activeToken.startsWith('DEMO_');

      // 1. If using Demo token
      if (isDemo && !webhookUrl) {
        return res.status(200).json({
          success: true,
          simulated: true,
          isDemo: true,
          provider: 'demo',
          message: 'บันทึกในโหมดจำลอง (Demo Mode) สำเร็จ',
          warning: 'ปัจจุบันยังไม่ได้ใส่ Token จริงของ LINE ระบบจึงจำลองการส่งเท่านั้น ยังไม่มีข้อความส่งไปยังมือถือจริง',
        });
      }

      // 2. Custom Webhook (Google Apps Script, Make, Zapier, etc.)
      if (provider === 'webhook' || (webhookUrl && webhookUrl.trim())) {
        try {
          const webhookRes = await fetch(webhookUrl.trim(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message,
              timestamp: new Date().toISOString(),
              source: 'PR SYSTEM คณะพยาบาลศาสตร์ ม.นเรศวร',
            }),
          });

          if (webhookRes.ok) {
            return res.status(200).json({
              success: true,
              simulated: false,
              provider: 'webhook',
              message: 'ส่งข้อมูลไปยัง Webhook สำเร็จเรียบร้อย!',
            });
          } else {
            return res.status(webhookRes.status).json({
              success: false,
              simulated: false,
              error: `Webhook ตอบกลับด้วยสถานะ HTTP ${webhookRes.status}`,
              status: webhookRes.status,
            });
          }
        } catch (webhookErr: any) {
          return res.status(502).json({
            success: false,
            simulated: false,
            error: `ไม่สามารถเชื่อมต่อไปยัง Webhook URL: ${webhookErr.message}`,
          });
        }
      }

      // 3. LINE Messaging API (LINE Official Account / Channel Access Token)
      if (provider === 'line_messaging_api' || channelAccessToken) {
        try {
          const botToken = channelAccessToken || activeToken;
          const endpoint = to && to.trim()
            ? 'https://api.line.me/v2/bot/message/push'
            : 'https://api.line.me/v2/bot/message/broadcast';

          const payload = to && to.trim()
            ? {
                to: to.trim(),
                messages: [{ type: 'text', text: message }],
              }
            : {
                messages: [{ type: 'text', text: message }],
              };

          const botRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${botToken}`,
            },
            body: JSON.stringify(payload),
          });

          const botData = await botRes.json().catch(() => ({}));

          if (botRes.ok) {
            return res.status(200).json({
              success: true,
              simulated: false,
              provider: 'line_messaging_api',
              message: 'ส่งข้อความผ่าน LINE Official Account (Messaging API) สำเร็จ!',
              details: botData,
            });
          } else {
            return res.status(botRes.status).json({
              success: false,
              simulated: false,
              error: botData.message || `LINE Messaging API ตอบกลับด้วยสถานะ HTTP ${botRes.status}`,
              status: botRes.status,
              hint: botRes.status === 401
                ? 'Channel Access Token ไม่ถูกต้องหรือหมดอายุ'
                : 'กรุณาตรวจสอบสิทธิ์และโควต้าการส่งข้อความของ LINE Official Account',
              details: botData,
            });
          }
        } catch (botErr: any) {
          return res.status(502).json({
            success: false,
            simulated: false,
            error: `เชื่อมต่อ LINE Messaging API ไม่สำเร็จ: ${botErr.message}`,
          });
        }
      }

      // 4. LINE Notify API (Default & Most Popular)
      try {
        const lineNotifyRes = await fetch('https://notify-api.line.me/api/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${activeToken}`,
          },
          body: new URLSearchParams({ message }).toString(),
        });

        const lineData = await lineNotifyRes.json().catch(() => ({}));

        if (lineNotifyRes.ok) {
          return res.status(200).json({
            success: true,
            simulated: false,
            provider: 'line_notify',
            message: 'ส่งการแจ้งเตือนเข้า LINE สำเร็จเรียบร้อย!',
            status: 200,
            details: lineData,
          });
        } else {
          let hintMessage = 'กรุณาตรวจสอบการตั้งค่า LINE Notify';
          if (lineNotifyRes.status === 401) {
            hintMessage = 'Token ไม่ถูกต้องหรือหมดอายุ กรุณาไปที่ https://notify-bot.line.me/my/ เพื่อสร้าง Token ใหม่';
          } else if (lineNotifyRes.status === 400) {
            hintMessage = 'คำขอไม่ถูกต้อง: หากเลือกส่งเข้ากลุ่ม ต้องเชิญ @LINE Notify เข้ากลุ่มแชทนั้นด้วย';
          }

          return res.status(lineNotifyRes.status).json({
            success: false,
            simulated: false,
            status: lineNotifyRes.status,
            error: lineData.message || `LINE Notify ตอบกลับด้วยสถานะ HTTP ${lineNotifyRes.status}`,
            hint: hintMessage,
            details: lineData,
          });
        }
      } catch (lineErr: any) {
        const isNetworkOrDnsError = 
          lineErr.message?.includes('fetch failed') || 
          lineErr.message?.includes('ENOTFOUND') ||
          lineErr.message?.includes('Could not resolve host');

        return res.status(502).json({
          success: false,
          simulated: false,
          error: isNetworkOrDnsError
            ? 'สภาพแวดล้อม Dev Sandbox ไม่สามารถเชื่อมต่อกับ notify-api.line.me ได้โดยตรง (ติดข้อจำกัด Firewall/DNS ของเครื่องพัฒนา)'
            : `ไม่สามารถส่งคำขอไปยัง LINE Notify: ${lineErr.message}`,
          hint: isNetworkOrDnsError
            ? 'แนะนำให้ใช้ตัวเลือก Google Apps Script Webhook (ฟรี ใช้ง่าย และส่งเข้ามือถือจริงได้ 100% ไม่ติดบล็อก) หรือ Deploy สู่ระบบจริง'
            : 'โปรดตรวจสอบความถูกต้องของ Token หรือการเชื่อมต่ออินเทอร์เน็ต',
        });
      }
    } catch (err: any) {
      console.error('Server error processing LINE notification:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'PR SYSTEM LINE Notification Proxy',
      time: new Date().toISOString(),
    });
  });

  // Vite middleware in dev or static files in production
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PR SYSTEM] Full-stack Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
