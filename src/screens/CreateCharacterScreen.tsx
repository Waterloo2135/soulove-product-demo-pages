import { useMemo, useState } from "react";
import {
  CHARACTERS,
  CREATE_BODY,
  CREATE_BREAST,
  CREATE_ETHNICITY,
  CREATE_HAIR_COLORS,
  CREATE_HAIR_STYLES,
  CREATE_HOBBIES,
  CREATE_OCCUPATION,
  CREATE_PERSONALITY,
  CREATE_RELATIONSHIP,
  CREATE_STYLES,
  CREATE_VOICES,
} from "../mock";
import { IconBack } from "../components/Icons";
import { useStore } from "../store";

const TOTAL = 12;

type FormState = {
  style: string;
  avatarId: string;
  ethnicity: string;
  hairStyle: string;
  hairColor: string;
  body: string;
  breast: string;
  personality: string;
  relationship: string;
  occupation: string;
  hobbies: string[];
  name: string;
  bio: string;
  visibility: "Public" | "Private" | "Unlisted";
  greeting: string;
  scenario: string;
  voice: string;
};

const initialForm: FormState = {
  style: "Realistic",
  avatarId: CHARACTERS[0].id,
  ethnicity: "Caucasian",
  hairStyle: "Long",
  hairColor: "Brunette",
  body: "Medium",
  breast: "Medium",
  personality: "Lover",
  relationship: "Girlfriend",
  occupation: "Model",
  hobbies: ["Fitness", "Traveling"],
  name: "",
  bio: "",
  visibility: "Public",
  greeting: "Hey... I've been waiting for you.",
  scenario: "You just walked into her apartment after a long day.",
  voice: "Soft",
};

const TITLES = [
  "Style",
  "Avatar",
  "Ethnicity",
  "Hair",
  "Body",
  "Personality",
  "Relationship",
  "Occupation",
  "Name & Bio",
  "Greeting",
  "Voice",
  "Bring her to life",
];

