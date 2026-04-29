import { createForm } from "../index.js";

export default function NestedForm({ onSubmit }) {
  const form = createForm({
    initialValues: {
      user: {
        profile: {
          firstName: "John",
          lastName: "Doe"
        },
        settings: {
          notifications: true
        }
      }
    }
  });

  return (
    <form onsubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("user.profile.firstName")} data-testid="first-name" />
      <input {...form.register("user.profile.lastName")} data-testid="last-name" />
      <input 
        type="checkbox" 
        {...form.register("user.settings.notifications")} 
        data-testid="notifications" 
      />
      <button type="submit" data-testid="submit">Submit</button>
    </form>
  );
}
