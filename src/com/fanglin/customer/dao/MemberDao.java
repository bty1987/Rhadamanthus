package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.PointAccountPO;

public interface MemberDao extends Dao<PointAccountPO> {

	public long totalMemberPointForDecoration(String orderId);

	public long amountMemberPointForDecoration(String orderId);

	public long totalMemberPointForMaterial(String orderId);

	public long amountMemberPointForMaterial(String orderId);

}
