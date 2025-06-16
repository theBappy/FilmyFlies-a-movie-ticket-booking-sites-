export default function reminderEmailBody({ userName, movieTitle, showTime, timeZone = 'Asia/Dhaka' }) {
  const date = new Date(showTime);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone,
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    timeZone,
  }).format(date);

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #2196F3;">🎬 Movie Reminder</h2>
      <p>Hi ${userName},</p>
      <p>This is a reminder for your upcoming movie:</p>

      <ul>
        <li><strong>Movie:</strong> ${movieTitle}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime}</li>
      </ul>

      <p>Please arrive 10–15 minutes early to enjoy your show. 🍿</p>

      <hr />
      <p style="font-size: 12px; color: #888;">This is an automated reminder. Please do not reply.</p>
    </div>
  `;
}
