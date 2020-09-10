package com.fanglin.information.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.utils.Paging;

public interface AwardRecordDao extends Dao<AwardRecordPO> {

	public List<AwardRecordPO> pageAwardRecord(Paging paging, List<Filter> filters, int company);

}
