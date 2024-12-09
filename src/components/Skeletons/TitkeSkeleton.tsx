import React from "react"
import ContentLoader from "react-content-loader"

const TitleSkeleton = (props: any) => (
    <ContentLoader
        rtl
        speed={2}
        width={300}
        height={40}
        viewBox="0 0 400 40"
        backgroundColor="#464858"
        style={{marginLeft:'15px'}}
        foregroundColor="#47468b"
        {...props}
    >
        <circle cx="10" cy="20" r="8" />
        <rect x="168" y="15" rx="5" ry="5" width="213" height="10" />
        <circle cx="10" cy="50" r="8" />
        <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="80" r="8" />
        <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
        <circle cx="10" cy="110" r="8" />
        <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
    </ContentLoader>
)

export default TitleSkeleton

