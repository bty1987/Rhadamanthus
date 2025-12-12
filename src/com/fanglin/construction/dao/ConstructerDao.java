package com.fanglin.construction.dao;

import java.util.List;

import com.fanglin.construction.po.ConstructerPO;
import com.fanglin.core.dao.Dao;

public interface ConstructerDao extends Dao<ConstructerPO> {

	public List<ConstructerPO> queryConstructerByOrderId(String orderId, Long csid);

	public List<ConstructerPO> queryConstructerByCid(long cid, Long csid);

	public ConstructerPO queryConstructerByCrid(long crid);

	public int countConstructer(long cid, int wuid, long csid);

	public ConstructerPO queryConstructerByUid(String orderId, long cnid, int wuid);

}
