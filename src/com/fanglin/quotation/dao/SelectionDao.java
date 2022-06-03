package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.SelectionDO;
import com.fanglin.quotation.po.SelectionPO;
import com.fanglin.utils.Paging;

public interface SelectionDao extends Dao<SelectionPO> {

	public List<SelectionDO> pageSelection(Paging paging, List<Filter> filters, Integer company);

	public SelectionPO querySelectionByQid(long qid);

	public SelectionPO querySelectionByOrderId(String orderId);

	public int updateSelectionForQidByOrderId(String orderId, long qid);

	public int deleteSelectionByQid(long qid);

}
