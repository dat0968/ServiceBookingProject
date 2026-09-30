# Service Booking Management System

Hệ thống quản lý đặt lịch dịch vụ (full-stack): khách hàng đặt lịch theo dịch vụ và thời gian; admin quản lý dịch vụ, nhân viên, lịch làm việc và booking.

---
## 1. Tài khoản demo
Admin -> email: admin@demo.com - padsword: admin@123
Customer -> email: customer1@demo.com - password: customer@123

## 2. Tổng quan

Project giải quyết bài toán đặt lịch sử dụng dịch vụ: Customer tạo / xem / hủy booking của mình; Admin quản lý danh mục và xử lý trạng thái booking.

### Vai trò trong source

| Vai trò | Mô tả (theo code) |
|---|---|
| **Customer** | Đăng nhập, xem dịch vụ, tạo booking, xem/lọc/hủy booking của mình. |
| **Admin** | Quản lý dịch vụ, nhân viên, lịch làm việc, danh sách toàn bộ booking; xác nhận / hoàn thành / hủy; gợi ý nhân viên khi đổi trạng thái. |

Role hợp lệ khi tạo/cập nhật user: `Admin`, `Customer`

### Chức năng đã hoàn thành

- Đăng nhập JWT, gắn cookie HttpOnly `accessToken`; đăng xuất; `GET /api/auth/me`; `GET /api/auth/validate`.
- CRUD + khóa/mở dịch vụ (Admin); danh sách dịch vụ có search theo tên và phân trang tại database.
- CRUD + khóa/mở nhân viên; tìm nhân viên theo tên/email.
- CRUD lịch làm việc (Admin): `StartTime` phải nhỏ hơn `EndTime`; chống trùng ca cùng nhân viên cùng ngày.
- Customer tạo booking: backend tính `EndTime = StartTime + DurationMinutes`; từ chối dịch vụ bị khóa; từ chối đặt trong quá khứ; sinh `BookingCode` unique; trạng thái ban đầu `Pending`.
- Customer xem booking của mình (lọc ngày, trạng thái, phân trang); chỉ xem/hủy booking thuộc về mình.
- Admin xem toàn bộ booking (lọc ngày, trạng thái, phân trang); `PATCH` trạng thái `Confirmed` / `Completed`; gán `StaffId` khi cập nhật trạng thái;
- Hủy booking: bắt buộc lý do; không hủy `Cancelled` / `Completed`; không hủy `Confirmed` (code coi Confirmed là “đã bắt đầu”);
- Swagger UI khi `ASPNETCORE_ENVIRONMENT=Development`.
- Màn hình: `/`, `/login`, `/services`, `/booking`, `/my-bookings`, `/admin/services`, `/admin/schedules`, `/admin/bookings`, `/admin/staffs`.
- Xử lý exception tập trung (`GlobalExceptionHandler`).

### Chức năng / hạng mục chưa hoàn thành (đối chiếu đề bài)

- **Mục 12 đề bài (phần cộng điểm) — chưa làm:** unit/integration test; Docker Compose; SignalR; Hangfire; xử lý hai request đặt cùng khung giờ; giao diện lịch trực quan. Trang lịch làm việc Admin là **bảng**, không phải calendar.

## 3. Công nghệ sử dụng

### Backend (`APIBookingServiceProject`)

- ASP.NET Core Web API, **.NET 8** (`net8.0`)
- Entity Framework Core 8 + SQL Server
- JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer` 8.0.31)
- ASP.NET Identity `PasswordHasher<User>` (hash mật khẩu, không dùng Identity UI / IdentityDbContext đầy đủ)
- Swashbuckle (Swagger)
- CORS policy `AllowMyFrontend`

### Frontend (`fe-booking-service-project`)

- Next.js **16.3.6** (App Router), React **19.2.8**, TypeScript
- Axios (`withCredentials: true`)
- Bootstrap 5 + react-bootstrap
- Tailwind CSS 4 (có trong `package.json` / PostCSS; UI chính dùng Bootstrap)

---

## 4. Kiến trúc project

```
Browser  →  Next.js (App Router, hooks, Axios)
                │  HTTPS + cookie `accessToken` (withCredentials)
                ▼
         ASP.NET Core Controllers
                │
                ▼
         Manager (business)  →  Repository (EF Core, async)  →  SQL Server
```

- Frontend không chứa connection string. Base URL API hard-code trong `fe-booking-service-project/services/api.ts`: `https://localhost:7204/api`.
- Backend đọc JWT từ cookie `accessToken` (`JwtBearerEvents.OnMessageReceived`). `validateToken` phía Next còn gửi header `Authorization: Bearer {token}`.
- Controller mỏng; logic nằm ở `*Manager`; truy cập DB qua `*Repository`.

