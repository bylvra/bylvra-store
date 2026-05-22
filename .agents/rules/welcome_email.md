# Welcome Email Automation

When triggered by a new NewsletterSubscriber record (automation: "Welcome Email — New Subscriber"):

1. Get the subscriber's email from `data.email`
2. Get their first_name from `data.first_name` (fallback: "there")
3. Use Gmail connector to send welcome email
4. Mark `discount_sent: true` on their record via update_entities

## Email template

**Subject:** Your 15% off code is here — welcome to BYLVRA

**Body (HTML):**
- BYLVRA header (minimal, dark)
- "Hi [first_name],"
- Welcome message — clinical, warm, not fluffy
- Discount code: WELCOME15 (large, prominent)
- CTA button: Shop Now → bylvra.shop
- Footer with unsubscribe note

## Gmail send method

Use the Gmail API with a properly encoded MIME message:
- To: subscriber email
- From: BYLVRA <contactbylvra@gmail.com>
- Subject: RFC 2047 encoded if needed
- Content-Type: text/html; charset=utf-8
- Body: base64url encoded HTML

Access token via: get_connector_token("gmail") → $GMAIL_ACCESS_TOKEN
