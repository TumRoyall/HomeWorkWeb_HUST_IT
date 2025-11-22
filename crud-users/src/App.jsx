import { useEffect, useState } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const PAGE_SIZE = 5;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // form state (dùng chung cho create + update)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // reset form
  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "" });
    setIsEditing(false);
    setEditingId(null);
  };

  // CREATE
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Name và Email là bắt buộc");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const created = await res.json();

      // JSONPlaceholder không lưu thật, nhưng vẫn trả id ảo → tự update UI
      setUsers((prev) => [...prev, { ...created }]);
      resetForm();
      setCurrentPage(1); // quay về trang đầu để thấy user mới
    } catch (err) {
      setError(err.message || "Create error");
    }
  };

  // set form để EDIT
  const startEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    setIsEditing(true);
    setEditingId(user.id);
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Name và Email là bắt buộc");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update user");

      const updated = await res.json();

      // update UI thủ công
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? { ...u, ...updated } : u))
      );

      resetForm();
    } catch (err) {
      setError(err.message || "Update error");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      // xóa trên UI
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message || "Delete error");
    }
  };

  // SEARCH + PAGINATION
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageUsers = filteredUsers.slice(startIdx, startIdx + PAGE_SIZE);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const onSubmit = isEditing ? handleUpdate : handleCreate;

  return (
    <div className="app-container">
      <h1>Nguyen Kim Ngoc _ BT _ Web</h1>

      {/* error */}
      {error && <div className="alert error">{error}</div>}

      {/* form */}
      <form className="user-form" onSubmit={onSubmit}>
        <h2>{isEditing ? "Edit User" : "Create User"}</h2>

        <div className="form-row">
          <label>
            Name*
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="User name"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Email*
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
            />
          </label>
        </div>

        <div className="form-row">
          <label>
            Phone
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0123-456-789"
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">
            {isEditing ? "Update" : "Create"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* search */}
      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* table */}
      <div className="table-wrapper">
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              ) : (
                pageUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <button
                        className="btn small"
                        onClick={() => startEdit(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      <div className="pagination">
        <button
          className="btn small"
          disabled={safePage === 1}
          onClick={() => goToPage(safePage - 1)}
        >
          &laquo; Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`btn small ${p === safePage ? "active" : ""}`}
            onClick={() => goToPage(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="btn small"
          disabled={safePage === totalPages}
          onClick={() => goToPage(safePage + 1)}
        >
          Next &raquo;
        </button>
      </div>
    </div>
  );
}

export default App;
