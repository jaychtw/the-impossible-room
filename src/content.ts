import type { EvidenceId } from "./state";
export type Text = { en: string; zh: string };
export const text = (en: string, zh: string): Text => ({ en, zh });
export const evidence: Record<
  EvidenceId,
  {
    title: Text;
    observation: Text;
    meaning: Text;
    kind: "observed" | "tested" | "reported";
  }
> = {
  E1: {
    title: text("An ordinary bolt", "平凡的門閂"),
    kind: "observed",
    observation: text(
      "Four worn screws, an aged brass slide, and a diagonal scratch below it. No visible thread, wire, or external actuator.",
      "四顆磨損的螺絲、老舊的黃銅滑閂，下方有一道斜痕。未見細線、金屬絲或外部致動裝置。",
    ),
    meaning: text(
      "Consistent with ordinary use. The absence of a visible mechanism weakens a remote-lock theory; it does not prove one impossible.",
      "符合日常使用的痕跡。沒有看見機關，削弱了遙控上鎖的說法，但不能單憑這點斷言絕無可能。",
    ),
  },
  E2: {
    title: text("A familiar precaution", "熟悉的習慣"),
    kind: "observed",
    observation: text(
      "A note in Edwin’s hand reads: “Bolt study door before working.”",
      "艾德溫的親筆便條寫著：「工作前，記得閂上書房門。」",
    ),
    meaning: text(
      "He had a habit of bolting himself in. A reminder establishes a habit, not a complete timeline.",
      "他習慣獨自在書房工作時上閂。便條能證明習慣，卻不能單獨證明當晚的時間線。",
    ),
  },
  E3: {
    title: text("The way they entered", "救援者的入口"),
    kind: "reported",
    observation: text(
      "Fresh tool marks on the fire-safety panel screws. The responder log records authorized panel removal at 9:25 p.m., followed by reaching the interior bolt.",
      "消防安全檢修板的螺絲有新工具痕跡。救援紀錄記載，晚間 9:25 經授權拆板，伸手鬆開內側門閂。",
    ),
    meaning: text(
      "Responders did not turn an exterior key to open a bolted door. This documented access explains entry.",
      "救援者並非用外側鑰匙打開上閂的門；記錄中的檢修通道解釋了進入方式。",
    ),
  },
  E4: {
    title: text("Three small scars", "三處小傷痕"),
    kind: "observed",
    observation: text(
      "A loose shutter hinge permits repeated movement. Three pale impact marks sit where the wood meets its frame.",
      "鬆動的百葉窗鉸鏈容許窗板反覆擺動。窗框與木板接觸的位置，有三處淺色撞痕。",
    ),
    meaning: text(
      "A candidate source of the knocks. Reproduce the sound before accepting the explanation.",
      "可能是敲擊聲的來源。先重現聲音，再接受這個解釋。",
    ),
  },
  E5: {
    title: text("The wind’s reply", "風的回應"),
    kind: "tested",
    observation: text(
      "A sustained gust makes the loose shutter strike its frame three times: knock, knock, knock.",
      "持續的陣風吹動鬆脫的窗板，三次撞上窗框：叩、叩、叩。",
    ),
    meaning: text(
      "The reported rhythm has a reproducible physical cause. No person needs to be inside to make it.",
      "目擊者描述的節奏有可重現的物理成因，不需要有人在屋內敲門。",
    ),
  },
  E6: {
    title: text("A pale shape on a hook", "掛鉤上的蒼白身影"),
    kind: "observed",
    observation: text(
      "A white rain cover hangs outside the frosted window. Its folds resemble the reported shoulder-like outline.",
      "白色防雨罩掛在霧面窗外，摺痕形成類似目擊者所說的肩膀輪廓。",
    ),
    meaning: text(
      "A plausible silhouette, but its apparent motion and lighting still need testing.",
      "它可能形成那道人影，但移動與照明條件仍需驗證。",
    ),
  },
  E7: {
    title: text("A figure made of light", "光造出的人影"),
    kind: "tested",
    observation: text(
      "A passing-headlight sweep behind the wind-blown cover projects a moving pale outline through the frosted glass.",
      "掠過的車燈照亮隨風擺動的防雨罩，透過霧面玻璃重現移動的蒼白輪廓。",
    ),
    meaning: text(
      "The apparition is reproduced with the same cover, glass, wind, and external light.",
      "相同的防雨罩、玻璃、風與外部光源，便能重現那個「幽影」。",
    ),
  },
  E8: {
    title: text("The professional report", "專業人員的報告"),
    kind: "reported",
    observation: text(
      "The attending professional’s incident note reports no evidence of assault and a fatal medical event, determined independently of the knocking and silhouette.",
      "現場專業人員的事故報告指出，沒有遭攻擊的證據；死亡由突發醫療事件導致，此判定獨立於敲擊聲與人影。",
    ),
    meaning: text(
      "Medical determination belongs to the attending professional. The environmental tests do not diagnose or explain his death.",
      "醫療判定來自專業人員。環境實驗並不能診斷或解釋他的死亡。",
    ),
  },
  E9: {
    title: text("Nine minutes past nine", "九點零七分"),
    kind: "observed",
    observation: text(
      "The clock reads 9:07. In the opened battery compartment, an exhausted cell and the caretaker’s maintenance label explain why it stopped.",
      "時鐘停在九點零七分。打開的電池槽內，一顆耗盡的電池與管理員的保養標籤說明停擺原因。",
    ),
    meaning: text(
      "A stopped clock cannot date the medical event. A coincidence can look like a clue.",
      "停擺的時鐘無法判定醫療事件的時間。巧合也可能看起來像線索。",
    ),
  },
};
export type SceneId = "study" | "hall" | "exterior";
export type ObjectId =
  "bolt" | "note" | "clock" | "panel" | "report" | "hinge" | "cover";
