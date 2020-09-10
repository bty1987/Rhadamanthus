package com.fanglin.information.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.information.dao.PhoneCallRecordDao;
import com.fanglin.information.po.PhoneCallRecordPO;

@Repository("phoneCallRecordDao")
public class PhoneCallRecordDaoImpl extends DaoImpl<PhoneCallRecordPO> implements PhoneCallRecordDao {

	public PhoneCallRecordDaoImpl() {
		super(PhoneCallRecordPO.class);
	}

	@Override
	public PhoneCallRecordPO queryPhoneCallRecord(long pcId) {
		return (PhoneCallRecordPO) session().createCriteria(PhoneCallRecordPO.class).add(Restrictions.eq("pcid", pcId)).uniqueResult();
	}
}
