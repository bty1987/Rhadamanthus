package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QeasureFunctionAreaDao;
import com.fanglin.quotation.po.QeasureFunctionAreaPO;

@Repository("qeasureFunctionAreaDao")
public class QeasureFunctionAreaDaoImpl extends DaoImpl<QeasureFunctionAreaPO> implements QeasureFunctionAreaDao {

	public QeasureFunctionAreaDaoImpl() {
		super(QeasureFunctionAreaPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QeasureFunctionAreaPO> queryQeasureFunctionArea(long qmid) {
		return session().createCriteria(QeasureFunctionAreaPO.class).add(Restrictions.eq("qmid", qmid)).list();
	}

}
