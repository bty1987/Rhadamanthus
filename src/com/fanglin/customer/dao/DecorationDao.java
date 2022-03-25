package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.customer.po.DecorationPO;

public interface DecorationDao extends Dao<DecorationPO> {

	public List<DecorationPO> queryCusDecoration(String unionId);

	public List<DecorationPO> queryCusDecorationByOrderId(String orderId);

	public DecorationPO queryCusDecorationByOrderId(String orderId, String unionId);

	public DecorationPO queryCusDecorationForDefault(String unionId);

	public void deleteCusDecorationByUnionId(String unionId);

}
