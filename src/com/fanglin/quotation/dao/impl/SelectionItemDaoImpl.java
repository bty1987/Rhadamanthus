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
	public List<SelectionItemPD> pageSelectionItemForSupplier(Paging paging, List<Filter> filters, Integer suid, Integer company) {

		PagingQuery<SelectionItemPD> query = pagingQuery(paging, SelectionItemPD.class);

		queryFilterExcute(query, filters);

		query.add(Restrictions.eq(SelectionItemPO.COLUMN_COMPANY_STR, company));
		query.add(Restrictions.eq("supplier.uid", suid));

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
	public List<SelectionItemPD> pageSelectionItemForAccount(Paging paging, List<Filter> filters, Integer company) {

		PagingQuery<SelectionItemPD> query = pagingQuery(paging, SelectionItemPD.class);

		query.add(query.getCriterion(SelectionItemPO.COLUMN_COMPANY_STR, company, "eq"));

		query.add(query.getCriterion("accountStatus", SelectionItemPO.ACCOUNT_STATUS_INIT_INT, "eq"));
		query.add(query.getCriterion("status", SelectionItemPO.STATUS_BALANCE_SHORT, "eq"));

		queryFilterExcute(query, filters);

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
		return createCriteria(SelectionItemPD.class).add(Restrictions.eq("selection.sid", sid)).list();
	}

	@Override
	public SelectionItemPO pickSelectionItem(String orderId, Long qiid) {

		String sql = String.format("select {sit.*} from data.soodsitem sis, quotation.selectionitem sit where sis.qiid = :qiid and sis.sid = sit.quoteId and sit.orderId = :orderId and sit.type = :type");

		return (SelectionItemPO) session().createSQLQuery(sql).addEntity("sit", SelectionItemPO.class).setString("orderId", orderId).setLong("qiid", qiid == null ? -1 : qiid).setShort("type", SelectionItemPO.TYPE_ALONE_SHORT).setMaxResults(1).uniqueResult();
	}

	@Override
	public int countSelectionItem(String orderId, Long areaId) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countSelectionItem(String orderId, short type) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong("type", type).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countSelectionItem(String orderId, long areaId, long quoteId) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId AND quoteId = :quoteId";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).setLong(SelectionItemPO.COLUMN_QUOTEID_STR, quoteId).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countSelectionItem(String orderId, long areaId, List<Long> quoteIds, short type) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND areaId = :areaId AND quoteId in :quoteId AND type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setLong(SelectionItemPO.COLUMN_AREAID_STR, areaId).setParameterList(SelectionItemPO.COLUMN_QUOTEID_STR, quoteIds).setShort(SelectionItemPO.COLUMN_TYPE_STR, type).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	@Override
	public int countSelectionItem(String orderId, List<Short> statuses) {

		String sql = "SELECT count(*) FROM quotation.selectionitem WHERE orderId = :orderId AND status in :statuses";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setString(SelectionItemPO.COLUMN_ORDERID_STR, orderId).setParameterList("statuses", statuses).uniqueResult();

		return count == null ? 0 : count.intValue();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			query.alias("goods", "goods");

			if (SelectionItemPD.COLUMN_ORDERID_STR.equals(field)) {
				query.alias("decoration", "decoration");
				query.add(query.getCriterion(SelectionItemPD.COLUMN_DECORATION_ORDERID_STR, data, op));
			} else if (SelectionItemPD.COLUMN_STATUS_STR.equals(field)) {
				query.add(query.getCriterion(SelectionItemPD.COLUMN_STATUS_STR, Short.valueOf(data), op));
			} else if ("type".equals(field)) {
				query.add(query.getCriterion("type", Short.valueOf(data), op));
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
			} else if ("reviewTime".equals(field)) {
				query.timeranges("reviewTime", data);
			} else if ("balanceTime".equals(field)) {
				query.timeranges("balanceTime", data);
			}
		}
	}
}
