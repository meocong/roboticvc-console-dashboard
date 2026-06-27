export type StatusTone = "success" | "info" | "warning" | "neutral" | "danger"

interface StatusMeta {
  label: string
  tone: StatusTone
}

export const deviceStatusMeta: Record<string, StatusMeta> = {
  online: { label: "Trực tuyến", tone: "success" },
  uploading: { label: "Đang upload", tone: "info" },
  updating: { label: "Đang cập nhật", tone: "info" },
  offline: { label: "Ngoại tuyến", tone: "neutral" },
  error: { label: "Lỗi", tone: "danger" },
}

export const facilityStatusMeta: Record<string, StatusMeta> = {
  active: { label: "Hoạt động", tone: "success" },
  paused: { label: "Tạm dừng", tone: "neutral" },
}

export const collaboratorStatusMeta: Record<string, StatusMeta> = {
  active: { label: "Đang quay", tone: "success" },
  off: { label: "Nghỉ", tone: "neutral" },
}

export const videoStatusMeta: Record<string, StatusMeta> = {
  uploaded: { label: "Đã tải lên", tone: "info" },
  processing: { label: "Đang xử lý", tone: "info" },
  ready: { label: "Sẵn sàng", tone: "success" },
  archived: { label: "Lưu trữ", tone: "neutral" },
}

export const rolloutStatusMeta: Record<string, StatusMeta> = {
  done: { label: "Hoàn tất", tone: "success" },
  updating: { label: "Đang cập nhật", tone: "info" },
  pending: { label: "Chờ", tone: "warning" },
  failed: { label: "Thất bại", tone: "danger" },
}

export const channelMeta: Record<string, StatusMeta> = {
  stable: { label: "Ổn định", tone: "success" },
  beta: { label: "Beta", tone: "warning" },
}

export const policyMeta: Record<string, StatusMeta> = {
  manual: { label: "Thủ công", tone: "warning" },
  auto: { label: "Tự động", tone: "info" },
  forced: { label: "Bắt buộc", tone: "danger" },
}

export const streamLabels: Record<string, string> = {
  head_cam: "Head Cam",
  wrist_cam: "Wrist Cam",
  depth: "Depth",
}
