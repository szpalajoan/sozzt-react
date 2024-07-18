import { useParams } from "react-router-dom";
import useFetch from "../useFetch";
import './ContractDetails.css';
import Sidebar from './SideBar';


const ContractDetails = () => {
    const { contractId } = useParams();
    const { data: contract, isPending } = useFetch('contract/' + contractId);

 
    return (
      <div className="content">
      <Sidebar />
      <main className="main-content">
                    {isPending && <div>Loading...</div>}
                    {contract && (<article>
        <div className="form-group">
          <label>Numer umowy klienta</label>
          <input type="text" value={contract.contractDetails.contractNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Nr roboczy</label>
          <input type="text" value={contract.contractDetails.workNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Nr stacji trafo i obwód</label>
          <input type="text" value={contract.location.transformerStationNumberWithCircuit} readOnly />
        </div>
        <div className="form-group">
          <label>Miejscowość</label>
          <input type="text" value={contract.location.region} readOnly />
        </div>
        <div className="form-group">
          <label>Nazwa odbiorcy</label>
          <input type="text" value={contract.contractDetails.customerContractNumber} readOnly />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="text" value={contract.contractDetails.orderDate} readOnly />
        </div>
        </article> )}
      </main>
    </div>
  );
  }

export default ContractDetails;