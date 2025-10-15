# Supabase Scripts Quick Reference

Quick reference for all Supabase-related npm scripts added to `package.json`.

## 🚀 Local Development

### Start/Stop Local Supabase

```bash
# Start local Supabase instance (requires Docker)
pnpm supabase:start

# Stop local Supabase instance
pnpm supabase:stop

# Check status of local Supabase
pnpm supabase:status
```

## ⚡ Edge Functions

### Local Development

```bash
# Serve all edge functions locally
pnpm supabase:functions:serve

# Test locally before deploying
curl -i --request POST \
  'http://localhost:54321/functions/v1/handle-user-signin' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### Deployment

```bash
# Deploy a single function (interactive - asks which function)
pnpm supabase:functions:deploy

# Deploy all functions at once (skips JWT verification)
pnpm supabase:functions:deploy:all

# Deploy specific function
supabase functions deploy handle-user-signin
```

## 🗄️ Database

### Migrations

```bash
# Create a new migration file
pnpm supabase:migration:new <migration_name>

# Example:
pnpm supabase:migration:new add_user_avatar_column
```

### Schema Management

```bash
# Push local migrations to remote database
pnpm supabase:db:push

# Pull remote schema to local
pnpm supabase:db:pull

# Reset local database (WARNING: destroys all data)
pnpm supabase:db:reset
```

### Type Generation

```bash
# Generate TypeScript types from database schema
pnpm supabase:gen:types

# This creates: src/types/supabase.ts
# Use these types for type-safe database queries
```

## 📝 Common Workflows

### 1. Initial Setup

```bash
# Start local Supabase
pnpm supabase:start

# Generate types
pnpm supabase:gen:types
```

### 2. Developing a New Feature

```bash
# Create migration
pnpm supabase:migration:new add_new_feature

# Edit migration file in supabase/migrations/

# Apply migration locally
pnpm supabase:db:reset

# Generate updated types
pnpm supabase:gen:types
```

### 3. Deploying Changes

```bash
# Push database changes
pnpm supabase:db:push

# Deploy edge functions
pnpm supabase:functions:deploy

# Or deploy all at once
pnpm supabase:functions:deploy:all
```

### 4. Debugging Edge Function

```bash
# Serve locally
pnpm supabase:functions:serve

# In another terminal, test the function
curl -i --request POST \
  'http://localhost:54321/functions/v1/handle-user-signin' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --header 'Content-Type: application/json'

# Check logs in the first terminal
```

### 5. Syncing Remote Changes

```bash
# Pull remote schema
pnpm supabase:db:pull

# Generate types from updated schema
pnpm supabase:gen:types
```

## 🔍 Troubleshooting

### Docker Issues

```bash
# If "Docker is not running" error:
# 1. Start Docker Desktop
# 2. Run: pnpm supabase:start

# If port conflicts:
# 1. Stop Supabase: pnpm supabase:stop
# 2. Check status: pnpm supabase:status
# 3. Restart: pnpm supabase:start
```

### Edge Function Issues

```bash
# View function logs (deployed)
supabase functions logs handle-user-signin --limit 20

# View local function output
# Just watch the terminal where you ran `pnpm supabase:functions:serve`
```

### Database Issues

```bash
# Reset and start fresh (WARNING: loses all data)
pnpm supabase:db:reset

# Check status
pnpm supabase:status

# View database URL
# Look for "DB URL" in status output
```

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Test edge functions locally with `supabase:functions:serve`
- [ ] Run database migrations with `supabase:db:push`
- [ ] Generate and commit types with `supabase:gen:types`
- [ ] Review edge function logs for errors
- [ ] Test authentication flow end-to-end
- [ ] Verify environment variables are set in Supabase dashboard

## 🔗 Useful Commands Not in Scripts

```bash
# Login to Supabase CLI
supabase login

# Link to remote project
supabase link --project-ref YOUR_PROJECT_REF

# View edge function logs
supabase functions logs FUNCTION_NAME

# Create new edge function
supabase functions new FUNCTION_NAME

# Download function from remote
supabase functions download FUNCTION_NAME
```

## 💡 Tips

1. **Always test locally first**: Use `supabase:functions:serve` before deploying
2. **Generate types regularly**: Run `supabase:gen:types` after schema changes
3. **Use migrations**: Don't modify the database manually - use migrations
4. **Check status**: Run `supabase:status` if something isn't working
5. **Read logs**: Edge function logs are your best friend for debugging

## 🆘 Getting Help

- [Supabase CLI Docs](https://supabase.com/docs/guides/cli)
- [Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Database Migrations](https://supabase.com/docs/guides/cli/local-development#database-migrations)
