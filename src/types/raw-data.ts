export interface RawData {
  sessions: Session[];
  speakers: Speaker[];
  session_types: SessionType[];
  rooms: Room[];
  tags: Tag[];
}

export interface Session {
  id: string;
  type: string;
  room: string;
  start: string;
  end: string;
  language: string;
  zh: SessionI18n;
  en: SessionI18n;
  speakers: string[];
  tags: string[];
  co_write: string | null;
  qa: string | null;
  slide: string | null;
  record: string | null;
  uri: string;
}

export interface SessionI18n {
  title: string;
  description: string;
}

export interface Speaker {
  id: string;
  avatar: string;
  zh: SpeakerI18n;
  en: SpeakerI18n;
}

export interface SpeakerI18n {
  name: string;
  bio: string;
}

export interface SessionType {
  id: string;
  zh: SessionTypeI18n;
  en: SessionTypeI18n;
}

export interface SessionTypeI18n {
  name: string;
}

export interface Room {
  id: string;
  zh: RoomI18n;
  en: RoomI18n;
}

export interface RoomI18n {
  name: string;
}

export interface Tag {
  id: string;
  zh: TagI18n;
  en: TagI18n;
}

export interface TagI18n {
  name: string;
}
