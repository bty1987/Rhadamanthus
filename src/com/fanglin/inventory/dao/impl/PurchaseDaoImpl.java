package com.fanglin.inventory.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("purchaseDao")
public class PurchaseDaoImpl extends DaoImpl<PurchasePO> implements PurchaseDao {

	public PurchaseDaoImpl() {
		super(PurchasePO.class);
	}

	@Override
	public List<PurchasePO> pagePurchase(Paging paging, List<Filter> filters, int company) {

		PagingQuery<PurchasePO> query = pagingQuery(paging, PurchasePO.class);

		query.add(query.getCriterion(PurchasePO.COLUMN_COMPANY_STR, company, "eq"));

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public List<PurchasePO> pagePurchaseObDelivery(Paging paging, List<Filter> filters, int company) {

		PagingQuery<PurchasePO> query = pagingQuery(paging, PurchasePO.class);

		query.add(query.getCriterion(PurchasePO.COLUMN_COMPANY_STR, company, "eq"));
		query.add(query.getCriterion(PurchasePO.COLUMN_STATUS_STR, PurchasePO.STATUS_BATCHIN_ALL_INT, "ne"));

		queryFilterExecute(query, filters);

		return query.list();
	}

	@Override
	public PurchasePO queryPurchaseByPid(long pid) {
		return (PurchasePO) session().createCriteria(PurchasePO.class).add(Restrictions.eq(PurchasePO.COLUMN_PID_STR, pid)).uniqueResult();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null && filters.size() > 0) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("user", "user");

				if ("purchaseUserName".equals(field)) {
					query.add(query.getCriterion(PurchasePO.COLUMN_USER_USERID_STR, data, op));
				} else if (PurchasePO.COLUMN_NO_STR.equals(field)) {
					query.add(query.getCriterion(PurchasePO.COLUMN_NO_STR, data, op));
				} else if ("purchaseStatus".equals(field)) {
					query.add(query.getCriterion("status", data, op));
				} else if ("createTime".equals(field)) {

					String sTime = data + " 00:00:00";
					String eTime = data + " 23:59:59";

					Date sdate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date edate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp stimestamp = DateUtil.getDateToTimestamp(sdate);
					Timestamp etimestamp = DateUtil.getDateToTimestamp(edate);

					query.add(query.getCriterion(PurchasePO.COLUMN_CREATETIME_STR, stimestamp, "ge"));
					query.add(query.getCriterion(PurchasePO.COLUMN_CREATETIME_STR, etimestamp, "le"));
				}
			}
		}
	}

}
