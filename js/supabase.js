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
// SAVE SCORE
// ============================================
export async function saveScore(data) {
  try {
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
    if (!res.ok) {
      console.warn('Supabase save failed:', res.status, await res.text());
      return null;
    }
    const result = await res.json();
    return result[0] || result;
  } catch (err) {
    console.warn('Supabase save error:', err);
    return null;
  }
}

// ============================================
// LOAD LEADERBOARD
// ============================================
export async function loadLeaderboard(mode = 'all') {
  try {
    let url = `${SUPABASE_URL}/rest/v1/scores?select=*&order=skor.desc,waktu_selesai.asc&limit=50`;
    if (mode !== 'all') {
      url += `&mode=eq.${mode}`;
    }
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn('Supabase load failed:', res.status);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn('Supabase load error:', err);
    return null;
  }
}

// ============================================
// CHECK CONNECTION
// ============================================
export async function checkConnection() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/scores?select=id&limit=1`, { headers });
    return res.ok;
  } catch {
    return false;
  }
}
