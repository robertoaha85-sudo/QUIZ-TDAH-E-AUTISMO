export default async function handler(req, res) {
  // Configurar CORS e cabeçalhos para Serverless Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido. Use GET.' });
  }

  try {
    const apiKey = process.env.CAKTO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave de API da Cakto não configurada (CAKTO_API_KEY)',
      });
    }

    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'Parâmetro ID do pagamento é obrigatório (?id=...).' });
    }

    const response = await fetch(`https://api.cakto.com.br/public_api/payments/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || 'Erro ao consultar status do pagamento na Cakto.',
        details: data,
      });
    }

    // Normalizar status
    const status = (
      data.status ||
      (data.data && data.data.status) ||
      ''
    ).toLowerCase();

    const isPaid = status === 'paid' || status === 'approved' || status === 'pago';

    return res.status(200).json({
      success: true,
      status: status,
      isPaid: isPaid,
      raw: data,
    });
  } catch (error) {
    console.error('Erro interno na rota /api/checar-status:', error);
    return res.status(500).json({
      error: 'Erro interno ao consultar status na Cakto.',
      message: error.message,
    });
  }
}