---

## 5. Cấu trúc thư mục

```text
ServiceBookingProject/
├── APIBookingServiceProject/
│   └── APIBookingServiceProject/
│       ├── Controllers/          # Auth, Booking, MyService, Staff, WorkSchedule, User
│       ├── Data/                 # ServiceBookingDbContext
│       ├── DTOs/                 # Request/response/query theo domain
│       ├── Exceptions/           # Exception + GlobalExceptionHandler
│       ├── Helper/               # Validation, map DTO
│       ├── Models/               # User, MyService, Staff, WorkSchedule, Booking
│       ├── Repositories/         # User, Service, Employee, WorkSchedule, Booking
│       ├── Services/             # *Manager (User, MyService, Employee, WorkSchedule, Booking)
│       ├── Properties/launchSettings.json
│       ├── Program.cs
│       └── appsettings.json
└── fe-booking-service-project/
    ├── app/
    │   ├── login/
    │   ├── (customer)/           # services, booking, my-bookings
    │   ├── admin/                # services, schedules, bookings, staffs
    │   └── actions/auth.ts
    ├── components/
    ├── hooks/
    ├── services/                 # Axios API clients
    ├── types/
    ├── helper/
    └── proxy.ts                  # bảo vệ /admin và /login (Next.js proxy)
```

---

## 6. Chức năng chính

| Đường dẫn | Nội dung trong code |
|---|---|
| `/` | Landing: giới thiệu + link dịch vụ / đặt lịch |
| `/login` | Form email/password, validation HTML, hiển thị lỗi, disable khi submit |
| `/services` | Danh sách dịch vụ (phân trang/search qua hook) |
| `/booking` | Form dịch vụ + ngày + giờ + ghi chú → `POST /bookings` |
| `/my-bookings` | Lịch Customer: lọc, phân trang, hủy kèm lý do |
| `/admin/services` | Quản lý dịch vụ |
| `/admin/staffs` | Quản lý nhân viên |
| `/admin/schedules` | Quản lý lịch làm việc (bảng) |
| `/admin/bookings` | Quản lý booking, đổi trạng thái, gợi ý staff, hủy |

## 7. API

Authentication: cookie HttpOnly `accessToken` (và/hoặc Bearer). Cột dưới ghi đúng attribute trên action/controller.

### Auth — `/api/auth`

| Method | Endpoint | Mô tả | Authentication |
|---|---|---|---|
| POST | `/api/auth/login` | Đăng nhập, set cookie, trả **User**| `[AllowAnonymous]` |
| GET | `/api/auth/validate` | Kiểm tra token còn hợp lệ | `[Authorize]` |
| POST | `/api/auth/logout` | Xóa cookie `accessToken` | Không gắn `[Authorize]` |
| GET | `/api/auth/me` | User hiện tại theo claim `NameIdentifier` | `[Authorize]` |

### Dịch vụ — `/api/MyService`

| Method | Endpoint | Mô tả | Authentication |
|---|---|---|---|
| POST | `/api/MyService` | Tạo dịch vụ | `[Authorize(Roles = "Admin")]` |
| GET | `/api/MyService` | Danh sách, query `Search`, `Page`, `PageSize` | Không |
| GET | `/api/MyService/{id}` | Chi tiết | Không |
| PUT | `/api/MyService/{id}` | Cập nhật | `[Authorize(Roles = "Admin")]` |
| PATCH | `/api/MyService/{id}/status` | Đổi `isActive` (query `isActive`) | `[Authorize(Roles = "Admin")]` |

### Nhân viên — `/api/Staff`

| Method | Endpoint | Mô tả | Authentication |
|---|---|---|---|
| POST | `/api/Staff` | Tạo nhân viên | `[Authorize(Roles = "Admin")]` |
| GET | `/api/Staff` | Danh sách, query `search` | `[Authorize(Roles = "Admin")] |
| GET | `/api/Staff/{id}` | Chi tiết | `[Authorize(Roles = "Admin")] |
| PUT | `/api/Staff/{id}` | Cập nhật | `[Authorize(Roles = "Admin")] |
| PATCH | `/api/Staff/{id}/status` | Đổi `isActive` (query `isActive`) | `[Authorize(Roles = "Admin")] |

### Lịch làm việc — `/api/WorkSchedule`

Controller gắn `[Authorize(Roles = "Admin")]`.

| Method | Endpoint | Mô tả | Authentication |
|---|---|---|---|
| GET | `/api/WorkSchedule` | Tất cả lịch | Admin |
| GET | `/api/WorkSchedule/{id}` | Chi tiết | Admin |
| POST | `/api/WorkSchedule` | Tạo ca | Admin |
| PUT | `/api/WorkSchedule/{id}` | Cập nhật | Admin |
| DELETE | `/api/WorkSchedule/{id}` | Xóa (`204`) | Admin |

