// ============================================
// SUPABASE INTEGRATION
// ============================================

const SUPABASE_URL = 'https://awflfzhfztsfgkuhdcvh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_crFPPRDfXXGXEvIDiQ8NcA_M_SiAOAI';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// ============================================
// SAVE SCORE (Upsert — only save if faster)
// ============================================
export async function saveScore(data) {
  try {
    // Check if name already exists
    const existing = await fetch(
      `${SUPABASE_URL}/rest/v1/scores?nama=eq.${encodeURIComponent(data.nama)}&select=*&order=skor.desc,waktu_selesai.asc&limit=1`,
      { headers }
    );

    if (existing.ok) {
      const rows = await existing.json();
      if (rows.length > 0) {
        const best = rows[0];
        // Only update if new score is higher, OR same score but faster time
        if (data.skor > best.skor || (data.skor === best.skor && data.waktuSelesai < best.waktu_selesai)) {
          // Update existing record
          const res = await fetch(
            `${SUPABASE_URL}/rest/v1/scores?id=eq.${best.id}`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                skor: data.skor,
                mode: data.mode,
                waktu_selesai: data.waktuSelesai,
                detail: data.detail,
                created_at: new Date().toISOString(),
              }),
            }
          );
          if (!res.ok) { console.warn('Supabase update failed:', res.status); return null; }
          return { updated: true };
        } else {
          // Existing score is better, don't update
          return { skipped: true, reason: 'Skor/waktu sebelumnya lebih baik' };
        }
      }
    }

    // No existing record — insert new
    const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nama: data.nama,
        skor: data.skor,
        mode: data.mode || 'practice',
        waktu_selesai: data.waktuSelesai,
        detail: data.detail,
      }),
    });
    if (!res.ok) { console.warn('Supabase insert failed:', res.status); return null; }
    return { inserted: true };
  } catch (err) {
    console.warn('Supabase save error:', err);
    return null;
  }
}

// ============================================
// LOAD LEADERBOARD
// ============================================
export async function loadLeaderboard() {
  try {
    const url = `${SUPABASE_URL}/rest/v1/scores?select=*&order=skor.desc,waktu_selesai.asc&limit=50`;
    const res = await fetch(url, { headers });
    if (!res.ok) { console.warn('Supabase load failed:', res.status); return null; }
    return await res.json();
  } catch (err) {
    console.warn('Supabase load error:', err);
    return null;
  }
}
