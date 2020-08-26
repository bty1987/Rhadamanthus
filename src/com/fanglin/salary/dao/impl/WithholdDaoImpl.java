package com.fanglin.salary.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.dao.WithholdDao;
import com.fanglin.salary.po.WithholdPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("WithholdDao")
public class WithholdDaoImpl extends DaoImpl<WithholdPO> implements WithholdDao {

	public WithholdDaoImpl() {
		super(WithholdPO.class);
	}

	@Override
	public List<WithholdPO> pageWithhold(Paging paging, List<Filter> filters) {

		PagingQuery<WithholdPO> query = pagingQuery(paging, WithholdPO.class);

		queryFilterExcuteForWorker(query, filters);

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<WithholdPO> queryWithhold(long ident, short type) {
		return session().createCriteria(WithholdPO.class). add(Restrictions.eq("ident", ident)). add(Restrictions.eq(WithholdPO.CHECKUP_TYPE_SHORT, type)) .list();
	}

	private void queryFilterExcuteForWorker(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String filet = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("userName".equals(filet)) {
				query.alias("user", "user");
				query.add(query.getCriterion("user.userId", data, op));
			} else if ("orderId".equals(filet)) {
				query.add(query.getCriterion("orderId", data, op));
			} else if ("type".equals(filet)) {
				query.add(query.getCriterion("type", Short.parseShort(data), op));
			} else if ("status".equals(filet)) {
				query.add(query.getCriterion(WithholdPO.COLUMN_STATUS_STR, Short.parseShort(data), op));
			} else if ("operateTime".equals(filter.getField())) {

				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

				query.add(query.getCriterion(WithholdPO.COLUMN_OPERATETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(WithholdPO.COLUMN_OPERATETIME_STR, sTimestamp, "ge"));
			} else if ("createTime".equals(filter.getField())) {

				String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
				String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

				Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

				query.add(query.getCriterion(WithholdPO.COLUMN_CREATETIME_STR, eTimestamp, "le"));
				query.add(query.getCriterion(WithholdPO.COLUMN_CREATETIME_STR, sTimestamp, "ge"));
			}
		}
	}

}
