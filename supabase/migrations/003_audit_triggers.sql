-- Audit triggers: automatically log INSERT/UPDATE/DELETE on animal tracking tables

-- ─── Function ───────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION write_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_action TEXT;
  v_record_id UUID;
  v_before JSONB;
  v_after JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'insert';
    v_record_id := NEW.id;
    v_before := NULL;
    v_after := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'update';
    v_record_id := NEW.id;
    v_before := to_jsonb(OLD);
    v_after := to_jsonb(NEW);
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'delete';
    v_record_id := OLD.id;
    v_before := to_jsonb(OLD);
    v_after := NULL;
  END IF;

  INSERT INTO audit_log (actor_id, action, table_name, record_id, before_data, after_data)
  VALUES (auth.uid(), v_action, TG_TABLE_NAME, v_record_id, v_before, v_after);

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

-- ─── Triggers ───────────────────────────────────────────────────────────────────

CREATE TRIGGER animals_audit
  AFTER INSERT OR UPDATE OR DELETE ON animals
  FOR EACH ROW
  EXECUTE FUNCTION write_audit_log();

CREATE TRIGGER weight_logs_audit
  AFTER INSERT OR UPDATE OR DELETE ON weight_logs
  FOR EACH ROW
  EXECUTE FUNCTION write_audit_log();

CREATE TRIGGER vaccinations_audit
  AFTER INSERT OR UPDATE OR DELETE ON vaccinations
  FOR EACH ROW
  EXECUTE FUNCTION write_audit_log();

CREATE TRIGGER health_checks_audit
  AFTER INSERT OR UPDATE OR DELETE ON health_checks
  FOR EACH ROW
  EXECUTE FUNCTION write_audit_log();

CREATE TRIGGER events_audit
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH ROW
  EXECUTE FUNCTION write_audit_log();
