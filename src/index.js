import React from "react";
import { render } from "react-dom";
import ToastrContainer from 'react-toastr-basic'

import NowPlaying from "./modules/NowPlaying/NowPlaying";

  render(
    <div>
      <ToastrContainer />
      <NowPlaying />
    </div>,
    document.getElementById("root")
);
