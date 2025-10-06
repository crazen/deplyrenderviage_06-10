import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { supabase } from './backend/backend_cadastro.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt'; // recomendado
import sgMail from '@sendgrid/mail';

// Configurações de path (necessário para ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // ✅ Render usa PORT da env

app.use(cors());
app.use(express.json());

// ✅ Servir arquivos estáticos da pasta frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Configura o SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// --- Cadastro ---
app.post('/cadastro', async (req, res) => {
  try {
    const { nome, sobrenome, email, senha } = req.body;

    const { data: existingUser, error: selectError } = await supabase
      .from('viajantes')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (selectError) throw selectError;
    if (existingUser) return res.status(400).json({ error: 'Email já cadastrado' });

    const { data, error } = await supabase
      .from('viajantes')
      .insert([{
        nome: `${nome} ${sobrenome}`,
        nome_usuario: { nome, sobrenome },
        password: { senha },
        email,
        sexo: 'não informado',
        idade: 0
      }])
      .select();

    if (error) throw error;

    res.status(200).json({ message: 'Cadastro realizado com sucesso!', data });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário', details: err.message });
  }
});

// --- Login ---
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const { data: user, error } = await supabase
      .from('viajantes')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Email ou senha incorretos' });

    const senhaCorreta = user.password?.senha === password; // sem bcrypt por enquanto
    if (!senhaCorreta) return res.status(401).json({ error: 'Email ou senha incorretos' });

    const primeiroLogin = user.logins_realizados === 0;

    await supabase
      .from('viajantes')
      .update({ logins_realizados: user.logins_realizados + 1 })
      .eq('id', user.id);

    res.status(200).json({
      message: 'Login realizado com sucesso!',
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        sexo: user.sexo,
        idade: user.idade,
        primeiroLogin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno no servidor', details: err.message });
  }
});

// --- Recuperar senha ---
app.post('/recuperar-senha', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email obrigatório' });

    const { data: user, error } = await supabase
      .from('viajantes')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(404).json({ error: 'Email não cadastrado' });

    const link = `http://localhost:5500/novasenha.html?email=${encodeURIComponent(email)}`;

    if (!process.env.SENDGRID_API_KEY) {
      console.error('Erro: SENDGRID_API_KEY não encontrada no .env');
      return res.status(500).json({ error: 'Chave do SendGrid não configurada' });
    }
    console.log('SendGrid API Key encontrada, enviando email...');

    const msg = {
      to: email,
      from: 'viajeemgrupofacil@gmail.com',
      subject: 'Redefinição de senha - vIAje!',
      html: `
        <p>Olá ${user.nome || ''},</p>
        <p>Clique no link abaixo para redefinir sua senha:</p>
        <a href="${link}" style="color: #007bff;">${link}</a>
        <p>Se você não solicitou isso, ignore este email.</p>
      `
    };

    try {
      await sgMail.send(msg);
      console.log(`Email de redefinição enviado para ${email}`);
      res.json({ message: 'Email enviado com sucesso!' });
    } catch (sendErr) {
      console.error('Erro ao enviar email via SendGrid:', sendErr.response?.body || sendErr.message);
      res.status(500).json({
        error: 'Falha ao enviar email',
        details: sendErr.response?.body || sendErr.message
      });
    }

  } catch (err) {
    console.error('Erro no endpoint /recuperar-senha:', err);
    res.status(500).json({ error: 'Erro interno', details: err.message });
  }
});

// --- Nova senha ---
app.post('/nova-senha', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    const { data, error } = await supabase
      .from('viajantes')
      .update({ password: { senha } })
      .eq('email', email);

    if (error) throw error;

    res.json({ message: 'Senha atualizada com sucesso!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar senha', details: err.message });
  }
});

// ✅ Rota para exibir login.html como página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

// ✅ Iniciar servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
