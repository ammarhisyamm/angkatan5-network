import { CommunityEvent } from "../types";

// Seed events with dates relative to "now" so they stay upcoming.
const inDays = (days: number, hour = 9, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const plusHours = (iso: string, hours: number) =>
  new Date(new Date(iso).getTime() + hours * 3600_000).toISOString();

const futsalDate = inDays(5, 7, 0);
const webinarDate = inDays(9, 19, 0);
const kopdarDate = inDays(14, 15, 0);

export const initialEvents: CommunityEvent[] = [
  {
    id: "evt-seed-1",
    title: "Saturday Morning Futsal",
    category: "Sport",
    description:
      "Weekly friendly futsal for all skill levels. Two pitches booked, bibs provided. Come for the game, stay for the coffee after.",
    location: "Lapangan Blok S, Jakarta Selatan",
    isOnline: false,
    date: futsalDate,
    endDate: plusHours(futsalDate, 2),
    organizerId: "usr-admin",
    organizerName: "Admin Angkatan 5",
    organizerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    capacity: 20,
    attendeeIds: [],
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-seed-2",
    title: "Webinar: Breaking into Product Design",
    category: "Webinar",
    description:
      "A 60-minute session on portfolios, case studies, and interview loops for product design roles — plus live Q&A with designers from Gojek and Traveloka.",
    location: "Online",
    isOnline: true,
    meetingLink: "https://meet.google.com/a5-webinar-design",
    date: webinarDate,
    endDate: plusHours(webinarDate, 1.5),
    organizerId: "usr-1",
    organizerName: "Ammar Hisyam",
    organizerAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    capacity: 100,
    attendeeIds: [],
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
  {
    id: "evt-seed-3",
    title: "Kopdar Angkatan 5: Coffee & Catch Up",
    category: "Social",
    description:
      "Casual offline meetup — no agenda, just coffee and stories. Bring a friend from the batch and meet people outside your circle.",
    location: "Kopi Kenangan HQ, Jakarta",
    isOnline: false,
    date: kopdarDate,
    endDate: plusHours(kopdarDate, 3),
    organizerId: "usr-admin",
    organizerName: "Admin Angkatan 5",
    organizerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    capacity: 30,
    attendeeIds: [],
    status: "Upcoming",
    createdAt: new Date().toISOString(),
  },
];
