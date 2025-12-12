export default async (request) => {
    const url = new URL(request.url);
    const term = url.searchParams.get("term");
    const subject = url.searchParams.get("subject");
    const grade = url.searchParams.get("grade");

    return new Response(
        JSON.stringify({
            ok: true,
            message: "Function activa",
            term,
            subject,
            grade
        }),
        { headers: { "Content-Type": "application/json" } }
    );
};
