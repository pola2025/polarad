export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const data = await request.json();
      const { name, phone, company, industry, adname } = data;

      if (!name || !phone) {
        return new Response(JSON.stringify({ error: 'name and phone are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const results = { telegram: false, sms: false, email: false };
      const errors = {};
      const now = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

      // 1. Telegram
      try {
        const msg = env.MSG_TELEGRAM
          .replace('{adname}', adname || '-')
          .replace('{name}', name)
          .replace('{phone}', phone)
          .replace('{company}', company || '-')
          .replace('{industry}', industry || '-')
          .replace('{time}', now);

        const res = await fetch(
          'https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: msg }),
          }
        );
        results.telegram = res.ok;
      } catch (e) {
        console.error('Telegram:', e);
      }

      // 2. SMS
      try {
        const smsMsg = env.MSG_SMS.replace('{name}', name);
        const ts = Date.now().toString();
        const sig = await makeSignature(
          'POST',
          '/sms/v2/services/' + env.NCP_SERVICE_ID + '/messages',
          ts,
          env.NCP_ACCESS_KEY,
          env.NCP_SECRET_KEY
        );

        const res = await fetch(
          'https://sens.apigw.ntruss.com/sms/v2/services/' + env.NCP_SERVICE_ID + '/messages',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'x-ncp-apigw-timestamp': ts,
              'x-ncp-iam-access-key': env.NCP_ACCESS_KEY,
              'x-ncp-apigw-signature-v2': sig,
            },
            body: JSON.stringify({
              type: 'LMS',
              from: env.NCP_SENDER_PHONE,
              subject: '[폴라애드]',
              content: smsMsg,
              messages: [{ to: phone.replace(/-/g, '').replace(/^\+82/, '0') }],
            }),
          }
        );
        results.sms = res.ok;
        if (!res.ok) {
          errors.sms = await res.text();
        }
      } catch (e) {
        errors.sms = e.message;
      }

      // 3. Email (Resend)
      try {
        const html = '<!DOCTYPE html><html><head><meta charset="utf-8"></head>' +
          '<body style="font-family:sans-serif;padding:20px;">' +
          '<h2>' + env.MSG_TELEGRAM.split('\n')[0] + '</h2>' +
          '<table style="border-collapse:collapse;width:100%;max-width:500px;">' +
          '<tr><td style="padding:10px;border:1px solid #ddd;background:#f9f9f9;"><b>' + '\uAD11\uACE0\uBA85' + '</b></td><td style="padding:10px;border:1px solid #ddd;">' + (adname || '-') + '</td></tr>' +
          '<tr><td style="padding:10px;border:1px solid #ddd;background:#f9f9f9;"><b>' + '\uC774\uB984' + '</b></td><td style="padding:10px;border:1px solid #ddd;">' + name + '</td></tr>' +
          '<tr><td style="padding:10px;border:1px solid #ddd;background:#f9f9f9;"><b>' + '\uC5F0\uB77D\uCC98' + '</b></td><td style="padding:10px;border:1px solid #ddd;">' + phone + '</td></tr>' +
          '<tr><td style="padding:10px;border:1px solid #ddd;background:#f9f9f9;"><b>' + '\uC0C1\uD638\uBA85' + '</b></td><td style="padding:10px;border:1px solid #ddd;">' + (company || '-') + '</td></tr>' +
          '<tr><td style="padding:10px;border:1px solid #ddd;background:#f9f9f9;"><b>' + '\uC5C5\uC885' + '</b></td><td style="padding:10px;border:1px solid #ddd;">' + (industry || '-') + '</td></tr>' +
          '<tr><td style="padding:10px;border:1px solid #ddd;background:#f9f9f9;"><b>' + '\uC811\uC218\uC2DC\uAC04' + '</b></td><td style="padding:10px;border:1px solid #ddd;">' + now + '</td></tr>' +
          '</table></body></html>';

        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.RESEND_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: env.EMAIL_FROM_NAME + ' <noreply@mail.policy-fund.online>',
            to: env.ADMIN_EMAIL || 'mkt@polarad.co.kr',
            subject: '[\uC0C1\uB2F4\uC2E0\uCCAD] ' + name + ' - ' + (company || '\uBBF8\uC785\uB825'),
            html: html,
          }),
        });
        results.email = res.ok;
      } catch (e) {
        console.error('Email:', e);
      }

      return new Response(JSON.stringify({ success: true, results, errors, input: { name, phone, company, industry, adname } }), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  },
};

async function makeSignature(method, url, timestamp, accessKey, secretKey) {
  const message = method + ' ' + url + '\n' + timestamp + '\n' + accessKey;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}