### User — `/api/User`

| Method | Endpoint | Mô tả | Authentication |
|---|---|---|---|
| GET | `/api/User` | Query `Search`, `Page`, `PageSize` | `[Authorize(Roles = "Admin")] |
| GET | `/api/User/{id}` | Chi tiết | `[Authorize(Roles = "Admin")] |
| POST | `/api/User` | Tạo user | `[Authorize(Roles = "Admin")] |
| PUT | `/api/User/{id}` | Cập nhật (`password` tùy chọn) | `[Authorize(Roles = "Admin")] |


### Booking — `/api/bookings`

| Method | Endpoint | Mô tả | Authentication |
|---|---|---|---|
| GET | `/api/bookings/my-bookings` | Booking của customer; query `Date`, `Status`, `Page`, `PageSize` | `[Authorize(Roles = "Customer")]` |
| GET | `/api/bookings` | Tất cả booking; cùng query | `[Authorize(Roles = "Admin")]` |
| GET | `/api/bookings/available-slots` | Slot trống; query `StaffId`, `ServiceId`, `Date` | Không `[Authorize]` |
| GET | `/api/bookings/{id}` | Chi tiết; Customer chỉ xem của mình | Không `[Authorize]` trên action; kiểm tra trong manager |
| POST | `/api/bookings` | Tạo booking | `[Authorize(Roles = "Customer,Admin")]` |
| PATCH | `/api/bookings/{id}/status` | `Confirmed` / `Completed`; gán `staffId` | `[Authorize(Roles = "Admin")]` |
| POST | `/api/bookings/{id}/cancel` | Hủy | `[Authorize(Roles = "Customer,Admin")]` |
| GET | `/api/bookings/{id}/suggested-staff` | Staff rảnh theo lịch + không overlap | `[Authorize(Roles = "Admin")]` |

## 8. Database

- Provider: **SQL Server** (`UseSqlServer`).
- Catalog trong `appsettings.json`: **`ServiceBookingDb`**.
- Runtime: `Program.cs` đọc `ConnectionStrings:DefaultConnection`.
- `ServiceBookingDbContext.OnConfiguring` còn chuỗi kết nối hard-code (thiết kế/scaffold). Nên đưa hết credential ra User Secrets / `appsettings` local, **không commit**.

## 9. Authentication & Authorization

### Login

- Endpoint: `POST /api/auth/login`.
- Verify: `PasswordHasher<User>.VerifyHashedPassword`.
- Sai email/mật khẩu: `UnauthorizedException` → **401**.
- Response HTTP: **chỉ `UserResponseDto`** (`Ok(result.User)`)

### JWT

- Ký HMAC-SHA256, key `Jwt:Key`.
- `ValidateIssuer = false`, `ValidateAudience = false`, `ValidateLifetime = true`.
- Hết hạn: `Jwt:ExpiresInMinutes` (parse được thì dùng; không thì **120** phút). Cookie `MaxAge` = 2 giờ.

### Claims

- `ClaimTypes.NameIdentifier` = `User.Id`
- `ClaimTypes.Email`
- `ClaimTypes.Name` = `FullName`
- `ClaimTypes.Role` = `User.Role`

### Cookie / storage

- Tên cookie: **`accessToken`**.
- `HttpOnly = true`, `Secure = true`, `SameSite = None`, `Path = /`.
- Axios: `withCredentials: true`.
- Interceptor: HTTP 401 → redirect `/login?returnUrl=...`.

## 10. Exception Handling

`IExceptionHandler`: `GlobalExceptionHandler` (`Program.cs`: `AddExceptionHandler` + `UseExceptionHandler`). Response JSON: `{ statusCode, message }`.

| Exception | HTTP |
|---|---|
| `BadRequestException` | 400 |
| `UnauthorizedException` | 401 |
| `ForbiddenException` | 403 |
| `NotFoundException` | 404 |
| `ConflictException` | 409 |
| Khác | 500 |

JWT middleware thất bại (token thiếu/hết hạn) trả 401 theo pipeline authentication, không đi qua switch exception ở trên.

---

## 11. Pagination / Search

Phân trang **`Skip` / `Take` trên `IQueryable`** (database), không load hết rồi cắt:

- Dịch vụ: `MyServiceRepository.GetAllAsync` + `CountAsync`; search `NameService.Contains`.
- Booking: `BookingRepository.GetPagedAsync` + `CountAsync`; lọc `Date` (theo `StartTime` trong ngày), `Status`, optional `customerId`.
- User: `UserRepository`; search `Email` hoặc `FullName`.

