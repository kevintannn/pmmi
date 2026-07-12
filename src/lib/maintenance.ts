import { get } from '@vercel/edge-config';

const KEY = 'maintenance';

/**
 * Whether maintenance mode is on. Order of precedence:
 *  1. MAINTENANCE_MODE env var (explicit on/off — useful locally or as override)
 *  2. Vercel Edge Config `maintenance` flag (toggled from /admin, read at the edge)
 * Never throws — defaults to "off".
 */
export async function isMaintenanceOn(): Promise<boolean> {
  const env = process.env.MAINTENANCE_MODE?.toLowerCase();
  if (env === '1' || env === 'true' || env === 'on') return true;
  if (env === '0' || env === 'false' || env === 'off') return false;

  if (process.env.EDGE_CONFIG) {
    try {
      return (await get<boolean>(KEY)) === true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Toggle the Edge Config flag via the Vercel REST API. Requires:
 *  - VERCEL_API_TOKEN  (account/team token with edge-config write access)
 *  - EDGE_CONFIG_ID    (the store id, e.g. "ecfg_...")
 *  - VERCEL_TEAM_ID    (only if the project belongs to a team)
 */
export async function setMaintenance(on: boolean): Promise<void> {
  const token = process.env.VERCEL_API_TOKEN;
  const configId = process.env.EDGE_CONFIG_ID;
  if (!token || !configId) {
    throw new Error('Edge Config write not configured (VERCEL_API_TOKEN / EDGE_CONFIG_ID).');
  }
  const teamId = process.env.VERCEL_TEAM_ID;
  const url = `https://api.vercel.com/v1/edge-config/${configId}/items${
    teamId ? `?teamId=${teamId}` : ''
  }`;

  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      items: [{ operation: 'upsert', key: KEY, value: on }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Edge Config write failed (${res.status})`);
  }
}

/** True when the app can flip the flag from /admin (write vars present). */
export function canToggleMaintenance(): boolean {
  return Boolean(process.env.VERCEL_API_TOKEN && process.env.EDGE_CONFIG_ID);
}
