package com.fanglin.data.quotation.dao.impl;

import java.sql.Timestamp;
import java.util.List;

import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.po.QuotationPricePO;
import com.fanglin.data.quotation.dao.QuotationPriceDao;
import com.fanglin.utils.Paging;

@Repository("QuotationPriceDao")
public class QuotationPriceDaoImpl extends DaoImpl<QuotationPricePO> implements QuotationPriceDao {

	public QuotationPriceDaoImpl() {
		super(QuotationPricePO.class);
	}

	@Override
	public List<QuotationPricePO> pageQuotationPrice(Paging paging, List<Filter> filters, Long qiid, Short status) {

		PagingQuery<QuotationPricePO> query = pagingQuery(paging, QuotationPricePO.class);

		if (qiid != null) {
			query.add(Restrictions.eq("quotationItem.qiid", qiid));
		}

		if (status != null) {
			query.add(Restrictions.eq("status", status));
		}

		queryFilterExcute(query, filters);

		return query.list();
	}

	@Override
	public List<QuotationPricePO> pageQuotationPrice(Paging paging, List<Filter> filters, String versionId, Timestamp updateTime) {

		String sql = queryFilterExcute(versionId, updateTime, filters);

		PagingQuery<QuotationPricePO> query = pagingQuery(paging, QuotationPricePO.class);

		return query.list("*", "SELECT *", sql, "");
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationPricePO> queryQuotationPrice(long faid, Timestamp updateTime) {

		String sql = "select {qprice.*} from (select price.*, faqi.sort from quotation.functionareaquoteitem faqi, quotation.quotationitem qi, quotation.quotationprice price where faqi.functionAreaId = :faid and faqi.quoteItemId = qi.qiid and qi.status = 0 and faqi.quoteItemId = price.qiid and price.updateTime <= :updateTime and price.status = 0 ORDER BY price.updateTime desc) AS qprice GROUP BY qprice.qiid ORDER BY qprice.sort";

		return session().createSQLQuery(sql).addEntity("qprice", QuotationPricePO.class).setLong("faid", faid).setTimestamp("updateTime", updateTime).list();
	}

	@Override
	public QuotationPricePO queryQuotationPriceLast(long qiid, Timestamp updateTime) {

		return (QuotationPricePO) session().createCriteria(QuotationPricePO.class).add(Restrictions.eq("quotationItem.qiid", qiid)).add(Restrictions.eq("status", QuotationPricePO.STATUS_ENABLE_INT)).add(Restrictions.le("updateTime", updateTime)).addOrder(Order.desc("updateTime")).setMaxResults(1).uniqueResult();

	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null) return;

		query.alias("quotationItem", "quotationItem");

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("qpid".equals(field)) {
				query.add(query.getCriterion("qpid", data, op));
			} else if ("createTime".equals(field)) {
				query.timeranges("createTime", "createTime", data);
			}

			if ("name".equals(field)) {
				query.add(query.getCriterion("quotationItem.name", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("quotationItem.status", Short.parseShort(data), op));
			} else if ("quotationTypeId".equals(field)) {
				query.alias("quotationItem.quotationType", "quotationType");
				query.add(query.getCriterion("quotationType.id", Integer.parseInt(data), op));
			} else if ("quotationClassificationId".equals(field)) {
				query.alias("quotationItem.quotationClassification", "quotationClassification");
				query.add(query.getCriterion("quotationClassification.id", Integer.parseInt(data), op));
			} else if ("quotationBigCategoryId".equals(field)) {
				query.alias("quotationItem.quotationBigCategory", "quotationBigCategory");
				query.add(query.getCriterion("quotationBigCategory.id", Integer.parseInt(data), op));
			} else if ("quotationSmallCategoryId".equals(field)) {
				query.alias("quotationItem.quotationSmallCategory", "quotationSmallCategory");
				query.add(query.getCriterion("quotationSmallCategory.id", Integer.parseInt(data), op));
			} else if ("versionId".equals(field)) {
				query.alias("quotationItem.quotationVersion", "quotationVersion");
				query.add(query.getCriterion("quotationVersion.no", (data), op));
			} else if ("quotationWorkTypeId".equals(field)) {
				query.alias("quotationItem.workType", "workType");
				query.add(query.getCriterion("workType.id", Integer.parseInt(data), op));
			} else if ("quotationCtemId".equals(field)) {
				query.alias("quotationItem.quotationCtem", "quotationCtem");
				query.add(query.getCriterion("quotationCtem.qcid", Long.valueOf(data), op));
			} else if ("company".equals(field)) {
				query.alias("quotationItem.quotationVersion", "quotationVersion");
				query.add(query.getCriterion("quotationVersion.company", Integer.parseInt(data), op));
			}
		}
	}

	private String queryFilterExcute(String versionId, Timestamp updateTime, List<Filter> filters) {

		StringBuffer select = new StringBuffer("SELECT qp.*");

		StringBuffer from = new StringBuffer(" FROM quotation.quotationprice qp");
		StringBuffer where = new StringBuffer();

		from.append(" LEFT JOIN quotation.quotationitem qi ON qp.qiid = qi.qiid");
		where.append(String.format(" WHERE qi.status = %s", QuotationItemPO.STATUS_ENABLE_INT));

		from.append(" LEFT JOIN quotation.quotationversion qv ON qi.versionId = qv.no");
		where.append(String.format(" AND qv.no = '%s'", versionId));

		if (updateTime != null) {
			where.append(String.format(" AND qp.updatetime <= '%s'", updateTime));
		}

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();

			if ("name".equals(field)) {
				where.append(String.format(" AND qi.name like '%%%s%%'", data));
			} else if ("quotationTypeId".equals(field)) {
				from.append(" LEFT JOIN communion.quotationtype qt ON qi.quotationTypeId = qt.id");
				where.append(String.format(" AND qt.id = %s", data));
			} else if ("quotationClassificationId".equals(field)) {
				from.append(" LEFT JOIN communion.quotationClassification qc ON qi.quotationClassificationId = qc.id");
				where.append(String.format(" AND qc.id = %s", data));
			} else if ("quotationBigCategoryId".equals(field)) {
				from.append(" LEFT JOIN communion.quotationBigCategory qbc ON qi.quotationBigCategoryId = qbc.id");
				where.append(String.format(" AND qbc.id = %s", data));
			} else if ("quotationSmallCategoryId".equals(field)) {
				from.append(" LEFT JOIN communion.quotationSmallCategory qsc ON qi.quotationSmallCategoryId = qsc.id");
				where.append(String.format(" AND qsc.id = %s", data));
			} else if ("quotationWorkTypeId".equals(field)) {
				from.append(" LEFT JOIN communion.workType wt ON qi.workTypeId = wt.id");
				where.append(String.format(" AND wt.id = %s", data));
			}
		}

		return String.format(" FROM ( SELECT t.* FROM ( %s %s %s ORDER BY updateTime DESC) t GROUP BY t.qiid) m", select.toString(), from.toString(), where.toString());
	}
}
