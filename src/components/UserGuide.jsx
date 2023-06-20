import React from "react";
import { Button, Image, OverlayTrigger, Tooltip } from "react-bootstrap";

const UserGuide = () => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip id="button-tooltip-2">Click to learn how to Use</Tooltip>
      }
    >
      {({ ref, ...triggerHandler }) => (
        // <Button
        //   variant="light"
        //   {...triggerHandler}
        //   className="d-inline-flex align-items-center"
        // >
        <Image
          {...triggerHandler}
          className="userguide-icon"
          ref={ref}
          roundedCircle
          width="60"
          height="60"
          src={process.env.PUBLIC_URL + "/UserGuidepic.png"}
        />
      )}
    </OverlayTrigger>
  );
};

export default UserGuide;
