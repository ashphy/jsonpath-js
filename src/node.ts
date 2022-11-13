export type Node = RootSelector |
  DotSelector |
  DotWildcardSelector |
  MemberNameSelector |
  IndexSelector;

export type RootSelector = {
  type: 'RootSelector';
}

export type DotSelector = {
  type: 'DotSelector';
  member: string;
}

export type DotWildcardSelector = {
  type: 'DotWildcardSelector';
}

export type MemberNameSelector = {
  type: 'MemberNameSelector';
  member: string;
}

export type IndexSelector = {
  type: 'IndexSelector';
  index: number;
}