// types
export type I18nLeafTip = string;
export type I18nLeaf = { [key: string]: I18nLeafTip };
export type I18nSubsection = { [key: string]: I18nLeaf };
export type I18nSection = { [key: string]: I18nSubsection };
export type I18nRoot = { [namespace: string]: I18nSection };

// recursive helper type
export interface DeepInput {
  [key: string]: string | DeepInput;
}

// actual deepWrap function
export function deepWrap(input: DeepInput): I18nRoot {
  const wrap = (
    val: string | DeepInput,
    depth = 1
  ): I18nLeafTip | I18nLeaf | I18nSubsection | I18nSection => {
    if (typeof val === 'string') {
      return val;
    }

    const wrapped: Record<
      string,
      I18nLeafTip | I18nLeaf | I18nSubsection | I18nSection
    > = {};
    for (const key in val) {
      const child = val[key];
      wrapped[key] = wrap(child, depth + 1);
    }

    return wrapped as I18nLeaf | I18nSubsection | I18nSection;
  };

  const root: I18nRoot = {};
  for (const ns in input) {
    const section = input[ns];
    root[ns] = wrap(section, 1) as I18nSection;
  }

  return root;
}
