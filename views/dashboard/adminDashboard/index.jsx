import React, { useEffect, useState } from 'react';

// The main AdminDashboard component
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    feeSummary: {
      totalAmount: 0,
      totalPaid: 0,
      totalPending: 0
    },
    studentStaffSummary: {
      totalStudents: 0,
      totalStaff: 0
    },
    attendanceSummary: {
      present: 0,
      absent: 0
    },
    latestNotifications: [],
    // New data to match the new design
    feeCollectionReport: {
      today: 105,
      thisWeek: 825,
      thisMonth: 22067,
      todayPercent: '74%'
    },
    newAdmissionReport: {
      today: 107,
      thisWeek: 268,
      thisMonth: 847,
      todayPercent: '74%'
    },
    upcomingClasses: [
      {
        id: 1,
        student: 'Cara Stevens',
        subject: 'Mathematics',
        time: '12 June 20 | 09:00 - 10:00',
        imageUrl: 'https://placehold.co/100x100/A0AEC0/ffffff?text=CS'
      },
      {
        id: 2,
        student: 'Ahi Satau',
        subject: 'Computer Studies',
        time: '12 June 20 | 11:00 - 12:00',
        imageUrl: 'https://placehold.co/100x100/A0AEC0/ffffff?text=AS'
      }
    ]
  });

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [fromYear, setFromYear] = useState('');

  // Simulating API calls with dummy data and a delay
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setData({
        feeSummary: {
          totalAmount: 25698,
          totalPaid: 1250000,
          totalPending: 250000
        },
        studentStaffSummary: {
          totalStudents: 2347,
          totalStaff: 258
        },
        attendanceSummary: {
          present: 1450,
          absent: 50
        },
        latestNotifications: [
          { id: 1, title: 'New parent-teacher meeting schedule', date: '2025-09-03' },
          { id: 2, title: 'School bus route changes', date: '2025-09-02' },
          { id: 3, title: 'Holiday on September 10th', date: '2025-09-01' }
        ],
        feeDetails: [
            { id: 1, student: 'John Doe', feeType: 'Tuition Fee', amount: 5000, status: 'Paid', date: '2025-09-01' },
            { id: 2, student: 'Jane Smith', feeType: 'Bus Fee', amount: 1500, status: 'Pending', date: '2025-09-05' },
            { id: 3, student: 'Peter Jones', feeType: 'Tuition Fee', amount: 5000, status: 'Paid', date: '2025-08-28' },
            { id: 4, student: 'Mary Lee', feeType: 'Library Fee', amount: 200, status: 'Pending', date: '2025-09-02' },
        ],
        feeCollectionReport: {
          today: 105,
          thisWeek: 825,
          thisMonth: 22067,
          todayPercent: '74%'
        },
        newAdmissionReport: {
          today: 107,
          thisWeek: 268,
          thisMonth: 847,
          todayPercent: '74%'
        },
        upcomingClasses: [
          {
            id: 1,
            student: 'Cara Stevens',
            subject: 'Mathematics',
            time: '12 June 20 | 09:00 - 10:00',
            imageUrl: 'https://placehold.co/100x100/A0AEC0/ffffff?text=CS'
          },
          {
            id: 2,
            student: 'Ahi Satau',
            subject: 'Computer Studies',
            time: '12 June 20 | 11:00 - 12:00',
            imageUrl: 'https://placehold.co/100x100/A0AEC0/ffffff?text=AS'
          }
        ]
      });
      setIsLoading(false);
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timer);
  }, [selectedSchool, selectedClass, selectedDivision, fromYear]);

  const schools = ['School A', 'School B'];
  const classes = ['Class 8', 'Class 9'];
  const divisions = ['Division A', 'Division B'];
  const years = ['2023', '2024', '2025'];
  
  const CardItem = ({ title, value, icon, color = 'blue', percentage = null, valueColor = 'text-gray-900', isLarge=false }) => {
    let bgColor, iconColor, textColor;
    switch(color) {
      case 'blue':
        bgColor = 'bg-blue-600';
        iconColor = 'text-white';
        textColor = 'text-blue-50';
        break;
      case 'green':
        bgColor = 'bg-teal-500';
        iconColor = 'text-white';
        textColor = 'text-teal-50';
        break;
      case 'yellow':
        bgColor = 'bg-orange-400';
        iconColor = 'text-white';
        textColor = 'text-orange-50';
        break;
      case 'red':
        bgColor = 'bg-rose-500';
        iconColor = 'text-white';
        textColor = 'text-rose-50';
        break;
    }
    
    return (
      <div className={`${bgColor} p-6 rounded-xl shadow-lg`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-xl font-semibold ${textColor}`}>{title}</h3>
            <p className={`text-4xl font-bold mt-2 ${textColor}`}>{value}</p>
          </div>
          <div className={`text-5xl ${iconColor}`}>
            {icon}
          </div>
        </div>
        {percentage && (
          <p className={`text-sm mt-2 ${textColor}`}>{percentage} Higher Than Last Month</p>
        )}
      </div>
    );
  };

  const ReportSummary = ({ title, today, thisWeek, thisMonth, todayPercent }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex justify-between text-center gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-500">Today</h4>
          <p className="text-lg font-bold">{today}</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
            <div className="bg-green-500 h-1 rounded-full" style={{ width: todayPercent }}></div>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-500">This Week</h4>
          <p className="text-lg font-bold">{thisWeek}</p>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-500">This Month</h4>
          <p className="text-lg font-bold">{thisMonth}</p>
        </div>
      </div>
    </div>
  );

  const StatusChip = ({ status }) => {
    const color = status === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {status}
      </span>
    );
  };

  const IconGroup = ({ children }) => (
    <div className="flex justify-center items-center h-12 w-12 bg-gray-100 rounded-full text-blue-500">
      {children}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen font-sans p-6 md:p-10">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
      </style>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Dashboard Title */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 hidden md:block">Dashboard 2</p>
          </div>
          
          {/* Top Row Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardItem
              title="Total Students"
              value={data.studentStaffSummary.totalStudents}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-graduation-cap"><path d="M21.42 10.992a1 1 0 0 0-.58-.87L11.43 5.432a1 1 0 0 0-1.85 0L2.16 9.872a1 1 0 0 0-.58.87v4.16c-.03.58.25 1.15.77 1.48l8.47 4.78c.55.32 1.25.32 1.8 0l8.47-4.78a1 1 0 0 0 .77-1.48v-4.16"/><path d="m11.5 17.5 9-5"/><path d="M22 10v6"/><path d="M2.5 10v6"/><path d="M12 2v20"/></svg>}
              color="blue"
              percentage="10%"
            />
            <CardItem
              title="Total Teachers"
              value={data.studentStaffSummary.totalStaff}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-user-check"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>}
              color="green"
              percentage="21%"
            />
            <CardItem
              title="Awards"
              value={27} // Dummy value for Awards
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14h4"/><path d="M12 10v6"/><path d="M12 2a5 5 0 0 0-5 5v3.17a2 2 0 0 1-.72 1.54L3 17"/><path d="M12 2a5 5 0 0 1 5 5v3.17a2 2 0 0 1 .72 1.54L21 17"/></svg>}
              color="yellow"
              percentage="37%"
            />
            <CardItem
              title="Total Earning"
              value={`$${data.feeSummary.totalAmount}`}
              icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-dollar-sign"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>}
              color="red"
              percentage="10%"
            />
          </div>

          {/* New Admission and Fee Collection Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportSummary
              title="Fees Collection Report"
              today={data.feeCollectionReport.today}
              thisWeek={data.feeCollectionReport.thisWeek}
              thisMonth={data.feeCollectionReport.thisMonth}
              todayPercent={data.feeCollectionReport.todayPercent}
            />
            <ReportSummary
              title="New Admission Report"
              today={data.newAdmissionReport.today}
              thisWeek={data.newAdmissionReport.thisWeek}
              thisMonth={data.newAdmissionReport.thisMonth}
              todayPercent={data.newAdmissionReport.todayPercent}
            />
          </div>

          {/* Main content grid: Fee Details and Upcoming Classes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fee Details Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Fee Details</h2>
                <a href="#" className="text-blue-600 font-medium">View All</a>
              </div>
              
              {/* Filter Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                  >
                    <option value="">All Schools</option>
                    {schools.map(school => <option key={school} value={school}>{school}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-down text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-down text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                    value={selectedDivision}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                  >
                    <option value="">All Divisions</option>
                    {divisions.map(div => <option key={div} value={div}>{div}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-down text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>

                <div className="relative">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 appearance-none"
                    value={fromYear}
                    onChange={(e) => setFromYear(e.target.value)}
                  >
                    <option value="">All Years</option>
                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-chevron-down text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              
              {/* Fee Table */}
              <div className="overflow-x-auto no-scrollbar">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Student ID</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Student Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Fee Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.feeDetails.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">4KJGY...</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{row.student}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">{row.feeType}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">₹{row.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusChip status={row.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-eye text-gray-500"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-pen text-gray-500"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Classes Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Upcoming Classes</h2>
                <a href="#" className="text-blue-600 font-medium">View All</a>
              </div>
              <ul className="divide-y divide-gray-200">
                {data.upcomingClasses.map((item) => (
                  <li key={item.id} className="py-4 flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.student} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-800">{item.student}</p>
                      <p className="text-sm text-gray-500">{item.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
