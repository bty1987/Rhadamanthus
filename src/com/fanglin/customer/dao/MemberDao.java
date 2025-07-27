package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.GroupPO;

public interface MemberDao extends Dao<GroupPO> {

	public long totalMemberPointForDecoration(String orderId);

	public long amountMemberPointForDecoration(String orderId);

	public long totalMemberPointForMaterial(String orderId);

	public long amountMemberPointForMaterial(String orderId);

}
