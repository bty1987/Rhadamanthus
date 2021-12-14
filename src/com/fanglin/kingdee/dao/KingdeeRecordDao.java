package com.fanglin.kingdee.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.kingdee.po.KingdeeRecordPO;
import com.fanglin.utils.Paging;

public interface KingdeeRecordDao extends Dao<KingdeeRecordPO> {

	public List<KingdeeRecordPO> pageKingdeeRecord(Paging paging, List<Filter> filters);

	
}
