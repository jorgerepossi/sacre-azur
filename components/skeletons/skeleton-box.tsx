import React from "react";


import { ComponentPropsWithoutRef } from "react";

type SkeletonBoxProps = ComponentPropsWithoutRef<"div"> & {

};

const SkeletonBox = ({ className, style, ...props }: SkeletonBoxProps) => {
  return (
    <div
      {...props}
      className={`animate-pulse bg-gray-200 rounded-md ${className || ""}`}
      style={style}
    />
  );
};


export default SkeletonBox;
