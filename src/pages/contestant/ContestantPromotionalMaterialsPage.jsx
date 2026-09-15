import { Download, FileImage } from 'lucide-react';
import '../../components/dashboard/DashboardPage.scss';
import './ContestantPromotionalMaterialsPage.scss';

const MATERIALS = [
  { id: 1, name: 'Instagram Post (1080×1080)', type: 'Square banner' },
  { id: 2, name: 'Instagram Story (1080×1920)', type: 'Story template' },
  { id: 3, name: 'Facebook Cover (820×312)', type: 'Cover banner' },
  { id: 4, name: 'Printable Flyer (A4)', type: 'PDF flyer' },
  { id: 5, name: 'WhatsApp Status Graphic', type: 'Square banner' },
  { id: 6, name: 'Twitter/X Header (1500×500)', type: 'Cover banner' },
];

export default function ContestantPromotionalMaterialsPage() {
  const download = (name) => {
    // TODO: point this at your real generated-asset files/CDN.
    console.log('Download requested for', name);
  };

  return (
    <div className="dash-page">
      <div className="dash-page__header">
        <div>
          <h1 className="dash-page__title">Promotional Materials</h1>
          <p className="dash-page__subtitle">Ready-made graphics to help you promote your campaign.</p>
        </div>
      </div>

      <div className="promo-materials__grid">
        {MATERIALS.map((m) => (
          <div className="promo-materials__card" key={m.id}>
            <div className="promo-materials__preview">
              <FileImage size={26} />
            </div>
            <p className="promo-materials__name">{m.name}</p>
            <p className="promo-materials__type">{m.type}</p>
            <button type="button" className="btn btn--outline" onClick={() => download(m.name)}>
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
