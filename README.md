# 📱 GearGuard – Maintenance Management System  
### AstraCore | Odoo × Adani Hack Innovate 2026

GearGuard is a **smart Maintenance Management System** built on **Odoo**, designed to streamline equipment maintenance, reduce downtime, and improve operational efficiency.  
It provides end-to-end tracking of **equipment, maintenance teams, repair requests, schedules, analytics, and audits**.

---

## 🚀 Key Objectives

- Centralize all company equipment data
- Simplify corrective & preventive maintenance workflows
- Improve technician productivity using Kanban & Calendar views
- Enable data-driven decisions with reports & analytics
- Ensure compliance with scrap tracking & audit logs

---

## 🏠 1. Dashboard (Home Page)

### Purpose
High-level operational visibility for **Managers** and **Technicians**.

### Features
**📊 KPIs**
- Total Equipment
- Open Maintenance Requests
- Overdue Requests
- Preventive vs Corrective Ratio

**📈 Visual Charts**
- Requests per Team
- Requests per Department

**⏰ Today’s Scheduled Maintenance**
- Quick overview of today’s tasks

**🔔 Alerts**
- Overdue requests
- Scrapped equipment notifications

---

## 🛠️ 2. Equipment Management

### Purpose
Acts as a **central asset registry** for all company equipment.

### Pages
- Equipment List Page
- Equipment Detail Page

### Equipment List Features
- 🔍 Search by:
  - Equipment Name
  - Serial Number
- 🗂️ Filter / Group by:
  - Department
  - Employee
  - Location
  - Status (Active / Scrapped)
- ⚡ Quick View:
  - Assigned Maintenance Team
  - Warranty Status (Active / Expired)

### Equipment Detail Features
- Equipment Information:
  - Name & Serial Number
  - Purchase Date
  - Warranty Period
  - Location & Department
  - Assigned Employee
  - Ownership & Responsibility
- Maintenance Defaults:
  - Default Maintenance Team
  - Default Technician
- Status:
  - Active / Under Maintenance / Scrapped

### Smart Features
- 🔘 **Smart Button – “Maintenance”**
  - Opens all maintenance requests linked to the equipment
  - Badge shows number of open requests
- 📝 Auto-log note when equipment is scrapped

---

## 👷 3. Maintenance Team Management

### Purpose
Define **who fixes what**.

### Pages
- Team List Page
- Team Detail Page

### Features
- Team Name (e.g., Mechanics, Electricians, IT Support)
- Team Type / Specialty
- Team Lead (Optional)
- Team Members Management
- Optional Technician Skill Tags
- 📊 Workload Indicator (Open requests count)

### Workflow Rules
- Only assigned team members can:
  - View requests
  - Assign technicians
  - Work on maintenance requests

---

## 🧾 4. Maintenance Request (Core Module)

### Purpose
Manage the **complete repair lifecycle**.

### Pages
- Request List
- Request Form
- Request Detail View

### Request Creation
- Request Type:
  - Corrective (Breakdown)
  - Preventive (Routine)
- Subject / Problem Description
- Equipment Selection
- Scheduled Date
- Priority (Low / Medium / High)

### Auto-Fill Logic
When equipment is selected:
- Equipment Category
- Default Maintenance Team
- Default Technician

### Request States
- New
- In Progress
- Repaired
- Scrap

### Execution Flow
- Assign Technician
- Start Work → *Moves to In Progress*
- Log Work Duration (Hours)
- Add Completion Notes

---

## 🗂️ 5. Maintenance Kanban Board

### Purpose
Primary **day-to-day workspace for technicians**.

### Features
- Columns:
  - New | In Progress | Repaired | Scrap
- Drag & Drop between stages
- Card Displays:
  - Equipment Name
  - Subject
  - Assigned Technician (Avatar)
  - Due Date

### Visual Indicators
- 🔴 Red highlight for overdue requests
- ⏳ Countdown for scheduled jobs

### Filters
- My Requests
- Team Requests
- Overdue Only

---

## 📆 6. Maintenance Calendar View

### Purpose
Visual planning of **preventive maintenance**.

### Features
- Displays only Preventive Requests
- Color-coded by:
  - Maintenance Team
  - Equipment Category
- Click on date → Create maintenance request
- Drag & drop to reschedule
- Views:
  - Daily
  - Weekly
  - Monthly

---

## 📊 7. Reports & Analytics (Optional / Advanced)

### Purpose
Support **decision-making and optimization**.

### Reports
- Requests per Team
- Requests per Equipment Category
- Preventive vs Corrective Ratio
- Average Repair Time
- Equipment with Highest Failure Rate

### Visuals
- Pivot Tables
- Bar Charts
- Pie Charts

---

## 🔔 8. Notifications & Automation

### Purpose
Make the system **proactive instead of reactive**.

### Features
- Automatic Notifications for:
  - New request assigned
  - Overdue requests
  - Upcoming preventive maintenance
- Email & In-app Alerts
- SLA breach warnings

---

## 🔐 9. User & Role Management

### Purpose
Enforce **access control and workflow security**.

### Roles
- Admin
- Manager
- Technician
- Employee (Request Creator)

### Permissions
- Create maintenance requests
- Assign requests
- Scrap equipment
- View analytics & reports

---

## 🗑️ 10. Scrap & Audit Log

### Purpose
Ensure **compliance, traceability, and transparency**.

### Features
- List of scrapped equipment
- Scrap reason
- Linked maintenance request
- Timestamp & technician details
- Complete equipment history timeline

---

## 🧠 Tech Stack

- **Platform:** Odoo
- **Backend:** Python (Odoo ORM)
- **Frontend:** XML, QWeb, JS
- **Database:** PostgreSQL
- **Architecture:** Modular Odoo Apps

---

## 🏆 Hackathon Context

This project is developed for **Adani Hack Innovate 2026** under the **AstraCore** theme, focusing on **industrial asset optimization, predictive maintenance readiness, and operational efficiency**.

---

## 📌 Future Enhancements

- Predictive maintenance using ML
- IoT sensor integration
- Mobile technician app
- Spare parts inventory linkage

---

## 👥 Team

Built with ❤️ by **GearGuard Team**  
For innovation, reliability, and smarter maintenance.

---

## 📄 License
This project is developed for academic & hackathon purposes.
