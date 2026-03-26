# AI Cyber Forensics Platform - API Documentation

## Base URL
```
http://localhost:8000
```

## Interactive Docs
```
http://localhost:8000/docs
```

---

## 1. Health Check

### `GET /health`

**Response:**
```json
{
  "status": "healthy"
}
```

---

## 2. Upload CSV & Start Analysis

### `POST /api/v1/analyses/upload`

**Request:**
```
Content-Type: multipart/form-data

file: <your-csv-file.csv>
```

**Response:**
```json
{
  "id": "f349c09d-9041-44d4-a84f-c45152e7d8d3",
  "filename": "security_logs.csv",
  "file_size_bytes": 15728640,
  "status": "uploaded",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**What happens:**
1. CSV file uploaded to Supabase Storage (`evtx-files` bucket)
2. Analysis record created in database
3. Background processing starts automatically:
   - Parse CSV → Extract events
   - Run rule-based detection (brute force, log tampering, privilege escalation, etc.)
   - Run ML anomaly detection (statistical + isolation forest + IQR)
   - Detect impossible travel (if GeoIP available)
   - Build attack chains
   - Generate LLM summary (if OpenAI key configured)

---

## 3. List All Analyses

### `GET /api/v1/analyses?page=1&limit=20`

**Response:**
```json
{
  "data": [
    {
      "id": "f349c09d-9041-44d4-a84f-c45152e7d8d3",
      "filename": "security_logs.csv",
      "file_size_bytes": 15728640,
      "storage_path": "uploads/f349c09d.../security_logs.csv",
      "status": "completed",
      "progress": 100,
      "total_events": 145230,
      "total_findings": 23,
      "total_anomalies": 8,
      "total_attack_chains": 2,
      "risk_score": 0.76,
      "created_at": "2024-01-15T10:00:00Z",
      "started_at": "2024-01-15T10:00:05Z",
      "completed_at": "2024-01-15T10:03:45Z"
    }
  ],
  "page": 1,
  "limit": 20
}
```

**Status values:** `uploaded` → `parsing` → `analyzing` → `completed` or `failed`

---

## 4. Get Single Analysis

### `GET /api/v1/analyses/{analysis_id}`

**Response:**
```json
{
  "id": "f349c09d-9041-44d4-a84f-c45152e7d8d3",
  "filename": "security_logs.csv",
  "file_size_bytes": 15728640,
  "status": "completed",
  "progress": 100,
  "total_events": 145230,
  "total_findings": 23,
  "total_anomalies": 8,
  "total_attack_chains": 2,
  "risk_score": 0.76,
  "created_at": "2024-01-15T10:00:00Z",
  "completed_at": "2024-01-15T10:03:45Z"
}
```

---

## 5. Check Analysis Status (Real-time)

### `GET /api/v1/analyses/{analysis_id}/status`

**Response:**
```json
{
  "id": "f349c09d-9041-44d4-a84f-c45152e7d8d3",
  "status": "analyzing",
  "progress": 65,
  "error_message": null
}
```

---

## 6. Delete Analysis

### `DELETE /api/v1/analyses/{analysis_id}`

**Response:**
```json
{
  "message": "Analysis deleted"
}
```

**What gets deleted:**
- CSV file from Supabase Storage
- All events, findings, chains, summaries from database

---

## 7. List Events (Parsed Logs)

### `GET /api/v1/analyses/{analysis_id}/events`

**Query Parameters:**
| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `event_id` | int | Filter by Windows Event ID | `4625` |
| `account_name` | string | Filter by username | `admin` |
| `source_ip` | string | Filter by IP | `192.168.1.50` |
| `log_name` | string | Filter by log source | `Security` |
| `page` | int | Page number | `1` |
| `limit` | int | Results per page (max 200) | `50` |
| `sort` | string | Sort field | `timestamp` |
| `order` | string | Sort direction | `desc` |

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "event_id": 4625,
      "timestamp": "2024-01-15T10:02:15Z",
      "account_name": "admin",
      "account_domain": "CORP",
      "source_ip": "192.168.1.50",
      "machine_name": "DC01",
      "log_name": "Security",
      "level": 0,
      "level_display": "Information",
      "message": "An account failed to log on",
      "security_id": "S-1-0-0",
      "logon_id": "0x0"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 145230
  }
}
```

---

## 8. Get Single Event

### `GET /api/v1/analyses/{analysis_id}/events/{event_db_id}`

**Response:**
```json
{
  "id": 1,
  "event_id": 4625,
  "timestamp": "2024-01-15T10:02:15Z",
  "account_name": "admin",
  "source_ip": "192.168.1.50",
  "machine_name": "DC01",
  "log_name": "Security",
  "message": "An account failed to log on",
  "raw_data": {
    "timestamp": "2024-01-15T10:02:15Z",
    "event_id": "4625",
    "AccountName": "admin",
    "ip": "192.168.1.50"
  }
}
```

