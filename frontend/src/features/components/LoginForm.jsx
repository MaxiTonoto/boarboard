import { Bounce, toast } from "react-toastify";
import React, { useState, useEffect } from "react";


export function LoginForm({ }) {

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-[50%] left-[50%] -translate-1/2 w-[50%] h-[75%] shadow-2xl text-white p-[1rem] rounded-md border-2 border-[rgba(52,52,52,0.75)] bg-[linear-gradient(to_top,rgba(12,12,12,0.75)_33%,rgba(24,24,24,0.5)_50%,rgba(12,12,12,0.95)_66%)] z-1"
    >
      <h2
        className="text-center text-5xl py-[0.5rem] text-white w-[100%] mb-[4rem]"
      >
        Login
      </h2>

      <div className="w-3/4 m-auto">
        <label
          className="text-2xl block text-left w-[100%] pb-2"
          htmlFor=""
        >
          Username *
        </label>

        <input
          className="border-2 border-[rgba(212,212,212,0.5)] rounded-md w-full text-2xl text-center py-1"
          placeholder=""
          maxLength={150}
          minLength={1}
          type="text"
          required
          id=""
          name=""
        />
      </div>

      <input
        className="rounded text-black text-2xl bg-[rgba(102,212,102,0.75)] px-6 py-3 hover:bg-[rgba(102,212,102,0.95)] transition absolute bottom-[5%] right-[5%] border-3 border-[rgba(47,185,93,0.75)] rounded-xl"
        type="submit"
        value="Create"
      />
    </form>
  );
}
