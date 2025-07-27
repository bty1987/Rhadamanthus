package com.fanglin.construction.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.construction.dao.ConstructionRecordDao;
import com.fanglin.construction.po.ConstructionRecordPO;
import com.fanglin.core.dao.impl.DaoImpl;

@Repository("constructionRecordDao")
public class ConstructionRecordDaoImpl extends DaoImpl<ConstructionRecordPO> implements ConstructionRecordDao {

	public ConstructionRecordDaoImpl() {
		super(ConstructionRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionRecordPO> queryConstructionRecordByOrderId(String orderId) {
		return session().createCriteria(ConstructionRecordPO.class).add(Restrictions.eq(ConstructionRecordPO.COLUMN_ORDERID_STR, orderId)).list();
	}

}
