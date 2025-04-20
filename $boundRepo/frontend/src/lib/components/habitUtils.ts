export function calculateStreak(checkins: Array<{ date: string }>): number {
  const dates = checkins.map(c => new Date(c.date).toDateString()).sort();
  let streak = 0;
  for(let i=dates.length-1;i>=0;i--){
    const expected = new Date(); expected.setDate(expected.getDate()-streak);
    if(new Date(dates[i]).toDateString() === expected.toDateString()) streak++; else break;
  }
  return streak;
}
export async function onCheckin(habitId: number) {
  await fetch(/api/habits//checkin,{method:'POST'});
  location.reload();
}
