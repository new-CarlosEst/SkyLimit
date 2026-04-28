import HeroBlog from "../components/layouts/hero/HeroBlog";
import MainBlog from "../components/layouts/Main/MainBlog";
import TrustSection from "../components/layouts/Section/TrustSection";

function Blog() {
    return (
        <div>
            <HeroBlog />
            <MainBlog />
            <TrustSection />
        </div>
    );
}

export default Blog;