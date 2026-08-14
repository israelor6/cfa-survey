export function PresenterMenu({ open, sessionId, status, demo, confirming, onToggle, onRequestReset, onCancelReset, onConfirmReset }: {
  open: boolean; sessionId: string; status: string; demo: boolean; confirming: boolean;
  onToggle: () => void; onRequestReset: () => void; onCancelReset: () => void; onConfirmReset: () => void;
}) {
  return <div className="presenter-wrap">
    <button className="presenter-trigger" type="button" onClick={onToggle} aria-expanded={open}>P</button>
    {open && <div className="presenter-menu"><span>Presenter tools</span>{demo && <p className="demo-mode">Demo mode — submissions are not being sent.</p>}<dl><div><dt>Session</dt><dd>{sessionId.slice(0, 8)}</dd></div><div><dt>Sync</dt><dd>{status}</dd></div></dl>{!confirming ? <button type="button" onClick={onRequestReset}>Start another conversation</button> : <div className="reset-confirm"><p>Reset this session?</p><button type="button" onClick={onConfirmReset}>Reset</button><button type="button" onClick={onCancelReset}>Cancel</button></div>}<small>Press R to open this menu</small></div>}
  </div>;
}
