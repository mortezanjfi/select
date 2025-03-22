import "./App.css";
import Select from "./components/ui/select/select";

const options = [
  { key: "Education 🎓", value: "education" },
  { key: "Yeeeah, science! 🚀", value: "science" },
  { key: "Art 🎨", value: "art" },
  { key: "Sport ⚽", value: "sport" },
  { key: "Games 🎮", value: "games" },
  { key: "Health 🏥", value: "health" },
];

function App() {
  return (
    <div>
      <h1>Lobox</h1>
      <Select
        options={options}
        onChange={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
}

export default App;
