package com.fanglin.customer.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.po.CppointRecordPO;

@Repository("cppointRecordDao")
public class CppointRecordDaoImpl extends DaoImpl<CppointRecordPO> implements CppointRecordDao {

	public CppointRecordDaoImpl() {
		super(CppointRecordPO.class);
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CppointRecordPO> queryCppointRecord(Long cid) {
		return session().createCriteria(CppointRecordPO.class).add(Restrictions.eq(CppointRecordPO.COLUMN_CID_STR, cid)).list();
	}

}
