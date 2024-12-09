import React from "react"
import ContentLoader from "react-content-loader"

const TaskSkeleton = (props: any) => (
    <ContentLoader
        speed={2}
        width={390}
        height={210}
        viewBox="0 0 390 215"
        backgroundColor="#2b2c37"
        foregroundColor="#47468b"
        style={{ margin: '0' }}
        {...props}
    >
        <rect x="19" y="19" rx="21" ry="21" width="344" height="189" />

    </ContentLoader>
)

export default TaskSkeleton

