import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type {
  HomeClassify,
  MainTab,
  NavItem,
  Overlay,
  Persona,
  ScreenId,
  SubscribeScene,
} from "./types";
import { markDramaWatched, shouldShowDramaRecommend, markDramaRecommendShown } from "./dramaGuide";

const MAIN_TABS: MainTab[] = ["home", "chats", "short-drama", "generate", "account"];

export function isMainTab(id: ScreenId): id is MainTab {
  return MAIN_TABS.includes(id as MainTab);
}

type State = {
  persona: Persona;
  gems: number;
  stack: NavItem[];
  overlay: Overlay;
  homeTab: HomeClassify;
  generateTab: "draw" | "photos" | "videos";
  createStep: number;
  sentCount: Record<string, number>;
  createdName: string;
  dramaPlat: boolean;
};

type Action =
  | { type: "setPersona"; persona: Persona }
  | { type: "setGems"; gems: number }
  | { type: "openTab"; tab: MainTab }
  | { type: "push"; item: NavItem }
  | { type: "back" }
  | { type: "replace"; item: NavItem }
  | { type: "openOverlay"; overlay: Overlay }
  | { type: "closeOverlay" }
  | { type: "setHomeTab"; tab: HomeClassify }
  | { type: "setGenerateTab"; tab: "draw" | "photos" | "videos" }
  | { type: "setCreateStep"; step: number }
  | { type: "setCreatedName"; name: string }
  | { type: "bumpSent"; characterId: string }
  | { type: "setDramaPlat"; dramaPlat: boolean };

const PERSONA_GEMS: Record<Persona, number> = { guest: 0, free: 12, plus: 120 };

const initial: State = {
  persona: "free",
  gems: 12,
  stack: [{ id: "home" }],
  overlay: null,
  homeTab: "forYou",
  generateTab: "draw",
  createStep: 1,
  sentCount: {},
  createdName: "",
  dramaPlat: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setPersona":
      return {
        ...state,
        persona: action.persona,
        gems: PERSONA_GEMS[action.persona],
        overlay: null,
        sentCount: {},
      };
    case "setGems":
      return { ...state, gems: action.gems };
    case "openTab":
      return { ...state, stack: [{ id: action.tab }], overlay: null };
    case "push":
      return { ...state, stack: [...state.stack, action.item] };
    case "back":
      return state.stack.length > 1 ? { ...state, stack: state.stack.slice(0, -1) } : state;
    case "replace":
      return { ...state, stack: [...state.stack.slice(0, -1), action.item] };
    case "openOverlay":
      return { ...state, overlay: action.overlay };
    case "closeOverlay":
      return { ...state, overlay: null };
    case "setHomeTab":
      return { ...state, homeTab: action.tab };
    case "setGenerateTab":
      return { ...state, generateTab: action.tab };
    case "setCreateStep":
      return { ...state, createStep: action.step };
    case "setCreatedName":
      return { ...state, createdName: action.name };
    case "bumpSent": {
      const current = state.sentCount[action.characterId] || 0;
      return { ...state, sentCount: { ...state.sentCount, [action.characterId]: current + 1 } };
    }
    case "setDramaPlat": {
      const hideDrama = !action.dramaPlat;
      const onDrama = state.stack.some((item) => item.id === "short-drama" || item.id === "short-drama-watch");
      if (hideDrama && onDrama) {
        return { ...state, dramaPlat: false, stack: [{ id: "home" }], overlay: null };
      }
      return { ...state, dramaPlat: action.dramaPlat };
    }
    default:
      return state;
  }
}

type Store = State & {
  current: NavItem;
  dispatch: (action: Action) => void;
  openTab: (tab: MainTab) => void;
  push: (id: ScreenId, params?: Record<string, string>) => void;
  back: () => void;
  requireUser: (next?: () => void) => boolean;
  requirePlus: (scene: SubscribeScene, next?: () => void) => boolean;
  toast: (message: string) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const current = state.stack[state.stack.length - 1];

  useEffect(() => {
    const raw = window.location.hash.replace(/^#\/?/, "");
    if (!raw) return;
    const [idPart, query = ""] = raw.split("?");
    const id = idPart.trim() as ScreenId;
    if (!id) return;
    const params = Object.fromEntries(new URLSearchParams(query));
    if (id === "characters") {
      dispatch({ type: "setHomeTab", tab: "lover" });
      dispatch({ type: "openTab", tab: "home" });
      return;
    }
    if ((id === "short-drama" || id === "short-drama-watch") && !initial.dramaPlat) {
      dispatch({ type: "openTab", tab: "home" });
      return;
    }
    if (id === "short-drama-watch") markDramaWatched(params.id);
    if (MAIN_TABS.includes(id as MainTab)) {
      dispatch({ type: "openTab", tab: id as MainTab });
      return;
    }
    dispatch({ type: "push", item: { id, params: Object.keys(params).length ? params : undefined } });
  }, []);

  const store = useMemo<Store>(() => {
    const toast = (message: string) => {
      dispatch({ type: "openOverlay", overlay: { type: "toast", message } });
      window.setTimeout(() => dispatch({ type: "closeOverlay" }), 1600);
    };
    const requireUser = (next?: () => void) => {
      if (state.persona === "guest") {
        dispatch({ type: "openOverlay", overlay: { type: "login" } });
        return false;
      }
      next?.();
      return true;
    };
    const requirePlus = (scene: SubscribeScene, next?: () => void) => {
      if (state.persona === "guest") return requireUser();
      if (state.persona !== "plus") {
        dispatch({ type: "openOverlay", overlay: { type: "subscribe", scene } });
        return false;
      }
      next?.();
      return true;
    };
    return {
      ...state,
      current,
      dispatch,
      openTab: (tab) => {
        if (tab === "short-drama" && !state.dramaPlat) {
          dispatch({ type: "openTab", tab: "home" });
          return;
        }
        const fromChat = current.id === "chat-room";
        dispatch({ type: "openTab", tab });
        if (fromChat && (tab === "home" || tab === "chats")) {
          window.setTimeout(() => {
            if (!state.dramaPlat || !shouldShowDramaRecommend()) return;
            markDramaRecommendShown();
            dispatch({ type: "openOverlay", overlay: { type: "dramaRecommend", message: "chat" } });
          }, 0);
        }
      },
      push: (id, params) => {
        if (id === "characters") {
          dispatch({ type: "setHomeTab", tab: "lover" });
          dispatch({ type: "openTab", tab: "home" });
          return;
        }
        if ((id === "short-drama" || id === "short-drama-watch") && !state.dramaPlat) {
          dispatch({ type: "openTab", tab: "home" });
          return;
        }
        if (id === "short-drama-watch") markDramaWatched(params?.id);
        dispatch({ type: "push", item: { id, params } });
      },
      back: () => {
        const fromChat = current.id === "chat-room";
        const prev = state.stack[state.stack.length - 2];
        const toHomeOrChats = prev && (prev.id === "home" || prev.id === "chats");
        dispatch({ type: "back" });
        if (fromChat && toHomeOrChats) {
          window.setTimeout(() => {
            if (!state.dramaPlat || !shouldShowDramaRecommend()) return;
            markDramaRecommendShown();
            dispatch({ type: "openOverlay", overlay: { type: "dramaRecommend", message: "chat" } });
          }, 0);
        }
      },
      requireUser,
      requirePlus,
      toast,
    };
  }, [state, current]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("Store missing");
  return value;
}
