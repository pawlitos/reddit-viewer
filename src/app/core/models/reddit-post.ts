export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  subreddit_name_prefixed: string;
  score: number;
  ups: number;
  upvote_ratio: number;
  num_comments: number;
  created_utc: number;
  url: string;
  permalink: string;
  selftext: string;
  thumbnail: string;
  preview?: { images: Array<{ source: { url: string; width: number; height: number } }> };
  is_self: boolean;
  is_video: boolean;
  link_flair_text: string | null;
  over_18: boolean;
  stickied: boolean;
  domain: string;
}
