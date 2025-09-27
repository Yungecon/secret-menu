import { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PremiumButton } from '..';
import { trackEvent } from '../../services/analytics';

const buildUrl = (baseUrl: string, path: string, params: Record<string, string>): string => {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
};

const downloadSvg = (svgElement: SVGSVGElement | null, filename: string) => {
  if (!svgElement) return;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const QRCodePage = () => {
  const [baseUrl, setBaseUrl] = useState('');
  const [path, setPath] = useState('/');
  const [tableId, setTableId] = useState('');
  const [campaign, setCampaign] = useState('table-tent');
  const [medium, setMedium] = useState('qr');
  const [size, setSize] = useState(256);
  const [margin, setMargin] = useState(2);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    try {
      setBaseUrl(window.location.origin);
    } catch {
      setBaseUrl('https://example.com');
    }
  }, []);

  const targetUrl = useMemo(() => {
    return buildUrl(baseUrl, path, {
      utm_source: 'in-venue',
      utm_medium: medium,
      utm_campaign: campaign,
      table: tableId,
    });
  }, [baseUrl, path, tableId, campaign, medium]);

  const handleDownload = () => {
    downloadSvg(svgRef.current, `qr_${campaign || 'campaign'}_${tableId || 'generic'}.svg`);
    trackEvent('qr', 'download', 'qr_svg', undefined, { campaign, tableId, path, size, margin });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      trackEvent('qr', 'copy_link', 'qr_target_url');
    } catch {
      /* no-op */
    }
  };

  return (
    <div className="min-h-screen bg-premium-black text-luxury-pearl px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-elegant text-3xl md:text-4xl mb-6 text-luxury-gold">QR Code Generator</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Base URL</label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                placeholder="https://your-domain.com"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Path</label>
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                placeholder="/quiz or /shuffle"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Table ID</label>
                <input
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                  placeholder="e.g. T12"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Campaign</label>
                <input
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                  placeholder="table-tent, poster, menu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Medium</label>
                <input
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                  placeholder="qr"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Size (px)</label>
                <input
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value) || 256)}
                  className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                  min={128}
                  max={1024}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Margin</label>
                <input
                  type="number"
                  value={margin}
                  onChange={(e) => setMargin(Number(e.target.value) || 2)}
                  className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                  min={0}
                  max={16}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Target URL</label>
              <div className="flex gap-2">
                <input
                  value={targetUrl}
                  readOnly
                  className="w-full bg-luxury-charcoal/50 border border-luxury-gold/20 rounded px-3 py-2"
                />
                <button onClick={handleCopy} className="px-3 py-2 bg-luxury-gold/20 rounded border border-luxury-gold/30 hover:bg-luxury-gold/30">Copy</button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-luxury-charcoal/50 rounded-xl border border-luxury-gold/20">
              <QRCodeSVG
                value={targetUrl}
                size={size}
                includeMargin={margin > 0}
                marginSize={margin}
                level="M"
                ref={svgRef as any}
              />
            </div>
            <PremiumButton onClick={handleDownload}>Download SVG</PremiumButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;

