package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.po.SelectionItemPO2;
import com.fanglin.utils.Paging;

public interface SelectionItemDao extends Dao<SelectionItemPO> {
	
	public List<SelectionItemPO2> pageSelectionItem(Paging paging, List<Filter> filters, Short status);
	
	public List<SelectionItemPO2> pageSelectionItemForSupplier(Paging paging, List<Filter> filters, Long suid);

	public List<SelectionItemPO> querySelectionItem(long sid);
	
	public List<SelectionItemPO2> querySelectionItemObject(long sid);

	public SelectionItemPO querySoleSelectionItem(long sid, long areaId, long quoteId, short type);

	public int countSelectionItem(String orderId, long areaId);

	public int countSelectionItem(String orderId, long areaId, long quoteId);

}
