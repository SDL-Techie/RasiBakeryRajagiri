import React, { useState, useEffect } from 'react';
import {
    Save, Loader2, CheckCircle2, AlertCircle,
    Scale, IndianRupee, Info
} from 'lucide-react';
import axios from 'axios';
import './Weightdeliverycharge.css';

const BASE_URL = "http://localhost:4000/api/v1";

interface WeightChargeData {
    _id?: string;
    ratePerKg: number;
    status: string;
}

const WeightDeliveryCharge: React.FC = () => {
    const [ratePerKg, setRatePerKg] = useState<string>('');
    const [status, setStatus] = useState<string>('Active');
    const [existingId, setExistingId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetchWeightCharge();
    }, []);

    const fetchWeightCharge = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${BASE_URL}/weightcharge`);
            if (res.data.success && res.data.data) {
                const data: WeightChargeData = res.data.data;
                setRatePerKg(String(data.ratePerKg ?? ''));
                setStatus(data.status || 'Active');
                setExistingId(data._id || null);
            }
        } catch (err) {
            console.error("Failed to fetch weight charge:", err);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const rate = Number(ratePerKg);
        if (!ratePerKg || isNaN(rate) || rate <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid rate per kg.' });
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const res = await axios.post(
                `${BASE_URL}/weightcharge`,
                { ratePerKg: rate, status },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (res.data.success) {
                setMessage({ type: 'success', text: 'Kg-wise delivery charge updated successfully!' });
                setExistingId(res.data.data._id);
            }
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to update delivery charge.'
            });
        } finally {
            setLoading(false);
        }
    };

    const previewWeight = 3;
    const previewCharge = ratePerKg && !isNaN(Number(ratePerKg))
        ? (Number(ratePerKg) * previewWeight).toFixed(2)
        : null;

    return (
        <div className="wdc-container">
            <div className="wdc-header">
                <div>
                    <h1><Scale size={28} /> Kg-wise Delivery Charge</h1>
                    <p>Used only when a pincode has no delivery charge configured</p>
                </div>
            </div>

            {message && (
                <div className={`wdc-alert ${message.type}`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {message.text}
                </div>
            )}

            <div className="wdc-info-box">
                <Info size={16} />
                <span>
                    This is a single global rate applied per kg of total order weight.
                    It is used as a fallback only when the delivery pincode is not found or inactive.
                </span>
            </div>

            {fetching ? (
                <div className="wdc-loading">
                    <Loader2 className="wdc-spin" size={24} />
                    <span>Loading current rate...</span>
                </div>
            ) : (
                <form className="wdc-glass-form" onSubmit={handleSubmit}>
                    <section className="wdc-section">
                        <h3><IndianRupee size={16} /> Rate Configuration</h3>

                        <div className="wdc-row">
                            <div className="wdc-input-group">
                                <label>Rate per Kg (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    name="ratePerKg"
                                    value={ratePerKg}
                                    onChange={(e) => setRatePerKg(e.target.value)}
                                    required
                                    placeholder="e.g. 10"
                                />
                            </div>

                            <div className="wdc-input-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {previewCharge && (
                            <div className="wdc-preview">
                                Example: {previewWeight} kg order → ₹{previewCharge} delivery charge
                            </div>
                        )}
                    </section>

                    <button type="submit" className="wdc-submit-btn" disabled={loading}>
                        {loading ? <Loader2 className="wdc-spin" /> : <Save size={18} />}
                        {loading ? 'Saving...' : existingId ? 'Update Rate' : 'Save Rate'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default WeightDeliveryCharge;