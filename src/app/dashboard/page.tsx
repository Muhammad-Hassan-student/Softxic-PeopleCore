"use client";

import { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  UserMinus,
  DollarSign,
  Clock,
  Calendar,
  TrendingUp,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/utils/supabase";
import toast from "react-hot-toast";
import { CardSkeleton, TableSkeleton } from "@/components/ui/loaders/loading";

const stats = [
  {
    name: "Total Employees",
    value: "0",
    icon: Users,
    change: "+0",
    changeType: "increase",
  },
  {
    name: "Active Employees",
    value: "0",
    icon: Users,
    change: "+0",
    changeType: "increase",
  },
  {
    name: "New This Month",
    value: "0",
    icon: UserPlus,
    change: "+0",
    changeType: "increase",
  },
  {
    name: "Left This Month",
    value: "0",
    icon: UserMinus,
    change: "+0",
    changeType: "decrease",
  },
  {
    name: "Salary Paid",
    value: "PKR 0",
    icon: DollarSign,
    change: "+0%",
    changeType: "increase",
  },
  {
    name: "Pending Salary",
    value: "PKR 0",
    icon: DollarSign,
    change: "+0%",
    changeType: "increase",
  },
  {
    name: "Avg. Attendance",
    value: "0%",
    icon: Clock,
    change: "+0%",
    changeType: "increase",
  },
  {
    name: "Leave Requests",
    value: "0",
    icon: Calendar,
    change: "+0",
    changeType: "increase",
  },
];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [employeesRes, salariesRes, attendanceRes, leavesRes] =
        await Promise.all([
          supabase.from("employees").select("*"),
          supabase.from("salaries").select("*"),
          supabase.from("attendance").select("*"),
          supabase.from("leaves").select("*"),
        ]);

      // Calculate stats
      const employees = employeesRes.data || [];
      const salaries = salariesRes.data || [];
      const attendance = attendanceRes.data || [];
      const leaves = leavesRes.data || [];

      const activeEmployees = employees.filter((e) => e.status === "active");
      const newThisMonth = employees.filter((e) => {
        const joining = new Date(e.joining_date);
        const now = new Date();
        return (
          joining.getMonth() === now.getMonth() &&
          joining.getFullYear() === now.getFullYear()
        );
      });
      const leftThisMonth = employees.filter((e) => {
        const leftDate = e.resignation_date || e.termination_date;
        if (!leftDate) return false;
        const left = new Date(leftDate);
        const now = new Date();
        return (
          left.getMonth() === now.getMonth() &&
          left.getFullYear() === now.getFullYear()
        );
      });
      const salaryPaid = salaries
        .filter((s) => s.payment_status === "paid")
        .reduce((sum, s) => sum + parseFloat(s.net_salary), 0);
      const salaryPending = salaries
        .filter((s) => s.payment_status === "pending")
        .reduce((sum, s) => sum + parseFloat(s.net_salary), 0);

      setData({
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        newThisMonth: newThisMonth.length,
        leftThisMonth: leftThisMonth.length,
        salaryPaid,
        salaryPending,
        avgAttendance: attendance.length > 0 ? "95%" : "0%",
        leaveRequests: leaves.filter((l) => l.status === "pending").length,
        recentEmployees: employees.slice(0, 5),
        recentActivities: [],
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      const { data: employees, error } = await supabase
        .from("employees")
        .select("*");

      if (error) throw error;

      // Convert to CSV
      const headers = [
        "ID",
        "Name",
        "Email",
        "Department",
        "Designation",
        "Salary",
        "Status",
      ];
      const csvData =
        employees?.map((emp) => [
          emp.employee_code,
          emp.full_name,
          emp.email,
          emp.department,
          emp.designation,
          emp.basic_salary,
          emp.status,
        ]) || [];

      const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");

      // Download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employees_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Export failed");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="mt-8">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const value = data
            ? [
                data.totalEmployees,
                data.activeEmployees,
                data.newThisMonth,
                data.leftThisMonth,
                `PKR ${data.salaryPaid.toLocaleString()}`,
                `PKR ${data.salaryPending.toLocaleString()}`,
                data.avgAttendance,
                data.leaveRequests,
              ][index]
            : stat.value;

          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === "increase"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Employees
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {data?.recentEmployees?.map((employee: any) => (
                  <li key={employee.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                          {employee.full_name.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {employee.full_name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {employee.designation} • {employee.department}
                        </p>
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            employee.status === "active"
                              ? "bg-green-100 text-green-800"
                              : employee.status === "probation"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </li>
                )) || (
                  <li className="py-4 text-center text-gray-500">
                    No employees found
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <UserPlus className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Add Employee
                </span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <DollarSign className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Generate Salary
                </span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <Calendar className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  Approve Leave
                </span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <TrendingUp className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900">
                  View Reports
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
