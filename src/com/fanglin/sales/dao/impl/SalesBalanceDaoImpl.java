package com.fanglin.sales.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.security.AESHelper;
import com.fanglin.core.vo.Filter;
import com.fanglin.sales.dao.SalesBalanceDao;
import com.fanglin.sales.po.SalesBalancePO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("salesBalanceDao")
public class SalesBalanceDaoImpl extends DaoImpl<SalesBalancePO> implements SalesBalanceDao {

	public SalesBalanceDaoImpl() {
		super(SalesBalancePO.class);
	}

	@Override
	public List<SalesBalancePO> pageSalesBalance(Paging paging, List<Filter> filters, int company) {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESCOMPANY_STR, company, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForDompany(Paging paging, List<Filter> filters, int dompany) {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESDOMPANY_STR, dompany, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForPompany(Paging paging, List<Filter> filters, int pompany) {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").add(query.getCriterion(SalesBalancePO.COLUMN_SALESPOMPANY_STR, pompany, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public List<SalesBalancePO> pageSalesBalanceForSupplier(Paging paging, List<Filter> filters, int pompany, int uid) {

		PagingQuery<SalesBalancePO> query = pagingQuery(paging, SalesBalancePO.class);

		query.alias("sales", "sales").alias("sales.supplier", "supplier").add(query.getCriterion(SalesPO.COLUMN_OCUID_STR, uid, "eq"));

		queryFilterExcute(query, filters);

		query.desc("sbid");

		return query.list();
	}

	@Override
	public SalesBalancePO querySalesBalance(long sid, short type, short onetype) {
		return (SalesBalancePO) session().createCriteria(SalesBalancePO.class).createAlias("sales", "sales").add(Restrictions.eq("sales.sid", sid)).add(Restrictions.eq("type", type)).add(Restrictions.eq("onetype", onetype)).uniqueResult();
	}

	private void queryFilterExcute(PagingQuery<SalesBalancePO> query, List<Filter> filters) {

		if (filters != null) {
			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();

				query.alias("sales", "sales");
				query.alias("sales.house", "house");
				query.alias("house.village", "village");
				query.alias("sales.region", "region");
				query.alias("sales.dept", "dept");

				if (SalesBalancePO.COLUMN_ORDERID_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_ORDERID_STR, data, op));
				} else if (SalesBalancePO.COLUMN_SALESNO_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESNO_STR, data, op));
				} else if (SalesBalancePO.COLUMN_SALESBRAND_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESBRAND_STR, data, op));
				} else if (SalesBalancePO.COLUMN_SALESVILLAGE_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESVILLAGE_STR, data, op));
				} else if (SalesBalancePO.COLUMN_SALESREGION_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESREGION_STR, data, op));
				} else if (SalesBalancePO.COLUMN_SALESDEPT_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESDEPT_STR, data, op));
				} else if (SalesBalancePO.COLUMN_STATUS_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_STATUS_STR, Short.valueOf(data), op));
				} else if (SalesBalancePO.COLUMN_TYPE_STR.equals(field)) {
					query.add(query.getCriterion(SalesBalancePO.COLUMN_TYPE_STR, Short.valueOf(data), op));
				} else if ("dompany".equals(field)) {
					try {
						int cid = FormatUtil.decodeCompany(AESHelper.decrypt(filter.getData(), SystemConfig.getString("encryptKey"), SystemConfig.getString("encryptIv")));
						query.add(query.getCriterion("sales.dompany", cid, op));
					} catch (Exception e) {
					}
				} else if (SalesBalancePO.COLUMN_SALESFULLPAYTIME_STR.equals(field)) {

					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESFULLPAYTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_SALESFULLPAYTIME_STR, sTimestamp, "ge"));

				} else if (SalesBalancePO.COLUMN_CREATETIME_STR.equals(field)) {

					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion(SalesBalancePO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));

				} else if (SalesBalancePO.COLUMN_VENDERTIME_STR.equals(field)) {

					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion(SalesBalancePO.COLUMN_VENDERTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_VENDERTIME_STR, sTimestamp, "ge"));

				} else if (SalesBalancePO.COLUMN_POSTTIME_STR.equals(field)) {

					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion(SalesBalancePO.COLUMN_POSTTIME_STR, eTimestamp, "le"));
					query.add(query.getCriterion(SalesBalancePO.COLUMN_POSTTIME_STR, sTimestamp, "ge"));

				}

			}
		}
	}

}
