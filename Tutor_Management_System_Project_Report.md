# TUTOR MANAGEMENT SYSTEM
—
AI PLATFORM

**23CS54C – MODERN WEB TECHNOLOGIES**

Submitted by  
**BRIGHTON M**  
**24104091**

In partial fulfillment for the award of the degree of  
**BACHELOR OF ENGINEERING**  
in  
**COMPUTER SCIENCE AND ENGINEERING**

**NATIONAL ENGINEERING COLLEGE**  
(An Autonomous Institution affiliated to Anna University, Chennai)  
K.R.NAGAR, KOVILPATTI - 628503  
**OCTOBER - 2026**

---

## BONAFIDE CERTIFICATE

This is to certify that this project report, **“Tutor Management System — AI Platform”**, is the bonafide work of **BRIGHTON M (24104091)** who carried out the project work under my supervision.

**Course Instructor / Guide**

Submitted to the 23CS54C – MODERN WEB TECHNOLOGIES Viva-Voce examination held at National Engineering College, K.R.Nagar, Kovilpatti on ______________

**Internal Examiner** | **Co Examiner**

---

## TABLE OF CONTENT
1. INTRODUCTION (Page 1)
2. OBJECTIVES (Page 2)
3. DESCRIPTION (Page 3)
4. CLASS DIAGRAM (Page 6)
5. TABLE STRUCTURES (Page 9)
6. ER DIAGRAM (Page 15)
7. TECH STACK (Page 17)
8. MODULES (Page 19)
9. CONCLUSION (Page 57)

---

## CHAPTER 1: INTRODUCTION

Every semester, universities and educational institutions handle vast amounts of academic data, including student enrollment, attendance tracking, grades, and scholarship distributions. However, managing this information across different departments, students, tutors, and parents often involves fragmented tools and manual processes. This leads to miscommunication, delayed grade verifications, and inefficient administrative workflows.

**Tutor Management System — AI Platform** is a full-stack, comprehensive educational marketplace platform designed to bridge this gap between university administration, tutors, students, and parents. It serves four distinct types of users – Admin, Tutor, Student, and Parent – each equipped with a dedicated interactive dashboard and workflow tailored to their specific roles.

The platform streamlines the academic lifecycle. It acts as a centralized hub where students can track their CGPA, attendance, apply for leaves, and submit grades. Tutors are empowered to monitor their assigned batches, verify grades, track attendance, and provide targeted mentorship. At the same time, the administration has a macro-level view of total enrollments, scholarships, and departmental metrics. Parents are kept in the loop with real-time updates regarding their child's academic standing.

The application is organized into four functional domains: **Student features** such as performance tracking (CGPA/SGPA), grade submissions, leave applications, and scholarship status monitoring; **Tutor features** including batch management, grade verification, and attendance tracking; **Admin features** such as document verification, user management, impact metrics (total students, scholarships awarded), and administrative audits; and **Parent features** for monitoring attendance and receiving notifications.

The system is built with **React 18** and **Vite** on the frontend, utilizing **Tailwind CSS**, **Recharts**, and **Radix UI components** for a dynamic user experience. The backend is powered by **Node.js** and **Express**, with **MongoDB (Mongoose)** as the database for robust data management. This report documents the design, development, and implementation of the Tutor Management System, providing a complete technical overview of its architecture, features, and functionality.

---

## CHAPTER 2: OBJECTIVES

- **To Centralize Academic Data:** Give the administration a unified platform to manage students, tutors, subjects, and scholarships seamlessly.
- **To Empower Student Tracking:** Offer students interactive tools to track their CGPA, SGPA, attendance, and upcoming academic deadlines.
- **To Simplify Tutor Workflows:** Automatically link tutors to their respective students, enabling efficient grade verification and attendance monitoring.
- **To Streamline Leave and Scholarship Management:** Provide a digital workflow for students to apply for leaves and scholarships, routing them directly to tutors and admins for approval.
- **To Deliver Real-Time Analytics:** Use interactive charts (via Recharts) to broadcast performance trends, attendance history, and scholarship distribution.
- **To Ensure Transparency for Parents:** Provide a dedicated portal for parents to monitor their child’s progress and receive important notifications.
- **To Enforce Authentication and Role-Based Access:** Secure the four roles (Admin, Tutor, Student, Parent) with structured schemas, custom login handling, and route protection.
- **To Measure Institutional Impact:** Report critical metrics such as total students enrolled, active tutors, scholarships distributed, and departmental performance through an Admin Analytics dashboard.
- **To Provide a Responsive User Interface:** Deliver an aesthetic, fast, and accessible web interface using Vite, React, and modern UI libraries, ensuring a native-like experience on desktops and tablets.

---

## CHAPTER 3: DESCRIPTION

The Tutor Management System is a full-stack educational web application that connects university administrators, tutors, students, and parents. The system consists of four major functional areas:

### Student (Learner)
Students log in to a personalized dashboard where they can track their academic performance, apply for leaves, and view scholarship eligibilities.

- **Authentication & Profile:** Secure login with role routing. Access to department, semester, and roll number details.
- **Performance Tracking:** Interactive line charts displaying semester-wise CGPA and SGPA trends.
- **Attendance Monitoring:** Visual indicators of attendance percentages and warnings for low attendance.
- **Leave & Grade Submission:** Interfaces to submit grades for verification and request leaves with urgent deadline alerts.

### Tutor (Educator / Mentor)
Tutors manage their assigned batches of students, verify academic records, and monitor overall class attendance.

