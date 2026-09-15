import { useRef, useState } from 'react';
import { ImagePlus, Star, Trash2 } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantMediaGalleryPage.scss';

const INITIAL_GALLERY = [
  { id: 1, src: null, label: 'Cover photo', isCover: true },
  { id: 2, src: null, label: 'Performance, Aug 2026' },
  { id: 3, src: null, label: 'Studio session' },
];

export default function ContestantMediaGalleryPage() {
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const fileInputRef = useRef(null);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        // TODO: upload the file to your real media storage instead of keeping it in memory.
        setGallery((prev) => [
          ...prev,
          { id: Date.now() + Math.random(), src: reader.result, label: file.name, isCover: false },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const setCover = (id) =>
    setGallery((prev) => prev.map((img) => ({ ...img, isCover: img.id === id })));

  const remove = (id) => setGallery((prev) => prev.filter((img) => img.id !== id));

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Media Gallery</h1>
          <p className="dash-page__subtitle">Add photos to your public profile — fans see these when they view you.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus size={16} />
          Add Photo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFiles}
        />
      </div>

      <div className="media-gallery__grid">
        {gallery.map((img) => (
          <div className="media-gallery__item" key={img.id}>
            <div className="media-gallery__thumb">
              {img.src ? (
                <img src={img.src} alt={img.label} />
              ) : (
                <span className="media-gallery__placeholder" aria-hidden="true" />
              )}
              {img.isCover && (
                <span className="media-gallery__cover-badge">
                  <Star size={11} fill="currentColor" /> Cover
                </span>
              )}
            </div>
            <p className="media-gallery__label">{img.label}</p>
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