function OptionGrid({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string | string[];
  onChange: (v: string) => void;
}) {
  const selected = Array.isArray(value) ? value : [value];
  return (
    <div className="create-pills">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className={selected.includes(item) ? "on" : ""}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function CreateCharacterScreen() {
  const store = useStore();
  const step = Math.min(Math.max(store.createStep, 1), TOTAL);
  const [form, setForm] = useState<FormState>(initialForm);
  const avatar = CHARACTERS.find((item) => item.id === form.avatarId) || CHARACTERS[0];

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleHobby = (name: string) => {
    setForm((prev) => {
      const has = prev.hobbies.includes(name);
      if (has) return { ...prev, hobbies: prev.hobbies.filter((h) => h !== name) };
      if (prev.hobbies.length >= 5) return prev;
      return { ...prev, hobbies: [...prev.hobbies, name] };
    });
  };

  const go = (next: number) => store.dispatch({ type: "setCreateStep", step: next });

  const canNext = useMemo(() => {
    if (step === 9) return form.name.trim().length > 0;
    if (step === 10) return form.greeting.trim().length > 0;
    return true;
  }, [step, form.name, form.greeting]);

  const finish = () => {
    store.dispatch({ type: "setCreateStep", step: 1 });
    store.dispatch({ type: "setCreatedName", name: form.name || avatar.name });
    store.requireUser(() => store.push("chat-room", { id: form.avatarId }));
  };

  return (
    <div className="create-page">
      <div className="create-top">
        <button
          className="back"
          onClick={() => {
            if (step <= 1) store.back();
            else go(step - 1);
          }}
        >
          <IconBack />
        </button>
        <div className="create-top-mid">
          <div className="h-title">{TITLES[step - 1]}</div>
          <div className="create-progress-text">{step}/{TOTAL}</div>
        </div>
        <span style={{ width: 36 }} />
      </div>

      <div className="create-progress">
        {Array.from({ length: TOTAL }, (_, i) => (
          <i key={i} className={i < step ? "on" : ""} />
        ))}
      </div>

      <div className="create-body">
        {step === 1 && (
          <>
            <p className="create-desc">Choose her art style</p>
            <div className="create-style-grid">
              {CREATE_STYLES.map((item) => (
                <button key={item.name} className={"create-style" + (form.style === item.name ? " on" : "")} onClick={() => setField("style", item.name)}>
                  <img src={item.image} alt="" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="create-desc">Pick a starting look</p>
            <div className="create-avatar-grid">
              {CHARACTERS.map((item) => (
                <button key={item.id} className={"create-avatar" + (form.avatarId === item.id ? " on" : "")} onClick={() => setField("avatarId", item.id)}>
                  <img src={item.image} alt="" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p className="create-desc">Ethnicity</p>
            <div className="create-eth-grid">
              {CREATE_ETHNICITY.map((item) => (
                <button key={item.name} className={"create-eth" + (form.ethnicity === item.name ? " on" : "")} onClick={() => setField("ethnicity", item.name)}>
                  <img src={item.image} alt="" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="create-desc">Hair style</p>
            <OptionGrid items={CREATE_HAIR_STYLES} value={form.hairStyle} onChange={(v) => setField("hairStyle", v)} />
            <p className="create-desc" style={{ marginTop: 16 }}>Hair color</p>
            <div className="create-colors">
              {CREATE_HAIR_COLORS.map((item) => (
                <button key={item.name} className={"create-color" + (form.hairColor === item.name ? " on" : "")} onClick={() => setField("hairColor", item.name)}>
                  <i style={{ background: item.color }} />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <p className="create-desc">Body type</p>
            <OptionGrid items={CREATE_BODY} value={form.body} onChange={(v) => setField("body", v)} />
            <p className="create-desc" style={{ marginTop: 16 }}>Breast size</p>
            <OptionGrid items={CREATE_BREAST} value={form.breast} onChange={(v) => setField("breast", v)} />
          </>
        )}

        {step === 6 && (
          <>
            <p className="create-desc">Personality</p>
            <OptionGrid items={CREATE_PERSONALITY} value={form.personality} onChange={(v) => setField("personality", v)} />
          </>
        )}

        {step === 7 && (
          <>
            <p className="create-desc">Relationship</p>
            <OptionGrid items={CREATE_RELATIONSHIP} value={form.relationship} onChange={(v) => setField("relationship", v)} />
          </>
        )}

        {step === 8 && (
          <>
            <p className="create-desc">Occupation</p>
            <OptionGrid items={CREATE_OCCUPATION} value={form.occupation} onChange={(v) => setField("occupation", v)} />
            <p className="create-desc" style={{ marginTop: 16 }}>Hobbies (up to 5)</p>
            <div className="create-pills">
              {CREATE_HOBBIES.map((item) => (
                <button key={item} type="button" className={form.hobbies.includes(item) ? "on" : ""} onClick={() => toggleHobby(item)}>
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 9 && (
          <>
            <p className="create-desc">Name</p>
            <input className="create-input" placeholder="Her name" value={form.name} onChange={(e) => setField("name", e.target.value)} />
            <p className="create-desc" style={{ marginTop: 16 }}>Bio</p>
            <textarea className="create-textarea" placeholder="A short background story..." value={form.bio} onChange={(e) => setField("bio", e.target.value)} />
            <p className="create-desc" style={{ marginTop: 16 }}>Visibility</p>
            <OptionGrid items={["Public", "Private", "Unlisted"]} value={form.visibility} onChange={(v) => setField("visibility", v as FormState["visibility"])} />
          </>
        )}

        {step === 10 && (
          <>
            <p className="create-desc">Opening message</p>
            <textarea className="create-textarea" value={form.greeting} onChange={(e) => setField("greeting", e.target.value)} />
            <p className="create-desc" style={{ marginTop: 16 }}>Scenario</p>
            <textarea className="create-textarea" value={form.scenario} onChange={(e) => setField("scenario", e.target.value)} />
          </>
        )}

        {step === 11 && (
          <>
            <p className="create-desc">Voice</p>
            <OptionGrid items={CREATE_VOICES} value={form.voice} onChange={(v) => setField("voice", v)} />
            <div className="create-voice-demo">
              <button type="button" onClick={() => store.toast("Playing " + form.voice + " voice")}>▶ Preview voice</button>
            </div>
          </>
        )}

        {step === 12 && (
          <div className="create-review">
            <img src={avatar.image} alt="" />
            <h2>{form.name || avatar.name}</h2>
            <p>{form.style} · {form.ethnicity} · {form.personality}</p>
            <p>{form.relationship} · {form.occupation}</p>
            <p className="muted">{form.hobbies.join(" · ")}</p>
            <p className="quote">"{form.greeting}"</p>
            <p className="muted">{form.scenario}</p>
          </div>
        )}
      </div>

      <div className="create-foot">
        {step < TOTAL ? (
          <button className="cta" disabled={!canNext} onClick={() => canNext && go(step + 1)}>
            Next
          </button>
        ) : (
          <button className="cta" onClick={finish}>
            Bring her to life
          </button>
        )}
      </div>
    </div>
  );
}
