import { OverlayHost } from "./components/Overlays";
import { DemoLab } from "./components/DemoLab";
import { TabBar } from "./components/TabBar";
import { AccountScreen } from "./screens/AccountScreen";
import { CharacterDetailScreen } from "./screens/CharacterDetailScreen";
import { CharactersScreen } from "./screens/CharactersScreen";
import { ChatRoomScreen } from "./screens/ChatRoomScreen";
import { ChatsScreen } from "./screens/ChatsScreen";
import { CreateCharacterScreen } from "./screens/CreateCharacterScreen";
import { GenerateScreen } from "./screens/GenerateScreen";
import { GenerateCreateScreen } from "./screens/GenerateCreateScreen";
import { HomeScreen } from "./screens/HomeScreen";
import {
  CharacterAlbumScreen,
  GalleryScreen,
  ShortDramaScreen,
  ShortDramaWatchScreen,
  SimpleScreen,
  SubscriptionsScreen,
  TokensScreen,
} from "./screens/MiscScreens";
import { FilmScenesScreen } from "./screens/FilmScenesScreen";
import { DramaRemixScreen } from "./screens/DramaRemixScreen";
import { GenerateResultScreen } from "./screens/GenerateResultScreen";
import { AdLandingScreen } from "./screens/AdLandingScreen";
import { isMainTab, useStore } from "./store";

function Screen() {
  const { current } = useStore();
  switch (current.id) {
    case "home":
      return <HomeScreen />;
    case "chats":
      return <ChatsScreen />;
    case "characters":
      return <CharactersScreen />;
    case "generate":
      return <GenerateScreen />;
    case "generate-image":
      return <GenerateCreateScreen />;
    case "account":
      return <AccountScreen />;
    case "character-detail":
      return <CharacterDetailScreen />;
    case "character-album":
      return <CharacterAlbumScreen />;
    case "chat-room":
      return <ChatRoomScreen />;
    case "create-character":
      return <CreateCharacterScreen />;
    case "generate-result":
      return <GenerateResultScreen />;
    case "gallery":
      return <GalleryScreen />;
    case "subscriptions":
      return <SubscriptionsScreen />;
    case "tokens":
      return <TokensScreen />;
    case "short-drama":
      return <ShortDramaScreen />;
    case "short-drama-watch":
      return <ShortDramaWatchScreen />;
    case "film-scenes":
      return <FilmScenesScreen />;
    case "drama-remix":
      return <DramaRemixScreen />;
    case "ad-landing":
      return <AdLandingScreen />;
    case "profile":
      return <SimpleScreen title="Profile" body="资料编辑骨架。可改名字、头像、性别展示。不是主转化路径。" />;
    case "settings":
      return <SimpleScreen title="Settings" body="账号管理、会员管理、政策入口在生产存在。骨架只保留设置壳。" />;
    case "invitation":
      return <SimpleScreen title="Invitation Reward" body="邀请得 30 天 VIP 的增长入口。次级，不能压过聊天和 Plus。" />;
    case "bonus":
      return <SimpleScreen title="Free Gems" body="任务墙骨架。Gems 任务存在，但会员转化仍是主目标。" />;
    case "login":
      return <SimpleScreen title="Log in" body="生产主形态是抽屉。这个整页只作备用。" />;
    case "pay":
      return <SimpleScreen title="Checkout" body="收银台占位。不实现真实支付渠道。" next={{ id: "pay-success", label: "Mock success" }} />;
    case "pay-success":
      return <SimpleScreen title="Payment success" body="支付成功。可配 Toast。然后回到聊天或会员页。" />;
    case "contact-us":
      return <SimpleScreen title="Feedback" body="反馈/联系我们占位。" />;
    default:
      return <SimpleScreen title="Unknown" body="未收录的屏，先补 screen-map。" />;
  }
}

export default function App() {
  const { current } = useStore();
  const showTab = isMainTab(current.id);
  return (
    <div className="workspace">
      <div className="phone-col">
        <div className="phone">
          <div className="status-bar">
            <span>9:41</span>
            <span className="status-right">▮▮▮ Wi‑Fi 🔋</span>
          </div>
          <div className={showTab ? "screen with-tab" : "screen"}>
            <Screen />
          </div>
          {showTab ? <TabBar /> : null}
          <OverlayHost />
        </div>
      </div>
      <DemoLab />
    </div>
  );
}


