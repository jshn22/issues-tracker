import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const ReportIssueForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  // lat/long removed - location handled by address or optional coordinates
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [coordinates, setCoordinates] = useState(null); // [lon, lat]
  const [suggestions, setSuggestions] = useState([]);
  const addrTimerRef = useRef(null);
  const [message, setMessage] = useState('');
  const [createdIssueId, setCreatedIssueId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setMessage('Preview ready. Submit to upload and report.');
    }
  };

  const handleAddressChange = (e) => {
    const val = e.target.value;
    setAddress(val);
    setCoordinates(null); // clear coordinates until user selects a suggestion
    setSuggestions([]);
    setMessage('');

    if (addrTimerRef.current) clearTimeout(addrTimerRef.current);
    if (!val || val.length < 3) return;

    // debounce the request
    addrTimerRef.current = setTimeout(async () => {
      try {
        const q = encodeURIComponent(val);
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${q}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (!res.ok) return;
        const data = await res.json();
        setSuggestions(data || []);
      } catch (err) {
        // ignore autocomplete errors silently
      }
    }, 300);
  };

  const pickSuggestion = (item) => {
    setAddress(item.display_name);
    setCoordinates([parseFloat(item.lon), parseFloat(item.lat)]);
    setSuggestions([]);
    setMessage('Location selected from address');
  };

  const uploadImage = async () => {
    if (!image) return '';
    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.imageUrl || '';
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to upload image.';
      setMessage(`Image upload failed: ${errMsg}`);
      return '';
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Basic client-side validation
    if (!title.trim() || !description.trim()) {
      setMessage('Please provide a title and description.');
      return;
    }

    setSubmitting(true);
    let uploadedImageUrl = '';

    if (image) {
      uploadedImageUrl = await uploadImage();
      if (!uploadedImageUrl) {
        // uploadImage has already set an error message
        setSubmitting(false);
        return;
      }
    }

    try {
      const payload = {
        title,
        description,
        category,
        address,
      };

      // Location is optional and may be provided by address or server-side geocoding later.
      if (Array.isArray(coordinates) && coordinates.length === 2) {
        payload.coordinates = coordinates;
      }

      if (uploadedImageUrl) payload.imageUrl = uploadedImageUrl;

  const res = await api.post('/issues', payload);
  setMessage('Issue reported successfully!');
  setCreatedIssueId(res.data._id);
      // Clear form
      setTitle('');
      setDescription('');
      setCategory('Other');
  // lat/long cleared (not used)
      setAddress('');
    setCoordinates(null);
  setImage(null);
  setImageUrl('');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to report issue.';
      setMessage(`Failed to report issue: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // No auto-redirect or toast: user stays on the report page after submission

  return (
    <form className="report-form" onSubmit={handleSubmit}>
      <div className="card-row">
  <label className="field-label"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="#1f6fd8"/><path d="M20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#2b79d9"/></svg></span> Title</label>
        <input className="field-input" placeholder="e.g., Pothole on Main Street" value={title} onChange={(e) => setTitle(e.target.value)} disabled={submitting || imageUploading} />
      </div>

      <div className="card-row">
  <label className="field-label"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="14" height="14" rx="2" stroke="#1f6fd8" strokeWidth="1.5" fill="#eaf4ff"/><path d="M7 8h8M7 12h8M7 16h5" stroke="#1f6fd8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Description</label>
        <textarea className="field-textarea" placeholder="Provide details about the issue..." value={description} onChange={(e) => setDescription(e.target.value)} disabled={submitting || imageUploading} />
      </div>

      <div className="card-row">
        <label className="field-label"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.59 13.41L12 21.99 2.41 12.41 11 3l9.59 10.41z" fill="#eaf4ff"/><circle cx="7.5" cy="7.5" r="1.5" fill="#1f6fd8"/></svg></span> Category</label>
        <select className="field-input" value={category} onChange={(e) => setCategory(e.target.value)} disabled={submitting || imageUploading}>
          <option value="Pothole">Pothole</option>
          <option value="Streetlight">Streetlight</option>
          <option value="Garbage">Garbage</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="card-row">
        <label className="field-label"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" fill="#eaf4ff"/><circle cx="12" cy="9" r="2" fill="#1f6fd8"/></svg></span> Address</label>
        <div className="address-row">
          <input className="field-input" value={address} onChange={handleAddressChange} disabled={submitting || imageUploading} />
          <button type="button" className="btn-outline" onClick={async () => {
            if (!navigator.geolocation) {
              setMessage('Geolocation not supported by your browser');
              return;
            }
            setMessage('Getting your location...');
            navigator.geolocation.getCurrentPosition(async (pos) => {
              const { latitude, longitude } = pos.coords;
              setCoordinates([longitude, latitude]);
              try {
                const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
                const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
                if (!res.ok) {
                  setMessage('Could not reverse-geocode location');
                  return;
                }
                const data = await res.json();
                if (data && data.display_name) {
                  setAddress(data.display_name);
                  setMessage('Location set from your device');
                } else {
                  setMessage('Location obtained but no address found');
                }
              } catch (err) {
                setMessage('Reverse geocoding failed');
              }
            }, (err) => setMessage('Unable to retrieve your location'));
          }} disabled={submitting}>Use my location</button>
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={`${s.lat}-${s.lon}`} onClick={() => pickSuggestion(s)}>{s.display_name}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="card-row">
  <label className="field-label"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="5" width="18" height="14" rx="2" fill="#eaf4ff"/><path d="M7 9l2 2 3-3 5 5" stroke="#1f6fd8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Upload Photo</label>
        <div className="file-row">
          <label className="file-choose btn-primary">
            Choose File
            <input type="file" onChange={handleImageChange} accept="image/*" disabled={imageUploading || submitting} />
          </label>
          <span className="file-name">{image ? image.name : 'No file chosen'}</span>
        </div>
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="preview-image" />
        )}
      </div>

      <div className="card-row">
        <button className="btn-submit" type="submit" disabled={submitting || imageUploading}>
          {submitting ? 'Submitting...' : imageUploading ? 'Uploading image...' : 'Report Issue'}
        </button>
      </div>

      {message && <p className="form-message">{message}</p>}
    </form>
  );
};

export default ReportIssueForm;
