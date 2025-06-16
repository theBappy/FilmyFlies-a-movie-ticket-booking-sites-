const htmlBody = (booking, timeZone = 'Asia/Dhaka') => {
  const showDateTime = new Date(booking.show.showDateTime);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeZone,
  }).format(showDateTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeStyle: 'short',
    timeZone,
  }).format(showDateTime);

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #4CAF50;">🎬 Booking Confirmation (Pending Payment)</h2>
      <p>Hi ${booking.user.name || 'there'},</p>
      <p>You've successfully reserved the following seats for your upcoming show:</p>
      <ul>
        <li><strong>Seats:</strong> ${booking.show.seats.join(', ')}</li>
        <li><strong>Show:</strong> ${booking.show.movie.title}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime} (${timeZone})</li>
        <li><strong>Amount:</strong> $${(booking.amount / 100).toFixed(2)} USD</li>
      </ul>
      <p><strong>⚠️ Important:</strong> Please complete the payment within <strong>15 minutes</strong>. 
      Otherwise, your selected seats will be released and the order will be automatically deleted.</p>
      <p>Thank you for choosing <strong>FilmyFlies</strong>! 🍿</p>
      <hr />
      <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
  `;
};

export default htmlBody;
