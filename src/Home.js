import React from 'react';
import ContractList from "./contract/ContractList";
import useFetch from "./useFetch";

const Home = () => {
  const { data: contracts, isPending, error } = useFetch('contract/');

  return (
    <div className="home">
      {isPending && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {contracts && <ContractList contracts={contracts} />}
    </div>
  );
}

export default Home;