- **Batch Management:** View a table of assigned students with their respective Roll Nos, CGPAs, and Status (Active/Warning).
- **Grade Verification:** Review and approve or reject grades submitted by students.
- **Attendance Insights:** Area charts visualizing monthly attendance trends (Present vs. Absent) for their assigned classes.
- **Leave Approvals:** Portal to approve or reject student leave requests.

### Admin (Platform Overseer)
The administrator manages the entire platform data, monitors institutional metrics, and reviews user roles.

- **Platform Management:** Central controls over total students, tutors, and subjects.
- **Impact Metrics & Reporting:** Visual representation (Bar/Pie Charts) of semester-wise enrollment and scholarship distribution.
- **User Activity:** Track recent platform activities (e.g., "New student enrolled," "Merit Scholarship awarded").
- **Quick Actions:** Shortcuts to add new students, manage subjects, and update system settings.

### Parent (Guardian)
Parents have a simplified view to ensure their child is meeting academic standards.

- **Monitoring:** Track their child's daily attendance and upcoming deadlines.
- **Notifications:** Receive alerts for low attendance or missing grades.

---

## CHAPTER 4: CLASS DIAGRAM
*(Insert your project's UML Class Diagram here)*

---

## CHAPTER 5: TABLE STRUCTURES

The system utilizes MongoDB (NoSQL) with Mongoose ORM. Below are the core schema structures representing the collections:

### 1. User Collection (Authentication Base)
- `_id`: ObjectId
- `name`: String (Required)
- `email`: String (Required, Unique)
- `role`: String (Enum: ['admin', 'student', 'tutor', 'parent'])
- `password`: String (Required)
- `isVerified`: Boolean (Default: false)
- `timestamps`: true

### 2. Student Collection
- `_id`: ObjectId
- `userId`: ObjectId (Ref: 'User')
- `name`: String
- `email`: String (Unique)
- `phone`: String
- `dept`: String
- `sem`: Number
- `cgpa`: Number (Default: 0)
- `status`: String (Enum: ['active', 'warning', 'inactive'])
- `roll`: String (Unique, Required)
- `parentId`: ObjectId (Ref: 'Parent')

### 3. Tutor Collection
- `_id`: ObjectId
- `userId`: ObjectId (Ref: 'User')
- `name`: String
- `email`: String (Unique)
- `phone`: String
- `dept`: String
- `subjects`: Array of Strings
- `students`: Array of ObjectIds (Ref: 'Student')

### 4. Parent Collection
- `_id`: ObjectId
- `userId`: ObjectId (Ref: 'User')
- `name`: String
- `email`: String (Unique)
- `phone`: String
- `students`: Array of ObjectIds (Ref: 'Student')

---

## CHAPTER 6: ER DIAGRAM
*(Insert your project's Entity Relationship Diagram here)*

---

## CHAPTER 7: TECH STACK

**Frontend:**
- React 18
- Vite (Build Tool)
- TypeScript (TSX)
- Tailwind CSS (Styling)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Radix UI & Shadcn UI principles (Accessible components)

**Backend:**
- Node.js
- Express.js (REST API)
- MongoDB (Database)
- Mongoose (Object Data Modeling)
- CORS & Dotenv (Middleware/Config)

---

## CHAPTER 8: MODULES

### 1. Authentication & Role Routing Module
- **Purpose:** Ensures secure access and routes users to their specific dashboards based on their role (`admin`, `tutor`, `student`, `parent`).
- **Features:** Centralized login (`/api/users/login`) that fetches contextual data (like `dept`, `roll`, `studentsCount`) alongside the base user identity.

### 2. Analytics & Dashboard Module
- **Purpose:** Provides at-a-glance insights using React and Recharts.
- **Features:**
  - Admin: Semester-wise enrollment bar charts and scholarship pie charts.
  - Tutor: Monthly attendance area charts and CGPA distribution.
  - Student: Semester-over-semester CGPA line charts.

### 3. User Management Module
- **Purpose:** Allows admins to control the platform's roster.
- **Features:** API endpoints to add users (`/api/users/add`), fetch all users, and update profile information across both the base `User` collection and the role-specific collections (e.g., updating a `Student` when the `User` is updated).

### 4. Mentorship & Verification Module
- **Purpose:** Connects Tutors directly with their assigned Students.
- **Features:** Tutors can fetch their assigned students via `GET /api/users/tutor/:userId/students`, enabling them to verify grades, track attendance statuses (`warning`, `active`), and approve leaves.

---

## CHAPTER 9: CONCLUSION

The Tutor Management System provides a complete digital solution for modernizing educational administration. By integrating role-specific dashboards, interactive data visualization, and streamlined verification workflows into a single platform, it eliminates the inefficiencies of traditional manual management.

The application was developed using React 18 and Vite for a highly responsive frontend, Node.js and Express for a robust backend API, and MongoDB with Mongoose for flexible, schema-driven data management. Its client-server architecture supports structured and secure communication between the user interface and the database. 

The completed project demonstrates end-to-end verified workflows for all four roles — Admin, Tutor, Student, and Parent. Its responsive interface, comprehensive analytics, and seamless data synchronization make it an accessible and powerful tool for university management. Overall, the Tutor Management System successfully meets its objective of providing a secure, real-time, and organized platform that connects educators, learners, and administrators.

### Future Enhancements
- **AI-Powered Performance Prediction:** Implement machine learning to forecast student performance and identify at-risk students before they fall behind.
- **Automated Report Generation:** Allow Admins and Tutors to generate and export scheduled PDF/Excel reports for attendance and grades.
- **Integrated Chat / Messaging:** Build a real-time messaging system (via Socket.io) between students and their assigned tutors for instant academic support.
- **Parent-Teacher Portal:** A dedicated module for scheduling virtual or physical parent-tutor meetings directly through the app.
