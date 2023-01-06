import React from "react";
import Skeleton from "react-loading-skeleton";

// import { Container } from './styles';

const shelfLoading: any = () => {
  return Array(4)
    .fill(0)
    .map((item) => {
      return (
        <div className="shelf-container">
          <div className="shelf-container-img">
            <Skeleton height={360} />
          </div>

          <div className="ctn-nome text-center">
            <Skeleton height={30} />
          </div>
          <div className="ctn-preco text-center">
            <Skeleton height={20} />
          </div>
        </div>
      );
    });
};

export default shelfLoading;
