export async function assignUsersToTask(taskId: string, userIds: string[]) {
    const response = await fetch(`https://kanban-server-psi.vercel.app/api/v1/task/${taskId}/assign`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds }),
    });

    const task = await response.json();
    console.log(task);
}