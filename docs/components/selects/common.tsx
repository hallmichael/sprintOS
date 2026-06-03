import { useTeamsQuery } from '@/graphql/graphql';
import {
  useDepartmentOptions,
  useLicenseRoleOptions,
  useProjectServiceStatusOptions,
  useProjectStatusOptions,
  useRolesOptions,
  useServiceTypeOptions,
  useStateOptions,
  useUserStatusOptions,
} from '@/redux/app/selectors';
import { IndiAutoComplete } from './autocomplete';
import { IndiSelect, renderSelectWithIndicator } from './base';
import { IndiSelectProps } from './type';

export function IndiStateSelect(props: IndiSelectProps) {
  const statesOptions = useStateOptions();

  return <IndiSelect data={statesOptions} {...props} />;
}

export const IndiServiceTypeSelect = (props: IndiSelectProps) => {
  const options = useServiceTypeOptions();
  return <IndiSelect data={options} {...props} />;
};

export const IndiLicenseRoleSelect = (props: IndiSelectProps) => {
  const options = useLicenseRoleOptions();
  return <IndiSelect data={options} {...props} />;
};

export const IndiDepartmentSelect = (props: IndiSelectProps) => {
  const options = useDepartmentOptions();
  return <IndiSelect data={options} {...props} />;
};

export type IndiTeamSelectProps = IndiSelectProps & {
  departmentId?: string;
};

export const IndiTeamSelect = ({ departmentId, ...props }: IndiTeamSelectProps) => {
  const { data, loading } = useTeamsQuery({
    variables: {
      first: 100,
      department_id: departmentId,
    },
  });
  const teams =
    data?.teams?.data?.map(team => ({
      label: team.name || '',
      value: team.id,
    })) || [];

  return <IndiAutoComplete placeholder="Select team" data={teams} loading={loading} {...props} />;
};

export const IndiRoleSelect = (props: IndiSelectProps) => {
  const roles = useRolesOptions();
  return <IndiSelect data={roles} {...props} />;
};

export const IndiUserStatusSelect = (props: IndiSelectProps) => {
  const options = useUserStatusOptions();
  return <IndiSelect data={options} {...props} />;
};

export const IndiProjectStatusSelect = (props: IndiSelectProps) => {
  const projectStatuseOptions = useProjectStatusOptions();

  return <IndiSelect data={projectStatuseOptions} {...props} />;
};

export const IndiProjectServiceStatusSelect = (props: IndiSelectProps) => {
  const projectServiceStatuseOptions = useProjectServiceStatusOptions();

  return <IndiSelect data={projectServiceStatuseOptions} renderItem={renderSelectWithIndicator} {...props} />;
};
