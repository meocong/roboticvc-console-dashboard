import type {
  Collaborator,
  CollaboratorStatus,
  Device,
  DeviceStatus,
  Facility,
  Version,
  VideoAsset,
  VideoStatus,
  RolloutStatus,
} from "./types"

/* ------------------------------------------------------------------ */
/* Facilities                                                          */
/* ------------------------------------------------------------------ */

export const facilities: Facility[] = [
  {
    id: "fac-hn1",
    name: "Nhà máy Bắc Thăng Long",
    code: "HN-01",
    region: "Hà Nội",
    address: "KCN Bắc Thăng Long, Đông Anh, Hà Nội",
    contactName: "Nguyễn Văn Hùng",
    contactPhone: "0901 234 567",
    status: "active",
  },
  {
    id: "fac-hcm1",
    name: "Trung tâm Logistics Tân Bình",
    code: "HCM-01",
    region: "TP. Hồ Chí Minh",
    address: "Số 12 Trường Chinh, Tân Bình, TP.HCM",
    contactName: "Trần Thị Mai",
    contactPhone: "0902 345 678",
    status: "active",
  },
  {
    id: "fac-dn1",
    name: "Kho vận Hòa Khánh",
    code: "DN-01",
    region: "Đà Nẵng",
    address: "KCN Hòa Khánh, Liên Chiểu, Đà Nẵng",
    contactName: "Lê Quang Vinh",
    contactPhone: "0903 456 789",
    status: "active",
  },
  {
    id: "fac-hcm2",
    name: "Xưởng lắp ráp Bình Dương",
    code: "BD-01",
    region: "Bình Dương",
    address: "KCN VSIP I, Thuận An, Bình Dương",
    contactName: "Phạm Văn Tâm",
    contactPhone: "0904 567 890",
    status: "active",
  },
  {
    id: "fac-hn2",
    name: "Trung tâm phân loại Long Biên",
    code: "HN-02",
    region: "Hà Nội",
    address: "Số 5 Ngọc Lâm, Long Biên, Hà Nội",
    contactName: "Đỗ Thị Lan",
    contactPhone: "0905 678 901",
    status: "paused",
  },
  {
    id: "fac-ct1",
    name: "Kho nông sản Cần Thơ",
    code: "CT-01",
    region: "Cần Thơ",
    address: "KCN Trà Nóc, Bình Thủy, Cần Thơ",
    contactName: "Võ Minh Khôi",
    contactPhone: "0906 789 012",
    status: "active",
  },
]

/* ------------------------------------------------------------------ */
/* Collaborators                                                       */
/* ------------------------------------------------------------------ */

const collaboratorNames = [
  "Nguyễn Văn An",
  "Trần Thị Bích",
  "Lê Hoàng Cường",
  "Phạm Thị Dung",
  "Hoàng Văn Đức",
  "Vũ Thị Em",
  "Đặng Văn Phong",
  "Bùi Thị Giang",
  "Ngô Văn Hải",
  "Dương Thị Hoa",
  "Lý Văn Khang",
  "Mai Thị Lan",
  "Đỗ Văn Minh",
  "Trịnh Thị Nga",
  "Phan Văn Oai",
  "Hồ Thị Phương",
  "Cao Văn Quân",
  "Đinh Thị Rạng",
  "Tô Văn Sơn",
  "Lương Thị Tâm",
]

const skillPool = [
  "Đóng gói",
  "Phân loại",
  "Lắp ráp",
  "Vận hành xe nâng",
  "Kiểm kho",
  "Bốc xếp",
  "QC",
  "Dán nhãn",
]

// Đa số đang quay; ~1/4 nghỉ.
const collabStatuses: CollaboratorStatus[] = ["active", "active", "active", "off"]

