package com.fanglin.quotation.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QeasureOptionPO;

public interface QeasureOptionDao extends Dao<QeasureOptionPO> {

	public int deleteQeasureOption(long qmid, long qmfaid);

}
