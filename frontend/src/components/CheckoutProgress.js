import React from 'react';

const CheckoutProgress = ({ currentStep = 1, steps = [] }) => {
  const defaultSteps = [
    { id: 1, name: 'Cart', icon: 'fas fa-shopping-cart' },
    { id: 2, name: 'Address', icon: 'fas fa-map-marker-alt' },
    { id: 3, name: 'Payment', icon: 'fas fa-credit-card' },
    { id: 4, name: 'Review', icon: 'fas fa-eye' },
    { id: 5, name: 'Complete', icon: 'fas fa-check' }
  ];

  const checkoutSteps = steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="checkout-progress">
      <div className="progress-container">
        {checkoutSteps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isLast = index === checkoutSteps.length - 1;

          return (
            <div key={step.id} className="progress-step">
              <div className="step-connector">
                {!isLast && (
                  <div 
                    className={`connector-line ${isCompleted ? 'completed' : ''}`}
                  ></div>
                )}
              </div>
              
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? (
                  <i className="fas fa-check"></i>
                ) : (
                  <i className={step.icon}></i>
                )}
              </div>
              
              <div className="step-info">
                <span className="step-name">{step.name}</span>
                <span className="step-number">{index + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .checkout-progress {
          background: var(--bg-primary, white);
          border-radius: var(--radius-xl, 1rem);
          padding: 2rem;
          box-shadow: var(--shadow-md, 0 4px 6px -1px rgb(0 0 0 / 0.1));
          margin-bottom: 2rem;
        }

        .progress-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
        }

        .step-connector {
          position: absolute;
          top: 25px;
          left: 50%;
          width: 100%;
          z-index: 0;
        }

        .connector-line {
          height: 2px;
          background: var(--gray-200, #e2e8f0);
          transition: background-color var(--transition-normal);
        }

        .connector-line.completed {
          background: var(--gradient-primary, linear-gradient(90deg, #ff6b35, #e55a2b));
        }

        .step-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: var(--gray-200, #e2e8f0);
          color: var(--text-secondary, #64748b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.125rem;
          transition: all var(--transition-normal);
          position: relative;
          z-index: 1;
          border: 3px solid var(--bg-primary, white);
        }

        .step-circle.active {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: white;
          transform: scale(1.1);
          box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
        }

        .step-circle.completed {
          background: var(--gradient-primary, linear-gradient(135deg, #ff6b35, #e55a2b));
          color: white;
        }

        .step-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.75rem;
        }

        .step-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary, #64748b);
          transition: color var(--transition-normal);
        }

        .step-circle.active ~ .step-info .step-name {
          color: var(--primary-color, #ff6b35);
          font-weight: 600;
        }

        .step-circle.completed ~ .step-info .step-name {
          color: var(--text-primary, #1e293b);
          font-weight: 600;
        }

        .step-number {
          font-size: 0.75rem;
          color: var(--text-muted, #94a3b8);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .checkout-progress {
            padding: 1rem;
          }

          .progress-container {
            gap: 0.5rem;
          }

          .step-circle {
            width: 40px;
            height: 40px;
            font-size: 0.875rem;
          }

          .step-connector {
            top: 20px;
          }

          .step-name {
            font-size: 0.75rem;
          }

          .step-number {
            font-size: 0.625rem;
          }
        }

        @media (max-width: 480px) {
          .step-info {
            gap: 0.125rem;
          }

          .step-name {
            font-size: 0.625rem;
            text-align: center;
            max-width: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        /* Animation */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1.1);
            box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
          }
          50% {
            transform: scale(1.15);
            box-shadow: 0 0 0 8px rgba(255, 107, 53, 0.2);
          }
        }

        .step-circle.active {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default CheckoutProgress;
