type Props = {
  lead?: { name: string; characterId: string };
  onClick: () => void;
};

export function MemberLockChatButton({ lead, onClick }: Props) {
  if (!lead) return null;
  return (
    <button className="player-lock-secondary player-lock-chat" onClick={onClick}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H5l-3 3V11.5a9 9 0 1 1 18 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span>Chat with {lead.name}</span>
    </button>
  );
}
