#!/bin/bash
# Usage: send_shipping_email.sh <email> <customer_name> <order_number> <tracking_number>
# Sends BYLVRA shipping confirmation with tracking link

EMAIL_TO="$1"
CUSTOMER_NAME="${2:-Valued Customer}"
ORDER_NUMBER="${3:-BL000000}"
TRACKING_NUMBER="${4:-}"
SOURCE_TOKEN="${GMAIL_ACCESS_TOKEN}"

if [ -z "$EMAIL_TO" ]; then
  echo "❌ No email provided"
  exit 1
fi

EMAIL_FROM="BYLVRA <thepeterabrand@gmail.com>"
SUBJECT="Your BYLVRA order is on its way — ${ORDER_NUMBER}"

TRACKING_SECTION=""
if [ -n "$TRACKING_NUMBER" ]; then
  TRACKING_SECTION="
          <div style=\"background:#f5f5f5;border:1px dashed #ddd;border-radius:4px;padding:20px;text-align:center;margin:0 0 24px;\">
            <p style=\"font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#999;margin:0 0 8px;\">Tracking Number</p>
            <p style=\"font-size:20px;font-weight:800;letter-spacing:3px;color:#1A1A1A;margin:0 0 12px;\">$TRACKING_NUMBER</p>
            <a href=\"https://t.17track.net/en#nums=$TRACKING_NUMBER\" style=\"font-size:12px;color:#2D9E6B;font-weight:600;\">Track your package →</a>
          </div>"
fi

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
          <div style=\"text-align:center;margin-bottom:28px;\">
            <div style=\"width:52px;height:52px;background:#B8E0D2;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:22px;\">📦</div>
          </div>
          <h2 style=\"font-size:22px;font-weight:800;color:#1A1A1A;letter-spacing:-0.5px;margin:0 0 12px;\">Your order has shipped.</h2>
          <p style=\"font-size:14px;color:#444;line-height:1.7;margin:0 0 8px;\">Hi ${CUSTOMER_NAME},</p>
          <p style=\"font-size:14px;color:#444;line-height:1.7;margin:0 0 24px;\">
            Great news — your BYLVRA order <strong>${ORDER_NUMBER}</strong> is on its way to you.
          </p>
          ${TRACKING_SECTION}
          <p style=\"font-size:13px;color:#888;line-height:1.7;margin:0 0 28px;\">
            Estimated delivery: <strong>7–14 business days</strong>. International shipping times may vary.
          </p>
          <div style=\"text-align:center;margin:0 0 32px;\">
            <a href=\"https://bylvra.shop/pages/track-order\" style=\"display:inline-block;background:#1A1A1A;color:#fff;text-decoration:none;padding:14px 40px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;\">
              Track Order
            </a>
          </div>
          <div style=\"background:#FAFAFA;border-radius:4px;padding:20px;margin-bottom:24px;\">
            <p style=\"font-size:12px;color:#888;margin:0 0 8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;\">Questions?</p>
            <p style=\"font-size:13px;color:#666;margin:0;\">Reply to this email or visit <a href=\"https://bylvra.shop/pages/contact\" style=\"color:#1A1A1A;font-weight:600;\">bylvra.shop/pages/contact</a></p>
          </div>
        </td></tr>
        <tr><td style=\"padding:20px 40px 32px;border-top:1px solid #f0f0f0;\">
          <p style=\"font-size:11px;color:#bbb;text-align:center;margin:0;line-height:1.6;\">
            BYLVRA · bylvra.shop<br>
            Order ${ORDER_NUMBER}
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

echo "$RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print('✅ Shipping email sent to ${EMAIL_TO}! ID:', d.get('id','?')) if 'id' in d else print('❌', d)"
