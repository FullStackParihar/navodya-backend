import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import './Contests.css';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const result = await api.get('/contests');
      if (result.success) {
        setContests(result.data);
      } else {
        error('Failed to load contests');
      }
    } catch (err) {
      console.error('Error fetching contests:', err);
      error('An error occurred while loading contests');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (contestId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      error('Please login to participate in the contest!');
      navigate('/login');
      return;
    }

    try {
      const result = await api.post(`/contests/${contestId}/participate`);
      if (result.success) {
        success('Congratulations! You have successfully entered the contest.');
      } else {
        error(result.message || 'Could not enter the contest');
      }
    } catch (err) {
      console.error('Error participating:', err);
      error('An error occurred. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="contests-loader">
        <div className="spinner"></div>
        <p>Loading Exciting Giveaways...</p>
      </div>
    );
  }

  return (
    <div className="contests-page">
      <div className="contests-hero">
        <h1>Exclusive Giveaways & Contests</h1>
        <p>Participate now for a chance to win premium Navodaya merchandise and exclusive rewards!</p>
      </div>

      <div className="contests-container">
        {contests.length === 0 ? (
          <div className="no-contests-state">
            <i className="fas fa-box-open"></i>
            <h2>No Active Contests</h2>
            <p>Check back later for exciting new giveaways!</p>
          </div>
        ) : (
          <div className="contests-grid">
            {contests.map((contest) => (
              <div key={contest._id} className="contest-card animate-fadeInUp">
                <div className="contest-image-wrapper">
                  {contest.bannerImage ? (
                    <img src={contest.bannerImage} alt={contest.title} className="contest-image" />
                  ) : (
                    <div className="contest-image-placeholder">
                      <i className="fas fa-gift"></i>
                    </div>
                  )}
                  <div className="contest-badge">Active</div>
                </div>
                
                <div className="contest-content">
                  <h3 className="contest-title">{contest.title}</h3>
                  <p className="contest-description">{contest.description}</p>
                  
                  <div className="contest-rules">
                    <strong><i className="fas fa-info-circle"></i> Rules:</strong>
                    <p>{contest.rules}</p>
                  </div>
                  
                  <div className="contest-dates">
                    <div className="date-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Ends: {new Date(contest.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-participate"
                    onClick={() => handleParticipate(contest._id)}
                  >
                    Participate Now <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
