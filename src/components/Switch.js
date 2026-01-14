import React from 'react';
import styled from 'styled-components';

const Switch = ({ checked, onChange }) => {
  return (
    <StyledWrapper>
      <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  /* The switch - the box around the slider */
  .switch {
    font-size: 17px;
    position: relative;
    display: inline-block;
    width: 3.5em;
    height: 2em;
  }

  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background: #d4acfb;
    border-radius: 50px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.4em;
    width: 1.4em;
    left: 0.3em;
    bottom: 0.3em;
    background-color: white;
    border-radius: 50px;
    box-shadow: 0 0px 20px rgba(0,0,0,0.4);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .switch input:checked + .slider {
    background: #b84fce;
  }

  .switch input:focus + .slider {
    box-shadow: 0 0 1px #b84fce;
  }

  .switch input:checked + .slider:before {
    transform: translateX(1.6em);
    width: 2em;
    height: 2em;
    bottom: 0;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .switch {
      width: 2.8em;
      height: 1.6em;
      font-size: 14px;
    }

    .slider:before {
      height: 1.2em;
      width: 1.2em;
      left: 0.2em;
      bottom: 0.2em;
    }

    .switch input:checked + .slider:before {
      transform: translateX(1.2em);
      width: 1.6em;
      height: 1.6em;
    }
  }

  @media (max-width: 480px) {
    .switch {
      width: 2.5em;
      height: 1.4em;
      font-size: 12px;
    }

    .slider:before {
      height: 1em;
      width: 1em;
      left: 0.2em;
      bottom: 0.2em;
    }

    .switch input:checked + .slider:before {
      transform: translateX(1em);
      width: 1.4em;
      height: 1.4em;
    }
  }`;

export default Switch;