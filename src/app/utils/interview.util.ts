export function isInterviewPast(date: string, time: string): boolean {
  const interviewDateTime = new Date(`${date}T${time}`);
  return interviewDateTime.getTime() < Date.now();
}