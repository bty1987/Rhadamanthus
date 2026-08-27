package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.PointAccountPO;

public interface MemberDao extends Dao<PointAccountPO> {

	public long totalMemberPointForDecoration(String orderId);

	public long amountMemberPointForDecoration(String orderId);

	public long totalMemberPointForMaterial(String orderId);

	public long amountMemberPointForMaterial(String orderId);

	public long amountDecorationIntegralByOrderId(String orderId);

	public long amountFreezeDecorationIntegralByOrderId(String orderId);

	public long amountMaterialIntegralByOrderId(String orderId);

	public List<Object[]> queryDecorationIntegralDetailByOrderId(String orderId);

	public List<Object[]> queryMaterialIntegralDetailByOrderId(String orderId);

}
