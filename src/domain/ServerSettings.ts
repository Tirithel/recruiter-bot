export interface ServerSettings {
  welcomeChannel?: string; // discord channel ID
  enableWelcomePost: boolean;
  acceptingApplications: boolean;
  webLink?: string;
  welcomePost?: {
    bannerAsset?: string;
    thumbnailAsset?: string;
    title: string;
    description: string;
    color?: number;
    additionalEmbeds?: [
      {
        title: string;
        description: string;
        color?: number;
        fields?: [
          {
            name?: string;
            value?: string;
            inline?: boolean;
          }
        ];
        footer?: string;
        timestamp?: boolean;
      }
    ];
  };
}
