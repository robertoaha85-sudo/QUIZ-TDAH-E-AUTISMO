export default async function handler(req, res) {
  // Configurar CORS e cabeçalhos para Serverless Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  try {
    const apiKey = process.env.CAKTO_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'Chave de API da Cakto não configurada (CAKTO_API_KEY)',
      });
    }

    const { name, email, phone, document, sessionId } = req.body || {};

    if (!name || !email || !phone || !document) {
      return res.status(400).json({
        error: 'Todos os 4 campos são obrigatórios: name, email, phone e document.',
      });
    }

    // Sanitizar apenas números de telefone e documento
    const cleanPhone = String(phone).replace(/\D/g, '');
    const cleanDocument = String(document).replace(/\D/g, '');

    if (cleanDocument.length !== 11 && cleanDocument.length !== 14) {
      return res.status(400).json({
        error: 'CPF inválido. Certifique-se de preencher os 11 dígitos do CPF.',
      });
    }

    // Montar payload para a API da Cakto
    // Offer ID fornecido: vIuE4fW1lGQNa1M3k1M4u91iOk06UTVZltPJUtNN
    const payload = {
      offer_id: 'vIuE4fW1lGQNa1M3k1M4u91iOk06UTVZltPJUtNN',
      payment_method: 'pix',
      customer: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        phone: cleanPhone,
        documentNumber: cleanDocument,
      },
      metadata: {
        sessionId: sessionId || '',
      },
    };

    const response = await fetch('https://api.cakto.com.br/public_api/payments/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Erro retornado pela API da Cakto:', data);
      return res.status(response.status).json({
        error: data.message || data.error || 'Erro ao processar transação na Cakto.',
        details: data,
      });
    }

    // Extrair ID do pagamento e código Pix Copia e Cola da Cakto
    const paymentId = data.id || data.payment_id || (data.data && data.data.id);
    const pixCode =
      data.pix_code ||
      data.pix_copy_paste ||
      data.copy_paste ||
      data.emv ||
      (data.pix && (data.pix.code || data.pix.qrcode || data.pix.copy_paste || data.pix.payload)) ||
      (data.point_of_interaction &&
        data.point_of_interaction.transaction_data &&
        data.point_of_interaction.transaction_data.qr_code);

    const qrCodeImage =
      data.pix_qr_code ||
      data.qr_code_base64 ||
      data.qr_code_url ||
      (data.pix && (data.pix.qr_code_base64 || data.pix.image || data.pix.qr_code_url)) ||
      (data.point_of_interaction &&
        data.point_of_interaction.transaction_data &&
        data.point_of_interaction.transaction_data.qr_code_base64);

    return res.status(200).json({
      success: true,
      paymentId: paymentId,
      pixCode: pixCode,
      qrCodeImage: qrCodeImage,
      raw: data,
    });
  } catch (error) {
    console.error('Erro interno na rota /api/criar-pix:', error);
    return res.status(500).json({
      error: 'Erro interno ao comunicar com a Cakto.',
      message: error.message,
    });
  }
}