---

## 9. List Findings (Detections)

### `GET /api/v1/analyses/{analysis_id}/findings`

**Query Parameters:**
| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `detection_type` | string | `rule`, `ml_anomaly`, `impossible_travel` | `rule` |
| `severity` | string | `critical`, `high`, `medium`, `low`, `info` | `high` |
| `mitre_technique` | string | Filter by MITRE technique | `T1110.001` |
| `page` | int | Page number | `1` |
| `limit` | int | Results per page | `50` |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "detection_type": "rule",
      "rule_id": "BRUTE_FORCE_001",
      "severity": "high",
      "title": "Brute Force: admin from 192.168.1.50",
      "description": "15 failed logon attempts for user 'admin' from 192.168.1.50 in 2 minutes",
      "mitre_techniques": ["T1110.001"],
      "mitre_tactics": ["credential-access"],
      "evidence_events": [1, 2, 3, 4, 5],
      "timestamp_start": "2024-01-15T10:02:00Z",
      "timestamp_end": "2024-01-15T10:04:00Z",
      "affected_users": ["admin"],
      "source_ips": ["192.168.1.50"],
      "anomaly_score": null,
      "ml_method": null,
      "details": {
        "failed_attempts": 15,
        "threshold": 5,
        "window_minutes": 2,
        "account_name": "admin",
        "source_ip": "192.168.1.50"
      }
    },
    {
      "id": "uuid",
      "detection_type": "ml_anomaly",
      "rule_id": "ML_ISOLATION_FOREST",
      "severity": "high",
      "title": "ML Anomaly: admin",
      "description": "Isolation Forest detected anomalous pattern for 'admin' at 2024-01-15T10:00:00",
      "mitre_techniques": ["T1078"],
      "mitre_tactics": ["initial-access"],
      "anomaly_score": 0.87,
      "ml_method": "isolation_forest",
      "details": {
        "method": "isolation_forest",
        "contamination": 0.05,
        "decision_score": -0.2345,
        "features": {
          "total_events": 45,
          "failed_logons": 15,
          "unique_source_ips": 3
        }
      }
    },
    {
      "id": "uuid",
      "detection_type": "impossible_travel",
      "rule_id": "IMPOSSIBLE_TRAVEL_001",
      "severity": "critical",
      "title": "Impossible Travel: admin",
      "description": "User 'admin' traveled 10838 km in 15 minutes (43352 km/h). Physical impossibility.",
      "mitre_techniques": ["T1078"],
      "mitre_tactics": ["initial-access"],
      "details": {
        "account_name": "admin",
        "events": [
          {"ip": "1.2.3.4", "location": "New York, US", "time": "2024-01-15T10:00:00Z"},
          {"ip": "5.6.7.8", "location": "Tokyo, JP", "time": "2024-01-15T10:15:00Z"}
        ],
        "distance_km": 10838,
        "time_diff_minutes": 15,
        "speed_kmph": 43352,
        "min_plausible_hours": 12,
        "explanation": "User traveled 10838 km in 15 minutes (43352 km/h). Minimum plausible travel time: 12.0 hours."
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 23
  }
}
```

---

## 10. Get Finding Stats

### `GET /api/v1/analyses/{analysis_id}/findings/stats`

**Response:**
```json
{
  "total": 23,
  "by_severity": {
    "critical": 2,
    "high": 5,
    "medium": 8,
    "low": 6,
    "info": 2
  },
  "by_type": {
    "rule": 12,
    "ml_anomaly": 8,
    "impossible_travel": 3
  }
}
```

---

## 11. List Attack Chains

### `GET /api/v1/analyses/{analysis_id}/chains`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "chain_index": 1,
      "title": "Credential Access → Lateral Movement",
      "summary": "Attack chain involving 5 correlated findings across 3 kill chain phases",
      "chain_confidence": 0.81,
      "finding_ids": ["uuid1", "uuid2", "uuid3"],
      "kill_chain_phases": ["credential-access", "lateral-movement", "persistence"],
      "first_event_time": "2024-01-15T10:00:00Z",
      "last_event_time": "2024-01-15T11:30:00Z",
      "duration_minutes": 90,
      "affected_users": ["admin"],
      "affected_hosts": ["DC01", "WS05", "FS02"]
    }
  ],
  "total_chains": 2,
  "parallel_attack_detected": true
}
```

---

## 12. Get Single Chain

### `GET /api/v1/analyses/{analysis_id}/chains/{chain_id}`

**Response:** Same as single item in list above.

---

## 13. Get Chain Graph (Visualization)

### `GET /api/v1/analyses/{analysis_id}/chains/{chain_id}/graph`

