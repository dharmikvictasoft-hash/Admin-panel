import { Helmet } from "react-helmet-async";

type PageMetaProps = {
  title: string;
  description?: string;
};

const PageMeta = ({ title, description }: PageMetaProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description && (
        <meta name="description" content={description} />
      )}
    </Helmet>
  );
};

export default PageMeta;
