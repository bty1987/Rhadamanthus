package com.fanglin.data.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.GoodsRecordPO;
import com.fanglin.utils.Paging;

public interface GoodsRecordDao extends Dao<GoodsRecordPO> {

	public List<GoodsRecordPO> pageGoodsRecord(Paging paging, List<Filter> filters, Long gid);

}
