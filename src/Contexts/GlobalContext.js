import React, { useState, useEffect } from 'react';

export const GlobalContext = React.createContext();

export const GlobalStorage = ({ children }) => {
  const [openFilter, setOpenFilter] = useState(false);
  const [data, setData] = useState([]);
  const [region, setRegion] = useState("all");
  const [search, setSearch] = useState('');
  const [darkTheme, setDarkTheme] = useState(false);
  const [loading, setLoading] = useState(true);

  //fetch all location data and render on home
  useEffect( () => {
    async function fetchAllData(){
    const theme = localStorage.getItem("theme");
    if (theme === "true") {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
    const response = await fetch("https://restcountries.com/v2/all");
    const json = await response.json();
    setData(json);
    setLoading(false);
}
fetchAllData();
  }, []);

  //create a new render applying the region filter
  useEffect( () => {
    async function fetchFilterData(){
    setLoading(true);
    if (region !== "all") {
      setOpenFilter(false);
      const response = await fetch(`https://restcountries.com/v2/region/${region}`)
      const json = await response.json();
      setData(json);
      setLoading(false);
    } else {
      setOpenFilter(false);
      const response = await fetch("https://restcountries.com/v2/all");
      const json = await response.json();
      setData(json);
      setLoading(false);
    }
}
fetchFilterData();
  }, [region]);

  //create a new render applying the user search
  useEffect( () => {
    async function fetchSearchData(){
    if (search && search.length >= 3) {
      setLoading(true);
      const response = await fetch(`https://restcountries.com/v2/name/${search}`);
      const json = await response.json();
      !json.status && setData(json);
      setLoading(false);
    } else if (search === '') {
      setLoading(true);
      const response = await fetch("https://restcountries.com/v2/all");
      const json = await response.json();
      setData(json);
      setLoading(false);
    }
}
fetchSearchData();
  }, [search]);

  //apply theme config
  useEffect(() => {
    localStorage.setItem("theme", darkTheme);
  }, [darkTheme]);

  return (
    <GlobalContext.Provider value={{ openFilter, setOpenFilter, data, setRegion, search, setSearch, darkTheme, setDarkTheme, loading, setLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};