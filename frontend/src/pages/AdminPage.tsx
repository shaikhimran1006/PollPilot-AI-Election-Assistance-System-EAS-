import { useEffect, useState } from "react";
import api from "../services/api";

type AdminUser = {
  id: string;
  email: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);

  useEffect(() => {
    api.get<AdminUser[]>("/admin/users").then((response) => setUsers(response.data));
  }, []);

  return (
    <section className="page">
      <h2 className="section-title">Admin Console</h2>
      <div className="card">
        <h3>Registered Users</h3>
        {users.map((user) => (
          <p key={user.id}>{user.email}</p>
        ))}
      </div>
    </section>
  );
}