export const objects: Record<
  ObjectId,
  {
    scene: SceneId;
    label: Text;
    id: EvidenceId;
    image: string;
    position: [number, number];
    description: Text;
  }
> = {
  bolt: {
    scene: "study",
    label: text("Door & bolt", "木門與門閂"),
    id: "E1",
    image: "bolt.webp",
    position: [31.5, 46],
    description: text(
      "Warm light picks out the scratches on the brass. Follow the slide into its receiver. This is an ordinary interior bolt.",
      "暖光照出黃銅上的細痕。沿著滑閂看向接槽，這是普通的內側門閂。",
    ),
  },
  note: {
    scene: "study",
    label: text("Desk note", "桌上便條"),
    id: "E2",
    image: "note.webp",
    position: [82, 73],
    description: text(
      "A small reminder, almost lost among the dealer’s papers. Some mysteries begin with a habit.",
      "一張小提醒，幾乎淹沒在古董商的文件中。有些謎團始於習慣。",
    ),
  },
  clock: {
    scene: "study",
    label: text("Stopped clock", "停擺的時鐘"),
    id: "E9",
    image: "clock.webp",
    position: [44, 27],
    description: text(
      "An impressive clock, but an unreliable witness. The caretaker opens its modern battery compartment.",
      "氣派的時鐘，卻未必是可靠的證人。管理員打開它的現代電池槽。",
    ),
  },
  panel: {
    scene: "hall",
    label: text("Emergency panel", "緊急檢修板"),
    id: "E3",
    image: "panel.webp",
    position: [63.5, 43],
    description: text(
      "A small removable fire-safety panel beside the bolt. Ask Mina to read the responder’s entry log alongside the fresh screw marks.",
      "門閂旁有一小塊可拆卸的消防安全檢修板。請米娜讀出救援進入紀錄，對照螺絲上的新工具痕。",
    ),
  },
  report: {
    scene: "hall",
    label: text("Incident report", "事故報告"),
    id: "E8",
    image: "report.webp",
    position: [88, 69],
    description: text(
      "Mina keeps the attending professional’s note with the witness statements. Establish the physical evidence first.",
      "米娜將現場專業人員的報告與證詞一起保管。先確認物理證據，再對照報告。",
    ),
  },
  hinge: {
    scene: "exterior",
    label: text("Shutter & hinge", "窗板與鉸鏈"),
    id: "E4",
    image: "hinge.webp",
    position: [21, 58],
    description: text(
      "The hinge shifts under light pressure. At the frame, three exposed patches of pale wood catch the light.",
      "輕壓之下鉸鏈便鬆動。窗框上有三處露出的淺色木質，在光下格外清楚。",
    ),
  },
  cover: {
    scene: "exterior",
    label: text("White rain cover", "白色防雨罩"),
    id: "E6",
    image: "cover.webp",
    position: [79, 46],
    description: text(
      "A waterproof cover, hung out of the way on a hook. Beyond it lies the road and the sweep of passing headlights.",
      "一件防水罩，掛在鉤上避開通道。後方就是道路，車燈會從那裡掃過。",
    ),
  },
};
export const hypothesisTitles = {
  H1: text("A hand outside the room", "房外的一隻手"),
  H2: text("Something beyond explanation", "超越常理的現象"),
  H3: text("Separate events. One story.", "不同事件，同一個故事。"),
};
export const hypothesisDescriptions = {
  H1: text(
    "An intruder used a remote mechanism to bolt the door.",
    "入侵者利用遠端機關閂上房門。",
  ),
  H2: text(
    "The knocking and pale figure have a supernatural cause.",
    "敲擊聲與蒼白人影來自超自然力量。",
  ),
  H3: text(
    "Edwin bolted the study himself. Wind and light created an unrelated haunting story.",
    "艾德溫自行上閂。風與光造出與死亡無關的鬧鬼傳聞。",
  ),
};
export const cards = {
  bolt: text("Edwin bolts the study", "艾德溫閂上書房門"),
  medical: text(
    "Edwin becomes unresponsive while alone",
    "艾德溫獨處時失去反應",
  ),
  signs: text(
    "Wind and passing lights create the signs",
    "風與掠過的車燈造出異象",
  ),
};
export const revealPanels = [
  {
    image: "study.webp",
    position: "24% 48%",
    title: text("01 · A familiar habit", "01 · 熟悉的習慣"),
    body: text(
      "8:40 p.m. Edwin enters his study and slides the bolt. His own reminder makes this ordinary act intelligible.",
      "晚間 8:40，艾德溫進入書房並上閂。他留下的便條，讓這個平常舉動有了依據。",
    ),
    cite: "E1 · E2",
  },
  {
    image: "hinge.webp",
    position: "center",
    title: text("02 · The house knocks back", "02 · 房屋的回聲"),
    body: text(
      "Later, gusts push a loose shutter against its frame. Three impacts become three mysterious knocks.",
      "稍後，陣風吹動鬆脫的窗板撞向窗框。三次撞擊，成了神祕的三聲敲門。",
    ),
    cite: "E4 · E5",
  },
  {
    image: "cover.webp",
    position: "center",
    title: text("03 · A borrowed silhouette", "03 · 借來的身影"),
    body: text(
      "A rain cover swings. Passing headlights sweep behind it; frosted glass turns cloth and light into a pale figure.",
      "防雨罩隨風擺動，車燈從後方掠過。霧面玻璃將布料與光，化成蒼白人影。",
    ),
    cite: "E6 · E7",
  },
  {
    image: "hall.webp",
    position: "center",
    title: text("04 · An ordinary way in", "04 · 平凡的入口"),
    body: text(
      "9:25 p.m. Responders remove the emergency panel, reach the interior bolt, and enter. There is no magical unlocking.",
      "晚間 9:25，救援者拆下緊急檢修板，伸手鬆開內側門閂後進入，沒有不可思議的開鎖。",
    ),
    cite: "E3",
  },
  {
    image: "study.webp",
    position: "70% 65%",
    title: text("05 · What the evidence can say", "05 · 證據能說明的事"),
    body: text(
      "The professional report determines a fatal medical event, separately. Recreating a noise or a shadow cannot diagnose a death.",
      "專業報告獨立判定死亡源於突發醫療事件。重現聲音或影子，不能診斷死亡原因。",
    ),
    cite: "E8",
  },
  {
    image: "study.webp",
    position: "center",
    title: text("06 · The impossible was a story", "06 · 不可能的，是那個故事"),
    body: text(
      "A bolted door, a death, a sound, a shape. We assumed one cause. The evidence supports separate events, mistakenly joined.",
      "上閂的門、死亡、聲音、人影。我們假設只有一個原因，證據卻支持彼此獨立的事件，被錯誤地串連。",
    ),
    cite: "E1–E8",
  },
];
