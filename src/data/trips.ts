export type Trip = {
  slug: string;
  title: string;
  location: string;
  date: string;
  cover: string;
  transitionImage?: string;
  photos: string[];
  summary: string;
  story: string;
};

export const trips: Trip[] = [
  {
    slug: "beihai",
    title: "北海风吹过的合照",
    location: "北海",
    date: "2023.10",
    cover: "/photos/beihai/cover.png",
    transitionImage: "/photos/beihai/cartoon_we.png",
    photos: [
      "/photos/beihai/cover.png",
      "/photos/beihai/01.jpg",
      "/photos/beihai/02.jpg",
      "/photos/beihai/03.jpg"
    ],
    summary: "海边的风很亮，我们把这一刻留在了镜头里。",
    story:
      "这张合照像一枚被海风吹亮的书签，夹在我们一起去北海的那一页。后来再看见它，还是会想起阳光、海边、还有那天并肩站在一起的心情。"
  },
  {
    slug: "hangzhou",
    title: "西湖边的慢下午",
    location: "杭州",
    date: "2024.04",
    cover: "/photos/hangzhou/cover.jpg",
    photos: [
      "/photos/hangzhou/01.jpg",
      "/photos/hangzhou/02.jpg",
      "/photos/hangzhou/03.jpg",
      "/photos/hangzhou/04.jpg"
    ],
    summary: "风从湖面吹过来，我们把时间走得很慢。",
    story:
      "那天没有特别赶路，只是沿着湖边走走停停。树影、晚风、便利店的热饮，还有你回头笑的那一秒，都被悄悄放进了这一天。"
  },
  {
    slug: "shanghai",
    title: "灯光亮起的时候",
    location: "上海",
    date: "2024.08",
    cover: "/photos/shanghai/cover.jpg",
    photos: [
      "/photos/shanghai/01.jpg",
      "/photos/shanghai/02.jpg",
      "/photos/shanghai/03.jpg",
      "/photos/shanghai/04.jpg"
    ],
    summary: "在人潮和夜色里，我们拥有自己的小小宇宙。",
    story:
      "城市很亮，也很忙，可我们在路口等红灯、在街边分一份甜品的时候，世界像是轻轻安静下来。后来想起上海，最先想到的还是和你并肩走过的夜。"
  },
  {
    slug: "xiamen",
    title: "海边写给夏天的信",
    location: "厦门",
    date: "2025.02",
    cover: "/photos/xiamen/cover.jpg",
    photos: [
      "/photos/xiamen/01.jpg",
      "/photos/xiamen/02.jpg",
      "/photos/xiamen/03.jpg",
      "/photos/xiamen/04.jpg"
    ],
    summary: "海风、日落、踩在沙滩上的影子，都刚刚好。",
    story:
      "我们在海边等一场日落，浪声一遍遍涌上来。很多话没有说完也没关系，因为坐在一起的那段时间，本身就像一句很温柔的答案。"
  }
];
