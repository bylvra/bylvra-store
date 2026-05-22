#!/bin/bash
# Usage: send_welcome_email.sh <email> <first_name>
# Sends the BYLVRA welcome email with WELCOME15 discount code

EMAIL_TO="$1"
FIRST_NAME="${2:-there}"
SOURCE_TOKEN="${GMAIL_ACCESS_TOKEN}"

if [ -z "$EMAIL_TO" ]; then
  echo "❌ No email provided"
  exit 1
fi

EMAIL_FROM="BYLVRA <thepeterabrand@gmail.com>"
SUBJECT="Your 15% off code is here — welcome to BYLVRA"

HTML_BODY="<!DOCTYPE html>
<html>
<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"></head>
<body style=\"margin:0;padding:0;background:#f9f9f9;font-family:Inter,sans-serif;\">
  <table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#f9f9f9;padding:40px 16px;\">
    <tr><td align=\"center\">
      <table width=\"100%\" style=\"max-width:520px;background:#fff;border-radius:4px;overflow:hidden;\">
        <tr><td style=\"height:4px;background:linear-gradient(90deg,#FCE4EC,#B8E0D2);\"></td></tr>
        <tr><td style=\"padding:32px 40px 0;text-align:center;\">
          <p style=\"font-size:22px;font-weight:800;letter-spacing:4px;color:#1A1A1A;margin:0;\">BYLVRA</p>
        </td></tr>
        <tr><td style=\"padding:28px 40px 0;\">
          <p style=\"font-size:14px;color:#444;line-height:1.7;margin:0 0 20px;\">Hi ${FIRST_NAME},</p>
          <p style=\"font-size:14px;color:#444;line-height:1.7;margin:0 0 24px;\">
            Welcome to BYLVRA — clinical beauty, built on science. Here is your exclusive 15% off code for your first order:
          </p>
          <div style=\"background:#f5f5f5;border:1px dashed #ddd;border-radius:4px;padding:20px;text-align:center;margin:0 0 24px;\">
            <p style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 8px;\">Your discount code</p>
            <p style=\"font-size:28px;font-weight:800;letter-spacing:6px;color:#1A1A1A;margin:0;\">WELCOME15</p>
          </div>
          <p style=\"font-size:13px;color:#888;line-height:1.7;margin:0 0 28px;\">
            Apply it at checkout for 15% off your entire first order. No minimum spend required.
          </p>
          <div style=\"text-align:center;margin:0 0 32px;\">
            <a href=\"https://bylvra.shop\" style=\"display:inline-block;background:#1A1A1A;color:#fff;text-decoration:none;padding:14px 40px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;\">
              Shop Now
            </a>
          </div>
        </td></tr>
        <tr><td style=\"padding:20px 40px 32px;border-top:1px solid #f0f0f0;\">
          <p style=\"font-size:11px;color:#bbb;text-align:center;margin:0;line-height:1.6;\">
            BYLVRA · bylvra.shop<br>
            You received this because you subscribed at bylvra.shop.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"

FULL_MESSAGE="From: $EMAIL_FROM
To: $EMAIL_TO
Subject: $SUBJECT
MIME-Version: 1.0
Content-Type: text/html; charset=utf-8

$HTML_BODY"

ENCODED=$(echo "$FULL_MESSAGE" | base64 | tr '+/' '-_' | tr -d '=\n')

RESPONSE=$(curl -s -X POST \
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/send" \
  -H "Authorization: Bearer $SOURCE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"raw\": \"$ENCODED\"}")

echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print('✅ Sent to ${EMAIL_TO}! ID:', d.get('id','?')) if 'id' in d else print('❌', d)"
