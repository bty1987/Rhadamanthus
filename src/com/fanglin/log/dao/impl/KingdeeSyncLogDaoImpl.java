package com.fanglin.log.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.KingdeeSyncLogDao;
import com.fanglin.log.po.KingdeeSyncLogPO;
import com.fanglin.utils.Paging;

@Repository("kingdeeSyncLogDao")
public class KingdeeSyncLogDaoImpl extends DaoImpl<KingdeeSyncLogPO> implements KingdeeSyncLogDao {

	public KingdeeSyncLogDaoImpl(){
		super(KingdeeSyncLogPO.class);
	}

	@Override
	public List<KingdeeSyncLogPO> pageKingdeeSyncLog(Paging paging, List<Filter> filters){
		PagingQuery<KingdeeSyncLogPO> query = pagingQuery(paging, KingdeeSyncLogPO.class);

		queryFilterExcute(query, filters);

		query.desc("createTime");

		return query.list();
	}

	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){

		if (filters == null) return;

		for (Filter filter : filters){
			String field = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if (!StringUtils.isNotEmpty(data)) continue;

			if ("createTime".equals(field) && "between".equals(op)){
				query.timeranges("createTime", "createTime", data);
			} else if ("createTime".equals(field)){
				query.add(getCriterion("createTime", data, op));
			} else if ("orderId".equals(field)){
				query.add(getCriterion("orderId", data, op));
			} else if ("rtid".equals(field)){
				query.add(getCriterion("rtid", Long.valueOf(data), op));
			} else if ("atttype".equals(field)){
				query.add(getCriterion("atttype", Short.valueOf(data), op));
			} else if ("type".equals(field)){
				query.add(getCriterion("type", data, op));
			} else {
				query.add(query.getCriterion(field, data, op));
			}
		}
	}

}
