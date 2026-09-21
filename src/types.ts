export type UserRole = "PLAYER" | "COACH" | "SCOUT" | "SCHOLARSHIP_PROVIDER" | "ADMIN";

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  email?: string;
  role: UserRole;
  country?: string;
  countryCode?: string;
  accessId?: string;
  status?: string;
  createdAt?: any;
  lastLoginAt?: any;
}

export interface PlayerPublicProfile {
  id: string;
  userId: string;
  name: string;
  country: string;
  countryCode: string;
  age: number;
  position: "Goalkeeper" | "Defender" | "Midfielder" | "Winger" | "Striker" | string;
  secondaryPosition?: string;
  preferredFoot: "Right" | "Left" | "Both" | string;
  location?: string;
  bio?: string;
  skills: {
    ballControl: number;
    passing: number;
    shooting: number;
    dribbling: number;
    tackling: number;
    vision: number;
    overall: number;
  };
  athleticism: {
    pace: number;
    stamina: number;
    agility: number;
    strength: number;
    jumping: number;
    overall: number;
  };
  developmentLevel: "Academy" | "Youth Elite" | "Pre-Pro" | "First Team Ready" | string;
  developmentProgress: number; // 0-100
  discoverable: boolean;
  profileStatus: "APPROVED" | "PENDING" | "DRAFT" | string;
  approvedShowcaseCount?: number;
}

export interface ShowcaseVideo {
  id: string;
  playerId: string;
  playerName: string;
  playerPosition?: string;
  playerCountry?: string;
  title: string;
  videoUrl: string;
  description?: string;
  matchInfo?: {
    competition?: string;
    opponent?: string;
    matchDate?: string;
    minute?: string;
  };
  status: "APPROVED" | "PENDING" | "REJECTED";
  createdAt?: any;
}

export interface ShortlistItem {
  id: string;
  scoutId: string;
  playerId: string;
  playerName?: string;
  playerPosition?: string;
  playerCountry?: string;
  playerAge?: number;
  playerProgress?: number;
  notes: string;
  createdAt: any;
  updatedAt?: any;
}

export type ContactRequestStatus = "PENDING" | "ACCEPTED" | "DECLINED" | "CLOSED";

export interface ContactRequest {
  id: string;
  senderId?: string;
  senderName?: string;
  senderRole?: "SCOUT" | "SCHOLARSHIP_PROVIDER" | string;
  senderOrganization?: string;
  targetPlayerId?: string;
  targetPlayerName?: string;
  targetPlayerPosition?: string;
  targetPlayerCountry?: string;
  playerPosition?: string;
  playerCountry?: string;
  subject?: string;
  message: string;
  status: ContactRequestStatus;
  conversationId?: string;
  declineReason?: string;
  createdAt: any;
  updatedAt?: any;
  // Legacy aliases for existing scout modules
  scoutId?: string;
  scoutName?: string;
  scoutOrganization?: string;
  playerId?: string;
  playerName?: string;
}

export interface ScoutProfileData {
  userId: string;
  name: string;
  organization: string;
  country: string;
  verificationStatus: "VERIFIED" | "PENDING_VERIFICATION" | "PENDING" | "REJECTED";
  licenseNumber?: string;
  scoutingLicense?: string;
  specialization?: string;
  bio?: string;
  preferredAgeGroups?: string[];
  scoutingRegions?: string[];
  contactEmail?: string;
  phone?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ScoutNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "CONTACT_REQUEST" | "TALENT_ALERT" | "SHOWCASE" | "MESSAGE" | "ANNOUNCEMENT" | "GLOBAL" | "NEW_SHOWCASE" | "PLAYER_MILESTONE" | "CONTACT_ACCEPTED" | "CONTACT_DECLINED";
  read: boolean;
  link?: string;
  createdAt: any;
}

export type ConversationType = 
  | "PLAYER_COACH" 
  | "PLAYER_ADMIN" 
  | "PLAYER_SCOUT" 
  | "PLAYER_PROVIDER" 
  | "COACH_ADMIN"
  | "GENERAL";

