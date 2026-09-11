import React, { useState, useEffect } from 'react';

interface NotificationTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultPhone?: string;
}

interface NotificationLog {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  title: string;
  status: 'sent' | 'simulated' | 'error';
  provider: string;
  timestamp: string;
  details?: string;
}

export const NotificationTesterModal: React.FC<NotificationTesterModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = 'medounla@gmail.com',
  defaultPhone = '+39 347 891 2345',
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'logs'>('email');

  // Email form state
  const [emailTo, setEmailTo] = useState(defaultEmail);
  const [emailSubject, setEmailSubject] = useState('[Vacances Sportives Happy] Confirmation de séjour & Fiche sanitaire');
  const [emailTemplate, setEmailTemplate] = useState<'confirmation' | 'relance_sante' | 'solde'>('confirmation');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<any | null>(null);

  // SMS form state (Focus on Italian international number +39)
  const [smsTo, setSmsTo] = useState(defaultPhone);
  const [smsTemplate, setSmsTemplate] = useState<'italiano_sanitaire' | 'italiano_convocation' | 'italiano_confirmation'>('italiano_sanitaire');
  const [smsMessage, setSmsMessage] = useState(
    '[Vacances Happy Cosne] Gentile genitore, promemoria: la scheda sanitaria e il certificato medico per il soggiorno sportivo devono pervenire entro il 30/06. Cordiali saluti, Dir. Christian HAPPI.'
  );
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsResult, setSmsResult] = useState<any | null>(null);

  // Configuration status from server
  const [serverStatus, setServerStatus] = useState<{ resendConfigured: boolean; smsConfigured: boolean; resendSender?: string } | null>(null);

  // Delivery logs
  const [logs, setLogs] = useState<NotificationLog[]>([]);

  useEffect(() => {
    fetch('/api/notifications/status')
      .then((r) => r.json())
      .then((data) => setServerStatus(data))
      .catch(() => setServerStatus({ resendConfigured: false, smsConfigured: false }));
  }, [isOpen]);

  if (!isOpen) return null;

  // Italian number detection & validation
  const cleanPhone = smsTo.replace(/[\s\-\.]/g, '');
  const isItalianNumber = cleanPhone.startsWith('+39') || cleanPhone.startsWith('0039');
  const isValidItalianFormat = isItalianNumber && cleanPhone.length >= 12 && cleanPhone.length <= 14;

  const handleSelectEmailTemplate = (type: 'confirmation' | 'relance_sante' | 'solde') => {
    setEmailTemplate(type);
    if (type === 'confirmation') {
      setEmailSubject('[Vacances Sportives Happy] Dossier validé - Séjour été à Cosne-Cours-sur-Loire');
    } else if (type === 'relance_sante') {
      setEmailSubject('[URGENT] Vacances Happy : Pièces sanitaires manquantes pour votre enfant');
    } else {
      setEmailSubject('[Vacances Sportives Happy] Reçu de paiement & Règlement du solde restant');
    }
  };

  const handleSelectSmsTemplate = (type: 'italiano_sanitaire' | 'italiano_convocation' | 'italiano_confirmation') => {
    setSmsTemplate(type);
    if (type === 'italiano_sanitaire') {
      setSmsMessage(
        '[Vacances Happy Cosne] Gentile genitore, promemoria: la scheda sanitaria e il certificato vaccinale DTP devono pervenire prima del 30/06 per convalidare l\'iscrizione. Christian HAPPI (+33 6 30 47 30 41)'
      );
    } else if (type === 'italiano_convocation') {
      setSmsMessage(
        '[Vacances Happy Cosne] Convocazione ufficiale: accoglienza lunedì ore 08:30 presso il Gymnase René Cassin (Cosne). Borsa con borraccia e scarpe pulite. A presto!'
      );
    } else {
      setSmsMessage(
        '[Vacances Happy] Prenotazione registrata con successo (Rif: VSH-26-042). Consultate il vostro Spazio Famiglia online su https://vacances-happy.fr. Grazie!'
      );
    }
  };

  const generateEmailHtml = () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background: #006a62; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: bold;">Vacances Sportives Happy</h1>
          <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Cosne-Cours-sur-Loire (Nièvre, 58) • Agrément n° 058ORG0219</p>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6; font-size: 14px;">
          <h2 style="color: #006a62; font-size: 18px; margin-top: 0;">${emailSubject}</h2>
          <p>Bonjour,</p>
          <p>${
            emailTemplate === 'confirmation'
              ? 'Nous avons le plaisir de vous confirmer la bonne prise en compte de votre inscription pour les stages sportifs de cet été à Cosne-Cours-sur-Loire.'
              : emailTemplate === 'relance_sante'
              ? 'Nous préparons activement l\'accueil de vos enfants au Gymnase René Cassin. Cependant, il nous manque encore la fiche sanitaire Cerfa ou la copie des vaccins DTP.'
              : 'Voici le récapitulatif de votre règlement pour le séjour sportif. Un solde de 80,00 € reste à régler avant le premier jour.'
          }</p>
          <div style="background: #f4fbf9; border-left: 4px solid #006a62; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
            <strong>Dossier N° :</strong> VSH-26-042<br />
            <strong>Lieu d'accueil :</strong> Gymnase René Cassin, 58200 Cosne-Cours-sur-Loire<br />
            <strong>Contact Direction :</strong> Christian HAPPI (06 30 47 30 41)
          </div>
          <p>Pour déposer vos justificatifs ou régler en ligne, rendez-vous sur votre <strong>Espace Famille Sécurisé</strong>.</p>
          <p style="margin-top: 24px;">Sportivement et chaleureusement,<br /><strong>Christian HAPPI</strong><br /><span style="font-size: 12px; color: #777;">Directeur de Séjour Vacances Sportives Happy</span></p>
        </div>
        <div style="background: #f7f9fb; padding: 14px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #e0e0e0;">
          Message automatique sécurisé envoyé via Resend.com • Ville de Cosne-Cours-sur-Loire • Partenaire Solidarité Cameroun
        </div>
      </div>
    `;
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingEmail(true);
    setEmailResult(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo.trim(),
          subject: emailSubject,
          html: generateEmailHtml(),
          templateName: emailTemplate,
        }),
      });

      const data = await response.json();
      setEmailResult(data);

      // Add to log
      setLogs((prev) => [
        {
          id: data.id || `log_email_${Date.now()}`,
          type: 'email',
          recipient: emailTo.trim(),
          title: emailSubject,
          status: data.live ? 'sent' : 'simulated',
          provider: 'Resend.com',
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          details: data.message,
        },
        ...prev,
      ]);
    } catch (err: any) {
      setEmailResult({ success: false, error: err.message || 'Erreur réseau' });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingSms(true);
    setSmsResult(null);

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: smsTo.trim(),
          message: smsMessage,
          sender: 'VSH-HAPPY',
        }),
      });

      const data = await response.json();
      setSmsResult(data);

      // Add to log
      setLogs((prev) => [
        {
          id: data.id || `log_sms_${Date.now()}`,
          type: 'sms',
          recipient: smsTo.trim(),
          title: `SMS International (${data.destinationCountry || 'Italie'})`,
          status: data.live ? 'sent' : 'simulated',
          provider: data.provider || 'Passerelle Telecom',
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          details: data.message,
        },
        ...prev,
      ]);
    } catch (err: any) {
      setSmsResult({ success: false, error: err.message || 'Erreur réseau' });
    } finally {
      setIsSendingSms(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-[#bbcac6]/50 flex flex-col animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#006a62] via-[#005049] to-[#ab3500] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide">
              <span className="material-symbols-outlined text-xs">mark_email_read</span>
              <span>Resend.com Email API</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold tracking-wide">
              <span className="material-symbols-outlined text-xs">send_to_mobile</span>
              <span>SMS International (+39 Italie)</span>
            </span>
          </div>

          <h2 className="text-2xl font-bold font-display tracking-tight">
            Centre de Test Notifications (Email & SMS)
          </h2>
          <p className="text-xs text-white/80 mt-1">
            Testez l'envoi d'emails transactionnels avec <strong>Resend.com</strong> et l'acheminement de SMS vers un numéro italien (+39).
          </p>
        </div>

        {/* Status Bar */}
        <div className="bg-[#f2f4f6] px-6 py-2.5 border-b border-[#e0e3e5] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${serverStatus?.resendConfigured ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
              <span className="font-semibold text-[#191c1e]">Resend API :</span>
              <span className="text-[#6c7a77]">
                {serverStatus?.resendConfigured ? 'Clé Active (Mode Réel)' : 'Mode Simulation Prêt'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${serverStatus?.smsConfigured ? 'bg-emerald-500' : 'bg-sky-500'}`}></span>
              <span className="font-semibold text-[#191c1e]">Passerelle SMS (+39) :</span>
              <span className="text-[#6c7a77]">
                {serverStatus?.smsConfigured ? 'Passerelle Active' : 'Routage International Simulé'}
              </span>
            </div>
          </div>

          <span className="text-[11px] text-[#006a62] font-semibold bg-[#006a62]/10 px-2.5 py-0.5 rounded-md">
            Serveur Express Connecté
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e0e3e5] bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'email'
                ? 'border-[#006a62] text-[#006a62]'
                : 'border-transparent text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">mail</span>
            <span>1. Test Email (Resend.com)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sms')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'sms'
                ? 'border-[#ab3500] text-[#ab3500]'
                : 'border-transparent text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">sms</span>
            <span>2. Test SMS International (+39 Italie)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'logs'
                ? 'border-[#191c1e] text-[#191c1e]'
                : 'border-transparent text-[#6c7a77] hover:text-[#191c1e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">history</span>
            <span>Historique ({logs.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: EMAIL RESEND */}
          {activeTab === 'email' && (
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 flex items-start gap-3">
                <span className="material-symbols-outlined text-emerald-700 text-lg mt-0.5">verified</span>
                <div>
                  <div className="font-bold">Connecté avec l'API Resend.com</div>
                  <p className="text-emerald-800/90 mt-0.5 text-[11px]">
                    L'envoi est pris en charge par la route sécurisée <code className="bg-white/80 px-1 py-0.5 rounded font-mono">POST /api/send-email</code>.
                    Si une clé <code className="bg-white/80 px-1 py-0.5 rounded font-mono">RESEND_API_KEY</code> est présente dans vos variables d'environnement, l'email est envoyé en temps réel via les serveurs Resend.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#191c1e]">
                    Adresse email du destinataire *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEmailTo('bernard.dounlame@gmail.com')}
                      className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200 transition-colors"
                      title="Adresse associée au compte Resend (envoi direct garanti)"
                    >
                      ✓ Compte Resend (bernard.dounlame@gmail.com)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailTo('medounla@gmail.com')}
                      className="text-[10px] text-[#006a62] hover:underline"
                    >
                      medounla@gmail.com
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#6c7a77] text-base">
                    alternate_email
                  </span>
                  <input
                    type="email"
                    required
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="ex: bernard.dounlame@gmail.com ou medounla@gmail.com"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
                  />
                </div>
                <p className="text-[10px] text-[#6c7a77] mt-1">
                  💡 <strong>Important Resend</strong> : Sur l'offre gratuite avec l'expéditeur <code className="bg-white px-1 py-0.5 rounded">dounlab@resend.dev</code>, Resend autorise l'envoi vers l'adresse propriétaire <code className="text-emerald-800 font-semibold">bernard.dounlame@gmail.com</code>. Pour envoyer à d'autres adresses, il suffit de vérifier un domaine sur <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="underline text-[#006a62]">resend.com/domains</a>.
                </p>
              </div>

              {/* Template selection */}
              <div>
                <label className="block text-xs font-bold text-[#191c1e] mb-1.5">
                  Choisir un modèle de message :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectEmailTemplate('confirmation')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      emailTemplate === 'confirmation'
                        ? 'border-[#006a62] bg-[#006a62]/10 font-bold text-[#006a62]'
                        : 'border-[#e0e3e5] hover:border-[#bbcac6] text-[#3c4947]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm">mark_email_read</span>
                      <span>Confirmation</span>
                    </div>
                    <p className="text-[10px] font-normal text-[#6c7a77]">Dossier & Convocation</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectEmailTemplate('relance_sante')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      emailTemplate === 'relance_sante'
                        ? 'border-rose-500 bg-rose-50 font-bold text-rose-700'
                        : 'border-[#e0e3e5] hover:border-[#bbcac6] text-[#3c4947]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm">assignment_late</span>
                      <span>Relance Santé</span>
                    </div>
                    <p className="text-[10px] font-normal text-[#6c7a77]">Vaccins DTP & Cerfa</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectEmailTemplate('solde')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      emailTemplate === 'solde'
                        ? 'border-amber-500 bg-amber-50 font-bold text-amber-800'
                        : 'border-[#e0e3e5] hover:border-[#bbcac6] text-[#3c4947]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm">receipt_long</span>
                      <span>Rappel Solde</span>
                    </div>
                    <p className="text-[10px] font-normal text-[#6c7a77]">Solde restant 80 €</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#191c1e] mb-1">
                  Objet de l'email
                </label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#006a62]"
                />
              </div>

              {/* Email HTML Preview Box */}
              <div className="bg-[#f7f9fb] p-3.5 rounded-2xl border border-[#e0e3e5]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-[#3c4947] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#006a62]">preview</span>
                    <span>Aperçu du rendu HTML Resend :</span>
                  </span>
                  <span className="text-[10px] text-[#6c7a77]">Expéditeur : onboarding@resend.dev</span>
                </div>
                <div
                  className="bg-white p-4 rounded-xl border border-[#e0e3e5] text-xs max-h-48 overflow-y-auto shadow-inner"
                  dangerouslySetInnerHTML={{ __html: generateEmailHtml() }}
                />
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSendingEmail}
                className="w-full py-3 px-4 bg-[#006a62] hover:bg-[#005049] disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSendingEmail ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Envoi en cours via Resend.com...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Envoyer l'Email avec Resend.com</span>
                  </>
                )}
              </button>

              {/* Email Result Feedback */}
              {emailResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs animate-fadeIn ${
                    emailResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span className="material-symbols-outlined text-base">
                      {emailResult.success ? 'check_circle' : 'error'}
                    </span>
                    <span>
                      {emailResult.success ? 'Résultat de l\'envoi Resend :' : 'Échec de l\'envoi :'}
                    </span>
                  </div>
                  <p className="text-[11px] mb-2">{emailResult.message || emailResult.error}</p>
                  {emailResult.id && (
                    <div className="font-mono text-[10px] bg-white/70 p-2 rounded-lg border border-emerald-200">
                      ID Message : <strong>{emailResult.id}</strong> • Mode :{' '}
                      <span className={emailResult.live ? 'text-emerald-700 font-bold' : 'text-blue-700'}>
                        {emailResult.live ? 'Production Resend (Réel)' : 'Simulation Validée'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </form>
          )}

          {/* TAB 2: SMS INTERNATIONAL (ITALIE +39) */}
          {activeTab === 'sms' && (
            <form onSubmit={handleSendSms} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
                <span className="text-xl">🇮🇹</span>
                <div>
                  <div className="font-bold">Acheminement SMS vers un numéro international italien (+39)</div>
                  <p className="text-amber-800/90 mt-0.5 text-[11px]">
                    Prise en charge complète du préfixe international <strong>+39</strong> (indicatif de l'Italie). Le système valide la conformité E.164 et le routage vers les réseaux mobiles italiens (TIM, Vodafone Italia, WindTre, Iliad Italia).
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#191c1e]">
                    Numéro de téléphone mobile international *
                  </label>
                  {isValidItalianFormat ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🇮🇹</span>
                      <span>Format Mobile Italien valide (+39)</span>
                    </span>
                  ) : isItalianNumber ? (
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      Numéro italien en cours de saisie
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#6c7a77]">Format attendu : +39 3XX XXXXXXX</span>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-2.5 flex items-center gap-1 text-base">
                    <span>🇮🇹</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={smsTo}
                    onChange={(e) => setSmsTo(e.target.value)}
                    placeholder="+39 347 123 4567"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#ab3500] font-mono font-semibold"
                  />
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-[#6c7a77]">Exemples de test en 1 clic :</span>
                  <button
                    type="button"
                    onClick={() => setSmsTo('+39 347 891 2345')}
                    className="text-[10px] text-[#006a62] underline hover:text-[#005049]"
                  >
                    +39 347 (Vodafone IT)
                  </button>
                  <span className="text-[#bbcac6]">•</span>
                  <button
                    type="button"
                    onClick={() => setSmsTo('+39 333 456 7890')}
                    className="text-[10px] text-[#006a62] underline hover:text-[#005049]"
                  >
                    +39 333 (TIM IT)
                  </button>
                  <span className="text-[#bbcac6]">•</span>
                  <button
                    type="button"
                    onClick={() => setSmsTo('+39 351 123 4567')}
                    className="text-[10px] text-[#006a62] underline hover:text-[#005049]"
                  >
                    +39 351 (Iliad IT)
                  </button>
                </div>
              </div>

              {/* Template selection for Italian SMS */}
              <div>
                <label className="block text-xs font-bold text-[#191c1e] mb-1.5">
                  Modèles de SMS en langue italienne / bilingue :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectSmsTemplate('italiano_sanitaire')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      smsTemplate === 'italiano_sanitaire'
                        ? 'border-[#ab3500] bg-[#ab3500]/10 font-bold text-[#ab3500]'
                        : 'border-[#e0e3e5] hover:border-[#bbcac6] text-[#3c4947]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm">health_and_safety</span>
                      <span>Scheda Sanitaria</span>
                    </div>
                    <p className="text-[10px] font-normal text-[#6c7a77]">Promemoria vaccini</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSmsTemplate('italiano_convocation')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      smsTemplate === 'italiano_convocation'
                        ? 'border-[#ab3500] bg-[#ab3500]/10 font-bold text-[#ab3500]'
                        : 'border-[#e0e3e5] hover:border-[#bbcac6] text-[#3c4947]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm">sports_soccer</span>
                      <span>Convocazione</span>
                    </div>
                    <p className="text-[10px] font-normal text-[#6c7a77]">Orario & palestra</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectSmsTemplate('italiano_confirmation')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      smsTemplate === 'italiano_confirmation'
                        ? 'border-[#ab3500] bg-[#ab3500]/10 font-bold text-[#ab3500]'
                        : 'border-[#e0e3e5] hover:border-[#bbcac6] text-[#3c4947]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span>Conferma Posto</span>
                    </div>
                    <p className="text-[10px] font-normal text-[#6c7a77]">Rif. VSH-26-042</p>
                  </button>
                </div>
              </div>

              {/* Message text area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#191c1e]">Texte du SMS :</label>
                  <span className="text-[10px] font-mono text-[#6c7a77]">
                    {smsMessage.length} caractères • {Math.ceil(smsMessage.length / 160)} SMS
                  </span>
                </div>
                <textarea
                  required
                  rows={4}
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-[#bbcac6] text-xs focus:outline-none focus:border-[#ab3500]"
                />
              </div>

              {/* Smartphone Preview */}
              <div className="bg-[#191c1e] text-white p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-white/70 border-b border-white/10 pb-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                    <span>Rete Mobile : TIM / Vodafone IT (4G/5G)</span>
                  </span>
                  <span>Mittente : VSH-HAPPY</span>
                </div>

                <div className="flex justify-end">
                  <div className="bg-[#006a62] text-white p-3 rounded-2xl rounded-tr-xs text-xs max-w-[85%] shadow-md">
                    <p className="whitespace-pre-wrap">{smsMessage}</p>
                    <span className="block text-[9px] text-white/75 text-right mt-1">
                      Oggi • Destinazione : {smsTo}
                    </span>
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={isSendingSms}
                className="w-full py-3 px-4 bg-[#ab3500] hover:bg-[#832600] disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
              >
                {isSendingSms ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Acheminement vers l'Italie (+39)...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send_to_mobile</span>
                    <span>Envoyer le SMS au numéro italien (+39)</span>
                  </>
                )}
              </button>

              {/* SMS Result Feedback */}
              {smsResult && (
                <div
                  className={`p-4 rounded-2xl border text-xs animate-fadeIn ${
                    smsResult.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span className="material-symbols-outlined text-base">
                      {smsResult.success ? 'check_circle' : 'info'}
                    </span>
                    <span>
                      {smsResult.success ? 'Rapport d\'acheminement SMS :' : 'Diagnostic Passerelle SMS :'}
                    </span>
                  </div>
                  <p className="text-[11px] mb-2">{smsResult.message || smsResult.error}</p>

                  {smsResult.suggestion && (
                    <div className="p-2.5 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 mb-2">
                      <strong>Note Twilio :</strong> {smsResult.suggestion}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-white/70 p-2.5 rounded-lg border border-amber-200/80">
                    <div>
                      Destinataire : <strong>{smsResult.recipient}</strong>
                    </div>
                    <div>
                      Pays détecté : <strong>{smsResult.destinationCountry || 'Italie (+39)'}</strong>
                    </div>
                    <div>
                      Opérateur : <strong>{smsResult.operatorDetected || 'Réseau Mobile Italien'}</strong>
                    </div>
                    <div>
                      Statut : <span className="text-emerald-700 font-bold">{smsResult.status || (smsResult.success ? 'Délivré' : 'Vérifié')}</span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* TAB 3: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#191c1e]">
                  Historique des envois récents ({logs.length})
                </h4>
                {logs.length > 0 && (
                  <button
                    onClick={() => setLogs([])}
                    className="text-[11px] text-rose-600 hover:underline"
                  >
                    Effacer l'historique
                  </button>
                )}
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-10 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
                  <span className="material-symbols-outlined text-3xl text-[#6c7a77] mb-1">
                    history_toggle_off
                  </span>
                  <p className="text-xs text-[#6c7a77]">Aucune notification envoyée pour le moment.</p>
                  <p className="text-[10px] text-[#6c7a77] mt-0.5">
                    Utilisez les onglets 1 (Email Resend) ou 2 (SMS +39) pour lancer un test.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-[#f7f9fb] border border-[#e0e3e5] rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${
                            log.type === 'email' ? 'bg-[#006a62]' : 'bg-[#ab3500]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {log.type === 'email' ? 'mail' : 'sms'}
                          </span>
                        </span>
                        <div>
                          <div className="font-bold text-[#191c1e] flex items-center gap-2">
                            <span>{log.title}</span>
                            <span className="text-[10px] font-mono text-[#6c7a77]">
                              ({log.recipient})
                            </span>
                          </div>
                          <p className="text-[10px] text-[#6c7a77]">
                            Via {log.provider} • {log.timestamp}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {log.status === 'sent' ? 'Envoyé Réel' : 'Simulé OK'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f2f4f6] border-t border-[#e0e3e5] flex items-center justify-between text-xs">
          <div className="text-[11px] text-[#6c7a77] flex items-center gap-1">
            <span className="material-symbols-outlined text-sm text-[#006a62]">check_circle</span>
            <span>Endpoints connectés : /api/send-email (Resend) et /api/send-sms</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-gray-100 border border-[#bbcac6] text-[#191c1e] font-semibold rounded-xl text-xs transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
