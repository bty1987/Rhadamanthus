package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.PresignItemPO;
import com.fanglin.utils.Paging;

public interface PresignItemDao extends Dao<PresignItemPO> {

	public List<PresignItemPO> pagePresignItem(Paging paging, List<Filter> filters, Long ppid, Short status, List<Short> types);

	public List<PresignItemPO> queryPresignItem(long ppid);

}
