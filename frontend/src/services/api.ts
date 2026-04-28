import axios, { type AxiosAdapter, type AxiosResponse } from "axios";

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";
export type DemoScenario = "balanced" | "deadline" | "community";

const demoScenarioKey = "pollpilot-demo-scenario";

export function getDemoScenario(): DemoScenario {
  const savedScenario = window.localStorage.getItem(demoScenarioKey);
  if (savedScenario === "deadline" || savedScenario === "community") {
    return savedScenario;
  }
  return "balanced";
}

export function setDemoScenario(scenario: DemoScenario) {
  window.localStorage.setItem(demoScenarioKey, scenario);
}

type DemoPayload = Record<string, unknown>;

type DemoTimelineItem = {
  title: string;
  description: string;
  eventTime: string;
};

type DemoDocumentItem = {
  id: string;
  documentName: string;
  status: string;
};

type DemoJourneyStep = {
  id: string;
  title: string;
  description: string;
  status: string;
  stepOrder: number;
};

type DemoPollingLocation = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

type DemoProfile = {
  headline: string;
  readinessDelta: number;
  activeBooths: number;
  supportedVoters: number;
  openTasks: number;
  timelineLead: string;
  journeyTone: string;
  documentTone: string;
  chatTone: string;
};

function getProfile(): DemoProfile {
  const scenario = getDemoScenario();

  if (scenario === "deadline") {
    return {
      headline: "High-pressure election week",
      readinessDelta: 10,
      activeBooths: 5,
      supportedVoters: 1890,
      openTasks: 3,
      timelineLead: "Registration is closing soon, so every update feels urgent.",
      journeyTone: "The journey is focused on urgent completion and final checks.",
      documentTone: "The checklist highlights exactly what still blocks a vote-ready state.",
      chatTone: "I can walk you through the fastest path to complete every required step."
    };
  }

  if (scenario === "community") {
    return {
      headline: "Community outreach and guidance",
      readinessDelta: 4,
      activeBooths: 4,
      supportedVoters: 1460,
      openTasks: 5,
      timelineLead: "The app is focused on helping more voters feel supported and informed.",
      journeyTone: "The journey emphasizes friendly guidance and clear next steps.",
      documentTone: "The checklist keeps the process simple and accessible.",
      chatTone: "I’m ready to explain the process in plain language or support a multilingual demo."
    };
  }

  return {
    headline: "Balanced live election support",
    readinessDelta: 7,
    activeBooths: 3,
    supportedVoters: 1280,
    openTasks: 4,
    timelineLead: "The app stays active with a balanced, judge-friendly civic workflow.",
    journeyTone: "The journey feels steady, realistic, and easy to narrate.",
    documentTone: "The checklist shows clean progress without looking too scripted.",
    chatTone: "Ask about documents, timelines, polling locations, or readiness steps."
  };
}

const demoTimelineBase: DemoTimelineItem[] = [
  {
    title: "Registration window open",
    description: "Your voter profile is active and ready for final checks.",
    eventTime: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    title: "Document checklist reviewed",
    description: "ID verification and address confirmation were completed in the simulation.",
    eventTime: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  },
  {
    title: "Polling reminder prepared",
    description: "A reminder is queued for the next local election milestone.",
    eventTime: new Date(Date.now() - 1000 * 60 * 8).toISOString()
  }
];

let demoTick = 0;

function delay(milliseconds: number) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function readPayload<T extends DemoPayload>(data: unknown): T {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as T;
    } catch {
      return {} as T;
    }
  }

  if (data && typeof data === "object") {
    return data as T;
  }

  return {} as T;
}

function buildResponse<T>(config: any, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? "OK" : "SIMULATED",
    headers: {},
    config,
    request: {}
  };
}

function hashAddress(address: string) {
  return address.split("").reduce((value, character) => value + character.charCodeAt(0), 0);
}

function generatePollingLocations(address: string): DemoPollingLocation[] {
  const profile = getProfile();
  const base = hashAddress(address) || 1000;
  const latitude = 28 + (base % 900) / 1000;
  const longitude = 77 + (base % 700) / 1000;

  return [
    {
      name: profile.headline.includes("Community") ? "Neighborhood Community Center" : "Central Public School Hall",
      address: `${address || "Your area"} · Main civic block`,
      latitude: Number((latitude + 0.012).toFixed(6)),
      longitude: Number((longitude + 0.014).toFixed(6))
    },
    {
      name: "Ward Community Center",
      address: `${address || "Your area"} · Community wing`,
      latitude: Number((latitude - 0.008).toFixed(6)),
      longitude: Number((longitude + 0.009).toFixed(6))
    },
    {
      name: profile.headline.includes("High-pressure") ? "Election Help Desk" : "District Service Office",
      address: `${address || "Your area"} · Election help desk`,
      latitude: Number((latitude + 0.004).toFixed(6)),
      longitude: Number((longitude - 0.011).toFixed(6))
    }
  ];
}

