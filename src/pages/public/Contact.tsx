import React, { useState } from 'react';
import Section from '@/components/common/Section';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('General');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const endpoint = 'https://formspree.io/f/mgvnzqdp';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    setSending(true);
    setStatus(null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          inquiryType,
          message
        })
      });

      if (res.ok) {
        setStatus('Message sent successfully! We will get back to you shortly.');
        setName('');
        setEmail('');
        setInquiryType('General');
        setMessage('');
      } else {
        setStatus('Failed to send message. Please try again later.');
      }
    } catch (error) {
      setStatus('Failed to send message. Please check your connection.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <Section title="Contact">
        <form className="card" style={{ padding: 16, display: 'grid', gap: 12 }} onSubmit={onSubmit}>
          <input 
            placeholder="Name" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            placeholder="Email" 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select 
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
          >
            <option>General</option>
            <option>Prototype</option>
            <option>Dealership</option>
          </select>
          <textarea 
            placeholder="Message" 
            rows={4} 
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          {status && (
            <div style={{ 
              padding: '10px', 
              borderRadius: '8px', 
              backgroundColor: status.includes('successfully') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              color: status.includes('successfully') ? '#4caf50' : '#f44336',
              fontSize: '14px'
            }}>
              {status}
            </div>
          )}
          <button 
            className="card" 
            style={{ padding: 10, cursor: 'pointer' }}
            disabled={sending || !name || !email || !message}
            type="submit"
          >
            {sending ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </Section>
    </div>
  );
}
