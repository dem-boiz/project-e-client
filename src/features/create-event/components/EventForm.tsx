import  * as z from "zod";

const schema = z.object({
  title: z.string().min(1, "Event title is required"),
  date: z.string().min(1, "Date is required"),
  isPrivate: z.boolean(),
});

type FormData = z.infer<typeof schema>;

const EventForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
    // Call your backend here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("title")} placeholder="Event Title" />
      {errors.title && <p>{errors.title.message}</p>}

      <input type="date" {...register("date")} />
      {errors.date && <p>{errors.date.message}</p>}

      <label>
        <input type="checkbox" {...register("isPrivate")} />
        Private Event
      </label>

      <button type="submit">Create Event</button>
    </form>
  );
};
