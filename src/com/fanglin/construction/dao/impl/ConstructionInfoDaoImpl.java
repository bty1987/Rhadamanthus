package com.fanglin.construction.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.core.dao.impl.DaoImpl;


@Repository("constructionInfoDao")
public class ConstructionInfoDaoImpl extends DaoImpl<ConstructionInfoPO> implements ConstructionInfoDao {

	public ConstructionInfoDaoImpl() {
		super(ConstructionInfoPO.class);
	}

	@Override
	public ConstructionInfoPO queryConstructionInfo(long cid) {
		return (ConstructionInfoPO) session().createCriteria(ConstructionInfoPO.class).add(Restrictions.eq(ConstructionInfoPO.COLUMN_CID_STR, cid)).uniqueResult();
	}

	@Override
	public ConstructionInfoPO queryConstructionInfoByOrderId(String orderId) {
		return (ConstructionInfoPO) session().createCriteria(ConstructionInfoPO.class).add(Restrictions.eq(ConstructionInfoPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	}

}
