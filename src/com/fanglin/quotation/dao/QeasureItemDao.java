package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.QeasureItemPO;

public interface QeasureItemDao extends Dao<QeasureItemPO> {

	public List<QeasureItemPO> queryQeasureItem(long qmid);

	public List<QeasureItemPO> queryQeasureItem(long qmfaid, short type);

	public int deleteQeasureItem(long qmfaid, short type);

}
