import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { MOCK_RESPONSE } from '../mockData';
import Navbar from '../components/Navbar';
import { 
  Search, 
  ArrowUpDown, 
  Copy, 
  Check, 
  Loader2, 
  AlertCircle, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Activity,
  ArrowUpRight
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch referrals data
  const fetchData = async (query = '', sort = 'desc') => {
    const token = Cookies.get('jwt_token');
    if (!token) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    // ── Demo bypass: use mock data locally, no API call ──
    if (token === 'demo-bypass-token') {
      let list = [...MOCK_RESPONSE.referrals];

      // client-side search filter
      if (query.trim()) {
        const q = query.toLowerCase();
        list = list.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.serviceName.toLowerCase().includes(q)
        );
      }

      // client-side sort by date
      list.sort((a, b) =>
        sort === 'asc'
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      );

      setData(MOCK_RESPONSE);
      setReferrals(list);
      setCurrentPage(1);
      setLoading(false);
      return;
    }

    // ── Live API flow (untouched) ──
    try {
      let url = '/api/referrals';
      const params = [];
      if (query.trim()) {
        params.push(`search=${encodeURIComponent(query)}`);
      }
      if (sort) {
        params.push(`sort=${sort}`);
      }
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseJson = await response.json();

      if (response.ok) {
        const parsedData = responseJson.data || responseJson || {};
        setData(parsedData);
        setReferrals(parsedData.referrals || []);
        setCurrentPage(1);
      } else {
        const statusText = response.status ? ` (Status ${response.status})` : '';
        const msg = responseJson.message || 'Failed to fetch referrals data';
        setErrorMsg(`${msg}${statusText}`);
      }
    } catch (err) {
      setErrorMsg(`Failed to connect to the referral server: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  // Debounced API fetch on searchQuery and sortOrder change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData(searchQuery, sortOrder);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, sortOrder]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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

  // Metric Icon mapping helper
  const getMetricIcon = (id) => {
    switch (id) {
      case 'total-referrals':
      case 'referrals':
        return <Users className="metric-icon-element text-indigo" />;
      case 'active-referrals':
      case 'active':
        return <Activity className="metric-icon-element text-green" />;
      case 'total-earnings':
      case 'earnings':
        return <DollarSign className="metric-icon-element text-blue" />;
      default:
        return <TrendingUp className="metric-icon-element text-purple" />;
    }
  };

  // Pagination Calculations
  const ITEMS_PER_PAGE = 10;
  const totalEntries = referrals.length;
  const totalPages = Math.ceil(totalEntries / ITEMS_PER_PAGE) || 1;
  const from = totalEntries === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const to = Math.min(currentPage * ITEMS_PER_PAGE, totalEntries);
  const paginatedReferrals = referrals.slice(from - 1, to);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="dashboard-page-container">
      <Navbar />

      <main className="dashboard-main-content">
        {/* Header Section */}
        <section className="dashboard-header-section">
          <h1 className="dashboard-title">Referral Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </section>

        {/* Loading and Error States */}
        {loading && !data && (
          <div className="dashboard-loading-state">
            <Loader2 className="loading-spinner" />
            <p>Loading referral dashboard data...</p>
          </div>
        )}

        {errorMsg && (
          <div className="dashboard-error-state" role="alert">
            <AlertCircle className="error-state-icon" />
            <div>
              <h3>Failed to Load Data</h3>
              <p>{errorMsg}</p>
              <button onClick={() => fetchData(searchQuery, sortOrder)} className="retry-button">
                Try Again
              </button>
            </div>
          </div>
        )}

        {data && (
          <>
            {/* Overview Section */}
            <section className="dashboard-section" role="region" aria-label="Overview metrics">
              <h2 className="section-title">Overview</h2>
              <div className="metrics-grid">
                {(data.metrics || []).map((metric, idx) => (
                  <div key={metric.id || idx} className="metric-card">
                    <div className="metric-card-header">
                      <span className="metric-label">{metric.label}</span>
                      <div className="metric-icon-wrapper">
                        {getMetricIcon(metric.id)}
                      </div>
                    </div>
                    <div className="metric-value">{metric.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Middle Section: Service Summary & Referral Sharing */}
            <div className="dashboard-middle-grid">
              {/* Service Summary Section */}
              <section className="dashboard-section" role="region" aria-label="Service summary">
                <h2 className="section-title">Service summary</h2>
                <div className="summary-card">
                  <div className="summary-table-wrapper">
                    <table className="summary-table">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Your Referrals</th>
                          <th>Active Referrals</th>
                          <th>Total Ref. Earnings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.serviceSummary ? (
                          <tr>
                            <td className="font-semibold">{data.serviceSummary.service}</td>
                            <td>{data.serviceSummary.yourReferrals}</td>
                            <td>{data.serviceSummary.activeReferrals}</td>
                            <td className="text-emerald font-semibold">
                              {data.serviceSummary.totalRefEarnings}
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted">
                              No service summary details available.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Share Referral Section */}
              <section className="dashboard-section" role="region" aria-label="Share referral">
                <h2 className="section-title">Refer friends and earn more</h2>
                <div className="share-card">
                  <div className="share-field">
                    <div className="share-field-header">
                      <label className="share-label">Your Referral Link</label>
                      {copiedLink && <span className="copy-feedback-text">Copied!</span>}
                    </div>
                    <div className="share-input-group">
                      <input 
                        type="text" 
                        readOnly 
                        value={data.referral?.link || ''} 
                        className="share-input"
                      />
                      <button 
                        onClick={() => copyToClipboard(data.referral?.link || '', 'link')}
                        className="copy-button"
                      >
                        {copiedLink ? <Check className="btn-copy-icon text-green" /> : <Copy className="btn-copy-icon" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>

                  <div className="share-field">
                    <div className="share-field-header">
                      <label className="share-label">Your Referral Code</label>
                      {copiedCode && <span className="copy-feedback-text">Copied!</span>}
                    </div>
                    <div className="share-input-group">
                      <input 
                        type="text" 
                        readOnly 
                        value={data.referral?.code || ''} 
                        className="share-input font-mono"
                      />
                      <button 
                        onClick={() => copyToClipboard(data.referral?.code || '', 'code')}
                        className="copy-button"
                      >
                        {copiedCode ? <Check className="btn-copy-icon text-green" /> : <Copy className="btn-copy-icon" />}
                        <span>Copy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* All Referrals Section */}
            <section className="dashboard-section table-section">
              <div className="table-section-header">
                <h2 className="section-title">All referrals</h2>
                
                <div className="table-controls">
                  <div className="search-box-wrapper">
                    <Search className="search-box-icon" />
                    <input
                      type="text"
                      placeholder="Name or service…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="search-box-input"
                      aria-label="Search referrals"
                    />
                  </div>

                  <div className="sort-box-wrapper">
                    <label className="sort-label">
                      Sort by date
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                      >
                        <option value="desc">Newest first</option>
                        <option value="asc">Oldest first</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {/* Referrals Table */}
              <div className="referrals-table-container">
                <table className="referrals-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReferrals.length > 0 ? (
                      paginatedReferrals.map((row) => (
                        <tr 
                          key={row.id} 
                          onClick={() => navigate(`/referral/${row.id}`)}
                          className="clickable-row"
                        >
                          <td className="font-semibold">{row.name}</td>
                          <td>
                            <span className="badge-service">{row.serviceName}</span>
                          </td>
                          <td>{formatDate(row.date)}</td>
                          <td className="text-emerald font-semibold">
                            {formatProfit(row.profit)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-state-cell">
                          No matching entries
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="table-footer-controls">
                <span className="entries-summary">
                  Showing {from}–{to} of {totalEntries} entries
                </span>
                
                <div className="pagination-actions">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  {totalPages > 1 && (
                    <div className="pagination-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer Section */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-brand-section">
            <span className="footer-brand">Go Business</span>
            <span className="footer-copyright">© 2024 Go Business</span>
          </div>
          <nav className="footer-navigation" aria-label="Footer">
            <a href="#about" className="footer-link">About</a>
            <a href="#privacy" className="footer-link">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
