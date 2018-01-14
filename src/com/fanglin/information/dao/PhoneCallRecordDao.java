package com.fanglin.information.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.information.po.PhoneCallRecordPO;

public interface PhoneCallRecordDao extends Dao<PhoneCallRecordPO> {

	public PhoneCallRecordPO queryPhoneCallRecordByPcId(long pcId);

}
