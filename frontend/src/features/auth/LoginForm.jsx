import styles from "./FormStyles.module.css";

export function LoginForm() {
  return (
    <form className={styles.form_styles}>
      <label htmlFor="username" className="block">
        User name
      </label>
      <input
        type="text"
        id="username"
        name="username"
        autoComplete="on"
        required
      />

      <label htmlFor="password" className="block">
        Password
      </label>
      <input type="password" id="password" name="password" required />

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-[1rem]"
      >
        Done
      </button>
    </form>
  );
}
