import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../context/ToastContext';
import './Contests.css';

const ContestCountdown = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(endDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft('Contest Ended');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);
      setTimeLeft(parts.join(' '));
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  return (
    <div className="contest-countdown">
      <i className="fas fa-hourglass-half"></i> Time Left: <strong>{timeLeft}</strong>
    </div>
  );
};

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContest, setSelectedContest] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const { success, error } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (id && contests.length > 0) {
      const found = contests.find(c => String(c._id) === String(id));
      if (found) {
        setSelectedContest(found);
      } else {
        setSelectedContest(null);
      }
    } else {
      setSelectedContest(null);
    }
  }, [id, contests]);

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

  const handleOpenContest = (contest) => {
    navigate(`/contests/${contest._id}`);
  };

  const handleCloseContest = () => {
    navigate('/contests');
  };

  const handleParticipate = async (contestId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      error('Please login to participate in the contest!');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
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
                <div className="contest-image-wrapper" onClick={() => handleOpenContest(contest)}>
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
                  <h3 className="contest-title" onClick={() => handleOpenContest(contest)} style={{ cursor: 'pointer' }}>
                    {contest.title}
                  </h3>
                  <p className="contest-description">{contest.description}</p>
                  
                  <div className="contest-dates">
                    <div className="date-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Ends: {new Date(contest.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-participate"
                    onClick={() => handleOpenContest(contest)}
                  >
                    View Details & Enter <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dedicated Detail Modal Popup */}
      {selectedContest && (
        <div className="contest-modal-overlay" onClick={handleCloseContest}>
          <div className="contest-modal-content animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <button className="contest-modal-close" onClick={handleCloseContest} aria-label="Close modal">
              <i className="fas fa-times"></i>
            </button>
            
            <div className="contest-modal-header">
              {selectedContest.bannerImage ? (
                <img 
                  src={selectedContest.bannerImage} 
                  alt={selectedContest.title} 
                  className="contest-modal-image" 
                  onClick={() => setLightboxImage(selectedContest.bannerImage)}
                  title="Click to zoom banner details"
                  style={{ cursor: 'pointer' }}
                />
              ) : (
                <div className="contest-modal-image-placeholder">
                  <i className="fas fa-gift"></i>
                </div>
              )}
              <div className="contest-modal-badge">Exclusive Giveaway</div>
            </div>

            <div className="contest-modal-body">
              <h2 className="contest-modal-title">{selectedContest.title}</h2>
              
              <div className="contest-modal-meta">
                <div className="meta-item dates">
                  <i className="fas fa-calendar-alt"></i>
                  <span>Ends: {new Date(selectedContest.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <ContestCountdown endDate={selectedContest.endDate} />
              </div>

              <div className="contest-modal-section">
                <h3><i className="fas fa-align-left"></i> About the Giveaway</h3>
                <p className="contest-modal-description">{selectedContest.description}</p>
              </div>

              {selectedContest.rules && (
                <div className="contest-modal-section">
                  <h3><i className="fas fa-clipboard-list"></i> Participation Rules & Guidelines</h3>
                  <div className="contest-modal-rules">
                    {selectedContest.rules.split('\n').filter(r => r.trim()).map((rule, idx) => (
                      <div key={idx} className="rule-bullet">
                        <i className="fas fa-check-circle"></i>
                        <span>{rule.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContest.googleFormLink && (
                <div className="contest-modal-section submission-form-section">
                  <h3><i className="fas fa-file-alt"></i> Submit Your Entry / Design</h3>
                  <p className="submission-helper-text">To submit your design or other contest submissions, please fill out the official form below:</p>
                  <a 
                    href={selectedContest.googleFormLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-contest-submission"
                  >
                    Open Submission Form <i className="fas fa-external-link-alt"></i>
                  </a>
                </div>
              )}

              <div className="contest-modal-footer">
                <button 
                  className="btn-modal-participate"
                  onClick={() => handleParticipate(selectedContest._id)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting Entry...
                    </>
                  ) : (
                    <>
                      Participate Now & Win <i className="fas fa-trophy"></i>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for banner viewing */}
      {lightboxImage && (
        <div className="contest-lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="contest-lightbox-content animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <button className="contest-lightbox-close" onClick={() => setLightboxImage(null)} aria-label="Close image preview">
              <i className="fas fa-times"></i>
            </button>
            <img src={lightboxImage} alt="Contest Banner Detail" className="contest-lightbox-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Contests;