function generateTimeline(): DemoTimelineItem[] {
  const profile = getProfile();
  const now = Date.now();
  const liveEventIndex = demoTick % 3;
  const liveEvents = [
    {
      title: "Queue monitor updated",
      description: "The nearest polling location estimate was refreshed a moment ago.",
      eventTime: new Date(now - 1000 * 60 * 3).toISOString()
    },
    {
      title: "Reminder pulse sent",
      description: "The simulation pushed a fresh reminder to keep the workflow feeling active.",
      eventTime: new Date(now - 1000 * 60 * 2).toISOString()
    },
    {
      title: "Journey step advanced",
      description: "Your readiness score moved forward after the latest simulated review.",
      eventTime: new Date(now - 1000 * 60).toISOString()
    }
  ];

  return [
    ...demoTimelineBase,
    {
      title: profile.headline,
      description: profile.timelineLead,
      eventTime: new Date(now - 1000 * 60 * 5).toISOString()
    },
    liveEvents[liveEventIndex]
  ];
}

function generateJourneySteps(): DemoJourneyStep[] {
  const profile = getProfile();
  return [
    {
      id: "1",
      title: "Confirm voter profile",
      description: profile.journeyTone,
      status: "done",
      stepOrder: 1
    },
    {
      id: "2",
      title: "Check required documents",
      description: profile.documentTone,
      status: demoTick % 2 === 0 ? "in-progress" : "done",
      stepOrder: 2
    },
    {
      id: "3",
      title: "Locate polling booth",
      description: profile.headline.includes("Community") ? "Nearby booths are presented in a friendly, easy-to-explain format." : "A nearby booth is suggested based on the mocked address lookup.",
      status: "pending",
      stepOrder: 3
    }
  ];
}

function generateDocuments(): DemoDocumentItem[] {
  const profile = getProfile();
  return [
    { id: "id-card", documentName: "Government ID", status: "Verified" },
    { id: "address-proof", documentName: "Address Proof", status: demoTick % 2 === 0 ? "Queued" : "Verified" },
    { id: "photo", documentName: profile.headline.includes("High-pressure") ? "Passport Photo" : "Profile Photo", status: "Ready" }
  ];
}

function chatReply(message: string) {
  const profile = getProfile();
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("id") || lowerMessage.includes("document")) {
    return "In demo mode, your ID check is already green. The checklist is moving toward completion.";
  }
  if (lowerMessage.includes("timeline") || lowerMessage.includes("deadline")) {
    return "The next simulated milestone is the reminder pulse in a few minutes, followed by booth confirmation.";
  }
  if (lowerMessage.includes("poll") || lowerMessage.includes("booth") || lowerMessage.includes("locat")) {
    return "I found a few realistic booth options in the simulation. Search the Locator page to see them refresh.";
  }
  return profile.chatTone;
}

const demoAdapter: AxiosAdapter = async (config) => {
  demoTick += 1;
  await delay(450 + (demoTick % 4) * 160);

  const method = (config.method ?? "get").toLowerCase();
  const url = (config.url ?? "").split("?")[0];
  const payload = readPayload<DemoPayload>(config.data);

  if (method === "post" && (url === "/auth/login" || url === "/auth/signup" || url === "/auth/firebase")) {
    return buildResponse(config, {
      accessToken: "demo-access-token",
      expiresIn: 24 * 60 * 60,
      mode: "demo"
    });
  }

  if (method === "get" && url === "/journey") {
    return buildResponse(config, generateJourneySteps());
  }

  if (method === "get" && url === "/timeline") {
    return buildResponse(config, generateTimeline());
  }

  if (method === "get" && url === "/documents") {
    return buildResponse(config, generateDocuments());
  }

  if (method === "get" && url === "/admin/users") {
    return buildResponse(config, [
      { id: "admin-1", email: "elections.admin@pollpilot.demo" },
      { id: "viewer-2", email: "observer@pollpilot.demo" },
      { id: "support-3", email: "support@pollpilot.demo" }
    ]);
  }

  if (method === "post" && url === "/chat") {
    return buildResponse(config, chatReply(String(payload.message ?? "")));
  }

  if (method === "post" && url === "/polling/search") {
    const address = String(payload.address ?? "");
    return buildResponse(config, generatePollingLocations(address));
  }

  return Promise.reject({
    response: {
      status: 404,
      data: { message: `Demo mode does not implement ${method.toUpperCase()} ${url}` }
    }
  });
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  adapter: isDemoMode ? demoAdapter : undefined
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.removeItem("accessToken");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
