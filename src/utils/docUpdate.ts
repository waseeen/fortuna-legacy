import { client, googleDoc } from '../client';
import { InviteEntity } from '../database/Invites.entity';
export const docUpdate = async (): Promise<void> => {
  await googleDoc.loadInfo();
  const googleSheet = googleDoc.sheetsById[0];
  await googleSheet.clearRows();
  await googleSheet.setHeaderRow(['Инвайт', 'Ссылка', 'Использования', 'Инвайтер', 'Описание']);
  for (const invite of client.invites) {
    const isProtected = await InviteEntity.getInvite(invite.code);
    const rowData = [
      invite.code,
      `https://discord.gg/${invite.code}`,
      invite.uses,
      invite.inviter.username,
    ];
    if (isProtected) rowData.push(isProtected.description);
    await googleSheet.addRow(rowData);
  }
};
