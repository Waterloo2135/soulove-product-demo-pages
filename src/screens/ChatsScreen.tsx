import { CHARACTERS, SESSIONS } from "../mock";
import { useStore } from "../store";

export function ChatsScreen() {
  const store = useStore();
  return (
    <div className="chats-page">
      <div className="chats-head">
        <div className="chats-tabs">
          <button className="on">Chats</button>
          <button type="button">Groups</button>
        </div>
        <div className="chats-head-right">
          {store.persona !== "guest" ? (
            <button className="ui-gems" onClick={() => store.push("tokens")}>
              💎 {store.gems}
            </button>
          ) : (
            <button className="ui-login" onClick={() => store.requireUser()}>
              Log in
            </button>
          )}
        </div>
      </div>
      <div className="session-list">
        {SESSIONS.map((session) => {
          const girl = CHARACTERS.find((item) => item.id === session.characterId);
          if (!girl) return null;
          return (
            <button
              key={session.id}
              className="session-item"
              onClick={() => store.requireUser(() => store.push("chat-room", { id: girl.id }))}
            >
              <div className="session-ava-wrap">
                <img className="session-ava" src={girl.image} alt="" />
                {session.unread ? <span className="session-unread">{session.unread > 99 ? "99+" : session.unread}</span> : null}
              </div>
              <div className="session-main">
                <div className="session-top">
                  <div className="session-name">{girl.name}</div>
                  <div className="session-time">{session.time}</div>
                </div>
                <div className="session-sub">{session.lastMessage}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
