package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.PointAccountPO;

public interface MemberDao extends Dao<PointAccountPO> {

	public long totalMemberPointForDecoration(String orderId);

	public long amountMemberPointForDecoration(String orderId);

	public long totalMemberPointForMaterial(String orderId);

	public long amountMemberPointForMaterial(String orderId);

	public long amountDecorationPointByOrderId(String orderId);

	public long amountDecorationPointForFreezeByOrderId(String orderId);

	public long amountMaterialPointByOrderId(String orderId);

	public List<Object[]> queryDecorationPointDetailByOrderId(String orderId);

	public List<Object[]> queryMaterialPointDetailByOrderId(String orderId);

}
