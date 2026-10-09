import { useMemo, useState } from "react";
import { CHARACTERS, characterById } from "../mock";
import { useStore } from "../store";

const CHAT_LINES = [
  "Hey you, come chat with me! I've been waiting to talk to you!",
  "Don't be shy—send me a message, I'd love to hear from you!",
  "I'm online now, want to talk? Let's get to know each other!",
  "Come say hi! I've been hoping we could chat soon.",
  "I'm here and ready to chat—let's not keep each other waiting!",
];

type Scene = "choose" | "email" | "verify";

export function LoginSheet() {
  const store = useStore();
  const [scene, setScene] = useState<Scene>("choose");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const girl = useMemo(() => {
    const id = store.current.params?.id;
    if (id) return characterById(id);
    return CHARACTERS[0];
  }, [store.current.params?.id]);

  const line = useMemo(() => CHAT_LINES[Math.floor(Math.random() * CHAT_LINES.length)], []);

  const finishLogin = (via: string) => {
    store.dispatch({ type: "setPersona", persona: "free" });
    store.toast("Logged in · " + via);
  };

  return (
    <div className="overlay login-overlay" onClick={() => store.dispatch({ type: "closeOverlay" })}>
      <div className="login-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="login-hero">
          <div className="login-hero-bg" />
          <div className="login-bubble-row">
            <div className="login-avatar-wrap">
              <div className="login-avatar-ring">
                <img src={girl.image} alt="" />
              </div>
            </div>
            <div className="login-bubble">
              {line}
              <i className="login-bubble-tail" aria-hidden />
            </div>
          </div>
        </div>

        <div className="login-body">
          <div className="login-bar">
            {scene === "choose" ? (
              <div className="login-title">Log in</div>
            ) : (
              <button
                type="button"
                className="login-back"
                onClick={() => setScene(scene === "verify" ? "email" : "choose")}
              >
                ‹ Back
              </button>
            )}
            <button
              type="button"
              className="login-x"
              onClick={() => store.dispatch({ type: "closeOverlay" })}
            >
              ✕
            </button>
          </div>

          {scene === "choose" ? (
            <div className="login-choose">
              <button type="button" className="login-google" onClick={() => finishLogin("Google")}>
                <span className="login-g">G</span>
                Google
              </button>
              <button type="button" className="login-email" onClick={() => setScene("email")}>
                <span className="login-mail">✉</span>
                Email
              </button>
            </div>
          ) : null}

          {scene === "email" ? (
            <div className="login-email-form">
              <p className="login-email-tip">Enter your email to continue</p>
              <input
                className="login-input"
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                className="login-google"
                onClick={() => {
                  if (!email.trim()) {
                    store.toast("Enter email first");
                    return;
                  }
                  setScene("verify");
                }}
              >
                Continue
              </button>
            </div>
          ) : null}

          {scene === "verify" ? (
            <div className="login-email-form">
              <p className="login-email-tip">We sent a code to {email || "your email"}</p>
              <input
                className="login-input"
                inputMode="numeric"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button type="button" className="login-google" onClick={() => finishLogin("Email")}>
                Verify & Log in
              </button>
              <button type="button" className="login-resend" onClick={() => store.toast("Code resent")}>
                Resend code
              </button>
            </div>
          ) : null}

          <div className="login-policy">
            <button type="button">Terms of Service</button>
            <span>|</span>
            <button type="button">Underage Policy</button>
            <span>|</span>
            <button type="button">Privacy Policy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
