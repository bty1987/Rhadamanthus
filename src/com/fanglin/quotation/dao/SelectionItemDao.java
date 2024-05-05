package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.utils.Paging;

public interface SelectionItemDao extends Dao<SelectionItemPO> {

	public List<SelectionItemPD> pageSelectionItem(Paging paging, List<Filter> filters, Short status, Integer company);

	public List<SelectionItemPD> pageSelectionItemForSupplier(Paging paging, List<Filter> filters, Integer suid, Integer company);

	public List<SelectionItemPD> pageSelectionItemForEscorter(Paging paging, List<Filter> filters, String userId);

	public List<SelectionItemPD> pageSelectionItemForAccount(Paging paging, List<Filter> filters, Integer company);

	public List<SelectionItemPO> querySelectionItem(long sid);

	public SelectionItemPO querySelectionItem(long sid, long areaId, long quoteId, short type);

	public SelectionItemPO querySelectionItem(String orderId, long areaId, long quoteId, short type);

	public SelectionItemPO pickSelectionItem(String orderId, Long qiid);

	public List<SelectionItemPD> querySelectionItemDBySid(long sid);

	public int countSelectionItem(String orderId, Long quoteId);

	public int countSelectionItem(String orderId, short type);

	public int countSelectionItem(String orderId, long areaId, long quoteId);

	public int countSelectionItem(String orderId, long areaId, List<Long> quoteIds, short type);

	public int countSelectionItem(String orderId, List<Short> statuses);

}
