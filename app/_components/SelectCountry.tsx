import { getCountries } from "@/app/_lib/data-service";

interface SelectCountryProps {
  defaultCountry: string;
  name: string;
  id: string;
  className: string;
  defaultFlag: string;
}

interface Country {
  name: string;
  flag: string;
  alpha2Code: string;
}

async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
  defaultFlag,
}: SelectCountryProps) {
  const countries = await getCountries();

  return (
    <>
      <select
        name={name}
        key={`${defaultCountry}-${defaultFlag}`}
        id={id}
        defaultValue={`${defaultCountry}%${defaultFlag}`}
        className={className}
      >
        <option value="">Select country...</option>
        {countries.map((c: Country) => (
          <option
            key={c.name}
            value={`${c.name}%https://flagcdn.com/${c.alpha2Code.toLocaleLowerCase()}.svg`}
          >
            {c.name}
          </option>
        ))}
      </select>
    </>
  );
}

export default SelectCountry;
