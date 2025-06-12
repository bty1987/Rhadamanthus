package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationActivityRecordPO;

public interface DecorationActivityRecordDao  extends Dao<DecorationActivityRecordPO> {

	public List<DecorationActivityRecordPO> queryDecorationActivityRecord(long daiid);

}
