package com.fanglin.kingdee.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.kingdee.dao.KingdeeRecordDao;
import com.fanglin.kingdee.po.KingdeeRecordPO;
import com.fanglin.utils.Paging;

@Repository("kingdeeRecordDao")
public class KingdeeRecordDaoImpl extends DaoImpl<KingdeeRecordPO> implements KingdeeRecordDao {

	public KingdeeRecordDaoImpl(){
		super(KingdeeRecordPO.class);
	}

	@Override
	public List<KingdeeRecordPO> pageKingdeeRecord(Paging paging, List<Filter> filters) {

		PagingQuery<KingdeeRecordPO> query = pagingQuery(paging, KingdeeRecordPO.class);

		queryFilterExcute(query, filters);

		return query.list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters) {

		if (filters == null)
			return;

		for (Filter filter : filters) {

			String filet = filter.getField();
			String data = filter.getData();
			String op = filter.getOp();

			if ("orderId".equals(filet)) {
				query.add(query.getCriterion(filet, data, op));
			} else if ("createTime".equals(filet)) {
				query.timeranges("createTime", "createTime", filter.getData());
			}
		}
	}

}
