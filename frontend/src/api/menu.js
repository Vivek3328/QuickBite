import { http, authHeaders } from "./http";

export async function fetchRestoMenu(ownerId, userToken) {
  const { data } = await http.get(`/menuitemauth/fetchrestomenu/${ownerId}`, {
    headers: authHeaders(userToken),
  });
  return data;
}

export async function fetchOwnerMenuItems(ownerToken) {
  const { data } = await http.get("/menuitemauth/fetchallmenuitems", {
    headers: authHeaders(ownerToken),
  });
  return data;
}

export async function addMenuItem(ownerToken, itemData) {
  const { data } = await http.post("/menuitemauth/additem", itemData, {
    headers: authHeaders(ownerToken),
  });
  return data;
}

export async function updateMenuItem(ownerToken, itemId, itemData) {
  const { data } = await http.put(
    `/menuitemauth/updatemenuitem/${itemId}`,
    itemData,
    { headers: authHeaders(ownerToken) }
  );
  return data;
}

export async function toggleMenuItemStock(ownerToken, itemId, isOutOfStock) {
  const { data } = await http.patch(
    `/menuitemauth/stock/${itemId}`,
    { isOutOfStock },
    { headers: authHeaders(ownerToken) }
  );
  return data;
}