export const collaborators: Collaborator[] = collaboratorNames.map((name, i) => {
  const facility = facilities[i % facilities.length]
  const status = collabStatuses[i % collabStatuses.length]
  const skillCount = 1 + (i % 3)
  const skills = Array.from(
    { length: skillCount },
    (_, k) => skillPool[(i + k * 3) % skillPool.length],
  )
  return {
    id: `ctv-${(i + 1).toString().padStart(3, "0")}`,
    name,
    phone: `09${(10 + i).toString()} ${(100 + i * 7).toString().slice(0, 3)} ${(200 + i * 11).toString().slice(0, 3)}`,
    facilityId: facility.id,
    skills,
    assignedDeviceId: null, // wired up after devices are built
    status,
    joinedAt: new Date(2024, i % 12, 1 + (i % 27)).toISOString(),
    videosRecorded: 12 + ((i * 17) % 90),
    assignmentHistory: [],
  }
})

/* ------------------------------------------------------------------ */
/* Devices                                                             */
/* ------------------------------------------------------------------ */

const deviceStatusPlan: DeviceStatus[] = [
  "online",
  "online",
  "online",
  "uploading",
  "uploading",
  "updating",
  "offline",
  "error",
  "online",
  "online",
]

const models = ["EGOkit Pro v2", "EGOkit Pro v2", "EGOkit Lite", "EGOkit Pro v3"]

export const devices: Device[] = Array.from({ length: 30 }, (_, i) => {
  const status = deviceStatusPlan[i % deviceStatusPlan.length]
  const facility = facilities[i % facilities.length]
  const total = 256
  const free =
    status === "offline"
      ? 8 + (i % 5)
      : status === "uploading"
        ? 30 + ((i * 7) % 60)
        : 60 + ((i * 11) % 150)
  const offlineQueue =
    status === "offline"
      ? 18 + (i % 12)
      : status === "error"
        ? 9 + (i % 6)
        : (i * 3) % 4
  const lastSeen =
    status === "offline"
      ? 180 + (i % 8) * 95
      : status === "error"
        ? 22 + (i % 5) * 14
        : (i * 2) % 9
  const appVersion =
    i % 7 === 0 ? "v3.0.0-beta.2" : i % 4 === 0 ? "v2.3.1" : "v2.4.0"
  const targetVersion = status === "updating" ? "v2.4.0" : appVersion
  return {
    id: `dev-${(i + 1).toString().padStart(3, "0")}`,
    name: `EGO-${facility.code}-${(i + 1).toString().padStart(2, "0")}`,
    hardwareId: `EK${(i * 73 + 10000).toString(16).toUpperCase().padStart(6, "0")}`,
    facilityId: facility.id,
    collaboratorId: null,
    status,
    appVersion,
    targetVersion,
    freeStorageGb: free,
    totalStorageGb: total,
    offlineQueue,
    battery:
      status === "offline" ? 0 : status === "error" ? 14 + (i % 20) : 45 + ((i * 13) % 55),
    lastSeenMinutes: lastSeen,
    model: models[i % models.length],
  }
})

/* Wire collaborators <-> devices (first N online/active devices get a CTV) */
collaborators.forEach((c, i) => {
  const device = devices[i]
  if (device && device.status !== "offline" && i < devices.length) {
    device.collaboratorId = c.id
    c.assignedDeviceId = device.id
    c.assignmentHistory = [
      {
        deviceName: device.name,
        from: new Date(2024, (i % 10) + 1, 5).toISOString(),
        to: null,
      },
    ]
    if (i % 4 === 0) {
      c.assignmentHistory.push({
        deviceName: `EGO-${facilities[(i + 1) % facilities.length].code}-99`,
        from: new Date(2024, i % 6, 2).toISOString(),
        to: new Date(2024, (i % 6) + 2, 20).toISOString(),
      })
    }
  }
})

/* ------------------------------------------------------------------ */
/* Versions                                                            */
/* ------------------------------------------------------------------ */

function buildRollout(targetTag: string): Version["rollout"] {
  const statuses: RolloutStatus[] = ["done", "done", "updating", "pending", "failed"]
  return devices.map((d, i) => {
    let status: RolloutStatus
    if (d.appVersion === targetTag) status = "done"
    else if (d.status === "updating") status = "updating"
    else status = statuses[i % statuses.length]
    return { deviceId: d.id, status }
  })
}