**Response:**
```json
{
  "nodes": [
    {"id": "user:admin", "type": "user", "label": "admin"},
    {"id": "host:DC01", "type": "host", "label": "DC01"},
    {"id": "host:WS05", "type": "host", "label": "WS05"},
    {"id": "ip:192.168.1.50", "type": "ip", "label": "192.168.1.50"}
  ],
  "edges": [
    {
      "source": "ip:192.168.1.50",
      "target": "user:admin",
      "label": "brute_force",
      "technique": "T1110.001",
      "timestamp": "2024-01-15T10:02:00Z",
      "finding_id": "uuid"
    },
    {
      "source": "user:admin",
      "target": "host:DC01",
      "label": "logon",
      "technique": "T1078",
      "timestamp": "2024-01-15T10:05:00Z",
      "finding_id": "uuid"
    }
  ]
}
```

**Node types:** `user`, `host`, `ip`, `service`, `process`

---

## 14. Get Summary

### `GET /api/v1/analyses/{analysis_id}/summary?mode=SOC_ANALYST`

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `mode` | string | `SOC_ANALYST` or `CISO` |

**Response:**
```json
{
  "id": "uuid",
  "mode": "SOC_ANALYST",
  "model": "gpt-4",
  "cached": true,
  "tokens_used": 2450,
  "content_markdown": "## Executive Summary\n\nA credential compromise attack...",
  "sections": {
    "executive_summary": "A credential compromise attack was detected...",
    "attack_narrative": "At 10:00, the attacker initiated...",
    "affected_assets": "admin account, DC01, WS05",
    "remediation_steps": "1. Reset admin password..."
  },
  "created_at": "2024-01-15T10:04:00Z"
}
```

---

## 15. Generate Summary

### `POST /api/v1/analyses/{analysis_id}/summary/generate?mode=SOC_ANALYST`

**Response:** Same as Get Summary but `"cached": false`

---

## 16. WebSocket (Real-time Progress)

### `WS /api/v1/ws/analyses/{analysis_id}`

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/analyses/{analysis_id}');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

**Messages received:**

**Progress:**
```json
{
  "type": "progress",
  "status": "analyzing",
  "progress": 45,
  "stage": "ML anomaly detection",
  "message": "Processing: ML anomaly detection"
}
```

**Complete:**
```json
{
  "type": "complete",
  "status": "completed",
  "progress": 100,
  "total_findings": 23,
  "total_anomalies": 8,
  "total_chains": 2
}
```

**Error:**
```json
{
  "type": "error",
  "status": "failed",
  "error_message": "Invalid CSV format"
}
```

---

## Detection Rules Reference

| Rule ID | Detection | Severity | MITRE |
|---------|-----------|----------|-------|
| `BRUTE_FORCE_001` | >5 failed logons from same source in 2 min | high | T1110.001 |
| `BRUTE_FORCE_002` | >10 failed logons from multiple IPs | high | T1110.001 |
| `LOG_TAMPER_001` | Security log cleared | critical | T1070.001 |
| `LOG_TAMPER_002` | Audit policy changed | high | T1070.001 |
| `PRIV_ESC_001` | Special privileges assigned | medium | T1548 |
| `PRIV_ESC_002` | Explicit credential use (RunAs) | medium | T1078 |
| `LAT_MOVE_001` | Network logon to multiple hosts | high | T1021.002 |
| `LAT_MOVE_002` | RDP logon detected | medium | T1021.001 |
| `PERSIST_001` | Scheduled task created | high | T1053.005 |
| `PERSIST_002` | Service installed | high | T1543.003 |
| `PERSIST_003` | Registry Run key modified | high | T1547.001 |
| `NETWORK_001` | Firewall rule added | medium | T1562.004 |
| `EXEC_001` | Suspicious process creation | medium | T1059 |

---

## CSV File Format

Your CSV must contain these columns:

| Column | Required | Description |
|--------|----------|-------------|
| `timestamp` or `TimeCreated` | Yes | Event timestamp |
| `event_id` or `Id` | Yes | Windows Event ID |
| `ip` | Yes | Source IP address |
| `AccountName` or `User` | Yes | Username |
| `MachineName` or `Computer` | No | Hostname |
| `LogName` | No | Log source (Security, System) |
| `Level` | No | Event level |
| `Message` or `detail` | No | Event description |
| `SecurityID` | No | User SID |
| `LogonID` | No | Session ID |
| `AccountDomain` | No | Domain name |

---

## Quick Start

```bash
# 1. Start server
cd C:\mcpantigrav\ai-cyber-forensics\backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# 2. Upload CSV
curl -X POST http://localhost:8000/api/v1/analyses/upload \
  -F "file=@your_logs.csv"

# 3. Check status
curl http://localhost:8000/api/v1/analyses/{analysis_id}/status

# 4. Get findings
curl http://localhost:8000/api/v1/analyses/{analysis_id}/findings

# 5. Get attack chains
curl http://localhost:8000/api/v1/analyses/{analysis_id}/chains

# 6. Get summary
curl http://localhost:8000/api/v1/analyses/{analysis_id}/summary
```
