package com.fanglin.customer.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.CppointPO;

public interface MemberDao extends Dao<CppointPO> {

	public long totalMemberPointForDecoration(String orderId);

	public long amountMemberPointForDecoration(String orderId);

	public long totalMemberPointForMaterial(String orderId);

	public long amountMemberPointForMaterial(String orderId);

}
