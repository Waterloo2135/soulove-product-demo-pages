import { IconBack } from "../../src/components/Icons";
import { useStore } from "../../src/store";

const BENEFITS: Array<{ name: string; prime: string; pro: string; check?: boolean }> = [
  { name: "Generate spicy video", prime: "✓", pro: "✓", check: true },
  { name: "Free hot photos", prime: "50", pro: "3600" },
  { name: "Ask for photo /mo", prime: "30", pro: "200" },
  { name: "Wardrobe (dress up) /mo", prime: "10", pro: "50" },
  { name: "Draw (generate image) /mo", prime: "10", pro: "50" },
  { name: "Free messages", prime: "3000", pro: "5000" },
  { name: "Bypass Intimate Level/mo", prime: "2", pro: "4" },
  { name: "Unlock lover's voices", prime: "✓", pro: "✓", check: true },
  { name: "Unlock premium clothes", prime: "✓", pro: "✓", check: true },
  { name: "Unlimited flirting tips", prime: "", pro: "✓", check: true },
  { name: "Create your own lovers", prime: "5 Times", pro: "✓", check: true },
];

/** 现网 Premium Membership 升级页。只替换声明，不改对比卡和支付流程。 */
export function UpgradeMembershipScreen() {
  const store = useStore();
  return (
    <div className="prem">
      <div className="prem-top">
        <button className="prem-back" onClick={store.back} aria-label="Back"><IconBack /></button>
        <div className="prem-title">Premium Membership</div>
        <button className="prem-help" type="button">Help</button>
      </div>
      <div className="prem-scroll">
        <div className="prem-current">
          <div>
            <div className="prem-kicker">Current Membership</div>
            <div className="prem-tier">Prime</div>
          </div>
          <div className="prem-expire">Expire 11/07/2026</div>
        </div>
        <div className="prem-h">Upgrade Membership</div>
        <div className="prem-compare">
          <div className="prem-side left">
            <div className="prem-brand">DreamMates</div>
            <div className="prem-name">Prime</div>
            <div className="prem-price">$0.47</div>
          </div>
          <div className="prem-side right">
            <div className="prem-brand">DreamMates</div>
            <div className="prem-name">Pro</div>
            <div className="prem-price">$0.19<span>/day</span></div>
            <div className="prem-was">$0.67/day</div>
          </div>
          <i className="prem-off">70% OFF</i>
        </div>
        <div className="prem-table">
          <div className="prem-row head">
            <span>Benefits</span>
            <span>Prime</span>
            <span>Pro</span>
          </div>
          {BENEFITS.map((row) => (
            <div className="prem-row" key={row.name}>
              <span>{row.name}</span>
              <b className={row.check && row.prime === "✓" ? "ok" : ""}>{row.prime}</b>
              <b className={row.check && row.pro === "✓" ? "ok" : "hot"}>{row.pro}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="prem-foot">
        <p className="prem-anon">100% anonymous. Cancel anytime. Then renews annual at $69.99</p>
        <button
          className="prem-pay"
          type="button"
          onClick={() => {
            store.dispatch({ type: "setPersona", persona: "plus" });
            store.toast("Pro unlocked");
          }}
        >
          <span className="prem-card">▭</span> Credit Card
        </button>
        <div className="prem-secure">
          <span>Antivirus Secure</span>
          <span>Bank Statement Privacy</span>
        </div>
      </div>
    </div>
  );
}