export const versions: Version[] = [
  {
    id: "ver-240",
    tag: "v2.4.0",
    channel: "stable",
    policy: "auto",
    active: true,
    releasedAt: new Date(2025, 5, 2).toISOString(),
    notes: [
      "Cải thiện đồng bộ dữ liệu nền, giảm 30% thời gian upload",
      "Sửa lỗi mất khung hình trên camera cổ tay",
      "Bổ sung cảnh báo pin yếu qua đèn LED",
    ],
    rollout: buildRollout("v2.4.0"),
  },
  {
    id: "ver-231",
    tag: "v2.3.1",
    channel: "stable",
    policy: "manual",
    active: true,
    releasedAt: new Date(2025, 3, 18).toISOString(),
    notes: [
      "Bản vá bảo mật cho dịch vụ upload",
      "Tối ưu mức tiêu thụ pin khi ghi liên tục",
    ],
    rollout: buildRollout("v2.3.1"),
  },
  {
    id: "ver-300b",
    tag: "v3.0.0-beta.2",
    channel: "beta",
    policy: "manual",
    active: true,
    releasedAt: new Date(2025, 5, 20).toISOString(),
    notes: [
      "Thử nghiệm pipeline ghi đa luồng (head + wrist + depth)",
      "Giao diện cấu hình mới trên thiết bị",
      "Lưu ý: chỉ triển khai trên thiết bị thử nghiệm",
    ],
    rollout: buildRollout("v3.0.0-beta.2"),
  },
  {
    id: "ver-220",
    tag: "v2.2.0",
    channel: "stable",
    policy: "forced",
    active: false,
    releasedAt: new Date(2025, 1, 10).toISOString(),
    notes: ["Phiên bản nền tảng cũ", "Đã ngừng hỗ trợ, bắt buộc nâng cấp"],
    rollout: buildRollout("v2.2.0"),
  },
]

/* ------------------------------------------------------------------ */
/* Video assets                                                        */
/* ------------------------------------------------------------------ */

const videoStatusPlan: VideoStatus[] = [
  "ready",
  "ready",
  "processing",
  "uploaded",
  "ready",
  "archived",
  "processing",
  "ready",
]

export const videoAssets: VideoAsset[] = Array.from({ length: 52 }, (_, i) => {
  const device = devices[i % devices.length]
  const collaborator =
    collaborators.find((c) => c.id === device.collaboratorId) ??
    collaborators[i % collaborators.length]
  const status = videoStatusPlan[i % videoStatusPlan.length]
  const hasWrist = i % 2 === 0
  const hasDepth = i % 5 === 0
  const streams: VideoAsset["streams"] = ["head_cam"]
  if (hasWrist) streams.push("wrist_cam")
  if (hasDepth) streams.push("depth")
  const duration = 18 + ((i * 13) % 95)
  // Giờ QC ~ 30-55% thời lượng quay (video chưa xử lý xong thì chưa QC).
  const qcMinutes =
    status === "uploaded" || status === "processing"
      ? 0
      : Math.round(duration * (0.3 + ((i * 5) % 25) / 100))
  const dayOffset = i % 28
  return {
    id: `vid-${(i + 1).toString().padStart(3, "0")}`,
    sessionCode: `SES-${device.facilityId.replace("fac-", "").toUpperCase()}-${(2400 + i).toString()}`,
    facilityId: device.facilityId,
    collaboratorId: collaborator.id,
    deviceId: device.id,
    streams,
    durationMin: duration,
    qcMinutes,
    sizeGb: Number((duration * 0.18 * streams.length).toFixed(1)),
    status,
    recordedAt: new Date(2025, 5, 27 - Math.floor(dayOffset), 8 + (i % 9), (i * 7) % 60).toISOString(),
  }
})

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

