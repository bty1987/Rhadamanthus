package com.fanglin.quotation.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.dao.SelectionItemDao;
import com.fanglin.quotation.po.SelectionItemPD;
import com.fanglin.quotation.po.SelectionItemPO;
import com.fanglin.utils.Paging;

@Repository("selectionItemDao")
public class SelectionItemDaoImpl extends DaoImpl<SelectionItemPO> implements SelectionItemDao {

	public SelectionItemDaoImpl() {
		super(SelectionItemPO.class);
	}

	@Override
	public List<SelectionItemPD> pageSelectionItem(Paging paging, List<Filter> filters, Short status, Integer company) {

		PagingQuery<SelectionItemPD> query = pagingQuery(paging, SelectionItemPD.class);

		queryFilterExcute(query, filters);

		query.add(Restrictions.eq(SelectionItemPO.COLUMN_COMPANY_STR, company));

		if (status != null) {
			query.add(Restrictions.eq(SelectionItemPO.COLUMN_STATUS_STR, status));
		}

		query.desc("siid");

		return query.list();
	}

	@Override
	public List<SelectionItemPD> pageSelectionItemForSupplier(Paging paging, List<Filter> filters, Long suid, Integer company) {

		PagingQuery<SelectionItemPD> query = pagingQuery(paging, SelectionItemPD.class);

		queryFilterExcute(query, filters);

		query.add(Restrictions.eq(SelectionItemPO.COLUMN_COMPANY_STR, company));
		query.add(Restrictions.eq(SelectionItemPO.COLUMN_SUID_STR, suid));

		query.desc("siid");

		return query.list();
	}

	@Override
	public List<SelectionItemPD> pageSelectionItemForEscorter(Paging paging, List<Filter> filters, String userId) {

		PagingQuery<SelectionItemPD> query = pagingQuery(paging, SelectionItemPD.class);

		queryFilterExcute(query, filters);

		query.alias("decoration", "decoration");
		query.alias("decoration.escorter", "decorationEscorter");

		query.add(Restrictions.eq("decorationEscorter.userId", userId));
		query.add(Restrictions.eq(SelectionItemPO.COLUMN_STATUS_STR, (short) 1));

		query.desc("siid");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SelectionItemPO> querySelectionItem(long sid) {
		return createCriteria(SelectionItemPO.class).add(Restrictions.eq(SelectionItemPO.COLUMN_SID_STR, sid)).list();
	}

	@Override
	public SelectionItemPO querySelectionItem(long sid, long areaId, long quoteId, short type) {
		return (SelectionItemPO) session().createCriteria(SelectionItemPO.class).add(Restrictions.eq(SelectionItemPO.COLUMN_SID_STR, sid)).add(Restrictions.eq(SelectionItemPO.COLUMN_AREAID_STR, areaId)).add(Restrictions.eq(SelectionItemPO.COLUMN_QUOTEID_STR, quoteId)).add(Restrictions.eq(SelectionItemPO.COLUMN_TYPE_STR, type)).uniqueResult();
	}

	@Override
	public SelectionItemPO querySelectionItem(String orderId, long areaId, long quoteId, short type) {
		return (SelectionItemPO) session().createCriteria(SelectionItemPO.class).add(Restrictions.eq(SelectionItemPO.COLUMN_ORDERID_STR, orderId)).add(Restrictions.eq(SelectionItemPO.COLUMN_AREAID_STR, areaId)).add(Restrictions.eq(SelectionItemPO.COLUMN_QUOTEID_STR, quoteId)).add(Restrictions.eq(SelectionItemPO.COLUMN_TYPE_STR, type)).uniqueResult();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<SelectionItemPD> querySelectionItemDBySid(long sid) {
		return createCriteria(SelectionItemPD.class).add(Restrictions.eq(SelectionItemPD.COLUMN_SID_STR, sid)).list();
	}

	@Override
	public int countSelectionItem(String orderId, long areaId) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countSelectionItem(String orderId, long areaId, long quoteId) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId AND quoteId = :quoteId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).setLong(SelectionItemPO.COLUMN_QUOTEID_STR, quoteId).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null && filters.size() > 0) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("decoration", "decoration");
				query.alias("goods", "goods");

				if (SelectionItemPD.COLUMN_ORDERID_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPD.COLUMN_DECORATION_ORDERID_STR, data, op));
				} else if (SelectionItemPD.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPD.COLUMN_STATUS_STR, Short.valueOf(data), op));
				} else if (SelectionItemPD.COLUMN_GOODS_NAME_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPD.COLUMN_GOODS_NAME_STR, data, op));
				} else if (SelectionItemPD.COLUMN_GOODS_CATEGORY_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPD.COLUMN_GOODS_CATEGORY_STR, data, op));
				} else if (SelectionItemPD.COLUMN_GOODS_BRAND_STR.equals(field)) {
					query.add(query.getCriterion(SelectionItemPD.COLUMN_GOODS_BRAND_STR, data, op));
				} else if ("createTime".equals(field)) {
					query.timeranges("createTime", data);
				} else if ("tranTime".equals(field)) {
					query.timeranges("tranTime", data);
				} else if ("checkTime".equals(field)) {
					query.timeranges("checkTime", data);
				} else if ("confirmTime".equals(field)) {
					query.timeranges("confirmTime", data);
				} else if ("finishTime".equals(field)) {
					query.timeranges("finishTime", data);
				} else if ("balanceTime".equals(field)) {
					query.timeranges("balanceTime", data);
				}
			}
		}
	}
}
