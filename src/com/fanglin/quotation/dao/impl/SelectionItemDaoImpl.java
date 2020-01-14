package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.quotation.po.SelectionItemPO2;
import com.fanglin.utils.Paging;

@Repository("selectionItemDao")
public class SelectionItemDaoImpl extends DaoImpl<SelectionItemPO> implements SelectionItemDao {

	public SelectionItemDaoImpl() {
		super(SelectionItemPO.class);
	}
	
	@Override
	public List<SelectionItemPO2> pageSelectionItem(Paging paging, List<Filter> filters, Short status) {
		
		PagingQuery<SelectionItemPO2> query = pagingQuery(paging, SelectionItemPO2.class);
		
		queryFilterExcute(query, filters);
		
		query.add(Restrictions.eq(SelectionItemPO.COLUMN_STATUS_STR, status));

		query.desc("siid");
		
		return query.list();
	}
	
	@Override
	public List<SelectionItemPO2> pageSelectionItemForSupplier(Paging paging, List<Filter> filters, Long suid) {
			
		PagingQuery<SelectionItemPO2> query = pagingQuery(paging, SelectionItemPO2.class);
	
		queryFilterExcute(query, filters);
	
		query.add(Restrictions.eq(SelectionItemPO.COLUMN_SUID_STR, suid));

		query.desc("siid");
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SelectionItemPO> querySelectionItem(long sid) {
		return createCriteria(SelectionItemPO.class).add(Restrictions.eq(SelectionItemPO.COLUMN_SID_STR, sid)).list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<SelectionItemPO2> querySelectionItemObject(long sid) {
		return createCriteria(SelectionItemPO2.class).createAlias("selection", "selection").add(Restrictions.eq(SelectionItemPO2.COLUMN_SELECTION_SID_STR, sid)).list();
	}

	@Override
	public SelectionItemPO querySoleSelectionItem(long sid, long areaId, long quoteId, short type) {
		return (SelectionItemPO) session().createCriteria(SelectionItemPO.class).add(Restrictions.eq(SelectionItemPO.COLUMN_SID_STR, sid)).add(Restrictions.eq(SelectionItemPO.COLUMN_AREAID_STR, areaId)).add(Restrictions.eq(SelectionItemPO.COLUMN_QUOTEID_STR, quoteId)).add(Restrictions.eq(SelectionItemPO.COLUMN_TYPE_STR, type)).uniqueResult();
	}

	@Override
	public int countSelectionItem(String orderId, long areaId) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).uniqueResult();

		return count.intValue();
	}

	@Override
	public int countSelectionItem(String orderId, long areaId, long quoteId) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId AND quoteId = :quoteId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).setLong(SelectionItemPO.COLUMN_QUOTEID_STR, quoteId).uniqueResult();

		return count.intValue();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if (filters != null && filters.size() > 0) {
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("decoration","decoration");
				query.alias("goods", "goods");
				
				if (SelectionItemPO2.COLUMN_ORDERID_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPO2.COLUMN_DECORATION_ORDERID_STR, data, op));
				} else if (SelectionItemPO2.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPO2.COLUMN_STATUS_STR, Short.valueOf(data), op));
				} else if (SelectionItemPO2.COLUMN_GOODS_NAME_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPO2.COLUMN_GOODS_NAME_STR, data, op));
				} else if (SelectionItemPO2.COLUMN_GOODS_CATEGORY_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPO2.COLUMN_GOODS_CATEGORY_STR, data, op));
				} else if (SelectionItemPO2.COLUMN_GOODS_BRAND_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPO2.COLUMN_GOODS_BRAND_STR, data, op));
				}
			}
		}
	}
}
