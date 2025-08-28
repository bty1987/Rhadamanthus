package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationInfoPO;
import com.fanglin.decoration.po.DecorationPO;

public interface DecorationInfoDao extends Dao<DecorationInfoPO> {

	public DecorationInfoPO queryDecorationInfoByOrderId(String orderId);

	public List<DecorationPO> queryDecorationForChanceRefer(String orderId);

	public List<DecorationPO> queryDecorationForOriginRefer(String orderId);

	public List<DecorationPO> queryDecorationForOrderRefer(String orderId);

	public List<DecorationPO> queryDecorationForChanceReferd(String orderId);

	public List<DecorationPO> queryDecorationForOriginReferd(String orderId);

	public List<DecorationPO> queryDecorationForOrderReferd(String orderId);

}
