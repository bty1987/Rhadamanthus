package com.fanglin.data.common.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.DecorationMatchingPO;
import com.fanglin.utils.Paging;

public interface DecorationMatchingDao extends Dao<DecorationMatchingPO> {

	public List<DecorationMatchingPO> pageDecorationMatching(Paging paging, List<Filter> filters, int company);

	public List<DecorationMatchingPO> queryDecorationMatching(List<Short> type, List<Short> typeness, int company);

}
