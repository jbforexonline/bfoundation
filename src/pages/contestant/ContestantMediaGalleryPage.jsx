import { useRef, useState } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import Notice from '../../components/ui/Notice';
import useApi from '../../hooks/useApi';
import { api, formatDate } from '../../api/client';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantMediaGalleryPage.scss';

// Photos are uploaded to the backend (JPG / PNG / WEBP, max 5 MB, up to 20). The cover photo is the profile picture.
export default function ContestantMediaGalleryPage() {
  const { data, error, loading, reload } = useApi('/contestants/me/media');
  const [notice, setNotice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const gallery = data?.media ?? [];

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (!files.length) return;
    setNotice(null);
    setUploading(true);
    let ok = 0;
    for (const file of files) {
      const form = new FormData();
      form.append('image', file);
      try {
        await api('/contestants/me/media', { method: 'POST', form });
        ok++;
      } catch (err) {
        setNotice({ tone: 'error', text: `${file.name}: ${err.message}` });
      }
    }
    setUploading(false);
    if (ok) {
      if (ok === files.length) setNotice({ tone: 'success', text: `${ok} photo${ok === 1 ? '' : 's'} uploaded.` });
      reload();
    }
  };

  const act = async (fn) => {
    setNotice(null);
    try {
      await fn();
      reload();
    } catch (err) {
      setNotice({ tone: 'error', text: err.message });
    }
  };
  const setCover = (id) => act(() => api(`/contestants/me/media/${id}/cover`, { method: 'PATCH' }));
  const remove = (id) => act(() => api(`/contestants/me/media/${id}`, { method: 'DELETE' }));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Media Gallery</h1>
          <p className="dash-page__subtitle">Add photos to your public profile — fans see these when they view you. JPG, PNG or WEBP up to 5 MB.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <ImagePlus size={16} />
          {uploading ? 'Uploading…' : 'Add Photo'}
        </button>
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={handleFiles} />
      </div>

      <Notice tone={notice?.tone}>{notice?.text}</Notice>
      <Notice tone="error">{error?.message}</Notice>
      {!loading && gallery.length === 0 && <Notice tone="info">No photos yet. Your first photo becomes your profile picture.</Notice>}

      <div className="media-gallery__grid">
        {gallery.map((img) => (
          <div className="media-gallery__item" key={img.id}>
            <div className="media-gallery__thumb">
              <img src={img.url} alt="Gallery" />
              {img.isCover && (
                <span className="media-gallery__cover-badge">
                  <Star size={11} fill="currentColor" /> Cover
                </span>
              )}
            </div>
            <p className="media-gallery__label">Added {formatDate(img.createdAt)}</p>
            <div className="media-gallery__actions">
              {!img.isCover && (
                <button type="button" onClick={() => setCover(img.id)}>
                  <Star size={13} /> Set as cover
                </button>
              )}
              <button type="button" onClick={() => remove(img.id)} className="media-gallery__remove">
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
