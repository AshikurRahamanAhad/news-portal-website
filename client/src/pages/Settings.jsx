import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const Settings = () => {
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({ reporterSecretCode: '', adminSecretCode: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/settings')
      .then((res) => setCurrent(res.data))
      .catch(() => setError('Could not load settings'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {};
    if (form.reporterSecretCode) payload.reporterSecretCode = form.reporterSecretCode;
    if (form.adminSecretCode) payload.adminSecretCode = form.adminSecretCode;

    if (!payload.reporterSecretCode && !payload.adminSecretCode) {
      setError('Enter a new code in at least one field');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put('/settings', payload);
      setCurrent(res.data);
      setForm({ reporterSecretCode: '', adminSecretCode: '' });
      setSuccess('Secret codes updated. New codes take effect immediately — no restart needed.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="section-heading">
        <h2>Settings</h2>
        <span className="section-heading__rule" />
      </div>

      {loading && <p className="state-message">Loading…</p>}

      {!loading && current && (
        <>
          <p className="dashboard-welcome">
            Current codes are only ever shown here, to signed-in admins. Rotate them any time —
            existing accounts are unaffected; only new reporter/admin sign-ups need the new code.
          </p>

          <div className="settings-current">
            <div>
              <span className="settings-current__label">Reporter code</span>
              <code>{current.reporterSecretCode}</code>
            </div>
            <div>
              <span className="settings-current__label">Admin code</span>
              <code>{current.adminSecretCode}</code>
            </div>
          </div>

          <form className="write-form settings-form" onSubmit={handleSubmit}>
            {error && <p className="state-message state-message--error">{error}</p>}
            {success && <p className="state-message state-message--success">{success}</p>}

            <label>
              New reporter secret code
              <input
                type="text"
                name="reporterSecretCode"
                value={form.reporterSecretCode}
                onChange={handleChange}
                placeholder="Leave blank to keep current code"
                minLength={6}
              />
            </label>

            <label>
              New admin secret code
              <input
                type="text"
                name="adminSecretCode"
                value={form.adminSecretCode}
                onChange={handleChange}
                placeholder="Leave blank to keep current code"
                minLength={6}
              />
            </label>

            <button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Update codes'}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Settings;
