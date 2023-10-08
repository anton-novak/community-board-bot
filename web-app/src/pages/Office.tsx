import { useState, useEffect } from "react";
import ItemContainer from '../components/ItemContainer';
import NavBar from '../components/NavBar';

export default function Office() {
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
      if (window.scrollY > 100 && window.scrollY + window.innerHeight < document.documentElement.scrollHeight - window.innerHeight * 0.1) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  return (
    <>
      <NavBar sortingSelectHandler={handleSortingChange}
        categoriesSelectHandler={handleCategoriesChange}
        office={true} />
      <ItemContainer sortBy={sorting} category={categories} office={true} />
      {
        showButton ?
          <button className="button is-rounded is-small is-info m-2"
            style={{
              position: "fixed",
              bottom: "1em",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >Back to top</button>
          : null
      }
    </>
  );
}