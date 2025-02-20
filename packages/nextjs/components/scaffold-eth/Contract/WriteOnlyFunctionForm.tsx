import { FunctionFragment } from "ethers/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { useContractWrite } from "wagmi";
import { tryToDisplay } from "./utilsDisplay";
import InputUI from "./InputUI";
import { getFunctionInputKey, getParsedEthersError } from "./utilsContract";
import { TxValueInput } from "./utilsComponents";
import { useTransactor } from "~~/hooks/scaffold-eth";
import { toast } from "~~/utils/scaffold-eth";

// TODO set sensible initial state values to avoid error on first render, also put it in utilsContract
const getInitialFormState = (functionFragment: FunctionFragment) => {
  const initialForm: Record<string, any> = {};
  functionFragment.inputs.forEach((input, inputIndex) => {
    const key = getFunctionInputKey(functionFragment, input, inputIndex);
    initialForm[key] = "";
  });
  return initialForm;
};

type TWriteOnlyFunctionFormProps = {
  functionFragment: FunctionFragment;
  contractAddress: string;
  setRefreshDisplayVariables: Dispatch<SetStateAction<boolean>>;
};

export const WriteOnlyFunctionForm = ({
  functionFragment,
  contractAddress,
  setRefreshDisplayVariables,
}: TWriteOnlyFunctionFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(functionFragment));
  const [txValue, setTxValue] = useState("");
  const writeTxn = useTransactor();

  const keys = Object.keys(form);

  // We are omitting usePrepareContractWrite here to avoid unnecessary RPC calls and wrong gas estimations.
  // See:
  //   - https://github.com/scaffold-eth/se-2/issues/59
  //   - https://github.com/scaffold-eth/se-2/pull/86#issuecomment-1374902738
  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    addressOrName: contractAddress,
    functionName: functionFragment.name,
    contractInterface: [functionFragment],
    args: keys.map(key => form[key]),
    mode: "recklesslyUnprepared",
    overrides: {
      value: txValue,
    },
  });

  const handleWrite = async () => {
    if (writeAsync && writeTxn) {
      try {
        await writeTxn(writeAsync());
        setRefreshDisplayVariables(prevState => !prevState);
      } catch (e: any) {
        const message = getParsedEthersError(e);
        toast.error(message);
      }
    }
  };

  // TODO use `useMemo` to optimize also update in ReadOnlyFunctionForm
  const inputs = functionFragment.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(functionFragment, input, inputIndex);
    return (
      <InputUI
        key={key}
        setForm={setForm}
        form={form}
        stateObjectKey={key}
        paramType={input}
        functionFragment={functionFragment}
      />
    );
  });

  // TODO prettify json result
  return (
    <div className="flex flex-col gap-3">
      <p className="font-medium my-0 break-words">{functionFragment.name}</p>
      {inputs}
      {functionFragment.payable ? <TxValueInput setTxValue={setTxValue} txValue={txValue} /> : null}
      <button className={`btn btn-secondary btn-sm self-end ${isLoading ? "loading" : ""}`} onClick={handleWrite}>
        Send 💸
      </button>
      <span className="break-all block">{tryToDisplay(result)}</span>
    </div>
  );
};