Mặc định `Page = 1`, `PageSize = 10` trên query DTO. User/Booking manager chuẩn hóa `Page`/`PageSize` &lt; 1.

Staff: search `FullName`/`Email`, **không** Skip/Take. WorkSchedule: **không** phân trang.

---

## 12. Cấu hình Backend

Project đã có `UserSecretsId` trong `.csproj`. Key runtime thực tế: `ConnectionStrings:DefaultConnection`, `Jwt:Key`, `Jwt:ExpiresInMinutes`.

### Cách 1 — `appsettings.json`

Chỉ dùng placeholder; không commit secret thật.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING"
  },
  "Jwt": {
    "Key": "YOUR_JWT_SECRET",
    "ExpiresInMinutes": "120"
  }
}
```

Chuỗi SQL Server cần trỏ catalog phù hợp (trong file mẫu: `Initial Catalog=ServiceBookingDb`). Thư viện JWT yêu cầu key đủ dài cho HMAC-SHA256.

### Cách 2 — .NET User Secrets (nên dùng local)

User Secrets phù hợp development, tránh commit secret vào Git.

Nếu chưa init (project hiện đã có `UserSecretsId`):

```bash
dotnet user-secrets init
```

Từ thư mục `APIBookingServiceProject/APIBookingServiceProject`:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "YOUR_CONNECTION_STRING"
dotnet user-secrets set "Jwt:Key" "YOUR_JWT_SECRET"
dotnet user-secrets set "Jwt:ExpiresInMinutes" "120"
```

---

## 13. Cấu hình Frontend / Local Development

API client: Axios, `baseURL` = `https://localhost:7204/api`, HTTPS local (certificate dev của .NET). CORS backend cho `http://localhost:3000` và `http://localhost:4200` kèm `AllowCredentials`.

### Khắc phục lỗi SSL `DEPTH_ZERO_SELF_SIGNED_CERT`

Node.js có thể từ chối self-signed certificate khi Next/`proxy.ts` gọi backend HTTPS.

Local: biến môi trường `NODE_TLS_REJECT_UNAUTHORIZED=0`.

**Windows**

1. Mở Windows Search → `Environment Variables`.
2. **Edit the system environment variables** → **Environment Variables...**.
3. **User variables** → **New...**.
4. Name: `NODE_TLS_REJECT_UNAUTHORIZED` — Value: `0`.
5. OK, đóng rồi mở lại VS Code/Terminal.

**macOS / Linux** — `~/.zshrc` hoặc `~/.bashrc`:

```bash
export NODE_TLS_REJECT_UNAUTHORIZED="0"
source ~/.zshrc
```

### Cảnh báo bảo mật

`NODE_TLS_REJECT_UNAUTHORIZED=0` **chỉ cho Local Development**. Không dùng Production/Staging: cấu hình này tắt kiểm tra TLS của Node.js. Production cần certificate hợp lệ/trusted.

---

## 14. Cách chạy project

Thứ tự: **SQL Server sẵn sàng** → **Backend** → **Frontend**.

Yêu cầu: .NET 8 SDK, Node.js (phiên bản chạy được Next 16), SQL Server.

### Backend

```bash
cd APIBookingServiceProject/APIBookingServiceProject
dotnet restore
dotnet run --launch-profile https
```

Theo `launchSettings.json` profile **https**:

- HTTPS: `https://localhost:7204`
- HTTP: `http://localhost:5227`
- Swagger (Development): `https://localhost:7204/swagger`

Profile **http**: chỉ `http://localhost:5227` (frontend đang trỏ HTTPS 7204).

### Frontend

```bash
cd fe-booking-service-project
npm install
npm run dev
```

- Dev server Next mặc định: **`http://localhost:3000`** (`package.json` script `next dev`; README create-next-app cũng ghi cổng này).
- API base URL: `fe-booking-service-project/services/api.ts` (`https://localhost:7204/api`). Đổi backend URL thì sửa file này (không có `.env` API URL trong source).

---

## 15. Security Notes

- Không commit password, JWT secret, connection string có credential.
- Local: dùng **.NET User Secrets**.
- `appsettings.json` trong repo đang chứa placeholder; không thay bằng secret thật rồi commit.
- `StaffController` / `UserController` không `[Authorize]` — không expose API này ra internet mà không bổ sung bảo vệ.
- `NODE_TLS_REJECT_UNAUTHORIZED=0` chỉ local.
- JWT không validate issuer/audience.

---

## Ghi chú bàn giao

- Swagger: bật khi Development (`UseSwagger` / `UseSwaggerUI`).
- Không có Docker, không có test project, không có SignalR/Hangfire.
- CORS: `http://localhost:3000`, `http://localhost:4200`.
