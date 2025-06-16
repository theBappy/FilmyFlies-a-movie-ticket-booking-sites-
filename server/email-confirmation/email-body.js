const htmlBody = (booking, timeZone) => {
  const show = booking?.show;
  const movie = show?.movie;
  const user = booking?.user;

  const showDate = new Date(show?.showDateTime || Date.now());

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    timeZone,
    dateStyle: 'long',
  }).format(showDate);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeStyle: 'short',
  }).format(showDate);

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto;">
      <h2 style="color: #4CAF50;">🎬 Booking Confirmation (Pending Payment)</h2>
      <p>Hi ${user?.name || 'there'},</p>
      <p>You've successfully reserved the following seats for your upcoming show:</p>
      
      <ul>
        <li><strong>Seats:</strong> ${booking?.bookedSeats?.join(', ') || 'N/A'}</li>
        <li><strong>Show:</strong> ${movie?.title || 'Your selected movie/show'}</li>
        <li><strong>Date:</strong> ${formattedDate}</li>
        <li><strong>Time:</strong> ${formattedTime}</li>
        <li><strong>Amount:</strong> $${(booking?.amount / 100).toFixed(2)} USD</li>
      </ul>

      <p><strong>⚠️ Important notice for unpaid booked:</strong> Please complete the payment within <strong>15 minutes</strong>. 
      Otherwise, your selected seats will be released and the order will be automatically deleted.</p>

      <p>Thank you for choosing <strong>FilmyFlies</strong>! 🍿</p>

      <hr />
      <p style="font-size: 12px; color: #888;">This is an automated message. Please do not reply.</p>
    </div>
  `;
};

export default htmlBody;
