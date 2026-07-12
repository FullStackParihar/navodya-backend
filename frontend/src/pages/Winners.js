import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './Winners.css';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      const result = await api.get('/winners');
      if (result.success) {
        setWinners(result.data);
      }
    } catch (err) {
      console.error('Error fetching winners:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="winners-loader">
        <div className="spinner"></div>
        <p>Loading the Hall of Fame...</p>
      </div>
    );
  }

  return (
    <div className="winners-page">
      <div className="winners-hero">
        <h1>🏆 Hall of Fame</h1>
        <p>Celebrating the lucky winners of our exclusive Navodaya Giveaways & Contests!</p>
      </div>

      <div className="winners-container">
        {winners.length === 0 ? (
          <div className="no-winners-state">
            <i className="fas fa-medal"></i>
            <h2>No Winners Yet</h2>
            <p>Participate in our active contests for a chance to be featured here!</p>
          </div>
        ) : (
          <div className="winners-grid">
            {winners.map((winner) => (
              <div key={winner._id} className="winner-card animate-fadeInUp">
                <div className="winner-contest-banner">
                  {winner.contest_id?.bannerImage ? (
                    <img src={winner.contest_id.bannerImage} alt={winner.contest_id.title} />
                  ) : (
                    <div className="banner-placeholder">
                      <i className="fas fa-gift"></i>
                    </div>
                  )}
                  <div className="winner-badge"><i className="fas fa-crown"></i> Winner</div>
                </div>
                
                <div className="winner-content">
                  <div className="winner-profile">
                    <div className="winner-avatar">
                      {winner.user_id?.name ? winner.user_id.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div className="winner-info">
                      <h3 className="winner-name">{winner.user_id?.name || 'Anonymous User'}</h3>
                      {winner.showUserDetails && winner.user_id?.email && (
                        <span className="winner-email">{winner.user_id.email}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="winner-details">
                    <div className="detail-row">
                      <span className="detail-label"><i className="fas fa-trophy"></i> Contest:</span>
                      <span className="detail-value">{winner.contest_id?.title || 'Unknown Contest'}</span>
                    </div>
                    <div className="detail-row prize-row">
                      <span className="detail-label"><i className="fas fa-gift"></i> Prize Won:</span>
                      <span className="detail-value highlight">{winner.prize}</span>
                    </div>
                    <div className="detail-row date-row">
                      <span className="detail-label"><i className="far fa-calendar-check"></i> Date:</span>
                      <span className="detail-value">
                        {new Date(winner.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Winners;
