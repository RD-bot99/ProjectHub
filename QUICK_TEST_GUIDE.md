# ProjectHub - Quick Test Guide

## 🚀 Getting Started

The application is fully functional with mock data. No backend needed for testing!

### Step 1: Start the Development Server
```bash
npm run dev
```
The app will start at `http://localhost:3000`

### Step 2: Test Authentication

#### Login
- Go to `/login`
- Enter any email and password
- Click "Sign In"
- You'll be redirected to dashboard

**Example credentials:**
- Email: `test@example.com`
- Password: `password123`

#### Register
- Go to `/register`
- Fill in name, email, password, and confirm password
- Click "Sign Up"
- You'll be redirected to dashboard

### Step 3: Test Theme Toggle

1. Look at the top-right header area
2. Click the sun/moon icon to toggle between light and dark mode
3. Refresh the page - your theme preference is saved!

### Step 4: Test Dashboard Features

**Dashboard** (`/dashboard`)
- View statistics cards
- See recent projects with progress bars
- View activity feed
- Test quick action buttons:
  - Click "Create New Project" → Fill in name → Click Create
  - Click "Add New Task" → Fill in title → Click Create
  - Click "Invite Team Members" → Fill in email and role → Click Send Invite

### Step 5: Test Projects Page

**Projects** (`/projects`)
- See all projects in grid layout
- Each project shows:
  - Name and description
  - Status badge (Active/Archived/Completed)
  - Progress bar
  - Member count
  - End date
- Click "New Project" button to create a new project
- New projects appear immediately in the list

### Step 6: Test Tasks Page

**Tasks** (`/tasks`)
- See all tasks with details
- Test filter buttons:
  - "All" - shows all tasks
  - "Assigned" - shows your tasks
  - "Completed" - shows completed tasks
- **Check/Uncheck tasks** - Click the checkbox to toggle task completion
- Click "New Task" button to create a new task
- New tasks appear immediately in the list

### Step 7: Test Team Page

**Team** (`/team`)
- See team members in a table
- View their roles (Admin, Manager, Member)
- View status (Active, Inactive)
- Click "Invite Member" button
- Select role and enter email
- New members appear in the table

### Step 8: Test Navigation

- Click on each sidebar item to navigate
- Notice the active tab highlights
- The page title updates accordingly
- All transitions are smooth

## ✅ Test Checklist

- [ ] Login with mock credentials
- [ ] Register new account
- [ ] Toggle theme (light/dark mode)
- [ ] Create a new project
- [ ] Create a new task
- [ ] Mark tasks as complete/incomplete
- [ ] Filter tasks by status
- [ ] Invite a team member
- [ ] Navigate between all pages
- [ ] Check theme persists after refresh
- [ ] Logout from dropdown menu
- [ ] Verify redirects to login when not authenticated

## 🎯 Expected Behavior

### Data Persistence
- **During session**: All new items you create stay in the app
- **After browser refresh**: Theme preference is saved, but data resets (mock data)
- **After logout and login**: You get fresh mock data

### Responsive Design
- Works on desktop (optimal experience)
- Mobile friendly sidebar and navigation
- All buttons and inputs are fully functional

## 🔍 Component Testing

### Form Inputs
- All input fields accept text
- Email fields validate format
- Select dropdowns work smoothly
- Modal dialogs open and close properly

### Interactive Elements
- All buttons have hover effects
- Links navigate properly
- Checkboxes toggle states
- Filters update content immediately

## 📋 Sample Data

### Projects
- Website Redesign (65% complete)
- Mobile App Development (40% complete)
- API Integration (100% complete)

### Tasks
- Design database schema (In Progress, High)
- Implement authentication (Todo, High)
- Review API endpoints (In Review, Medium)
- Create UI components (Completed, Medium)

### Team Members
- You (Admin)
- Sarah Johnson (Manager)
- John Smith (Member)
- Emily Davis (Member)
- Michael Brown (Member - Inactive)

## 💡 Pro Tips

1. **Try the modals**: Click any "Create", "New", or "Invite" button to see clean modal dialogs
2. **Test filters**: Tasks page has working filter tabs
3. **Check colors**: Different statuses have distinct badge colors
4. **Observe animations**: Hover effects and transitions are smooth
5. **Theme persistence**: Set theme preference, then refresh - it stays!

## 🐛 Troubleshooting

**App won't start:**
- Make sure Node.js is installed
- Run `npm install` first
- Check if port 3000 is available

**Login page shows:**
- This means you're not authenticated
- Use any email/password to login
- Mock auth doesn't validate credentials

**Buttons not working:**
- Make sure you're clicking actual buttons (not just text)
- Look for hover effects when hovering over buttons

**Data disappeared after refresh:**
- This is expected for mock data
- Theme preference IS saved
- Create real projects/tasks again after refresh

## 📱 Browser Support

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

**Enjoy testing ProjectHub!** All features are fully functional and ready for demo. 🎉
