# 🚀 Hướng Dẫn Tự Động Build File `.ipa` & Quản Lý Kho Nhạc Qua GitHub

Chào bạn! Dự án **Doraemon Pocket Player** đã được tích hợp hoàn chỉnh:
1. **GitHub Actions**: Tự động build ra file cài đặt `.ipa` cho iOS mà không cần máy Mac.
2. **GitHub Playlist Sync**: Tự động đồng bộ bài hát, MP3 và lời bài hát từ xa qua file `playlist.json`.

---

## 📌 BƯỚC 1: Đưa Code Lên GitHub

1. Mở terminal tại thư mục dự án và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "feat: Khoi tao app Doraemon Pocket Player va GitHub Sync"
   ```

2. Tạo một Repository mới trên [GitHub.com](https://github.com/new) (chọn Public hoặc Private).

3. Đẩy code lên GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
   git push -u origin main
   ```

---

## 📌 BƯỚC 2: Tải File `.ipa` Từ GitHub Actions

1. Ngay khi bạn `git push`, vào tab **Actions** trên Repository GitHub của bạn.
2. Bạn sẽ thấy Workflow **"Build Doraemon iOS IPA"** đang chạy trên máy chủ macOS.
3. Khi workflow hoàn tất (khoảng 2 - 4 phút, hiện dấu tích xanh ✅), kéo xuống phần **Artifacts** ở dưới cùng trang và tải về file **`DoraemonPocketPlayer-IPA.zip`**. Giải nén ra sẽ có file **`DoraemonPocketPlayer.ipa`**.

---

## 📌 BƯỚC 3: Cài Đặt File `.ipa` Vào iPhone / iPad

### Cách 1: Dùng Sideloadly (Rất dễ trên máy tính Windows)
1. Tải phần mềm miễn phí **[Sideloadly](https://sideloadly.io/)** về máy tính.
2. Cắm iPhone vào máy tính bằng cáp sạc.
3. Kéo thả file `DoraemonPocketPlayer.ipa` vào Sideloadly.
4. Nhập Apple ID của bạn và bấm **Start**.
5. Trên iPhone: Vào **Cài đặt** -> **Cài đặt chung** -> **VPN & Quản lý thiết bị** -> Bấm **Tin cậy ứng dụng** là mở app nghe nhạc được ngay!

### Cách 2: Dùng TrollStore / AltStore / SideStore / Gbox / Scarlet
- Gửi file `.ipa` qua Telegram/iCloud Drive vào iPhone rồi chọn mở bằng TrollStore hoặc AltStore/SideStore để cài trực tiếp.

---

## 🎵 BƯỚC 4: Cách Thêm / Sửa Bài Hát Trên GitHub (Không Cần Build Lại App)

Đây là tính năng độc quyền giúp bạn cập nhật bài hát mới bất kỳ lúc nào:

1. Trong repository GitHub của bạn, mở file **`public/playlist.json`**.
2. Bấm nút **Edit (Hình cây bút)** và thêm bài hát mới theo cấu trúc:
   ```json
   {
     "id": "bai-hat-moi-01",
     "title": "Tên Bài Hát",
     "artist": "Tên Ca Sĩ",
     "category": "nostalgia", 
     "duration": 210,
     "src": "https://link-file-nhac-mp3-cua-ban.mp3",
     "cover": "https://link-anh-bia.jpg",
     "lyrics": [
       { "time": 0, "text": "Lời câu hát thứ nhất..." },
       { "time": 10, "text": "Lời câu hát thứ hai..." }
     ]
   }
   ```
3. Lưu (Commit) thay đổi trên GitHub.
4. Trên iPhone, mở App Doraemon -> Mở **Túi Thần Kỳ 🎒** -> Bấm nút **"Đồng Bộ GitHub 🔄"** là bài hát mới sẽ lập tức xuất hiện trong app của bạn!
