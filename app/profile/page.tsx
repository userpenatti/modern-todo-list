import Profile from "../components/Profile"

interface Item {
  id: string;
  name: string;
}

export default function ProfilePage({ title = "Título Padrão", todas = [] }: { title?: string; todas?: Item[] }) {
  return (
    <div>
      <h1>{title}</h1>
      <ul>
        {todas.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}


