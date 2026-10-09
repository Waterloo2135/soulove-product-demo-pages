import { DRAMAS } from "./mock";
import type { Drama } from "./types";

export type FilmAction = {
  id: string;
  label: string;
  videoUrl: string;
  next?: FilmAction[];
};

export type FilmScene = {
  id: string;
  title: string;
  hook: string;
  cover: string;
  actions: FilmAction[];
};

const CLIP = DRAMAS[0].firstEpisodeUrl;

function branch(prefix: string, videoUrl: string, labels: [string, string, string]): FilmAction[] {
  return labels.map((label, i) => ({
    id: prefix + "-" + (i + 1),
    label,
    videoUrl,
  }));
}

function layer1(prefix: string, videoUrl: string, items: Array<{ label: string; next: [string, string, string] }>): FilmAction[] {
  return items.map((item, i) => ({
    id: prefix + "-l1-" + (i + 1),
    label: item.label,
    videoUrl,
    next: branch(prefix + "-l2-" + (i + 1), videoUrl, item.next),
  }));
}

export function filmScenesForDrama(drama: Drama): FilmScene[] {
  const covers = [drama.cover, ...DRAMAS.map((item) => item.cover)].filter(Boolean).slice(0, 4);
  const videoUrl = drama.firstEpisodeUrl || CLIP;
  return [
    {
      id: drama.id + "-dance",
      title: "On the dance floor",
      hook: "You have her in the middle of the floor. What do you do next?",
      cover: covers[0],
      actions: layer1(drama.id + "-dance", videoUrl, [
        { label: "Pull her closer and kiss her neck", next: ["Slide a hand under her dress", "Make her grind against you", "Take her off the floor"] },
        { label: "Turn her around and hold her from behind", next: ["Whisper what you want", "Let your hands wander", "Lead her into the dark hallway"] },
        { label: "Stop dancing and look her in the eyes", next: ["Dare her to come home with you", "Kiss her until she forgets the song", "Put her hand on you"] },
      ]),
    },
    {
      id: drama.id + "-door",
      title: "She left the door unlocked",
      hook: "The apartment is quiet. She knows you walked in.",
      cover: covers[1] || covers[0],
      actions: layer1(drama.id + "-door", videoUrl, [
        { label: "Walk in without knocking", next: ["Catch her changing", "Pin her to the door", "Let her pretend she is surprised"] },
        { label: "Call her name from the hallway", next: ["She pulls you inside", "She tells you to lock it", "She does not bother covering up"] },
        { label: "Wait and watch her through the gap", next: ["She notices and does not stop", "You step in anyway", "She invites you with a look"] },
      ]),
    },
    {
      id: drama.id + "-couch",
      title: "Late on the couch",
      hook: "The show is on. Neither of you is watching.",
      cover: covers[2] || covers[0],
      actions: layer1(drama.id + "-couch", videoUrl, [
        { label: "Pull her into your lap", next: ["Let her take control", "Keep her there", "Carry her to the bedroom"] },
        { label: "Start with her mouth, not her clothes", next: ["She kisses back harder", "She climbs on you", "You do not let her go"] },
        { label: "Pause the show and ask what she wants", next: ["She shows you", "She wants it slow", "She wants it now"] },
      ]),
    },
    {
      id: drama.id + "-kitchen",
      title: "Kitchen after midnight",
      hook: "Only the fridge light is on. She is not here for water.",
      cover: covers[3] || covers[0],
      actions: layer1(drama.id + "-kitchen", videoUrl, [
        { label: "Back her against the counter", next: ["Lift her up", "Keep standing", "Take it to the table"] },
        { label: "Let her come to you first", next: ["She starts it", "You take over", "You make her wait"] },
        { label: "Turn her toward the window", next: ["Keep the risk", "Close the blinds", "Do not stop"] },
      ]),
    },
  ];
}
