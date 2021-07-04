package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.DecorationBusitypePO;
import com.fanglin.utils.Paging;

public interface DecorationBusitypeDao extends Dao<DecorationBusitypePO> {

	public List<DecorationBusitypePO> pageDecorationBusitype(Paging paging, List<Filter> filters, int company);

	public List<DecorationBusitypePO> queryDecorationBusitype(int company);
}
