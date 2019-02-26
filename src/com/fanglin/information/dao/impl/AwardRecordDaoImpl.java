package com.fanglin.information.dao.impl;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("awardRecordDao")
public class AwardRecordDaoImpl extends DaoImpl<AwardRecordPO> implements AwardRecordDao {

	@Override
	public List<AwardRecordPO> pageAwardRecord(Paging paging, List<Filter> filters, int company) {

		PagingQuery<AwardRecordPO> query = pagingQuery(paging, AwardRecordPO.class);

		query.alias("creater", "creater");

		queryFilterExecute(query, filters);
		query.desc("arid");

		return query.list();
	}

	private void queryFilterExecute(PagingQuery<?> query, List<Filter> filters) {

		if (filters != null) {

			for (Filter filter : filters) {

				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("awardStock", "awardStock");

				if ("awardStock".equals(field)) {
					query.add(query.getCriterion("awardStock.asId", Long.valueOf(data), op));
				} else if ("awardRecordTimeDateRange".equals(field)) {
					String sTime = data.split("-")[0].replaceAll("/", "-") + " 00:00:00";
					String eTime = data.split("-")[1].replaceAll("/", "-") + " 23:59:59";

					Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
					Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

					Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
					Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);

					query.add(query.getCriterion("operateTime", eTimestamp, "le"));
					query.add(query.getCriterion("operateTime", sTimestamp, "ge"));
				}else if ("awardStock.name".equals(field)) {
					query.add(query.getCriterion("awardStock.name", data, op));
				}
			}
		}
	}
}
