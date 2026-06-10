# Supabase — configuração obrigatória

As tabelas **não são criadas automaticamente** pelo app. Execute **uma vez** no seu projeto Supabase:

## Passo a passo

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto  
2. Menu **SQL Editor** → **New query**  
3. Copie todo o conteúdo de [`setup.sql`](./setup.sql)  
4. Clique em **Run**  
5. Recarregue o dashboard (`/dashboard`) no navegador  

O script cria:

- `public.candidates` — perfil e currículo  
- `public.candidate_phase_progress` — progresso por fase (individual)  
- `public.candidate_technical_submissions` — links enviados no Desafio Técnico  
- Bucket `resumes` + políticas de storage  

## Marcar fase concluída (equipe)

```sql
update public.candidate_phase_progress
set completed_at = now()
where candidate_id = 'UUID_DO_USUARIO'
  and phase_key = 'disc';
```

Valores de `phase_key`: `cadastro`, `disc`, `technical`, `cultural`, `legal`, `onboarding`.

## Teste DISC (dashboard)

O candidato conclui a fase **DISC** ao enviar o PDF do mapeamento no dashboard. É necessária a política `"Candidatos concluem fase DISC"` (já incluída no `setup.sql`).

Opcional no `.env`:

```env
PUBLIC_DISC_ASSESSMENT_URL=https://www.mrcoach.com.br/teste-perfil-comportamental-disc.php
```

## Desafio Técnico (dashboard)

O candidato conclui a fase **Desafio Técnico** ao colar os links da entrega e clicar em **Enviar**. São necessárias a tabela `candidate_technical_submissions` e a política `"Candidatos concluem fase técnica"` (já incluídas no `setup.sql`).

Opcional no `.env`:

Por padrão as orientações ficam em `/desafio-tecnico` (página interna). Override opcional:

```env
PUBLIC_TECHNICAL_CHALLENGE_URL=/desafio-tecnico
```

## Fit Cultural (dashboard)

Quando a fase está desbloqueada, o candidato vê o link de agendamento no Google Calendar. A conclusão da fase é feita pela equipe no Supabase (como nas demais etapas após o DISC/técnico).

Opcional no `.env`:

```env
PUBLIC_CULTURAL_CALENDAR_URL=https://calendar.app.google/T1H7ghKxibiesdgGA
```

## Painel superadmin (`/superadmin`)

Rota pública (sem login) para gestão interna: lista candidatos, entregas, anotações e mudança de fase/congelamento.

Requer no `.env` do servidor:

```env
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

**Atenção:** não exponha essa chave no front-end. Em produção, proteja a rota (VPN, IP allowlist ou autenticação) — o app não exige login por padrão nesta rota.

Colunas usadas em `candidates`: `admin_notes`, `is_frozen` (incluídas no `setup.sql`).

## Auth

### Cadastro em massa (recomendado para o processo seletivo)

Com vários candidatos se cadastrando ao mesmo tempo, **desative a confirmação de e-mail**:

1. Supabase Dashboard → **Authentication** → **Providers** → **Email**
2. Desligue **Confirm email**
3. Salve

Assim o cadastro conclui na hora (com currículo) e **não dispara e-mail** a cada inscrição — evitando o erro `email rate limit exceeded`.

O SMTP embutido do Supabase envia poucos e-mails por hora (cerca de 3–4). Não use isso em produção com muitos cadastros.

**Alternativa para produção com confirmação de e-mail:** configure SMTP próprio em *Project Settings → Authentication → SMTP* (Resend, SendGrid, etc.) e ajuste os limites em *Authentication → Rate Limits*.

Em **Authentication → URL Configuration**, inclua a URL de produção (ex.: `https://seu-app.vercel.app`) em **Site URL** e em **Redirect URLs** (com `/candidatar`).

### Erro ao cadastrar ("falha na busca" ou similar)

1. **Vercel:** confira `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_PUBLISHABLE_KEY` nas variáveis de ambiente (mesmos valores do `.env` local).
2. **Supabase pausado:** projetos gratuitos pausam por inatividade — reative no dashboard (primeira requisição pode demorar).
3. **Logs:** *Authentication → Logs* e *Postgres → Logs* no momento do cadastro. Erros 500 costumam ser **trigger** em `auth.users` (função que falha ao criar usuário). Remova ou corrija triggers customizados no schema `auth`.
4. **Confirmação de e-mail:** com confirmação ativa, o candidato recebe o link por e-mail e só depois conclui o perfil em `/candidatar`.
5. **`email rate limit exceeded`:** limite do SMTP padrão. Desative **Confirm email** (ver seção Auth acima) ou configure SMTP próprio.
