package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationActivityRecordDao;
import com.fanglin.decoration.po.DecorationActivityRecordPO;

@Repository("decorationActivityRecordDao")
public class DecorationActivityRecordDaoImpl extends DaoImpl<DecorationActivityRecordPO> implements DecorationActivityRecordDao {

	public DecorationActivityRecordDaoImpl() {
		super(DecorationActivityRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationActivityRecordPO> queryDecorationActivityRecord(long daiid) {
		return session().createCriteria(DecorationActivityRecordPO.class).add(Restrictions.eq("decorationActivityItem.daiId", daiid)).list();
	}

}
