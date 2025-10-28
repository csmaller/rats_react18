const Honeypot = () => (
  <div>
    <form
      name="rats-form-2025"
      method="POST"
      netlify-honeypot="bot-field"
      data-netlify="true"
      hidden
    >
      <p>
        <label>
          Don’t fill this out if you’re human: <input name="bot-field" />
        </label>
      </p>
      <p>
        <label>
          Email: <input type="text" name="email" />
        </label>
      </p>
      <p>
        <label>
          Message: <textarea name="message"></textarea>
        </label>
      </p>
      <p>
        <button type="submit">Send</button>
      </p>
    </form>
  </div>
);

export default Honeypot;
