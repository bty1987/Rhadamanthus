/**
 * @File Name		: QuotationItemDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.utils.Paging;

@Repository("quotationItemDao")
public class QuotationItemDaoImpl extends DaoImpl<QuotationItemPO> implements QuotationItemDao {

	public QuotationItemDaoImpl() {
		super(QuotationItemPO.class);
	}

	@Override
	public List<QuotationItemPO> pageQuotationItem(Paging paging, List<Filter> filters) {

		PagingQuery<QuotationItemPO> query = pagingQuery(paging, QuotationItemPO.class);

		queryFilterExcute(query, filters);

		query.asc("no");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationItemPO> queryQuotationItemByIds(List<Long> ids) {
		return session().createCriteria(QuotationItemPO.class).add(Restrictions.in("qiid", ids)).list();
	}

	@Override
	public QuotationItemPO queryQuotationItemByIdAVersionId(String itemId, String versionId) {
		return (QuotationItemPO) session().createCriteria(QuotationItemPO.class).add(Restrictions.eq("no", itemId)).add(Restrictions.eq("quotationVersion.no", versionId)).add(Restrictions.eq("status", QuotationItemPO.STATUS_ENABLE_INT)).uniqueResult();
	}

	@Override
	public void copyQuotaitonItem(String sourceVersionId, String newVersionId) {

		StringBuffer sql = new StringBuffer();
		sql.append("insert into quotation.quotationItem (no,versionId,quotationTypeId,quotationClassificationId,quotationBigCategoryId,quotationSmallCategoryId,itemName,measurementUnitId,itemWorkTypeId,comment,unitPrice) ");
		sql.append("select no,'");
		sql.append(newVersionId);
		sql.append("',quotationTypeId,quotationClassificationId,quotationBigCategoryId,quotationSmallCategoryId,itemName,measurementUnitId,itemWorkTypeId,comment,unitPrice from quotation.quotationItem where versionId='");
		sql.append(sourceVersionId);
		sql.append("'");

		session().createSQLQuery(sql.toString()).executeUpdate();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("name".equals(field)) {
				query.add(query.getCriterion("name", data, op));
			} else if ("status".equals(field)) {
				query.add(query.getCriterion("status", Short.parseShort(data), op));
			} else if ("quotationTypeId".equals(field)) {
				query.add(query.getCriterion("quotationType.id", Integer.parseInt(data), op));
			} else if ("quotationClassificationId".equals(field)) {
				query.add(query.getCriterion("quotationClassification.id", Integer.parseInt(data), op));
			} else if ("quotationBigCategoryId".equals(field)) {
				query.add(query.getCriterion("quotationBigCategory.id", Integer.parseInt(data), op));
			} else if ("quotationSmallCategoryId".equals(field)) {
				query.add(query.getCriterion("quotationSmallCategory.id", Integer.parseInt(data), op));
			} else if ("versionId".equals(field)) {
				query.add(query.getCriterion("quotationVersion.no", (data), op));
			} else if ("quotationWorkTypeId".equals(field)) {
				query.add(query.getCriterion("workType.id", Integer.parseInt(data), op));
			} else if ("quotationCtemId".equals(field)) {
				query.add(query.getCriterion("quotationCtem.qcid", Long.valueOf(data), op));
			} else if ("company".equals(field)) {
				query.alias("quotationVersion", "quotationVersion");
				query.add(query.getCriterion("quotationVersion.company", Integer.parseInt(data), op));
			}
		}
	}

}
