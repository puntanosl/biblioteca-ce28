export async function handler(event) {
  const params = event.queryStringParameters || {};

  const term = params.term || "suma";
  const subject = params.subject || "matematica";
  const grade = params.grade || "4";

  const items = [
    {
      title: "Suma básica – fichas imprimibles",
      url: "https://www.liveworksheets.com/",
      source: "liveworksheets",
      subject,
      grade
    },
    {
      title: "Ejercicios de suma para primaria",
      url: "https://wordwall.net/",
      source: "wordwall",
      subject,
      grade
    }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      items
    })
  };
}
