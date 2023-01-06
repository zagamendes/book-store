import React from "react";
import Skeleton from "react-loading-skeleton";

// import { Container } from './styles';

const PdpLoading: React.FC = () => {
  return (
    <div className="container">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-sm-6">
              <Skeleton height={500}></Skeleton>
            </div>
            <div className="col-sm-6">
              <Skeleton height={70} className="mb-5"></Skeleton>
              <Skeleton count={7} style={{ marginBottom: "10px" }}></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdpLoading;
