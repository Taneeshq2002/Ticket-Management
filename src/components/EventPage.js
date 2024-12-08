import React, { useState } from 'react';
import { ethers } from 'ethers';

const EventPage = ({ tokenMasterContract }) => {
    const [eventDetails, setEventDetails] = useState({
        name: '',
        cost: '',
        maxTickets: '',
        date: '',
        time: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            const { name, cost, maxTickets, date, time, location } = eventDetails;

            const costInWei = ethers.utils.parseEther(cost);

            const tx = await tokenMasterContract.list(
                name,
                costInWei,
                maxTickets,
                date,
                time,
                location
            );

            await tx.wait(); // Wait for the transaction to be mined
            setSuccess('Event successfully listed!');
        } catch (error) {
            console.error('Error listing event:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="event-page">
            <h2>List a New Event</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Event Name:
                    <input
                        type="text"
                        name="name"
                        value={eventDetails.name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Ticket Cost (ETH):
                    <input
                        type="text"
                        name="cost"
                        value={eventDetails.cost}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Maximum Tickets:
                    <input
                        type="number"
                        name="maxTickets"
                        value={eventDetails.maxTickets}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Event Date:
                    <input
                        type="date"
                        name="date"
                        value={eventDetails.date}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Event Time:
                    <input
                        type="time"
                        name="time"
                        value={eventDetails.time}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Location:
                    <input
                        type="text"
                        name="location"
                        value={eventDetails.location}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" disabled={loading}>
                    {loading ? 'Listing...' : 'List Event'}
                </button>
            </form>
            {success && <p className="success">{success}</p>}
        </div>
    );
};

export default EventPage;
