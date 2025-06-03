import { Link } from 'react-router-dom';
import { ShoppingBag, ListOrdered, Users, LayoutDashboard } from 'lucide-react';

const AdminDashboardCard = ({ title, to, icon: Icon, description }: { title: string, to: string, icon: React.ElementType, description: string }) => (
  <Link
    to={to}
    className="group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:border-primary-300"
  >
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white">
      <Icon className="h-6 w-6" />
    </div>
    <h2 className="mb-2 text-xl font-semibold text-neutral-800">{title}</h2>
    <p className="text-sm text-neutral-600">{description}</p>
    <div className="mt-4 text-sm font-medium text-primary-600 group-hover:underline">
      Go to {title} &rarr;
    </div>
  </Link>
);

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center space-x-3">
        <LayoutDashboard className="h-8 w-8 text-neutral-700" />
        <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
      </div>

      <p className="mb-10 text-lg text-neutral-600">
        Welcome to the admin dashboard. From here you can manage products, orders, users, and other site settings.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminDashboardCard
          title="Manage Products"
          to="/admin/products"
          icon={ShoppingBag}
          description="View, add, edit, and delete products in your store."
        />
        <AdminDashboardCard
          title="Manage Orders"
          to="/admin/orders"
          icon={ListOrdered}
          description="Track customer orders, update statuses, and manage returns."
        />
        <AdminDashboardCard
          title="Manage Users"
          to="/admin/users"
          icon={Users}
          description="View user accounts, manage roles, and handle customer data."
        />
        {/* Add more cards here for other admin sections as needed */}
      </div>
    </div>
  );
}
