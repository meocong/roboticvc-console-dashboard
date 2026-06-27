export type FacilityStatus = "active" | "paused"

export type DeviceStatus =
  | "online"
  | "uploading"
  | "updating"
  | "offline"
  | "error"

export type CollaboratorStatus = "active" | "off"

export type VersionChannel = "stable" | "beta"
export type VersionPolicy = "manual" | "auto" | "forced"

export type VideoStatus = "uploaded" | "processing" | "ready" | "archived"
export type RolloutStatus = "pending" | "updating" | "done" | "failed"

export interface Facility {
  id: string
  name: string
  code: string
  region: string
  address: string
  contactName: string
  contactPhone: string
  status: FacilityStatus
}

export interface Collaborator {
  id: string
  name: string
  phone: string
  facilityId: string
  skills: string[]
  assignedDeviceId: string | null
  status: CollaboratorStatus
  joinedAt: string
  videosRecorded: number
  assignmentHistory: { deviceName: string; from: string; to: string | null }[]
}

export interface Device {
  id: string
  name: string
  hardwareId: string
  facilityId: string
  collaboratorId: string | null
  status: DeviceStatus
  appVersion: string
  targetVersion: string
  freeStorageGb: number
  totalStorageGb: number
  offlineQueue: number
  battery: number
  lastSeenMinutes: number
  model: string
}

export interface Version {
  id: string
  tag: string
  channel: VersionChannel
  policy: VersionPolicy
  active: boolean
  releasedAt: string
  notes: string[]
  rollout: { deviceId: string; status: RolloutStatus }[]
}

export interface VideoAsset {
  id: string
  sessionCode: string
  facilityId: string
  collaboratorId: string
  deviceId: string
  streams: ("head_cam" | "wrist_cam" | "depth")[]
  durationMin: number
  qcMinutes: number
  sizeGb: number
  status: VideoStatus
  recordedAt: string
}
