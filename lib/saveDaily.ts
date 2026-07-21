export async function saveDaily(form: any) {
  const res = await fetch("/api/daily", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(
      data.message || "保存に失敗しました"
    );
  }

  return data;
}