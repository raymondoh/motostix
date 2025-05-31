import type { User, SerializedUser } from "../user/common";

/**
 * Props for the AccountSummary component
 */
export interface AccountSummaryProps {
  user: User;
  profileUrl?: string;
  className?: string;
}

/**
 * Props for the AccountSummaryClient component
 * Uses SerializedUser to ensure dates are properly serialized for client components
 *
 * @deprecated This interface appears to be unused. If you're using it, please remove this comment.
 */
export interface AccountSummaryClientProps {
  userData: SerializedUser;
}

/**
 * Props for account settings related components
 *
 * @deprecated This interface appears to be unused. If you're using it, please remove this comment.
 */
export interface AccountSettingsProps {
  user: User;
  className?: string;
}

/**
 * Props for user profile related components
 *
 * @deprecated This interface appears to be unused. If you're using it, please remove this comment.
 */
export interface UserProfileProps {
  user: User;
  className?: string;
}
