<script lang="ts">
  export let eventId: number;
  export let title: string;
  export let description: string;
  export let start: string;
  export let end: string;
  export let location: string = '';

  function formatDateForCalendar(dt: string) {
    const d = new Date(dt);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  const startStr = formatDateForCalendar(start);
  const endStr = formatDateForCalendar(end);

  const googleUrl =
    https://calendar.google.com/calendar/render?action=TEMPLATE&text= +
    &dates=/ +
    &details= +
    &location=;

  const outlookUrl =
    https://outlook.live.com/owa/?rru=addevent&subject= +
    &startdt= +
    &enddt= +
    &body= +
    &location=;

  const icsUrl = /api/events//ical;
</script>

<div class="flex space-x-2">
  <a href={icsUrl} download={event-.ics} class="btn">Download .ICS</a>
  <a href={googleUrl} target="_blank" rel="noopener" class="btn">Google Calendar</a>
  <a href={outlookUrl} target="_blank" rel="noopener" class="btn">Outlook</a>
</div>
