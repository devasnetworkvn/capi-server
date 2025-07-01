# Meta CAPI Gateway (Tự lưu trữ)

## Giới thiệu
Đây là server trung gian giúp gửi dữ liệu từ LadiPage hoặc bất kỳ client nào về Facebook qua Meta Conversion API.

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` từ mẫu `.env.example`:

```env
PIXEL_ID=your_pixel_id
ACCESS_TOKEN=your_access_token
```

## Chạy server

```bash
node index.js
```

## Đường dẫn nhận request:

POST `/capi`

Payload JSON chứa:
```json
{
  "event_name": "Purchase",
  "user_data": {
    "em": "hashed_email",
    "ph": "hashed_phone"
  },
  "custom_data": {
    "value": 99.9,
    "currency": "USD"
  }
}
```
