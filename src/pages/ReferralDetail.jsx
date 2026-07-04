import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { 
  ArrowLeft, 
  Loader2, 
  AlertTriangle,
  Award,
  Calendar,
  DollarSign,
  Briefcase,
  Hash
} from 'lucide-react';

const ReferralDetail = () => {
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    const fetchReferralDetail = async () => {
      const token = Cookies.get('jwt_token');
      if (!token) {
        setLoading(false);
        setErrorState(true);
        return;
      }

      setLoading(true);
      setErrorState(false);

      try {
        const response = await fetch(
          `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const responseJson = await response.json();

        if (response.ok) {
          // Parse data with high flexibility
          const data = responseJson.data;
          let matched = null;

          if (data) {
            if (data.id && String(data.id) === String(id)) {
              matched = data;
            } else if (Array.isArray(data.referrals)) {
              matched = data.referrals.find((r) => String(r.id) === String(id));
            } else if (Array.isArray(data)) {
              matched = data.find((r) => String(r.id) === String(id));
            } else if (data.referral && String(data.referral.id) === String(id)) {
              matched = data.referral;
            }
          }

          if (!matched) {
            const root = responseJson;
            if (root.id && String(root.id) === String(id)) {
              matched = root;
            } else if (Array.isArray(root.referrals)) {
              matched = root.referrals.find((r) => String(r.id) === String(id));
            } else if (Array.isArray(root)) {
              matched = root.find((r) => String(r.id) === String(id));
            } else if (root.referral && String(root.referral.id) === String(id)) {
              matched = root.referral;
            }
          }

          if (matched) {
            setReferral(matched);
          } else {
            setErrorState(true);
          }
        } else {
          setErrorState(true);
        }
      } catch (err) {
        setErrorState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralDetail();
  }, [id]);

  // Formatting helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.substring(0, 10).replace(/-/g, '/');
  };

  const formatProfit = (val) => {
    const num = Number(val);
    if (isNaN(num)) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="detail-page-container">
      <Navbar />

      <main className="detail-main-content">
        <div className="detail-back-nav">
          <Link to="/" className="back-link" aria-label="Back to dashboard">
            <ArrowLeft className="back-icon" />
            <span>Back to dashboard</span>
          </Link>
        </div>

        {loading ? (
          <div className="detail-loading-state">
            <Loader2 className="loading-spinner" />
            <p>Loading referral details...</p>
          </div>
        ) : errorState || !referral ? (
          <div className="detail-error-card">
            <div className="detail-error-header">
              <AlertTriangle className="detail-error-icon" />
              <h1 className="detail-error-title">Referral not found</h1>
            </div>
            <p className="detail-error-message">
              The referral record you are looking for does not exist, has been removed, or you don't have access to it.
            </p>
            <div className="detail-error-action">
              <Link to="/" className="error-back-btn" aria-label="Back to dashboard">
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="detail-card">
            <div className="detail-header">
              <h1 className="detail-title">Referral Details</h1>
              <h2 className="partner-name">{referral.name}</h2>
            </div>

            <div className="detail-body">
              <dl className="details-list">
                <div className="detail-row">
                  <dt className="detail-label-wrapper">
                    <Hash className="row-icon" />
                    <span>Referral ID</span>
                  </dt>
                  <dd className="detail-val-element font-mono">{referral.id}</dd>
                </div>

                <div className="detail-row">
                  <dt className="detail-label-wrapper">
                    <Briefcase className="row-icon" />
                    <span>Service Name</span>
                  </dt>
                  <dd className="detail-val-element">
                    <span className="badge-service">{referral.serviceName || referral.service}</span>
                  </dd>
                </div>

                <div className="detail-row">
                  <dt className="detail-label-wrapper">
                    <Calendar className="row-icon" />
                    <span>Date</span>
                  </dt>
                  <dd className="detail-val-element">{formatDate(referral.date)}</dd>
                </div>

                <div className="detail-row">
                  <dt className="detail-label-wrapper">
                    <DollarSign className="row-icon text-emerald" />
                    <span>Profit</span>
                  </dt>
                  <dd className="detail-val-element text-emerald font-semibold">
                    {formatProfit(referral.profit)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ReferralDetail;
