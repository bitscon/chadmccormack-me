# Proof of Work
## Dun & Bradstreet - Global CMDB and Discovery Rollout

---

## Situation

Dun & Bradstreet needed a reliable global infrastructure inventory.

Infrastructure data existed across teams and tools, but there was no consistent automated process for discovery, CI identification, and lifecycle governance.

Operational issues included:

- Limited enterprise visibility into infrastructure assets
- Inconsistent CMDB data quality
- Weak incident impact analysis due to missing relationships
- Fragmented ownership and certification practices

---

## Objective

Design and implement an enterprise ServiceNow CMDB and Discovery architecture that would:

- Expand discovery coverage across environments
- Improve CI identification and reconciliation quality
- Establish an accurate global CMDB baseline
- Create repeatable governance and certification controls

---

## Architecture Strategy

### Discovery Coverage

- Expanded discovery into previously unmanaged infrastructure zones
- Coordinated network and platform dependencies with infrastructure teams

### Credential Architecture

- Standardized credential patterns for Linux, Windows, network, and API discovery
- Reduced authentication-related discovery failures

### MID Server Topology

- Implemented distributed MID Server design for reliability and scale
- Balanced discovery workload and improved resilience across segments

### Pattern and Classification Governance

- Tuned discovery patterns for consistent classification outcomes
- Improved mapping of discovered components into correct CI classes

### CI Identification and Reconciliation

- Strengthened identification rules to reduce duplicate CIs
- Improved reconciliation confidence across data sources

### CMDB Governance

- Established CI ownership expectations and certification cadence
- Added reporting guardrails for compliance and operational health

---

## Discovery Pipeline (ASCII)

Enterprise Infrastructure
(Servers / Cloud / Network)
|
v
ServiceNow Discovery
via MID Servers
|
v
Credential Strategy
(SSH / WMI / SNMP / API)
|
v
Pattern Execution
Identification + Classification
|
v
CI Reconciliation
Unique CI matching
|
v
CMDB Population
CIs + Relationships
|
v
Governance + Certification

---

## Execution

Key delivery activities:

- Deployed and tuned MID Servers across enterprise segments
- Enabled discovery connectivity with infrastructure stakeholders
- Resolved credential and access blockers for critical systems
- Increased discovery reliability and CI classification quality
- Operationalized governance reporting for leadership and audit use

---

## Results

The rollout established Dun & Bradstreet's first reliable automated global infrastructure inventory.

Measured outcomes:

- 98% increase in CMDB accuracy and completeness
- Improved infrastructure visibility across enterprise teams
- Stronger incident impact analysis and troubleshooting context
- Better change planning confidence through improved CI relationships
- Improved cross-team collaboration on infrastructure ownership

---

## Why It Matters

With trusted discovery and CMDB governance in place, operations teams can:

- Understand service and infrastructure dependencies faster
- Reduce risk during incident and change workflows
- Improve decision quality with accurate configuration data
- Sustain operational maturity with repeatable governance controls
