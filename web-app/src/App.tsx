import './App.css';
import { useState, useEffect } from "react";
import ItemContainer from './components/ItemContainer';
import NavBar from './components/NavBar';

function App() {
  const [sorting, setSorting] = useState<string>("Latest first");
  const [categories, setCategories] = useState<string>("All ads");
  const [showButton, setShowButton] = useState<boolean>(false);

  function handleSortingChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.value);
    setSorting(event.target.value);
  }

  function handleCategoriesChange(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(event.target.value);
    setCategories(event.target.value);
  }

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  return (
    <>
      <NavBar sortingSelectHandler={handleSortingChange}
        categoriesSelectHandler={handleCategoriesChange} />
      <ItemContainer sortBy={sorting} category={categories} />
      {
        showButton ?
        <button className="button is-rounded is-small is-info m-2"
        style={{
          position: "fixed",
          bottom: "1em",
          right: "1em"
        }}
        onClick={() => {
          window.scrollTo({top: 0, behavior: "smooth"});
        }}
        >Back to top</button>
        : null
      }
    </>
  );
}

export default App;
