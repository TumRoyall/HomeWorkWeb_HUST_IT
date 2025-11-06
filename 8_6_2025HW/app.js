function App() {
  const [kw, setKeyword] = React.useState("");
  const [newUser, setNewUser] = React.useState(null);

  return (
    <div>
      <h1>Quản lý Người Dùng</h1>

      <SearchForm onChangeValue={setKeyword} />
      <AddUser onAdd={setNewUser} />
      <ResultTable keyword={kw} user={newUser} onAdded={() => setNewUser(null)} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);


function SearchForm({ onChangeValue }) {
  return (
    <div>
      <input
        type="text"
        placeholder="Tìm theo name, username"
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
}


function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Load API
  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); });
  }, []);

  // Khi AddUser truyền user mới lên
  React.useEffect(() => {
    if (user) {
      setUsers(prev => [...prev, { ...user, id: prev.length + 1 }]);
      onAdded();
    }
  }, [user]);

  // Filter
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(keyword.toLowerCase()) ||
    u.username.toLowerCase().includes(keyword.toLowerCase())
  );

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const [editing, setEditing] = React.useState(null);

  const editUser = (u) => {
    setEditing({ ...u, address: { ...u.address } });
  };

  const saveUser = () => {
    setUsers(prev => prev.map(u => u.id === editing.id ? editing : u));
    setEditing(null);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>City</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.address.city}</td>
              <td>
                <button onClick={() => editUser(u)}>Sửa</button>
                <button onClick={() => removeUser(u.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div style={{ marginTop: 20 }}>
          <h3>Sửa User</h3>
          <input
            value={editing.name}
            onChange={(e) =>
              setEditing({ ...editing, name: e.target.value })
            }
          />
          <button onClick={saveUser}>Lưu</button>
        </div>
      )}
    </div>
  );
}

function AddUser({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "",
    username: "",
    email: "",
    address: { street: "", suite: "", city: "" },
    phone: "",
    website: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (["street", "suite", "city"].includes(id)) {
      setUser({ ...user, address: { ...user.address, [id]: value } });
    } else {
      setUser({ ...user, [id]: value });
    }
  };

  const handleAdd = () => {
    if (!user.name || !user.username) {
      alert("Nhập thiếu Name hoặc Username");
      return;
    }
    onAdd(user);
    setUser({
      name: "",
      username: "",
      email: "",
      address: { street: "", suite: "", city: "" },
      phone: "",
      website: "",
    });
    setAdding(false);
  };

  return (
    <div>
      <button onClick={() => setAdding(true)}>Thêm User</button>

      {adding && (
        <div style={{ marginTop: 20 }}>
          <h3>Thêm User</h3>
          <input id="name" placeholder="Name" value={user.name} onChange={handleChange} />
          <input id="username" placeholder="Username" value={user.username} onChange={handleChange} />
          <input id="email" placeholder="Email" value={user.email} onChange={handleChange} />
          <input id="city" placeholder="City" value={user.address.city} onChange={handleChange} />

          <button onClick={handleAdd}>Lưu</button>
        </div>
      )}
    </div>
  );
}
