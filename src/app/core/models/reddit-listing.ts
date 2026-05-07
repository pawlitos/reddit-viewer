export interface RedditListing<T> {
  kind: string;
  data: {
    children: Array<{ kind: string; data: T }>;
    after: string | null;
    before: string | null;
    dist: number;
  };
}
