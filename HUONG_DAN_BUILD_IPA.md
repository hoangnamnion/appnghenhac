# 🚀 Hướng Dẫn Tự Động Build `.ipa` (iOS) & `.apk` (Android) Qua GitHub

Chào bạn! Workflow GitHub Actions đã được nâng cấp theo chuẩn tối ưu nhất:
* Tự động xuất file **`Doraemon-iOS-IPA`** (cho iPhone / iPad).
* Tự động xuất file **`Doraemon-Android-APK`** (cho máy Android).
* Tự động đồng bộ bài hát, lời bài hát từ xa qua **`public/playlist.json`**.

---

## 📌 BƯỚC 1: Đẩy Code Lên GitHub

Chạy 3 lệnh sau tại terminal:
```bash
git add .
git commit -m "feat: Nang cap workflow build ca IPA iOS va APK Android"
git push
```

---

## 📌 BƯỚC 2: Tải File `.ipa` & `.apk` Từ Tab Actions

1. Mở Repository của bạn trên GitHub -> Bấm vào tab **Actions**.
2. Chọn lần chạy mới nhất của workflow **"Build iOS IPA & Android APK"**.
3. Khi workflow chạy xong (dấu tích xanh ✅), kéo xuống mục **Artifacts** để tải:
   - 🍏 **`Doraemon-iOS-IPA`**: Chứa file `DoraemonPocketPlayer.ipa` để cài vào iPhone (dùng Sideloadly / TrollStore / AltStore).
   - 🤖 **`Doraemon-Android-APK`**: Chứa file `app-debug.apk` để cài trực tiếp vào điện thoại Android.

---

## 🎵 BƯỚC 3: Cập Nhật Bài Hát Trên GitHub (Không Cần Build Lại App)

1. Mở file **`public/playlist.json`** trên GitHub và sửa/thêm bài hát:
   ```json
   {
     "id": "bai-hat-moi",
     "title": "Tên Bài Hát",
     "artist": "Tên Ca Sĩ",
     "category": "nostalgia",
     "duration": 210,
     "src": "https://link-file-mp3.mp3",
     "cover": "https://link-anh-bia.jpg",
     "lyrics": [
       { "time": 0, "text": "Lời bài hát câu 1..." }
     ]
   }
   ```
2. Lưu lại trên GitHub.
3. Mở App trên điện thoại -> Vào **Túi Thần Kỳ 🎒** -> Bấm nút **"Đồng Bộ GitHub 🔄"** là có bài mới ngay lập tức!