export const facilityById = (id: string) => facilities.find((f) => f.id === id)
export const collaboratorById = (id: string | null) =>
  id ? collaborators.find((c) => c.id === id) : undefined
export const deviceById = (id: string | null) =>
  id ? devices.find((d) => d.id === id) : undefined
export const versionByTag = (tag: string) => versions.find((v) => v.tag === tag)

export const facilityName = (id: string) => facilityById(id)?.name ?? "—"
export const collaboratorName = (id: string | null) =>
  collaboratorById(id)?.name ?? "Chưa gán"
export const deviceName = (id: string | null) => deviceById(id)?.name ?? "Chưa gán"

/* ------------------------------------------------------------------ */
/* Aggregate stats                                                     */
/* ------------------------------------------------------------------ */

export function deviceStatusCounts() {
  return devices.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1
      return acc
    },
    {} as Record<DeviceStatus, number>,
  )
}

export function videoStatusCounts() {
  return videoAssets.reduce(
    (acc, v) => {
      acc[v.status] = (acc[v.status] ?? 0) + 1
      return acc
    },
    {} as Record<VideoStatus, number>,
  )
}

export function devicesByFacilityChart() {
  return facilities.map((f) => ({
    name: f.code,
    fullName: f.name,
    "thiết bị": devices.filter((d) => d.facilityId === f.id).length,
  }))
}

export function uploadTrendChart() {
  // 30-day synthetic upload volume (GB)
  return Array.from({ length: 30 }, (_, i) => {
    const base = 40 + Math.round(25 * Math.sin(i / 3.2))
    const noise = ((i * 37) % 23) - 6
    const day = new Date(2025, 5, 28 - (29 - i))
    return {
      ngày: day.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
      "GB": Math.max(8, base + noise),
    }
  })
}

export const totalGcsUsedTb = Number(
  (videoAssets.reduce((s, v) => s + v.sizeGb, 0) / 1024 + 4.2).toFixed(2),
)
export const pendingVideoCount = videoAssets.filter(
  (v) => v.status === "uploaded" || v.status === "processing",
).length

/* ------------------------------------------------------------------ */
/* Hours / per-entity stats                                            */
/* ------------------------------------------------------------------ */

export const totalRecordedHours = Math.round(
  videoAssets.reduce((s, v) => s + v.durationMin, 0) / 60,
)
export const totalQcHours = Math.round(
  videoAssets.reduce((s, v) => s + v.qcMinutes, 0) / 60,
)

export function collaboratorStats(id: string) {
  const vids = videoAssets.filter((v) => v.collaboratorId === id)
  const recordedMin = vids.reduce((s, v) => s + v.durationMin, 0)
  const qcMin = vids.reduce((s, v) => s + v.qcMinutes, 0)
  return {
    videos: vids.length,
    recordedHours: Math.round((recordedMin / 60) * 10) / 10,
    qcHours: Math.round((qcMin / 60) * 10) / 10,
    recordedMin,
    qcMin,
  }
}

export function facilityStats(id: string) {
  const facDevices = devices.filter((d) => d.facilityId === id)
  const facCollabs = collaborators.filter((c) => c.facilityId === id)
  const facVideos = videoAssets.filter((v) => v.facilityId === id)
  return {
    devices: facDevices,
    collaborators: facCollabs,
    videos: facVideos,
    online: facDevices.filter((d) => d.status === "online" || d.status === "uploading").length,
    issues: facDevices.filter((d) => d.status === "error" || d.status === "offline").length,
    usedGb: facVideos.reduce((s, v) => s + v.sizeGb, 0),
    recordedHours: Math.round(facVideos.reduce((s, v) => s + v.durationMin, 0) / 60),
  }
}

/** Top CTV theo giờ quay (cho dashboard). */
export function topCollaboratorsByHours(limit = 5) {
  return collaborators
    .map((c) => ({ collaborator: c, ...collaboratorStats(c.id) }))
    .sort((a, b) => b.recordedMin - a.recordedMin)
    .slice(0, limit)
}
