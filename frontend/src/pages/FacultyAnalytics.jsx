import React, { useState, useEffect } from 'react';
import Sidebar from '../components/SideBar';
import HomeButton from '../components/HomeButton';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export default function FacultyAnalytics() {
  const [facultyData, setFacultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFaculty, setExpandedFaculty] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('tpo_token') || localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/tpo/login';
      return;
    }
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tpo/faculty-analytics/tests-by-faculty`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        // Group tests by faculty
        const grouped = groupByFaculty(response.data.data);
        setFacultyData(grouped);
      }
    } catch (err) {
      console.error('Error fetching faculty data:', err);
      setError(err.response?.data?.message || 'Failed to load faculty analytics');
      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const groupByFaculty = (tests) => {
    const map = {};
    tests.forEach(test => {
      const fid = test.facultyId?.toString() || 'unknown';
      if (!map[fid]) {
        map[fid] = {
          facultyId: fid,
          facultyName: test.facultyName || 'Unknown Faculty',
          facultyEmail: test.facultyEmail || '',
          tests: []
        };
      }
      map[fid].tests.push(test);
    });
    return Object.values(map);
  };

  const filteredFaculty = facultyData.filter(f =>
    f.facultyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.facultyEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (pct) => {
    if (pct >= 70) return '#10b981';
    if (pct >= 40) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBadge = (pct) => {
    if (pct >= 70) return { bg: '#d1fae5', text: '#065f46', label: 'Good' };
    if (pct >= 40) return { bg: '#fef3c7', text: '#92400e', label: 'Average' };
    return { bg: '#fee2e2', text: '#991b1b', label: 'Needs Work' };
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f1f5f9', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f0fdf4 100%)' }}>
          
          {/* Fixed HomeButton */}
          <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 50 }}>
            <HomeButton />
          </div>

          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                👨‍🏫 Faculty Analytics
              </h1>
              <p style={{ color: '#64748b', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                View all faculty members, their tests, and student performance
              </p>
            </div>

            {/* Search + Refresh Bar */}
            <div style={{
              display: 'flex', gap: '0.75rem', marginBottom: '1.5rem',
              background: 'white', padding: '1rem 1.25rem', borderRadius: '16px',
              boxShadow: '0 1px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0'
            }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search faculty by name or email..."
                style={{
                  flex: 1, padding: '0.5rem 0.875rem', borderRadius: '10px',
                  border: '1.5px solid #e2e8f0', fontSize: '0.9rem', outline: 'none',
                  background: '#f8fafc', color: '#1e293b'
                }}
              />
              <button
                onClick={fetchFacultyData}
                disabled={loading}
                style={{
                  padding: '0.5rem 1.25rem', background: '#4f46e5', color: 'white',
                  border: 'none', borderRadius: '10px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1, fontSize: '0.9rem', whiteSpace: 'nowrap'
                }}
              >
                {loading ? '⏳ Loading...' : '🔄 Refresh'}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: '#fee2e2', border: '1.5px solid #fca5a5', color: '#991b1b',
                padding: '0.875rem 1rem', borderRadius: '12px', marginBottom: '1rem', fontSize: '0.9rem'
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    height: '80px', background: 'white', borderRadius: '16px',
                    animation: 'pulse 1.5s infinite', opacity: 0.6
                  }} />
                ))}
              </div>
            )}

            {/* Faculty List */}
            {!loading && filteredFaculty.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '4rem 2rem', background: 'white',
                borderRadius: '20px', boxShadow: '0 1px 8px rgba(0,0,0,0.07)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  No Faculty Data Found
                </h3>
                <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>
                  {searchQuery ? 'No faculty matches your search.' : 'No tests have been created yet.'}
                </p>
              </div>
            )}

            {!loading && filteredFaculty.map((faculty) => {
              const isExpanded = expandedFaculty === faculty.facultyId;
              const totalTests = faculty.tests.length;
              const totalStudents = new Set(faculty.tests.flatMap(t => t.attempts.map(a => a.studentId?.toString()))).size;
              const avgPct = faculty.tests.reduce((sum, t) => sum + (t.avgPercentage || 0), 0) / (totalTests || 1);

              return (
                <div key={faculty.facultyId} style={{ marginBottom: '1rem' }}>
                  {/* Faculty Card Header */}
                  <div
                    onClick={() => setExpandedFaculty(isExpanded ? null : faculty.facultyId)}
                    style={{
                      background: 'white', borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
                      padding: '1.25rem 1.5rem', cursor: 'pointer', userSelect: 'none',
                      boxShadow: '0 1px 8px rgba(0,0,0,0.07)', border: '1.5px solid',
                      borderColor: isExpanded ? '#6366f1' : '#e2e8f0',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '1rem'
                    }}
                  >
                    {/* Avatar */}
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '1.1rem'
                    }}>
                      {faculty.facultyName.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e293b' }}>
                        {faculty.facultyName}
                      </div>
                      {faculty.facultyEmail && (
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>
                          {faculty.facultyEmail}
                        </div>
                      )}
                    </div>

                    {/* Stats chips */}
                    <div style={{ display: 'flex', gap: '0.625rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <span style={{
                        background: '#eff6ff', color: '#3b82f6', padding: '0.25rem 0.75rem',
                        borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600
                      }}>
                        {totalTests} test{totalTests !== 1 ? 's' : ''}
                      </span>
                      <span style={{
                        background: '#f0fdf4', color: '#16a34a', padding: '0.25rem 0.75rem',
                        borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600
                      }}>
                        {totalStudents} student{totalStudents !== 1 ? 's' : ''}
                      </span>
                      <span style={{
                        background: getScoreBadge(avgPct).bg, color: getScoreBadge(avgPct).text,
                        padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600
                      }}>
                        Avg {Math.round(avgPct)}%
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '1rem' }}>
                        {isExpanded ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded: Tests List */}
                  {isExpanded && (
                    <div style={{
                      background: '#f8fafc', border: '1.5px solid #6366f1',
                      borderTop: 'none', borderRadius: '0 0 16px 16px',
                      padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'
                    }}>
                      {faculty.tests.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>
                          No tests created yet.
                        </p>
                      ) : (
                        faculty.tests.map((test) => {
                          const isTestExpanded = expandedTest === test._id;
                          return (
                            <div key={test._id} style={{
                              background: 'white', borderRadius: '12px',
                              border: '1px solid #e2e8f0', overflow: 'hidden'
                            }}>
                              {/* Test Row */}
                              <div
                                onClick={() => setExpandedTest(isTestExpanded ? null : test._id)}
                                style={{
                                  padding: '0.875rem 1.125rem', cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                                  borderBottom: isTestExpanded ? '1px solid #e2e8f0' : 'none',
                                  background: isTestExpanded ? '#fafafa' : 'white'
                                }}
                              >
                                <div style={{
                                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '1rem'
                                }}>
                                  📝
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.9rem' }}>
                                    {test.testTitle || 'Untitled Test'}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                                    {test.schedule
                                      ? new Date(test.schedule).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                      : 'No date'
                                    }
                                    {test.totalMarks ? ` · ${test.totalMarks} marks` : ''}
                                    {test.duration ? ` · ${test.duration} min` : ''}
                                  </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                                  <span style={{
                                    background: '#eff6ff', color: '#2563eb', padding: '0.2rem 0.625rem',
                                    borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600
                                  }}>
                                    {test.attempts?.length || 0} attempts
                                  </span>
                                  {test.avgPercentage != null && (
                                    <span style={{
                                      background: getScoreBadge(test.avgPercentage).bg,
                                      color: getScoreBadge(test.avgPercentage).text,
                                      padding: '0.2rem 0.625rem', borderRadius: '999px',
                                      fontSize: '0.75rem', fontWeight: 600
                                    }}>
                                      Avg {Math.round(test.avgPercentage)}%
                                    </span>
                                  )}
                                  <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>
                                    {isTestExpanded ? '▲' : '▼'}
                                  </span>
                                </div>
                              </div>

                              {/* Students Table */}
                              {isTestExpanded && (
                                <div style={{ padding: '0.75rem 1rem' }}>
                                  {!test.attempts || test.attempts.length === 0 ? (
                                    <p style={{ color: '#94a3b8', textAlign: 'center', padding: '0.75rem', fontSize: '0.85rem' }}>
                                      No students have attempted this test yet.
                                    </p>
                                  ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                                        <thead>
                                          <tr style={{ background: '#f1f5f9' }}>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600, borderRadius: '6px 0 0 6px' }}>#</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Student Name</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Roll No.</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Score</th>
                                            <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: '#64748b', fontWeight: 600, borderRadius: '0 6px 6px 0' }}>%</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {test.attempts.map((attempt, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                              <td style={{ padding: '0.5rem 0.75rem', color: '#94a3b8' }}>{idx + 1}</td>
                                              <td style={{ padding: '0.5rem 0.75rem', fontWeight: 500, color: '#1e293b' }}>
                                                {attempt.studentName || 'Unknown'}
                                              </td>
                                              <td style={{ padding: '0.5rem 0.75rem', color: '#64748b' }}>
                                                {attempt.studentRoll || 'N/A'}
                                              </td>
                                              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right', fontWeight: 600, color: '#1e293b' }}>
                                                {attempt.score ?? '-'}
                                              </td>
                                              <td style={{ padding: '0.5rem 0.75rem', textAlign: 'right' }}>
                                                <span style={{
                                                  background: getScoreBadge(attempt.percentage).bg,
                                                  color: getScoreBadge(attempt.percentage).text,
                                                  padding: '0.15rem 0.5rem', borderRadius: '999px',
                                                  fontWeight: 700, fontSize: '0.78rem'
                                                }}>
                                                  {attempt.percentage != null ? `${Math.round(attempt.percentage)}%` : '-'}
                                                </span>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Summary Footer */}
            {!loading && facultyData.length > 0 && (
              <div style={{
                marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '0.75rem'
              }}>
                {[
                  { label: 'Total Faculty', value: facultyData.length, icon: '👨‍🏫', bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
                  { label: 'Total Tests', value: facultyData.reduce((s, f) => s + f.tests.length, 0), icon: '📝', bg: 'linear-gradient(135deg,#0ea5e9,#6366f1)' },
                  {
                    label: 'Total Students',
                    value: new Set(facultyData.flatMap(f => f.tests.flatMap(t => t.attempts.map(a => a.studentId?.toString())))).size,
                    icon: '🎓', bg: 'linear-gradient(135deg,#10b981,#0ea5e9)'
                  }
                ].map(stat => (
                  <div key={stat.label} style={{
                    background: stat.bg, borderRadius: '14px', padding: '1rem 1.25rem',
                    color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>{stat.icon}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.78rem', opacity: 0.85, marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
