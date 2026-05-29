export async function fetchWialonUnit(unitId, config = window.LABESA_CONFIG || {}) {
  const apiUrl = config.WIALON_API_URL;
  const token = config.WIALON_TOKEN;
  const targetUnitId = unitId || config.WIALON_UNIT_ID;

  if (!apiUrl || !token || !targetUnitId) {
    return {
      ready: false,
      message: "Configura WIALON_API_URL, WIALON_TOKEN y WIALON_UNIT_ID para consultar GPS."
    };
  }

  const url = new URL(apiUrl);
  url.searchParams.set("token", token);
  url.searchParams.set("unit_id", targetUnitId);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Wialon respondio con estado ${response.status}`);
  }

  return {
    ready: true,
    data: await response.json()
  };
}