export type ConversationStatus = "ACTIVE" | "BLOCKED" | "ARCHIVED" | "CLOSED";

export interface ConversationParticipant {
  uid: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  country?: string;
  organization?: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: {
    [uid: string]: ConversationParticipant;
  };
  type: ConversationType;
  contactRequestId?: string;
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    hasImage?: boolean;
    createdAt: any;
  };
  unreadCounts: {
    [uid: string]: number;
  };
  status: ConversationStatus;
  blockedBy?: string;
  blockedReason?: string;
  createdAt: any;
  updatedAt: any;
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string;
  senderName?: string;
  senderRole?: UserRole;
  receiverId?: string;
  receiverName?: string;
  text: string;
  imageUrl?: string;
  imageName?: string;
  read: boolean;
  readBy?: string[];
  createdAt: any;
  status?: "SENDING" | "SENT" | "DELIVERED" | "READ";
}

export type NotificationType = 
  | "NEW_MESSAGE"
  | "CONTACT_REQUEST"
  | "CONTACT_REQUEST_ACCEPTED"
  | "CONTACT_REQUEST_DECLINED"
  | "TRAINING_ASSIGNMENT"
  | "COURSE_UPDATE"
  | "SHOWCASE_STATUS"
  | "SCHOLARSHIP_UPDATE"
  | "ADMIN_ANNOUNCEMENT"
  | "TALENT_ALERT"
  | "GLOBAL";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  conversationId?: string;
  contactRequestId?: string;
  metadata?: Record<string, any>;
  createdAt: any;
}

export interface ConversationReport {
  id: string;
  conversationId: string;
  reporterId: string;
  reporterName: string;
  reporterRole: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  notes?: string;
  status: "PENDING_REVIEW" | "RESOLVED" | "DISMISSED";
  createdAt: any;
  resolvedAt?: any;
  resolvedBy?: string;
}

export type ScholarshipStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";

export interface Scholarship {
  id: string;
  providerId: string;
  providerName?: string;
  organizationName: string;
  title: string;
  description: string;
  country: string;
  location: string;
  ageRequirements: string;
  minAge?: number;
  maxAge?: number;
  eligiblePositions: string[];
  playerRequirements: string;
  benefits: string[];
  applicationDeadline: string;
  availablePlaces: number;
  applicationInstructions: string;
  status: ScholarshipStatus;
  applicationsCount?: number;
  createdAt: any;
  updatedAt?: any;
}

export type ApplicationStatus = "SUBMITTED" | "UNDER_REVIEW" | "SHORTLISTED" | "ACCEPTED" | "REJECTED";

export interface ScholarshipApplication {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  providerId: string;
  playerId: string;
  playerName: string;
  playerCountry: string;
  playerCountryCode?: string;
  playerAge: number;
  playerPosition: string;
  playerPreferredFoot?: string;
  playerDevelopmentLevel?: string;
  playerBio?: string;
  personalStatement?: string;
  guardianConsent?: boolean;
  academicGrade?: string;
  videoShowcaseUrl?: string;
  status: ApplicationStatus;
  providerNotes?: string;
  appliedAt: any;
  updatedAt?: any;
}

export interface ProviderProfile {
  userId: string;
  organizationName: string;
  logoUrl?: string;
  country: string;
  location?: string;
  description: string;
  website?: string;
  contactEmail: string;
  phone?: string;
  accreditationNumber?: string;
  verificationStatus: "VERIFIED" | "PENDING_VERIFICATION" | "REJECTED";
  verificationDocumentUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ProviderShortlist {
  id: string;
  providerId: string;
  playerId: string;
  playerName: string;
  playerCountry: string;
  playerCountryCode?: string;
  playerAge: number;
  playerPosition: string;
  playerPreferredFoot?: string;
  playerDevelopmentLevel?: string;
  notes: string;
  createdAt: any;
  updatedAt?: any;
}

export interface ProviderNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "APPLICATION" | "STATUS_UPDATE" | "MESSAGE" | "DEADLINE" | "ANNOUNCEMENT" | "GLOBAL";
  read: boolean;
  link?: string;
  createdAt: any;
}

