// TicketQRCode.js
import React from "react";
import QRCode from "react-qr-code";

const TicketQRCode = ({ ticket }) => {
  if (!ticket) {
    return <p>No ticket data available</p>;
  }

  // Encode important ticket information as a string for the QR code
  const qrData = JSON.stringify({
    ticketId: ticket.ticketId,
    occasionId: ticket.occasionId,
    seatNumber: ticket.seatNumber,
    owner: ticket.owner,
    seller:ticket.seller
  });
console.log(qrData);

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h3>QR Code for Ticket</h3>
      <QRCode value={qrData} size={200} />
      <p>
        <strong>Ticket ID:</strong> {ticket.ticketId} <br />
        <strong>Event:</strong> {ticket.occasionId} <br />
        <strong>Seat:</strong> {ticket.seatNumber}
      </p>
    </div>
  );
};

export default TicketQRCode;
