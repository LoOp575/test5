# ERD — PVC Virtual Company

```
companies 1──* departments 1──* agents
   │                │
   │                └── projects (via company_id)
   │                       │
   │                       └── tasks (self-parent parent_task_id)
   │                              └── artifacts
   │
   └── workflow_runs 1──* checkpoints
          └── approvals (via workflow_run_id / task_id)
   └── audit_logs, memories, usage_ledger
```

Indeks: company_id, status, created_at. RLS per company_owner. Trigger updated_at.
