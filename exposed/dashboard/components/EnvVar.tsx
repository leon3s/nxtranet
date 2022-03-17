import type {ModelEnvVar} from "@nxtranet/headers";
import * as Style from './EnvVar.s';

export type EnvVarProps = {
  data: ModelEnvVar;
  onClickEdit?: (envVar: ModelEnvVar) => void;
  onClickDelete?: (envVar: ModelEnvVar) => void;
}

export default function EnvVar(props: EnvVarProps) {
  function onClickEdit() {
    props.onClickEdit && props.onClickEdit(props.data);
  }

  function onClickDelete() {
    props.onClickDelete && props.onClickDelete(props.data);
  }

  return (
    <Style.Container
    >
      <Style.Overlay>
        <Style.Delete
          onClick={onClickDelete}
          title="Delete"
        >

        </Style.Delete>
        <Style.Edit
          title="Edit"
          onClick={onClickEdit}
        >

        </Style.Edit>
      </Style.Overlay>
      <Style.Title>
        {props.data.key}
      </Style.Title>
    </Style.Container>
  );
}
