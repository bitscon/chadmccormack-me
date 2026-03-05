# Flagship Case Study
## Global CMDB & Discovery Rollout
### Dun & Bradstreet

---

## The Problem

When I joined Dun & Bradstreet, the organization lacked a reliable global infrastructure inventory.

Infrastructure data was fragmented across teams and tools, making it difficult to answer critical operational questions:

- What infrastructure actually exists across the enterprise?
- What services depend on those systems?
- What infrastructure is impacted during incidents or changes?

Without a trustworthy CMDB, service visibility and operational decision-making were limited.

---

## The Mission

Design and implement an enterprise-scale ServiceNow CMDB architecture capable of delivering:

• Automated infrastructure discovery  
• Accurate configuration item population  
• Reliable CI relationships  
• Governance processes to maintain long-term data quality  

The goal was to create the company’s **first reliable global infrastructure inventory**.

---

## Architecture Strategy

Rather than treating discovery as a tool configuration exercise, the project focused on building a **repeatable discovery architecture**.

Key components included:

• ServiceNow Discovery architecture  
• Distributed MID Server infrastructure  
• Enterprise credential strategy  
• Discovery pattern governance  
• CI identification and reconciliation rules  
• Data certification and governance processes  

This ensured the CMDB could remain accurate as infrastructure evolved.

---

## Discovery Architecture


Enterprise Infrastructure
(Servers, Cloud, Network)

    │
    ▼

ServiceNow MID Servers
Distributed discovery execution

    │
    ▼

Credential Strategy
SSH / WMI / SNMP / APIs

    │
    ▼

Discovery Patterns
Identification and classification

    │
    ▼

CI Identification & Reconciliation

    │
    ▼

CMDB Population
CIs + Relationships

    │
    ▼

Data Governance
Certification and ownership


---

## Execution

The rollout required extensive collaboration across infrastructure teams to remove discovery blockers and improve data quality.

Key execution activities included:

• deploying and tuning MID Server infrastructure  
• coordinating credential strategies with infrastructure teams  
• resolving discovery coverage gaps  
• improving discovery reliability and CI identification accuracy  
• building reporting for CMDB governance and audit readiness  

---

## Outcome

The initiative resulted in Dun & Bradstreet’s first automated global infrastructure inventory.

Key outcomes included:

• significantly improved CMDB accuracy and completeness  
• improved service visibility across enterprise infrastructure  
• stronger incident impact analysis capabilities  
• improved change management decision-making  
• increased cross-team collaboration around infrastructure ownership

The CMDB became a **trusted operational platform rather than a static database**.

---

## Why This Matters

Enterprise operations depend on reliable infrastructure visibility.

By establishing automated discovery and governance processes, the organization gained the ability to:

• understand infrastructure dependencies  
• respond to incidents more effectively  
• make informed change decisions  
• improve overall operational maturity