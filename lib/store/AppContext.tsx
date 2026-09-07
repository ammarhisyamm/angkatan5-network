"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import {
  User,
  Opportunity,
  Skill,
  CommunityEvent,
  ToastMessage,
  OpportunityStatus,
  SkillCategory,
} from "../types";
import { initialMembers } from "../data/members";
import { initialOpportunities } from "../data/opportunities";
import { initialSkills } from "../data/skills";
import { initialEvents } from "../data/events";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  opportunities: Opportunity[];
  skills: Skill[];
  events: CommunityEvent[];
  bookmarkedOpportunityIds: string[];
  toasts: ToastMessage[];
  isLoading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, batch: string) => User;
  updateProfile: (userId: string, data: Partial<User>) => void;
  completeOnboarding: (data: Partial<User>) => void;
  createOpportunity: (
    data: Omit<
      Opportunity,
      | "id"
      | "createdAt"
      | "authorId"
      | "authorName"
      | "authorAvatar"
      | "authorRole"
      | "authorCompany"
    >
  ) => Opportunity;
  updateOpportunityStatus: (id: string, status: OpportunityStatus) => void;
  deleteOpportunity: (id: string) => void;
  createEvent: (
    data: Omit<CommunityEvent, "id" | "createdAt" | "organizerId" | "organizerName" | "organizerAvatar" | "attendeeIds" | "status">
  ) => CommunityEvent;
  joinEvent: (id: string) => void;
  leaveEvent: (id: string) => void;
  cancelEvent: (id: string) => void;
  notifications: { id: string; title: string; desc: string; read: boolean; time: string }[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleBookmark: (opportunityId: string) => void;
  isBookmarked: (opportunityId: string) => boolean;
  addSkill: (name: string, category: SkillCategory) => void;
  renameSkill: (id: string, newName: string) => void;
  mergeSkills: (sourceId: string, targetId: string) => void;
  deleteSkill: (id: string) => void;
  verifyMember: (id: string) => void;
  suspendMember: (id: string) => void;
  deleteMember: (id: string) => void;
  addToast: (
    title: string,
    description?: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
  removeToast: (id: string) => void;
  switchDemoRole: (role: "member" | "admin") => void;
  switchUser: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: "a5_current_user_v3",
  USERS: "a5_users_v3",
  OPPORTUNITIES: "a5_opportunities_v3",
  SKILLS: "a5_skills_v3",
  EVENTS: "a5_events_v3",
  BOOKMARKS: "a5_bookmarks_v3",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialMembers);
  const [opportunities, setOpportunities] =
    useState<Opportunity[]>(initialOpportunities);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [events, setEvents] = useState<CommunityEvent[]>(initialEvents);
  const [notifications, setNotifications] = useState<{ id: string; title: string; desc: string; read: boolean; time: string }[]>([]);
  const [bookmarkedOpportunityIds, setBookmarkedOpportunityIds] = useState<
    string[]
  >([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notificationModal, setNotificationModal] = useState<{ title: string; description?: string; icon?: "success" | "error" | "warning" | "info" | "question" } | null>(null);
  const markNotificationRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedOpps = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
      const storedSkills = localStorage.getItem(STORAGE_KEYS.SKILLS);
      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const storedCurrentUser = localStorage.getItem(
        STORAGE_KEYS.CURRENT_USER
      );

      const parsedUsers = storedUsers ? JSON.parse(storedUsers) : initialMembers;
      const parsedOpps = storedOpps
        ? JSON.parse(storedOpps)
        : initialOpportunities;
      const parsedSkills = storedSkills
        ? JSON.parse(storedSkills)
        : initialSkills;
      const parsedEvents = storedEvents
        ? JSON.parse(storedEvents)
        : initialEvents;
      const parsedBookmarks = storedBookmarks
        ? JSON.parse(storedBookmarks)
        : [];

      // These state updates hydrate client-only localStorage data once on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUsers(parsedUsers);
      setOpportunities(parsedOpps);
      setSkills(parsedSkills);
      setEvents(parsedEvents);
      setBookmarkedOpportunityIds(parsedBookmarks);

      if (storedCurrentUser) {
        const found = parsedUsers.find(
          (u: User) => u.id === JSON.parse(storedCurrentUser).id
        );
        // No auto-login fallback: unknown/stale session starts logged out
        setCurrentUser(found || null);
      } else {
        setCurrentUser(null);
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save changes to localStorage
  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(newUsers));
  };

  const saveOpps = (newOpps: Opportunity[]) => {
    setOpportunities(newOpps);
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(newOpps));
  };

  const saveSkills = (newSkills: Skill[]) => {
    setSkills(newSkills);
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(newSkills));
  };

  const saveEvents = (newEvents: CommunityEvent[]) => {
    setEvents(newEvents);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(newEvents));
  };

  const saveBookmarks = (newBookmarks: string[]) => {
    setBookmarkedOpportunityIds(newBookmarks);
    localStorage.setItem(
      STORAGE_KEYS.BOOKMARKS,
      JSON.stringify(newBookmarks)
    );
  };

  const addToast = (
    title: string,
    description?: string,
    type: "success" | "error" | "info" | "warning" = "success"
  ) => {
    const iconMap = { success: "success", error: "error", warning: "warning", info: "info" } as const;
    setNotificationModal({ title, description, icon: iconMap[type] || "info" });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string): boolean => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      if (typeof document !== "undefined") {
        document.cookie = `a5_user=${encodeURIComponent(found.id)}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `a5_role=${found.roleType || (found.email.includes("admin") ? "admin" : "member")}; path=/; max-age=86400; SameSite=Lax`;
      }
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(found)
      );
      addToast(
        `Welcome back, ${found.name.split(" ")[0]}!`,
        "You are now logged in.",
        "success"
      );
      return true;
    }
    return false;
  };

  const switchDemoRole = (role: "member" | "admin") => {
    // Only admins may switch into the admin role
    if (role === "admin" && currentUser?.roleType !== "admin") {
      addToast(
        "Admin only",
        "Only admins can switch to the admin workspace.",
        "error"
      );
      return;
    }
    const targetEmail =
      role === "admin" ? "admin@example.com" : "member@example.com";
    const found = users.find((u) => u.email === targetEmail);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(found)
      );
      if (typeof document !== "undefined") {
        document.cookie = `a5_user=${encodeURIComponent(found.id)}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `a5_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      }
      addToast(
        `Switched to ${role === "admin" ? "Admin" : "Member"} demo account`,
        `Logged in as ${found.name}`,
        "info"
      );
    }
  };

  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    // Members may not switch into an admin account
    if (found && found.roleType === "admin" && currentUser?.roleType !== "admin") {
      addToast(
        "Admin only",
        "Only admins can switch to an admin account.",
        "error"
      );
      return;
    }
    if (found) {
      setCurrentUser(found);
      localStorage.setItem(
        STORAGE_KEYS.CURRENT_USER,
        JSON.stringify(found)
      );
      if (typeof document !== "undefined") {
        document.cookie = `a5_user=${encodeURIComponent(found.id)}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `a5_role=${found.roleType || (found.email.includes("admin") ? "admin" : "member")}; path=/; max-age=86400; SameSite=Lax`;
      }
      addToast(
        "Switched account",
        `Logged in as ${found.name}`,
        "info"
      );
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    if (typeof document !== "undefined") {
      document.cookie = "a5_user=; path=/; max-age=0; SameSite=Lax";
      document.cookie = "a5_role=; path=/; max-age=0; SameSite=Lax";
    }
    addToast("Logged out", "You have been logged out successfully.", "info");
  };

  const register = (name: string, email: string, batch: string): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      batch: batch || "Angkatan 5 (2018)",
      location: "Jakarta, Indonesia",
      role: "Community Member",
      company: "Independent",
      industry: "Technology",
      experience: "1+ years",
      experienceYears: 1,
      bio: "Excited to connect with fellow Angkatan 5 alumni!",
      skills: ["Software Development", "UI/UX Design"],
      status: "Available to Help",
      lookingFor: ["Networking", "Collaboration"],
      canOffer: ["Collaboration"],
      profileCompletion: 40,
      visibility: "community",
      roleType: "member",
      verified: false,
      joinedAt: new Date().toISOString().split("T")[0],
    };

    const newUsers = [newUser, ...users];
    saveUsers(newUsers);
    setCurrentUser(newUser);
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(newUser)
    );
    addToast(
      "Account created!",
      "Please complete your onboarding profile setup.",
      "success"
    );
    return newUser;
  };

  const updateProfile = (userId: string, data: Partial<User>) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        // Calculate profile completion
        const merged = { ...u, ...data };
        let fieldsFilled = 0;
        const checkFields = [
          merged.name,
          merged.avatar,
          merged.location,
          merged.batch,
          merged.role,
          merged.company,
          merged.industry,
          merged.bio,
          merged.skills?.length > 0,
          merged.lookingFor?.length > 0,
          merged.canOffer?.length > 0,
          merged.linkedin || merged.portfolio || merged.website,
        ];
        checkFields.forEach((val) => {
          if (val) fieldsFilled += 1;
        });
        merged.profileCompletion = Math.min(
          100,
          Math.round((fieldsFilled / checkFields.length) * 100)
        );
        return merged;
      }
      return u;
    });

    saveUsers(updated);
      if (currentUser?.id === userId) {
      const updatedCurrent = updated.find((u) => u.id === userId);
      if (updatedCurrent) {
        setCurrentUser(updatedCurrent);
        localStorage.setItem(
          STORAGE_KEYS.CURRENT_USER,
          JSON.stringify(updatedCurrent)
        );
      }
    }
  };

  const completeOnboarding = (data: Partial<User>) => {
    if (!currentUser) return;
    updateProfile(currentUser.id, {
      ...data,
      profileCompletion: 85,
    });
    addToast(
      "Profile setup complete!",
      "Welcome to the Angkatan 5 Talent Network.",
      "success"
    );
  };

  const createOpportunity = (
    data: Omit<
      Opportunity,
      | "id"
      | "createdAt"
      | "authorId"
      | "authorName"
      | "authorAvatar"
      | "authorRole"
      | "authorCompany"
    >
  ): Opportunity => {
    const author = currentUser || users[0];
    const newOpp: Opportunity = {
      ...data,
      id: `opp-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      authorRole: author.role,
      authorCompany: author.company,
      status: "Published",
      createdAt: new Date().toISOString(),
    };

    const newOpps = [newOpp, ...opportunities];
    saveOpps(newOpps);
    addToast(
      "Opportunity published!",
      "Your opportunity is now live on the community board.",
      "success"
    );
    return newOpp;
  };

  const updateOpportunityStatus = (id: string, status: OpportunityStatus) => {
    const updated = opportunities.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    saveOpps(updated);
    addToast(
      "Status updated",
      `Opportunity status is now ${status}.`,
      "info"
    );
  };

  const deleteOpportunity = (id: string) => {
    const updated = opportunities.filter((o) => o.id !== id);
    saveOpps(updated);
    addToast(
      "Opportunity deleted",
      "The opportunity has been removed.",
      "info"
    );
  };

  const createEvent = (
    data: Omit<
      CommunityEvent,
      | "id"
      | "createdAt"
      | "organizerId"
      | "organizerName"
      | "organizerAvatar"
      | "attendeeIds"
      | "status"
    >
  ): CommunityEvent => {
    const organizer = currentUser || users[0];
    const newEvent: CommunityEvent = {
      ...data,
      id: `evt-${Date.now()}`,
      organizerId: organizer.id,
      organizerName: organizer.name,
      organizerAvatar: organizer.avatar,
      attendeeIds: [organizer.id],
      status: "Upcoming",
      createdAt: new Date().toISOString(),
    };

    const newEvents = [newEvent, ...events];
    saveEvents(newEvents);
    addToast(
      "Event published!",
      "Your event is now live on the community board.",
      "success"
    );
    return newEvent;
  };

  const joinEvent = (id: string) => {
    if (!currentUser) return;
    const updated = events.map((e) => {
      if (e.id !== id) return e;
      if (e.attendeeIds.includes(currentUser.id)) return e;
      if (e.capacity > 0 && e.attendeeIds.length >= e.capacity) return e;
      return { ...e, attendeeIds: [...e.attendeeIds, currentUser.id] };
    });
    saveEvents(updated);
    addToast(
      "You're in!",
      "Your spot has been reserved. See you there.",
      "success"
    );
  };

  const leaveEvent = (id: string) => {
    if (!currentUser) return;
    const updated = events.map((e) =>
      e.id === id
        ? { ...e, attendeeIds: e.attendeeIds.filter((a) => a !== currentUser.id) }
        : e
    );
    saveEvents(updated);
    addToast("Spot released", "You've left this event.", "info");
  };

  const cancelEvent = (id: string) => {
    const updated = events.map((e) =>
      e.id === id ? { ...e, status: "Cancelled" as const } : e
    );
    saveEvents(updated);
    addToast("Event cancelled", "Attendees will see the updated status.", "info");
  };

  const toggleBookmark = (opportunityId: string) => {
    let updated: string[];
    if (bookmarkedOpportunityIds.includes(opportunityId)) {
      updated = bookmarkedOpportunityIds.filter((id) => id !== opportunityId);
      addToast(
        "Bookmark removed",
        "Removed from your saved opportunities.",
        "info"
      );
    } else {
      updated = [...bookmarkedOpportunityIds, opportunityId];
      addToast(
        "Opportunity saved",
        "Added to your saved opportunities.",
        "success"
      );
    }
    saveBookmarks(updated);
  };

  const isBookmarked = (opportunityId: string) => {
    return bookmarkedOpportunityIds.includes(opportunityId);
  };

  const addSkill = (name: string, category: SkillCategory) => {
    if (!name.trim()) return;
    const exists = skills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      addToast("Skill exists", `"${name}" is already in the list.`, "warning");
      return;
    }
    const newSkill: Skill = {
      id: `sk-${Date.now()}`,
      name: name.trim(),
      category,
      memberCount: 1,
    };
    const updated = [...skills, newSkill];
    saveSkills(updated);
    addToast(
      "Skill added",
      `"${name}" has been added to skills directory.`,
      "success"
    );
  };

  const renameSkill = (id: string, newName: string) => {
    const oldSkill = skills.find((s) => s.id === id);
    if (!oldSkill || !newName.trim()) return;
    const oldName = oldSkill.name;

    const updatedSkills = skills.map((s) =>
      s.id === id ? { ...s, name: newName.trim() } : s
    );
    saveSkills(updatedSkills);

    // Update members having this skill
    const updatedMembers = users.map((u) => ({
      ...u,
      skills: u.skills.map((sk) => (sk === oldName ? newName.trim() : sk)),
    }));
    saveUsers(updatedMembers);

    addToast(
      "Skill renamed",
      `Renamed "${oldName}" to "${newName}".`,
      "success"
    );
  };

  const mergeSkills = (sourceId: string, targetId: string) => {
    const source = skills.find((s) => s.id === sourceId);
    const target = skills.find((s) => s.id === targetId);
    if (!source || !target || sourceId === targetId) return;

    // Update all users who have source to have target instead (no dupes)
    const updatedMembers = users.map((u) => {
      if (u.skills.includes(source.name)) {
        const withoutSource = u.skills.filter((s) => s !== source.name);
        if (!withoutSource.includes(target.name)) {
          withoutSource.push(target.name);
        }
        return { ...u, skills: withoutSource };
      }
      return u;
    });
    saveUsers(updatedMembers);

    const updatedSkills = skills
      .filter((s) => s.id !== sourceId)
      .map((s) =>
        s.id === targetId
          ? { ...s, memberCount: s.memberCount + source.memberCount }
          : s
      );
    saveSkills(updatedSkills);

    addToast(
      "Skills merged",
      `Merged "${source.name}" into "${target.name}".`,
      "success"
    );
  };

  const deleteSkill = (id: string) => {
    const skill = skills.find((s) => s.id === id);
    if (!skill) return;
    const updated = skills.filter((s) => s.id !== id);
    saveSkills(updated);
    addToast(
      "Skill removed",
      `"${skill.name}" was removed from the directory.`,
      "info"
    );
  };

  const verifyMember = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, verified: !u.verified } : u
    );
    saveUsers(updated);
    addToast("Member updated", "Verification status changed.", "success");
  };

  const suspendMember = (id: string) => {
    const updated = users.map((u) =>
      u.id === id ? { ...u, suspended: !u.suspended } : u
    );
    saveUsers(updated);
    addToast("Member updated", "Suspension status changed.", "warning");
  };

  const deleteMember = (id: string) => {
    const updated = users.filter((u) => u.id !== id);
    saveUsers(updated);
    addToast("Member deleted", "User was removed from the network.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        opportunities,
        skills,
        events,
        bookmarkedOpportunityIds,
        toasts,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
        completeOnboarding,
        createOpportunity,
        updateOpportunityStatus,
        deleteOpportunity,
        createEvent,
        joinEvent,
        leaveEvent,
        cancelEvent,
        toggleBookmark,
        isBookmarked,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addSkill,
        renameSkill,
        mergeSkills,
        deleteSkill,
        verifyMember,
        suspendMember,
        deleteMember,
        addToast,
        removeToast,
        switchDemoRole,
        switchUser,
      }}
    >
      {children}
      <Modal
        isOpen={!!notificationModal}
        onClose={() => setNotificationModal(null)}
        title={notificationModal?.title}
        description={notificationModal?.description}
        icon={notificationModal?.icon || "info"}
        centered
        maxWidth="sm"
      >
        <div className="flex justify-center">
          <Button variant="primary" size="md" onClick={() => setNotificationModal(null)} className="px-6">
            Done
          </Button>
        </div>
      </Modal>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
