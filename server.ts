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

  // API Route: Verify LINE Token & Get Bot Info
  app.post('/api/line-bot-info', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const activeToken = (token || '').trim();

      if (!activeToken || activeToken.startsWith('DEMO_')) {
        return res.status(200).json({
          valid: false,
          isDemo: true,
          error: 'ปัจจุบันใช้ Demo Token กรุณากรอก Channel Access Token จาก LINE Developers',
        });
      }

      // Check against LINE Messaging API
      const botRes = await fetch('https://api.line.me/v2/bot/info', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      const botData = await botRes.json().catch(() => ({}));

      if (botRes.ok) {
        return res.status(200).json({
          valid: true,
          isDemo: false,
          bot: {
            displayName: botData.displayName,
            basicId: botData.basicId,
            userId: botData.userId,
            pictureUrl: botData.pictureUrl,
            chatMode: botData.chatMode,
          },
          message: `เชื่อมต่อกับ LINE Bot "${botData.displayName}" (@${botData.basicId}) สำเร็จ!`,
        });
      } else {
        return res.status(botRes.status).json({
          valid: false,
          isDemo: false,
          status: botRes.status,
          error: botData.message || 'Token ไม่ถูกต้องหรือหมดอายุ (Authentication failed 401)',
          hint: 'โปรดตรวจสอบว่าได้คัดลอก Channel access token (long-lived) มาครบถ้วนหรือไม่',
          tokenLength: activeToken.length,
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        valid: false,
        error: `ไม่สามารถตรวจสอบ Token: ${err.message}`,
      });
    }
  });

  // API Route: Send LINE Notification
  app.post('/api/line-notify', async (req: Request, res: Response) => {
    try {
      const {
        provider = 'line_messaging_api',
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
      if (webhookUrl && webhookUrl.trim()) {
        try {
          const webhookRes = await fetch(webhookUrl.trim(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token: activeToken,
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
      // First verify the token with LINE's server
      const verifyRes = await fetch('https://api.line.me/v2/bot/info', {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      const botInfo = await verifyRes.json().catch(() => ({}));

      if (verifyRes.ok) {
        // Token is valid! Now send message via broadcast or push
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

        const sendRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${activeToken}`,
          },
          body: JSON.stringify(payload),
        });

        const sendData = await sendRes.json().catch(() => ({}));

        if (sendRes.ok) {
          return res.status(200).json({
            success: true,
            simulated: false,
            provider: 'line_messaging_api',
            botName: botInfo.displayName,
            botId: botInfo.basicId,
            message: `ส่งแจ้งเตือนผ่านบอท "${botInfo.displayName}" (@${botInfo.basicId}) สำเร็จ!`,
            hint: `ส่งข้อความ Broadcast ไปยังผู้ติดตามบอท @${botInfo.basicId} เรียบร้อยแล้ว`,
            details: sendData,
          });
        } else {
          return res.status(sendRes.status).json({
            success: false,
            simulated: false,
            status: sendRes.status,
            error: sendData.message || `LINE ตอบกลับด้วยรหัส HTTP ${sendRes.status}`,
            hint: sendData.details?.map((d: any) => d.message).join(', ') || 'โปรดตรวจสอบโควต้าข้อความหรือสิทธิ์ของบอท',
            details: sendData,
          });
        }
      } else {
        // Token rejected by LINE Messaging API
        // Provide clear diagnostic
        const isOldNotifyFormat = activeToken.length < 50;

        return res.status(401).json({
          success: false,
          simulated: false,
          status: 401,
          error: botInfo.message || 'รหัส Token ไม่ถูกต้อง (LINE Authentication failed: 401)',
          hint: isOldNotifyFormat
            ? 'รหัสที่คุณใส่มีความยาวสั้นคล้าย LINE Notify เดิม (ซึ่ง LINE ปิดบริการไปแล้ว) กรุณาสร้าง Channel access token จาก developers.line.biz (ความยาวประมาณ 170+ ตัวอักษร) หรือใช้ Webhook แทน'
            : 'โปรดตรวจสอบว่าได้คัดลอก "Channel access token (long-lived)" จาก LINE Developers Console มาครบถ้วนทุกตัวอักษรหรือไม่',
          tokenLength: activeToken.length,
          details: botInfo,
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
