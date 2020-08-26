package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.utils.Paging;

public interface SelectionItemDao extends Dao<SelectionItemPO> {
	
	public List<SelectionItemPD> pageSelectionItem(Paging paging, List<Filter> filters, Short status, Integer company);
	
	public List<SelectionItemPD> pageSelectionItemForSupplier(Paging paging, List<Filter> filters, Long suid, Integer company);
	
	public List<SelectionItemPD> pageSelectionItemForEscorter(Paging paging, List<Filter> filters, String userId);
	
	public List<SelectionItemPO> querySelectionItem(long sid);
	
	public SelectionItemPO querySelectionItem(long sid, long areaId, long quoteId, short type);
	
	public SelectionItemPO querySelectionItem(String orderId, long areaId, long quoteId, short type);
	
	public List<SelectionItemPD> querySelectionItemDBySid(long sid);
	
	public int countSelectionItem(String orderId, long areaId);

	public int countSelectionItem(String orderId, long areaId, long quoteId);

}
