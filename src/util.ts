import * as Luxon from 'luxon';
import type { RawData } from './types/raw-data';
import type { Data, College, Department, Course } from './types/data';

export const COSCUP_YEAR = process.env.COSCUP_YEAR ?? '2077';
export const COSCUP_DAYS = JSON.parse(process.env.COSCUP_DAYS ?? '[]') as string[];
export const COSCUP_TIMEZONE = process.env.COSCUP_TIMEZONE ?? '+08:00';

export const DAYS = COSCUP_DAYS.map((day, index) => ({
  key: `${1 + index}`,
  name: `Day ${1 + index}`,
  date: day,
}));

export const HOURS = [
  { key: '1', name: '1', start: '08:00:00', end: '09:00:00' },
  { key: '2', name: '2', start: '09:00:00', end: '10:00:00' },
  { key: '3', name: '3', start: '10:00:00', end: '11:00:00' },
  { key: '4', name: '4', start: '11:00:00', end: '12:00:00' },
  { key: 'Z', name: 'Z', start: '12:00:00', end: '13:00:00' },
  { key: '5', name: '5', start: '13:00:00', end: '14:00:00' },
  { key: '6', name: '6', start: '14:00:00', end: '15:00:00' },
  { key: '7', name: '7', start: '15:00:00', end: '16:00:00' },
  { key: '8', name: '8', start: '16:00:00', end: '17:00:00' },
  { key: '9', name: '9', start: '17:00:00', end: '18:00:00' },
  { key: 'A', name: 'A', start: '18:00:00', end: '19:00:00' },
  { key: 'B', name: 'B', start: '19:00:00', end: '20:00:00' },
  { key: 'C', name: 'C', start: '20:00:00', end: '21:00:00' },
  { key: 'D', name: 'D', start: '21:00:00', end: '22:00:00' },
];

export const DAY_HOURS = DAYS.flatMap(
  (day, i) => HOURS.map(
    (hour, j) => ({
      i, j,
      day, hour,
      key: `${day.key}-${hour.key}`,
      interval: Luxon.Interval.fromDateTimes(
        Luxon.DateTime.fromISO(`${day.date}T${hour.start}${COSCUP_TIMEZONE}`),
        Luxon.DateTime.fromISO(`${day.date}T${hour.end}${COSCUP_TIMEZONE}`),
      ),
    }),
  ),
);

export function makeData(rawData: RawData): Data {
  const defaultCollegeId = `coscup-${COSCUP_YEAR}`;
  const defaultCollegeName = `COSCUP ${COSCUP_YEAR}`;

  const colleges: College[] = [
    {
      collegeId: defaultCollegeId,
      collegeName: defaultCollegeName,
    },
  ];

  const departments: Department[] = rawData.session_types.map((session_type) => ({
    departmentId: session_type.id,
    departmentName: session_type.zh.name,
    collegeId: defaultCollegeId,
  }));

  const courses: Course[] = rawData.sessions.map((session, index) => {
    const interval = Luxon.Interval.fromDateTimes(
      Luxon.DateTime.fromISO(session.start),
      Luxon.DateTime.fromISO(session.end),
    );

    return {
      serialNo: 1 + index,
      classNo: session.id,
      title: session.zh.title,
      credit: interval.toDuration().as('minutes'),
      passwordCard: 'NONE',
      teachers: session.speakers.map((speakerId) => rawData.speakers.find((speaker) => speaker.id === speakerId)!.zh.name),
      classTimes: DAY_HOURS.filter((dayHour) => dayHour.interval.overlaps(interval)).map((dayHour) => dayHour.key),
      limitCnt: null,
      admitCnt: 0,
      waitCnt: 0,
      collegeIds: [defaultCollegeId],
      departmentIds: [session.type],
      courseType: session.tags.includes('Prime') ? 'REQUIRED' : 'ELECTIVE',
      // Extra properties:
      classRooms: [session.room],
      languages: [session.language],
      tags: session.tags,
      interval: interval.toISO(),
      detailUrl: session.uri,
    };
  });

  return {
    colleges,
    departments,
    courses,
    LAST_UPDATE_TIME: new Date().toISOString(),
  };
}
