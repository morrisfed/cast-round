import { createAccountDelegate } from "api/accounts";
import { ActionFunctionArgs, Form, redirect } from "react-router-dom";

export async function createAccountDelegateAction({
  request,
  params,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const label = formData.get("label") as string;
  const accountId = params.accountId as string;

  const createDelegateTask = createAccountDelegate(accountId, label);

  await createDelegateTask();

  return redirect(`/accounts/${accountId}`);
}

const NewAccountDelegate: React.FC = () => {
  return (
    <Form method="POST">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Delegate label</span>
        </label>
        <input
          name="label"
          type="text"
          placeholder="Label"
          className="input-bordered input w-full max-w-xs"
        />
        <button type="submit" className="btn-outline btn-accent btn">
          Create delegate
        </button>
      </div>
    </Form>
  );
};

export default NewAccountDelegate;
